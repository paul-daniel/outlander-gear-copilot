import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, AuthResponse } from '@models';
import { environment } from '@env';

/**
 * Manages user authentication state, JWT tokens, and session persistence.
 *
 * Exposes a reactive `user$` observable that components can subscribe to
 * for auth-state changes. Tokens are stored in `localStorage`.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly userSubject = new BehaviorSubject<User | null>(null);

  /** Observable stream of the current authenticated user (or `null`). */
  readonly user$ = this.userSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    this.loadUserFromStorage();
  }

  /** Whether a valid JWT token exists in storage. */
  get isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /** Snapshot of the current user (or `null`). */
  get currentUser(): User | null {
    return this.userSubject.value;
  }

  /** Register a new user account and persist the session. */
  register(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((res) => this.saveSession(res))
    );
  }

  /** Authenticate with email/password and persist the session. */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => this.saveSession(res))
    );
  }

  /** Clear the stored token and user, resetting auth state. */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  /** Retrieve the stored JWT token. */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private saveSession(res: AuthResponse): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.userSubject.next(res.user);
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.userSubject.next(JSON.parse(userData));
      } catch {
        this.logout();
      }
    }
  }
}
