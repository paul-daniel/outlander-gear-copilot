import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { getTranslocoModule } from '@shared/utils/transloco-testing.module';
import { CatalogPageComponent } from './catalog-page.component';

describe('CatalogPageComponent', () => {
  let component: CatalogPageComponent;
  let fixture: ComponentFixture<CatalogPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogPageComponent, RouterModule.forRoot([]), getTranslocoModule()],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogPageComponent);
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
    expect(component.pagination.page).toBe(1);
  });

  it('should reset page on category change', () => {
    component.pagination.page = 3;
    component.onCategoryChange('tents');
    expect(component.selectedCategory).toBe('tents');
    expect(component.pagination.page).toBe(1);
  });

  it('should reset page on search change', () => {
    component.pagination.page = 2;
    component.onSearchChange('backpack');
    expect(component.searchQuery).toBe('backpack');
    expect(component.pagination.page).toBe(1);
  });

  it('should reset page on sort change', () => {
    component.pagination.page = 2;
    component.onSortChange('price_asc');
    expect(component.sortBy).toBe('price_asc');
    expect(component.pagination.page).toBe(1);
  });
});
