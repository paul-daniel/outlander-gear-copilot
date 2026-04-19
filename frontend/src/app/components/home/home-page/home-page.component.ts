import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { ProductService } from '@services/product.service';
import { CartService } from '@services/cart.service';
import { AuthService } from '@services/auth.service';
import { Product, Category } from '@models';
import { HomeHeroComponent } from '../home-hero/home-hero.component';
import { HomeCategoriesComponent } from '../home-categories/home-categories.component';
import { HomeFeaturedComponent } from '../home-featured/home-featured.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoModule,
    HomeHeroComponent,
    HomeCategoriesComponent,
    HomeFeaturedComponent,
  ],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit {
  featuredProducts: Product[] = [];
  categories: Category[] = [];

  constructor(
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe({
      next: (cats) => (this.categories = cats),
    });
    this.productService.getFeaturedProducts().subscribe({
      next: (data) => (this.featuredProducts = data),
    });
  }

  onAddToCart(product: Product): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.addToCart(product.id).subscribe();
  }
}
