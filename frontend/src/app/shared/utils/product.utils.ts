/**
 * Shared product-related helper functions.
 *
 * Extracted from ProductListComponent and ProductDetailComponent
 * to eliminate duplication.
 */

/**
 * Calculate the discount percentage for a product.
 * @param product - An object with `price` and optional `compare_price`.
 * @returns The rounded discount percentage, or 0 if no compare price.
 */
export function getDiscount(product: { price: number; compare_price?: number | null }): number {
  if (!product.compare_price) return 0;
  return Math.round((1 - product.price / product.compare_price) * 100);
}

/**
 * Generate a 5-element array representing filled (1) and empty (0) stars.
 * @param rating - The average rating (0–5).
 * @returns An array of 5 numbers (1 or 0).
 */
export function getStars(rating: number): number[] {
  return Array(5)
    .fill(0)
    .map((_, i) => (i < Math.round(rating) ? 1 : 0));
}
