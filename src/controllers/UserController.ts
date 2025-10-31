import { Request, Response } from "express";
import UserService from "../services/UserService";
import { CreateUserDTO } from "../dto/UserDTO";

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
}

export default new UserController();
