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

const MESSAGES_PAGE_SIZE = 50;
const TYPEWRITER_CHAR_DELAY = 18;

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

  /** Number of messages rendered from the end of the array. */
  renderedCount = MESSAGES_PAGE_SIZE;

  private readonly translocoService = inject(TranslocoService);
  private readonly zone = inject(NgZone);
  private shouldScrollToBottom = false;
  private typewriterTimer: ReturnType<typeof setInterval> | null = null;

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
    this.closed.emit();
  }

  loadOlderMessages(): void {
    this.renderedCount += MESSAGES_PAGE_SIZE;
  }

  onScroll(event: Event): void {
    const el = event.target as HTMLElement;
    if (el.scrollTop === 0 && this.hasOlderMessages) {
      const prevHeight = el.scrollHeight;
      this.loadOlderMessages();
      // Preserve scroll position after prepending older messages
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight - prevHeight;
      });
    }
  }

  sendMessage(): void {
    if (!this.userMessage.trim()) return;

    this.messages.push({
      role: 'user',
      content: this.userMessage,
      displayedContent: this.userMessage,
      read: true,
      typing: false,
    });
    const userMsg = this.userMessage;
    this.userMessage = '';
    this.shouldScrollToBottom = true;
    this.resetTextareaHeight();

    // Simulated AI response for demo
    setTimeout(() => {
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

  /** Auto-resize textarea to fit content. */
  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
  }

  /** Send on Enter, allow Shift+Enter for newlines. */
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  private startTypewriter(msg: ChatMessage): void {
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer);
    }
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
        // Update in batches of ~3 chars for smoother perf
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
