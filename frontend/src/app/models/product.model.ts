export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_desc: string;
  price: number;
  compare_price: number | null;
  stock_quantity: number;
  category_id: number;
  category_name: string;
  category_slug: string;
  image_url: string;
  images: string[];
  weight_kg: number | null;
  is_featured: boolean;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  reviews?: Review[];
  related_products?: ProductSummary[];
}

export interface ProductSummary {
  id: number;
  name: string;
  slug: string;
  price: number;
  compare_price: number | null;
  image_url: string;
  rating_avg: number;
}

export interface ProductResponse {
  products: Product[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  product_count: number;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  title: string;
  comment: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

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

export interface Cart {
  items: CartItem[];
  total: number;
  count: number;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
