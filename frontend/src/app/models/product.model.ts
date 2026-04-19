import { Review } from './review.model';

/** A single key-value specification for a product. */
export interface ProductSpecification {
  id: number;
  spec_key: string;
  spec_value: string;
  spec_unit: string | null;
  spec_group: string | null;
}

/** Core product returned from the API product list. */
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
  specifications?: ProductSpecification[];
  tags?: string[];
}

/** Lightweight product summary used in related-products and cards. */
export interface ProductSummary {
  id: number;
  name: string;
  slug: string;
  price: number;
  compare_price: number | null;
  image_url: string;
  rating_avg: number;
}

/** Paginated product response from the API. */
export interface ProductResponse {
  products: Product[];
  pagination: Pagination;
}

/** Pagination metadata returned alongside product lists. */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}
