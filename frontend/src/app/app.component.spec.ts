import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { getTranslocoModule } from '@shared/utils/transloco-testing.module';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule.forRoot([]), getTranslocoModule()],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title', () => {
    expect(component.title).toBe('Outlander Gear Co.');
  });

  it('should toggle mobile menu', () => {
    expect(component.mobileMenuOpen).toBeFalse();
    component.toggleMobileMenu();
    expect(component.mobileMenuOpen).toBeTrue();
    component.toggleMobileMenu();
    expect(component.mobileMenuOpen).toBeFalse();
  });

  it('should toggle copilot panel', () => {
    expect(component.copilotOpen).toBeFalse();
    component.toggleCopilot();
    expect(component.copilotOpen).toBeTrue();
  });

  it('should reset copilot unread when opening', () => {
    component.copilotUnread = 3;
    component.toggleCopilot();
    expect(component.copilotUnread).toBe(0);
  });

  it('should increment unread when copilot is closed', () => {
    component.copilotOpen = false;
    component.onCopilotNewMessage();
    expect(component.copilotUnread).toBe(1);
  });

  it('should not increment unread when copilot is open', () => {
    component.copilotOpen = true;
    component.onCopilotNewMessage();
    expect(component.copilotUnread).toBe(0);
  });
});
