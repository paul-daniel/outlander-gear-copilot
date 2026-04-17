import { Component, DestroyRef, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationStart } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { filter } from 'rxjs';

/** Slide-over AI chat assistant panel. */
@Component({
  selector: 'app-chat-copilot',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule],
  templateUrl: './chat-copilot.component.html',
})
export class ChatCopilotComponent {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() newAssistantMessage = new EventEmitter<void>();

  userMessage = '';
  messages: { role: 'user' | 'assistant'; content: string; read: boolean }[] = [];

  private readonly translocoService = inject(TranslocoService);

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

  close(): void {
    this.closed.emit();
  }

  sendMessage(): void {
    if (!this.userMessage.trim()) return;

    this.messages.push({ role: 'user', content: this.userMessage, read: true });
    const userMsg = this.userMessage;
    this.userMessage = '';

    // Simulated AI response for demo
    setTimeout(() => {
      this.messages.push({
        role: 'assistant',
        content: this.translocoService.translate('copilot.demoResponse'),
        read: this.isOpen,
      });
      this.newAssistantMessage.emit();
    }, 800);
  }
}
