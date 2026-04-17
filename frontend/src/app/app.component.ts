import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ChatCopilotComponent } from '@components/chat-copilot/chat-copilot.component';
import { AuthService } from '@services/auth.service';
import { CartService } from '@services/cart.service';
import { User, Cart } from '@models';

/**
 * Root shell component — renders the navigation bar, main router outlet,
 * chat copilot panel, and footer.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule, ChatCopilotComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Outlander Gear Co.';
  user: User | null = null;
  cart: Cart = { items: [], total: 0, count: 0 };
  mobileMenuOpen = false;
  copilotOpen = false;
  copilotUnread = 0;

  private readonly destroyRef = inject(DestroyRef);
  private readonly translocoService = inject(TranslocoService);

  /** Current active language code. */
  get activeLang(): string {
    return this.translocoService.getActiveLang();
  }

  constructor(
    private readonly authService: AuthService,
    private readonly cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.authService.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((u) => {
        const wasLoggedIn = !!this.user;
        this.user = u;
        if (u) {
          this.cartService.loadCart();
        } else if (wasLoggedIn) {
          this.cartService.resetLocal();
        }
      });

    this.cartService.cart$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((c) => (this.cart = c));
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

  switchLang(lang: string): void {
    this.translocoService.setActiveLang(lang);
  }
}
