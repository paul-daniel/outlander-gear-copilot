/**
 * Barrel export for all domain models.
 *
 * Import from `@models` (via tsconfig path alias) or
 * `../models` to access any model interface.
 */
export { Product, ProductSummary, ProductResponse, Pagination, ProductSpecification } from './product.model';
export { Cart, CartItem } from './cart.model';
export { User, AuthResponse } from './user.model';
export { Category } from './category.model';
export { Review } from './review.model';
