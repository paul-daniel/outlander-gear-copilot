/** Shopping cart item returned from the cart API. */
export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  stock_quantity: number;
}

/** Aggregated cart state with items, total price and item count. */
export interface Cart {
  items: CartItem[];
  total: number;
  count: number;
}
