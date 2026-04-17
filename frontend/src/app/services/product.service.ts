import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductResponse, Category } from '@models';
import { environment } from '@env';

/** Query parameters accepted by the product list endpoint. */
export interface ProductQueryParams {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
  min_price?: number;
  max_price?: number;
}

/**
 * Handles all product and category API interactions.
 *
 * Provides methods for listing, searching, filtering, and
 * fetching individual products by slug.
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  /** Fetch a paginated, filterable product list. */
  getProducts(params?: ProductQueryParams): Observable<ProductResponse> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return this.http.get<ProductResponse>(`${this.apiUrl}/products`, { params: httpParams });
  }

  /** Fetch the curated list of featured products. */
  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/featured`);
  }

  /** Fetch a single product by its URL slug (includes reviews and related). */
  getProductBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${slug}`);
  }

  /** Fetch all product categories with their item counts. */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }
}
