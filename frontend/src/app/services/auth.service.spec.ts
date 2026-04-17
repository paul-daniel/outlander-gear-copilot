import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '@env';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially have no user', () => {
    expect(service.currentUser).toBeNull();
    expect(service.isLoggedIn).toBeFalse();
  });

  describe('login', () => {
    it('should store token and user on successful login', () => {
      const mockResponse = {
        token: 'test-jwt',
        user: { id: 1, email: 'a@b.com', first_name: 'A', last_name: 'B' },
      };

      service.login('a@b.com', 'pass').subscribe((res) => {
        expect(res.token).toBe('test-jwt');
        expect(service.currentUser?.email).toBe('a@b.com');
        expect(service.isLoggedIn).toBeTrue();
      });

      const req = httpMock.expectOne(`${apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'a@b.com', password: 'pass' });
      req.flush(mockResponse);
    });
  });

  describe('register', () => {
    it('should store token and user on successful registration', () => {
      const payload = {
        email: 'new@b.com',
        password: 'pass',
        first_name: 'New',
        last_name: 'User',
      };
      const mockResponse = {
        token: 'new-jwt',
        user: { id: 2, email: 'new@b.com', first_name: 'New', last_name: 'User' },
      };

      service.register(payload).subscribe((res) => {
        expect(res.token).toBe('new-jwt');
        expect(service.isLoggedIn).toBeTrue();
      });

      const req = httpMock.expectOne(`${apiUrl}/register`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('logout', () => {
    it('should clear token, user, and emit null', () => {
      localStorage.setItem('token', 'old-jwt');
      localStorage.setItem('user', JSON.stringify({ id: 1 }));

      service.logout();

      expect(service.isLoggedIn).toBeFalse();
      expect(service.currentUser).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('loadUserFromStorage', () => {
    it('should restore user from localStorage on construction', () => {
      const user = { id: 1, email: 'a@b.com', first_name: 'A', last_name: 'B' };
      localStorage.setItem('token', 'jwt');
      localStorage.setItem('user', JSON.stringify(user));

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting()],
      });
      const svc = TestBed.inject(AuthService);
      expect(svc.currentUser?.email).toBe('a@b.com');
      expect(svc.isLoggedIn).toBeTrue();
    });

    it('should logout if stored user data is corrupt', () => {
      localStorage.setItem('user', '{invalid-json');
      localStorage.setItem('token', 'jwt');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting()],
      });
      const svc = TestBed.inject(AuthService);
      expect(svc.currentUser).toBeNull();
      expect(svc.isLoggedIn).toBeFalse();
    });
  });
});
