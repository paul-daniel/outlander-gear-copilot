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
import { filter } from 'rxjs';

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
  imports: [CommonModule, FormsModule, TranslocoModule],
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

  /** Chat history */
  chatHistory: ChatSession[] = [];
  activeSessionId: string | null = null;
  historyOpen = false;

  /** Number of messages rendered from the end of the array. */
  renderedCount = MESSAGES_PAGE_SIZE;

  private readonly translocoService = inject(TranslocoService);
  private readonly zone = inject(NgZone);
  private shouldScrollToBottom = false;
  private typewriterTimer: ReturnType<typeof setInterval> | null = null;
  private responseTimeoutTimer: ReturnType<typeof setTimeout> | null = null;

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

    setTimeout(() => {
      this.clearResponseTimeout();
      this.waiting = false;
      this.timedOut = false;
      const fullText = this.translocoService.translate('copilot.demoResponse');
      const msg: ChatMessage = {
        role: 'assistant',
        content: fullText,
        displayedContent: '',
        read: this.isOpen,
        typing: true,
      };
      this.messages.push(msg);
      this.shouldScrollToBottom = true;
      this.newAssistantMessage.emit();
      this.startTypewriter(msg);
    }, 800);
  }

  dismissTimeout(): void {
    this.timedOut = false;
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
