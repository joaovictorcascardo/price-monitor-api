import { Request, Response } from "express";
import UserService from "../services/UserService";
import { CreateUserDTO } from "../dto/UserDTO";
import { AuthenticatedRequest } from "../types/Auth";

class UserController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const userData: CreateUserDTO = req.body;

      const user = await UserService.create(userData);

      return res.status(201).json(user);
    } catch (error: any) {
      if (error.message === "Este e-mail já está em uso.") {
        return res.status(409).json({ error: error.message });
      }

      console.error(error);
      return res
        .status(500)
        .json({ error: "Ocorreu um erro interno ao criar o usuário." });
    }
  }

  async getMe(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Usuário não autenticado." });
      }

      const userId = req.user.id;

      const userMe = await UserService.findMe(userId);

      return res.status(200).json(userMe);
    } catch (error: any) {
      if (error.message === "Usuário não encontrado.") {
        return res.status(404).json({ error: error.message });
      }
      return res
        .status(500)
        .json({ error: "Ocorreu um erro interno ao buscar o usuário." });
    }
  }
}

export default new UserController();
