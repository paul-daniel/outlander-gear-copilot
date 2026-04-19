import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { getTranslocoModule } from '@shared/utils/transloco-testing.module';
import { FaqPageComponent } from './faq-page.component';

describe('FaqPageComponent', () => {
  let component: FaqPageComponent;
  let fixture: ComponentFixture<FaqPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqPageComponent, RouterModule.forRoot([]), getTranslocoModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(FaqPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have FAQ categories populated', () => {
    expect(component.categories.length).toBeGreaterThan(0);
  });

  it('should have items in each category', () => {
    for (const cat of component.categories) {
      expect(cat.items.length).toBeGreaterThan(0);
    }
  });
});
