import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ProductService } from '@services/product.service';
import { CartService } from '@services/cart.service';
import { AuthService } from '@services/auth.service';
import { Product, ProductSpecification } from '@models';
import { getDiscount, getStars } from '@shared/utils/product.utils';

interface SpecGroup {
  name: string | null;
  specs: ProductSpecification[];
}

/**
 * Full product detail page — image, pricing, reviews, quantity picker,
 * add-to-cart action, and related product suggestions.
 */
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error = '';
  quantity = 1;
  addedToCart = false;

  /** Expose shared utilities to the template. */
  readonly getDiscount = getDiscount;
  readonly getStars = getStars;

  /** Specifications grouped by spec_group for display. */
  get specGroups(): SpecGroup[] {
    if (!this.product?.specifications) return [];
    const map = new Map<string | null, ProductSpecification[]>();
    for (const spec of this.product.specifications) {
      const group = spec.spec_group ?? null;
      if (!map.has(group)) map.set(group, []);
      map.get(group)!.push(spec);
    }
    return Array.from(map.entries()).map(([name, specs]) => ({ name, specs }));
  }

  private addedTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly destroyRef = inject(DestroyRef);
  private readonly translocoService = inject(TranslocoService);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly authService: AuthService,
  ) {
    this.destroyRef.onDestroy(() => {
      if (this.addedTimer) clearTimeout(this.addedTimer);
    });
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.productService.getProductBySlug(slug).subscribe({
        next: (product) => {
          this.product = product;
          this.loading = false;
        },
        error: () => {
          this.error = this.translocoService.translate('detail.notFound');
          this.loading = false;
        },
      });
    }
  }

  changeQuantity(delta: number): void {
    const newQty = this.quantity + delta;
    if (newQty >= 1 && newQty <= (this.product?.stock_quantity || 1)) {
      this.quantity = newQty;
    }
  }

  addToCart(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.product) return;

    this.cartService.addToCart(this.product.id, this.quantity).subscribe({
      next: () => {
        this.addedToCart = true;
        this.addedTimer = setTimeout(() => (this.addedToCart = false), 3000);
      },
      error: (err) => alert(err.error?.error || 'Erreur'),
    });
  }
}
