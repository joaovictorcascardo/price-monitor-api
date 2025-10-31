import { Router } from "express";
import UserController from "../controllers/UserController";
import { validate } from "../middlewares/validation.middleware";
import { UserValidator } from "../validators/UserValidator";
import { authMiddleware } from "../middlewares/authMiddleware";

const userRoutes = Router();

userRoutes.post("/", validate(UserValidator.createUser), UserController.create);
userRoutes.use(authMiddleware);
userRoutes.get("/me", UserController.getMe);

export { userRoutes };
