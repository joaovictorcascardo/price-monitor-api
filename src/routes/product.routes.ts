import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validation.middleware";
import { ProductValidator } from "../validators/ProductValidator";
import ProductController from "../controllers/ProductController";

const productRoutes = Router();

productRoutes.use(authMiddleware);

productRoutes.post(
  "/",
  validate(ProductValidator.createProduct),
  ProductController.create
);

productRoutes.get("/", ProductController.listMyProducts);

export { productRoutes };
