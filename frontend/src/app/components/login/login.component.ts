import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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
          this.error = err.error?.error || 'Erreur lors de l\'inscription';
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
          this.error = err.error?.error || 'Identifiants incorrects';
        },
      });
    }
  }
}
