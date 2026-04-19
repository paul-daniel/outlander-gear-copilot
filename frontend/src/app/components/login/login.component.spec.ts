import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { getTranslocoModule } from '@shared/utils/transloco-testing.module';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterModule.forRoot([]), getTranslocoModule()],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start in sign-in mode', () => {
    expect(component.isRegister).toBeFalse();
  });

  it('should toggle between sign-in and register', () => {
    component.toggleMode();
    expect(component.isRegister).toBeTrue();
    component.toggleMode();
    expect(component.isRegister).toBeFalse();
  });

  it('should clear error when toggling mode', () => {
    component.error = 'some error';
    component.toggleMode();
    expect(component.error).toBe('');
  });
});
