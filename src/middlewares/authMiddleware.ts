import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest, TokenPayload } from "../types/Auth";

export function authMiddleware(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    response
      .status(401)
      .json({ error: "Token de autenticação não fornecido." });
    return;
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    response.status(401).json({ error: "Token mal formatado." });
    return;
  }

  const token = parts[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("Erro interno: Segredo JWT não definido.");
    }

    const decoded = jwt.verify(token, secret);

    const userId = (decoded as TokenPayload).userId;

    if (!userId) {
      throw new Error("Token inválido - payload incorreto.");
    }

    request.user = { id: Number(userId) };

    return next();
  } catch (error) {
    console.error("AuthMiddleware: Falha na verificação do token:", error);
    response.status(401).json({ error: "Token inválido ou expirado." });
    return;
  }
}
