import { Routes } from '@angular/router';
import { authGuard } from '@guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/product-list/product-list.component').then((m) => m.ProductListComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/product-list/product-list.component').then((m) => m.ProductListComponent),
  },
  {
    path: 'products/:slug',
    loadComponent: () =>
      import('./components/product-detail/product-detail.component').then((m) => m.ProductDetailComponent),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./components/cart/cart.component').then((m) => m.CartComponent),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((m) => m.LoginComponent),
  },
  { path: '**', redirectTo: '' },
];
