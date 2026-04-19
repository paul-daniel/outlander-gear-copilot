import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaqSectionComponent, FaqCategory } from './faq-section.component';

describe('FaqSectionComponent', () => {
  let component: FaqSectionComponent;
  let fixture: ComponentFixture<FaqSectionComponent>;

  const mockCategory: FaqCategory = {
    title: 'Shipping',
    items: [
      { question: 'How long?', answer: '3-5 days.' },
      { question: 'How much?', answer: 'Free over €100.' },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FaqSectionComponent);
    component = fixture.componentInstance;
    component.category = mockCategory;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with no item open', () => {
    expect(component.openIndex).toBeNull();
  });

  it('should toggle an item open', () => {
    component.toggle(0);
    expect(component.openIndex).toBe(0);
  });

  it('should close an item when toggled again', () => {
    component.toggle(0);
    component.toggle(0);
    expect(component.openIndex).toBeNull();
  });

  it('should switch to another item', () => {
    component.toggle(0);
    component.toggle(1);
    expect(component.openIndex).toBe(1);
  });
});
