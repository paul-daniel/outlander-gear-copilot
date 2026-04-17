import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AuthService } from '@services/auth.service';

/** Login / registration page with togglable form mode. */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslocoModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  isRegister = false;
  email = '';
  password = '';
  firstName = '';
  lastName = '';
  error = '';
  loading = false;

  private readonly translocoService = inject(TranslocoService);

  constructor(private authService: AuthService, private router: Router) {}

  toggleMode(): void {
    this.isRegister = !this.isRegister;
    this.error = '';
  }

  submit(): void {
    this.error = '';
    this.loading = true;

    if (this.isRegister) {
      this.authService.register({
        email: this.email,
        password: this.password,
        first_name: this.firstName,
        last_name: this.lastName,
      }).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.error || this.translocoService.translate('login.registerError');
        },
      });
    } else {
      this.authService.login(this.email, this.password).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.error || this.translocoService.translate('login.loginError');
        },
      });
    }
  }
}
