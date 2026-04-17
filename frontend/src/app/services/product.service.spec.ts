import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductService, ProductQueryParams } from './product.service';
import { environment } from '@env';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should fetch products without params', () => {
      service.getProducts().subscribe((res) => {
        expect(res.products.length).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/products`);
      expect(req.request.method).toBe('GET');
      req.flush({ products: [{ id: 1, name: 'Test' }], pagination: {} });
    });

    it('should add query params when provided', () => {
      const params: ProductQueryParams = { category: 'bags', page: 2, limit: 10 };
      service.getProducts(params).subscribe();

      const req = httpMock.expectOne((r) => r.url === `${apiUrl}/products`);
      expect(req.request.params.get('category')).toBe('bags');
      expect(req.request.params.get('page')).toBe('2');
      expect(req.request.params.get('limit')).toBe('10');
      req.flush({ products: [], pagination: {} });
    });

    it('should skip empty/undefined params', () => {
      service.getProducts({ category: '', search: undefined }).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/products`);
      expect(req.request.params.keys().length).toBe(0);
      req.flush({ products: [], pagination: {} });
    });
  });

  describe('getFeaturedProducts', () => {
    it('should fetch featured products', () => {
      service.getFeaturedProducts().subscribe((products) => {
        expect(products.length).toBe(2);
      });

      const req = httpMock.expectOne(`${apiUrl}/products/featured`);
      expect(req.request.method).toBe('GET');
      req.flush([{ id: 1 }, { id: 2 }]);
    });
  });

  describe('getProductBySlug', () => {
    it('should fetch a product by slug', () => {
      service.getProductBySlug('test-bag').subscribe((product) => {
        expect(product.name).toBe('Test Bag');
      });

      const req = httpMock.expectOne(`${apiUrl}/products/test-bag`);
      expect(req.request.method).toBe('GET');
      req.flush({ id: 1, name: 'Test Bag', slug: 'test-bag' });
    });
  });

  describe('getCategories', () => {
    it('should fetch categories', () => {
      service.getCategories().subscribe((cats) => {
        expect(cats.length).toBe(3);
      });

      const req = httpMock.expectOne(`${apiUrl}/categories`);
      expect(req.request.method).toBe('GET');
      req.flush([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });
  });
});
