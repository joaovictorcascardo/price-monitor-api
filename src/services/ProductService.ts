import { db } from "../database/connection";
import { CreateProductDTO, ProductDTO } from "../dto/ProductDTO";

class ProductService {
  async create(data: CreateProductDTO, userId: number): Promise<ProductDTO> {
    const [newProduct] = await db("products")
      .insert({
        url: data.url,
        target_price: data.target_price,
        user_id: userId,
      })
      .returning("*");

    return newProduct as ProductDTO;
  }

  async findByUserId(userId: number): Promise<ProductDTO[]> {
    const products = await db("products")
      .where({ user_id: userId })
      .orderBy("created_at", "desc");

    return products as ProductDTO[];
  }
}

export default new ProductService();
