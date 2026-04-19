import {
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  Output,
  ViewChild,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationStart } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { filter, Subscription } from 'rxjs';
import { CopilotService, CopilotHistoryEntry } from '@services/copilot.service';
import { MarkdownPipe } from './markdown.pipe';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  displayedContent: string;
  read: boolean;
  typing: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
}

const MESSAGES_PAGE_SIZE = 50;
const TYPEWRITER_CHAR_DELAY = 18;
const RESPONSE_TIMEOUT_MS = 30_000;

/** Slide-over AI chat assistant panel. */
@Component({
  selector: 'app-chat-copilot',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule, MarkdownPipe],
  templateUrl: './chat-copilot.component.html',
})
export class ChatCopilotComponent implements AfterViewChecked {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() newAssistantMessage = new EventEmitter<void>();

  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;

  userMessage = '';
  messages: ChatMessage[] = [];
  waiting = false;
  timedOut = false;

  /** Expanded table modal */
  expandedTableHtml: string | null = null;

  /** Chat history */
  chatHistory: ChatSession[] = [];
  activeSessionId: string | null = null;
  historyOpen = false;

  /** Number of messages rendered from the end of the array. */
  renderedCount = MESSAGES_PAGE_SIZE;

  private readonly translocoService = inject(TranslocoService);
  private readonly copilotService = inject(CopilotService);
  private readonly zone = inject(NgZone);
  private shouldScrollToBottom = false;
  private typewriterTimer: ReturnType<typeof setInterval> | null = null;
  private responseTimeoutTimer: ReturnType<typeof setTimeout> | null = null;
  private chatSub: Subscription | null = null;

  constructor(private readonly router: Router) {
    const destroyRef = inject(DestroyRef);
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(destroyRef),
      )
      .subscribe(() => {
        if (this.isOpen) this.close();
      });
  }

  /** Messages slice that is currently rendered (windowed). */
  get visibleMessages(): ChatMessage[] {
    const start = Math.max(0, this.messages.length - this.renderedCount);
    return this.messages.slice(start);
  }

  get hasOlderMessages(): boolean {
    return this.messages.length > this.renderedCount;
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  close(): void {
    this.historyOpen = false;
    this.closed.emit();
  }

  toggleHistory(): void {
    this.historyOpen = !this.historyOpen;
  }

  /** Start a new chat, archiving the current one if it has messages. */
  newChat(): void {
    this.archiveCurrentSession();
    this.messages = [];
    this.activeSessionId = null;
    this.renderedCount = MESSAGES_PAGE_SIZE;
    this.historyOpen = false;
    this.stopTypewriter();
  }

  /** Clear all messages from the current chat without archiving. */
  clearChat(): void {
    this.stopTypewriter();
    this.clearResponseTimeout();
    this.chatSub?.unsubscribe();
    this.waiting = false;
    this.timedOut = false;
    this.messages = [];
    this.renderedCount = MESSAGES_PAGE_SIZE;
  }

  /** Load a previous chat session. */
  loadSession(session: ChatSession): void {
    this.archiveCurrentSession();
    this.messages = session.messages;
    this.activeSessionId = session.id;
    this.renderedCount = MESSAGES_PAGE_SIZE;
    this.historyOpen = false;
    this.shouldScrollToBottom = true;
  }

  /** Delete a chat session from history. */
  deleteSession(session: ChatSession, event: Event): void {
    event.stopPropagation();
    this.chatHistory = this.chatHistory.filter(s => s.id !== session.id);
    if (this.activeSessionId === session.id) {
      this.messages = [];
      this.activeSessionId = null;
    }
  }

  loadOlderMessages(): void {
    this.renderedCount += MESSAGES_PAGE_SIZE;
  }

  onScroll(event: Event): void {
    const el = event.target as HTMLElement;
    if (el.scrollTop === 0 && this.hasOlderMessages) {
      const prevHeight = el.scrollHeight;
      this.loadOlderMessages();
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight - prevHeight;
      });
    }
  }

  sendMessage(): void {
    if (!this.userMessage.trim() || this.waiting) return;

    // Auto-create session on first message
    if (!this.activeSessionId && this.messages.length === 0) {
      this.activeSessionId = this.generateId();
    }

    this.messages.push({
      role: 'user',
      content: this.userMessage,
      displayedContent: this.userMessage,
      read: true,
      typing: false,
    });
    const userMsg = this.userMessage;
    this.userMessage = '';
    this.waiting = true;
    this.timedOut = false;
    this.shouldScrollToBottom = true;
    this.resetTextareaHeight();

    // Start timeout timer
    this.clearResponseTimeout();
    this.responseTimeoutTimer = setTimeout(() => {
      if (this.waiting) {
        this.waiting = false;
        this.timedOut = true;
        this.shouldScrollToBottom = true;
      }
    }, RESPONSE_TIMEOUT_MS);

    // Build PromptFlow chat_history from existing messages
    const history = this.buildChatHistory();

    this.chatSub?.unsubscribe();
    this.chatSub = this.copilotService.chat(userMsg, history).subscribe({
      next: (reply) => {
        this.clearResponseTimeout();
        this.waiting = false;
        this.timedOut = false;
        const msg: ChatMessage = {
          role: 'assistant',
          content: reply,
          displayedContent: '',
          read: this.isOpen,
          typing: true,
        };
        this.messages.push(msg);
        this.shouldScrollToBottom = true;
        this.newAssistantMessage.emit();
        this.startTypewriter(msg);
      },
      error: () => {
        this.clearResponseTimeout();
        this.waiting = false;
        this.timedOut = true;
        this.shouldScrollToBottom = true;
      },
    });
  }

  dismissTimeout(): void {
    this.timedOut = false;
  }

  /** Handle clicks inside rendered markdown (e.g. table expand buttons). */
  onMessageClick(event: Event): void {
    const target = event.target as HTMLElement;
    const btn = target.closest('.copilot-table-expand-btn');
    if (btn) {
      const wrap = btn.closest('.copilot-table-wrap');
      const table = wrap?.querySelector('table');
      if (table) {
        this.expandedTableHtml = table.outerHTML;
      }
    }
  }

  closeExpandedTable(): void {
    this.expandedTableHtml = null;
  }

  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  /** Archive current messages into history if non-empty. */
  private archiveCurrentSession(): void {
    if (this.messages.length === 0) return;

    const existingIdx = this.chatHistory.findIndex(s => s.id === this.activeSessionId);
    const firstUserMsg = this.messages.find(m => m.role === 'user');
    const title = firstUserMsg
      ? firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? '…' : '')
      : 'Chat';

    if (existingIdx >= 0) {
      this.chatHistory[existingIdx].messages = [...this.messages];
      this.chatHistory[existingIdx].title = title;
    } else {
      this.chatHistory.unshift({
        id: this.activeSessionId || this.generateId(),
        title,
        messages: [...this.messages],
        createdAt: new Date(),
      });
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  /**
   * Build the PromptFlow chat_history array from the current messages.
   * Pairs consecutive user→assistant turns into the expected format.
   */
  private buildChatHistory(): CopilotHistoryEntry[] {
    const history: CopilotHistoryEntry[] = [];
    for (let i = 0; i < this.messages.length - 1; i++) {
      const msg = this.messages[i];
      const next = this.messages[i + 1];
      if (msg.role === 'user' && next?.role === 'assistant') {
        history.push({
          inputs: { chat_input: msg.content },
          outputs: { chat_output: next.content },
        });
        i++; // skip the assistant message
      }
    }
    return history;
  }

  private stopTypewriter(): void {
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer);
      this.typewriterTimer = null;
    }
  }

  private clearResponseTimeout(): void {
    if (this.responseTimeoutTimer) {
      clearTimeout(this.responseTimeoutTimer);
      this.responseTimeoutTimer = null;
    }
  }

  private startTypewriter(msg: ChatMessage): void {
    this.stopTypewriter();
    let charIndex = 0;
    this.zone.runOutsideAngular(() => {
      this.typewriterTimer = setInterval(() => {
        charIndex++;
        if (charIndex >= msg.content.length) {
          if (this.typewriterTimer) clearInterval(this.typewriterTimer);
          this.typewriterTimer = null;
          this.zone.run(() => {
            msg.displayedContent = msg.content;
            msg.typing = false;
          });
          return;
        }
        const end = Math.min(charIndex + 2, msg.content.length);
        charIndex = end;
        this.zone.run(() => {
          msg.displayedContent = msg.content.slice(0, charIndex);
          this.scrollToBottom();
        });
      }, TYPEWRITER_CHAR_DELAY);
    });
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  private resetTextareaHeight(): void {
    if (this.messageInput) {
      this.messageInput.nativeElement.style.height = 'auto';
    }
  }
}
