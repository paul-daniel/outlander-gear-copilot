import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Cart, CartItem } from '@models';
import { environment } from '@env';

/** Empty cart constant to avoid repeated object literals. */
const EMPTY_CART: Cart = { items: [], total: 0, count: 0 };

/**
 * Manages the shopping cart state and API interactions.
 *
 * Exposes a reactive `cart$` observable. Components subscribe to
 * get live updates whenever the cart changes.
 */
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly apiUrl = `${environment.apiUrl}/cart`;
  private readonly cartSubject = new BehaviorSubject<Cart>({ ...EMPTY_CART });

  /** Observable stream of the current cart state. */
  readonly cart$ = this.cartSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  /** Fetch the current cart from the API and push it to subscribers. */
  loadCart(): void {
    this.http.get<Cart>(this.apiUrl).subscribe({
      next: (cart) => this.cartSubject.next(cart),
      error: () => this.cartSubject.next({ ...EMPTY_CART }),
    });
  }

  /** Add a product to the cart (or increment its quantity). */
  addToCart(productId: number, quantity: number = 1): Observable<CartItem> {
    return this.http.post<CartItem>(this.apiUrl, { product_id: productId, quantity }).pipe(
      tap(() => this.loadCart())
    );
  }

  /** Update the quantity of an existing cart item. */
  updateQuantity(productId: number, quantity: number): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.apiUrl}/${productId}`, { quantity }).pipe(
      tap(() => this.loadCart())
    );
  }

  /** Remove a single item from the cart. */
  removeItem(productId: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${productId}`).pipe(
      tap(() => this.loadCart())
    );
  }

  /** Clear all items from the cart. */
  clearCart(): Observable<unknown> {
    return this.http.delete(this.apiUrl).pipe(
      tap(() => this.cartSubject.next({ ...EMPTY_CART }))
    );
  }

  /** Reset the local cart state without an API call (used on logout). */
  resetLocal(): void {
    this.cartSubject.next({ ...EMPTY_CART });
  }

  /** Snapshot of the current cart item count. */
  getCartCount(): number {
    return this.cartSubject.value.count;
  }
}
