import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-copilot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-copilot.component.html',
})
export class ChatCopilotComponent implements OnDestroy {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() newAssistantMessage = new EventEmitter<void>();

  userMessage = '';
  messages: { role: 'user' | 'assistant'; content: string; read: boolean }[] = [];
  private routerSub: Subscription;

  constructor(private router: Router) {
    this.routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart && this.isOpen) {
        this.close();
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
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
        content: `Merci pour votre message ! Je suis le copilote Outlander. Pour l'instant je suis en mode démo, mais bientôt je pourrai vous aider à trouver l'équipement parfait.`,
        read: this.isOpen,
      });
      this.newAssistantMessage.emit();
    }, 800);
  }
}
