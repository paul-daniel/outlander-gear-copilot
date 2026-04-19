import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { getTranslocoModule } from '@shared/utils/transloco-testing.module';
import { ProductCardComponent } from './product-card.component';
import { Product } from '@models';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  const mockProduct: Product = {
    id: 1, name: 'Trail Backpack', slug: 'trail-backpack', description: '', short_desc: '',
    price: 129.99, compare_price: 159.99, stock_quantity: 5, category_id: 1,
    category_name: 'Backpacks', category_slug: 'backpacks', image_url: '', images: [],
    weight_kg: 1.2, is_featured: false, rating_avg: 4.2, rating_count: 8, created_at: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent, RouterModule.forRoot([]), getTranslocoModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit addToCart with the product', () => {
    spyOn(component.addToCart, 'emit');
    component.addToCart.emit(mockProduct);
    expect(component.addToCart.emit).toHaveBeenCalledWith(mockProduct);
  });

  it('should compute discount', () => {
    const discount = component.getDiscount(mockProduct);
    expect(discount).toBeGreaterThan(0);
  });
});
