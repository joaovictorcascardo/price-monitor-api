import { Router } from "express";
import { validate } from "../middlewares/validation.middleware";
import { SessionValidator } from "../validators/SessionValidator";
import SessionController from "../controllers/SessionController";

const authRoutes = Router();

authRoutes.post(
  "/sessions",
  validate(SessionValidator.createSession),
  SessionController.createSession
);

export { authRoutes };
