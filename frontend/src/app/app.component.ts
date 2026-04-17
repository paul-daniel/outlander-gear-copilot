import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChatCopilotComponent } from './components/chat-copilot/chat-copilot.component';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { User, Cart } from './models/product.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, ChatCopilotComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Outlander Gear Co.';
  user: User | null = null;
  cart: Cart = { items: [], total: 0, count: 0 };
  mobileMenuOpen = false;
  copilotOpen = false;
  copilotUnread = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((u) => {
      const wasLoggedIn = !!this.user;
      this.user = u;
      if (u) {
        this.cartService.loadCart();
      } else if (wasLoggedIn) {
        this.cartService.resetLocal();
      }
    });
    this.cartService.cart$.subscribe((c) => (this.cart = c));
  }

  logout(): void {
    this.authService.logout();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleCopilot(): void {
    this.copilotOpen = !this.copilotOpen;
    if (this.copilotOpen) {
      this.copilotUnread = 0;
    }
  }

  onCopilotNewMessage(): void {
    if (!this.copilotOpen) {
      this.copilotUnread++;
    }
  }
}
