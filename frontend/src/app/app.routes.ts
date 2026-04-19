import { Routes } from '@angular/router';
import { authGuard } from '@guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home-page/home-page.component').then((m) => m.HomePageComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/catalog/catalog-page/catalog-page.component').then((m) => m.CatalogPageComponent),
  },
  {
    path: 'products/:slug',
    loadComponent: () =>
      import('./components/product-detail/product-detail.component').then((m) => m.ProductDetailComponent),
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('./components/faq/faq-page/faq-page.component').then((m) => m.FaqPageComponent),
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
