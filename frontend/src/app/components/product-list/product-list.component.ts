import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product, Category, Pagination } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  featuredProducts: Product[] = [];
  categories: Category[] = [];
  pagination: Pagination = { page: 1, limit: 12, total: 0, total_pages: 0 };
  loading = true;
  error = '';

  // Filters
  selectedCategory = '';
  searchQuery = '';
  sortBy = 'newest';
  showFilters = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
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
          this.error = 'Impossible de charger les produits.';
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

  getDiscount(product: Product): number {
    if (!product.compare_price) return 0;
    return Math.round((1 - product.price / product.compare_price) * 100);
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.round(rating) ? 1 : 0);
  }
}
