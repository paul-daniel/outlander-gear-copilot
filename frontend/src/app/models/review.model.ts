/** Customer review attached to a product. */
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
