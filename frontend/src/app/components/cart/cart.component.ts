import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CartService } from '@services/cart.service';
import { Cart } from '@models';

/**
 * Shopping cart page displaying line items, quantities, totals,
 * and checkout actions. Protected by {@link authGuard}.
 */
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [], total: 0, count: 0 };

  private readonly destroyRef = inject(DestroyRef);
  private readonly translocoService = inject(TranslocoService);

  constructor(private readonly cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.loadCart();
    this.cartService.cart$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cart) => (this.cart = cart));
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) return;
    this.cartService.updateQuantity(productId, quantity).subscribe();
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId).subscribe();
  }

  clearCart(): void {
    if (confirm(this.translocoService.translate('cart.clearCartConfirm'))) {
      this.cartService.clearCart().subscribe();
    }
  }
}
