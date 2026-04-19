import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Product } from '@models';
import { getDiscount, getStars } from '@shared/utils/product.utils';

@Component({
  selector: 'app-home-featured',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule],
  templateUrl: './home-featured.component.html',
})
export class HomeFeaturedComponent {
  @Input() products: Product[] = [];
  @Output() addToCart = new EventEmitter<Product>();

  readonly getDiscount = getDiscount;
  readonly getStars = getStars;
}
