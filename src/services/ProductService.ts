import { db } from "../database/connection";
import { CreateProductDTO, ProductDTO } from "../dto/ProductDTO";
import ScraperService from "./ScraperService";

class ProductService {
  async create(data: CreateProductDTO, userId: number): Promise<ProductDTO> {
    console.log(`[ProductService] Buscando dados da URL: ${data.url}`);
    const productDetails = await ScraperService.fetchProductDetails(data.url);

    if (!productDetails) {
      throw new Error(
        "Não foi possível extrair os dados da URL fornecida. O site pode estar offline ou ter bloqueado o acesso."
      );
    }

    const [newProduct] = await db("products")
      .insert({
        url: data.url,
        target_price: data.target_price,
        user_id: userId,

        name: productDetails.name,
        current_price: productDetails.current_price,
        image_url: productDetails.image_url,
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
