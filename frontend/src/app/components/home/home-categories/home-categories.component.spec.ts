import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { getTranslocoModule } from '@shared/utils/transloco-testing.module';
import { HomeCategoriesComponent } from './home-categories.component';

describe('HomeCategoriesComponent', () => {
  let component: HomeCategoriesComponent;
  let fixture: ComponentFixture<HomeCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCategoriesComponent, RouterModule.forRoot([]), getTranslocoModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept categories input', () => {
    component.categories = [{ id: 1, name: 'Tents', slug: 'tents', product_count: 5 }];
    fixture.detectChanges();
    expect(component.categories.length).toBe(1);
  });
});
