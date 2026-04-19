import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoModule } from '@shared/utils/transloco-testing.module';
import { CatalogFiltersComponent } from './catalog-filters.component';

describe('CatalogFiltersComponent', () => {
  let component: CatalogFiltersComponent;
  let fixture: ComponentFixture<CatalogFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogFiltersComponent, getTranslocoModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit categoryChange on category selection', () => {
    spyOn(component.categoryChange, 'emit');
    component.categoryChange.emit('tents');
    expect(component.categoryChange.emit).toHaveBeenCalledWith('tents');
  });

  it('should emit searchChange on Enter key', () => {
    spyOn(component.searchChange, 'emit');
    const event = new KeyboardEvent('keyup', { key: 'Enter' });
    component.onSearchKeyup(event, 'backpack');
    expect(component.searchChange.emit).toHaveBeenCalledWith('backpack');
  });

  it('should not emit searchChange on non-Enter key', () => {
    spyOn(component.searchChange, 'emit');
    const event = new KeyboardEvent('keyup', { key: 'a' });
    component.onSearchKeyup(event, 'backpack');
    expect(component.searchChange.emit).not.toHaveBeenCalled();
  });

  it('should emit sortChange', () => {
    spyOn(component.sortChange, 'emit');
    component.sortChange.emit('price_asc');
    expect(component.sortChange.emit).toHaveBeenCalledWith('price_asc');
  });
});
