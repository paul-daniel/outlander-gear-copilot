import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ProductService } from '@services/product.service';
import { CartService } from '@services/cart.service';
import { AuthService } from '@services/auth.service';
import { Product, Category, Pagination } from '@models';
import { CatalogFiltersComponent } from '../catalog-filters/catalog-filters.component';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule, CatalogFiltersComponent, ProductCardComponent],
  templateUrl: './catalog-page.component.html',
})
export class CatalogPageComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  pagination: Pagination = { page: 1, limit: 12, total: 0, total_pages: 0 };
  loading = true;
  error = '';

  selectedCategory = '';
  searchQuery = '';
  sortBy = 'newest';

  private readonly translocoService = inject(TranslocoService);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    // Read initial category from query params
    const catParam = this.route.snapshot.queryParamMap.get('category');
    if (catParam) {
      this.selectedCategory = catParam;
    }
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (cats) => (this.categories = cats),
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

  onCategoryChange(slug: string): void {
    this.selectedCategory = slug;
    this.pagination.page = 1;
    this.loadProducts();
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.pagination.page = 1;
    this.loadProducts();
  }

  onSortChange(sort: string): void {
    this.sortBy = sort;
    this.pagination.page = 1;
    this.loadProducts();
  }

  onAddToCart(product: Product): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.addToCart(product.id).subscribe();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pagination.total_pages) return;
    this.pagination.page = page;
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
