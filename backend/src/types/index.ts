// ===================== Product =====================
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_desc: string;
  price: number;
  compare_price: number | null;
  stock_quantity: number;
  category_id: number | null;
  image_url: string;
  images: string[];
  weight_kg: number | null;
  is_featured: boolean;
  is_active: boolean;
  rating_avg: number;
  rating_count: number;
  created_at: Date;
  updated_at: Date;
  // Joined fields
  category_name?: string;
  category_slug?: string;
  // Enriched fields (detail endpoint)
  specifications?: ProductSpecification[];
  tags?: string[];
}

// ===================== Category =====================
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  product_count?: number;
  created_at: Date;
}

// ===================== User =====================
export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: 'customer' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export interface UserPublic {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: string;
  created_at: Date;
}

// ===================== Cart =====================
export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: Date;
  // Joined
  name?: string;
  slug?: string;
  price?: number;
  image_url?: string;
  stock_quantity?: number;
}

// ===================== Order =====================
export interface Order {
  id: number;
  user_id: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: string;
  payment_method: string;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  name?: string;
  image_url?: string;
}

// ===================== Review =====================
export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  title: string;
  comment: string;
  created_at: Date;
  // Joined
  first_name?: string;
  last_name?: string;
}

// ===================== Address =====================
export interface Address {
  id: number;
  user_id: number;
  label: string;
  line1: string;
  line2: string | null;
  city: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: Date;
}

// ===================== Product Specification =====================
export interface ProductSpecification {
  id: number;
  product_id: number;
  spec_key: string;
  spec_value: string;
  spec_unit: string | null;
  spec_group: string;
}

// ===================== Product Tag =====================
export interface ProductTag {
  id: number;
  product_id: number;
  tag: string;
}

// ===================== JWT =====================
export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}
