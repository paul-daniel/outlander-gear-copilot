import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Cart, CartItem } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';
  private cartSubject = new BehaviorSubject<Cart>({ items: [], total: 0, count: 0 });

  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadCart(): void {
    this.http.get<Cart>(this.apiUrl).subscribe({
      next: (cart) => this.cartSubject.next(cart),
      error: () => this.cartSubject.next({ items: [], total: 0, count: 0 }),
    });
  }

  addToCart(productId: number, quantity: number = 1): Observable<CartItem> {
    return this.http.post<CartItem>(this.apiUrl, { product_id: productId, quantity }).pipe(
      tap(() => this.loadCart())
    );
  }

  updateQuantity(productId: number, quantity: number): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.apiUrl}/${productId}`, { quantity }).pipe(
      tap(() => this.loadCart())
    );
  }

  removeItem(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productId}`).pipe(
      tap(() => this.loadCart())
    );
  }

  clearCart(): Observable<any> {
    return this.http.delete(this.apiUrl).pipe(
      tap(() => this.cartSubject.next({ items: [], total: 0, count: 0 }))
    );
  }

  resetLocal(): void {
    this.cartSubject.next({ items: [], total: 0, count: 0 });
  }

  getCartCount(): number {
    return this.cartSubject.value.count;
  }
}
