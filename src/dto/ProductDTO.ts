export interface CreateProductDTO {
  url: string;
  target_price: number;
}

export interface ProductDTO {
  id: number;
  user_id: number;
  url: string;
  target_price: number;
  name: string | null;
  current_price: number | null;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
}
