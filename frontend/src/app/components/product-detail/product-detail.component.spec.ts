import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { getTranslocoModule } from '@shared/utils/transloco-testing.module';
import { ProductDetailComponent } from './product-detail.component';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent, RouterModule.forRoot([]), getTranslocoModule()],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with loading true and quantity 1', () => {
    expect(component.loading).toBeTrue();
    expect(component.quantity).toBe(1);
  });

  it('should increase quantity', () => {
    component.product = {
      id: 1, name: 'Test', slug: 'test', description: '', short_desc: '',
      price: 99, compare_price: null, stock_quantity: 10, category_id: 1,
      category_name: 'Tents', category_slug: 'tents', image_url: '', images: [],
      weight_kg: null, is_featured: false, rating_avg: 4, rating_count: 2, created_at: '',
    };
    component.changeQuantity(1);
    expect(component.quantity).toBe(2);
  });

  it('should not decrease quantity below 1', () => {
    component.product = {
      id: 1, name: 'Test', slug: 'test', description: '', short_desc: '',
      price: 99, compare_price: null, stock_quantity: 10, category_id: 1,
      category_name: 'Tents', category_slug: 'tents', image_url: '', images: [],
      weight_kg: null, is_featured: false, rating_avg: 4, rating_count: 2, created_at: '',
    };
    component.changeQuantity(-1);
    expect(component.quantity).toBe(1);
  });

  it('should group specifications by spec_group', () => {
    component.product = {
      id: 1, name: 'Test', slug: 'test', description: '', short_desc: '',
      price: 99, compare_price: null, stock_quantity: 10, category_id: 1,
      category_name: 'Tents', category_slug: 'tents', image_url: '', images: [],
      weight_kg: null, is_featured: false, rating_avg: 4, rating_count: 2, created_at: '',
      specifications: [
        { id: 1, spec_key: 'Weight', spec_value: '1.5', spec_unit: 'kg', spec_group: 'Physical' },
        { id: 2, spec_key: 'Length', spec_value: '60', spec_unit: 'cm', spec_group: 'Physical' },
        { id: 3, spec_key: 'Material', spec_value: 'Nylon', spec_unit: null, spec_group: 'Materials' },
      ],
    };
    const groups = component.specGroups;
    expect(groups.length).toBe(2);
    expect(groups[0].name).toBe('Physical');
    expect(groups[0].specs.length).toBe(2);
    expect(groups[1].name).toBe('Materials');
    expect(groups[1].specs.length).toBe(1);
  });

  it('should return empty specGroups when no product', () => {
    component.product = null;
    expect(component.specGroups).toEqual([]);
  });
});
