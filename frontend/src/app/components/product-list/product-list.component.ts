import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ProductService } from '@services/product.service';
import { CartService } from '@services/cart.service';
import { AuthService } from '@services/auth.service';
import { Product, Category, Pagination } from '@models';
import { getDiscount, getStars } from '@shared/utils/product.utils';

/**
 * Browsable product catalogue with hero banner, featured picks,
 * category/search/sort filters, and pagination.
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslocoModule],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  featuredProducts: Product[] = [];
  categories: Category[] = [];
  pagination: Pagination = { page: 1, limit: 12, total: 0, total_pages: 0 };
  loading = true;
  error = '';

  selectedCategory = '';
  searchQuery = '';
  sortBy = 'newest';
  showFilters = false;

  /** Expose shared utilities to the template. */
  readonly getDiscount = getDiscount;
  readonly getStars = getStars;

  private readonly translocoService = inject(TranslocoService);

  constructor(
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadFeatured();
    this.loadProducts();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (cats) => (this.categories = cats),
    });
  }

  loadFeatured(): void {
    this.productService.getFeaturedProducts().subscribe({
      next: (data) => (this.featuredProducts = data),
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService
      .getProducts({
        category: this.selectedCategory || undefined,
        search: this.searchQuery || undefined,
        sort: this.sortBy,
        page: this.pagination.page,
        limit: this.pagination.limit,
      })
      .subscribe({
        next: (res) => {
          this.products = res.products;
          this.pagination = res.pagination;
          this.loading = false;
        },
        error: () => {
          this.error = this.translocoService.translate('products.loadError');
          this.loading = false;
        },
      });
  }

  onSearch(): void {
    this.pagination.page = 1;
    this.loadProducts();
  }

  onCategoryChange(slug: string): void {
    this.selectedCategory = slug;
    this.pagination.page = 1;
    this.loadProducts();
  }

  onSortChange(): void {
    this.pagination.page = 1;
    this.loadProducts();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pagination.total_pages) return;
    this.pagination.page = page;
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addToCart(product: Product): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.addToCart(product.id).subscribe({
      error: (err) => alert(err.error?.error || 'Erreur'),
    });
  }
}
