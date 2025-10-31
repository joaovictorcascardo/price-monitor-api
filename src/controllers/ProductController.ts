import { Response } from "express";
import { AuthenticatedRequest } from "../types/Auth";
import ProductService from "../services/ProductService";
import { CreateProductDTO } from "../dto/ProductDTO";

class ProductController {
  async create(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const productData: CreateProductDTO = req.body;
      const userId = req.user!.id;

      const product = await ProductService.create(productData, userId);

      return res.status(201).json(product);
    } catch (error: any) {
      if (error.message.includes("Não foi possível extrair os dados")) {
        return res.status(400).json({ error: error.message });
      }

      console.error("Erro no ProductController (create):", error);
      return res
        .status(500)
        .json({ error: "Ocorreu um erro interno ao salvar o produto." });
    }
  }

  async listMyProducts(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const userId = req.user!.id;

      const products = await ProductService.findByUserId(userId);

      return res.status(200).json(products);
    } catch (error: any) {
      console.error("Erro no ProductController (list):", error);
      return res
        .status(500)
        .json({ error: "Ocorreu um erro interno ao listar os produtos." });
    }
  }
}

export default new ProductController();
