import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { getTranslocoModule } from '@shared/utils/transloco-testing.module';
import { HomeFeaturedComponent } from './home-featured.component';
import { Product } from '@models';

describe('HomeFeaturedComponent', () => {
  let component: HomeFeaturedComponent;
  let fixture: ComponentFixture<HomeFeaturedComponent>;

  const mockProduct: Product = {
    id: 1, name: 'Test', slug: 'test', description: '', short_desc: '',
    price: 99, compare_price: null, stock_quantity: 10, category_id: 1,
    category_name: 'Tents', category_slug: 'tents', image_url: '', images: [],
    weight_kg: null, is_featured: true, rating_avg: 4.5, rating_count: 10, created_at: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeFeaturedComponent, RouterModule.forRoot([]), getTranslocoModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeFeaturedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit addToCart event', () => {
    spyOn(component.addToCart, 'emit');
    component.addToCart.emit(mockProduct);
    expect(component.addToCart.emit).toHaveBeenCalledWith(mockProduct);
  });
});
