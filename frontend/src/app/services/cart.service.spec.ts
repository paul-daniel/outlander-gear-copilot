import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CartService } from './cart.service';
import { environment } from '@env';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/cart`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with an empty cart', () => {
    let cart: any;
    service.cart$.subscribe((c) => (cart = c));
    expect(cart.items).toEqual([]);
    expect(cart.total).toBe(0);
    expect(cart.count).toBe(0);
  });

  describe('loadCart', () => {
    it('should update cart$ on success', () => {
      const mockCart = { items: [{ id: 1 }], total: 50, count: 1 };

      service.loadCart();

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockCart);

      let cart: any;
      service.cart$.subscribe((c) => (cart = c));
      expect(cart.total).toBe(50);
      expect(cart.count).toBe(1);
    });

    it('should reset to empty cart on error', () => {
      service.loadCart();

      const req = httpMock.expectOne(apiUrl);
      req.error(new ProgressEvent('error'));

      let cart: any;
      service.cart$.subscribe((c) => (cart = c));
      expect(cart.items).toEqual([]);
      expect(cart.count).toBe(0);
    });
  });

  describe('addToCart', () => {
    it('should POST and reload cart', () => {
      service.addToCart(5, 2).subscribe();

      const postReq = httpMock.expectOne(apiUrl);
      expect(postReq.request.method).toBe('POST');
      expect(postReq.request.body).toEqual({ product_id: 5, quantity: 2 });
      postReq.flush({ id: 1, product_id: 5, quantity: 2 });

      // loadCart triggered by tap
      const getReq = httpMock.expectOne(apiUrl);
      expect(getReq.request.method).toBe('GET');
      getReq.flush({ items: [], total: 0, count: 0 });
    });
  });

  describe('updateQuantity', () => {
    it('should PUT and reload cart', () => {
      service.updateQuantity(5, 3).subscribe();

      const putReq = httpMock.expectOne(`${apiUrl}/5`);
      expect(putReq.request.method).toBe('PUT');
      expect(putReq.request.body).toEqual({ quantity: 3 });
      putReq.flush({ id: 1, product_id: 5, quantity: 3 });

      const getReq = httpMock.expectOne(apiUrl);
      getReq.flush({ items: [], total: 0, count: 0 });
    });
  });

  describe('removeItem', () => {
    it('should DELETE and reload cart', () => {
      service.removeItem(5).subscribe();

      const delReq = httpMock.expectOne(`${apiUrl}/5`);
      expect(delReq.request.method).toBe('DELETE');
      delReq.flush({});

      const getReq = httpMock.expectOne(apiUrl);
      getReq.flush({ items: [], total: 0, count: 0 });
    });
  });

  describe('clearCart', () => {
    it('should DELETE all and reset local state', () => {
      service.clearCart().subscribe();

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      let cart: any;
      service.cart$.subscribe((c) => (cart = c));
      expect(cart.count).toBe(0);
    });
  });

  describe('resetLocal', () => {
    it('should reset cart without API call', () => {
      service.resetLocal();

      let cart: any;
      service.cart$.subscribe((c) => (cart = c));
      expect(cart.items).toEqual([]);
      expect(cart.total).toBe(0);
    });
  });

  describe('getCartCount', () => {
    it('should return current count', () => {
      expect(service.getCartCount()).toBe(0);
    });
  });
});
