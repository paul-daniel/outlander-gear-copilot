import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { getTranslocoModule } from '@shared/utils/transloco-testing.module';
import { ProductListComponent } from './product-list.component';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent, RouterModule.forRoot([]), getTranslocoModule()],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise with default state', () => {
    expect(component.selectedCategory).toBe('');
    expect(component.searchQuery).toBe('');
    expect(component.sortBy).toBe('newest');
  });

  it('should reset page on category change', () => {
    component.pagination.page = 3;
    component.onCategoryChange('tents');
    expect(component.selectedCategory).toBe('tents');
    expect(component.pagination.page).toBe(1);
  });
});
