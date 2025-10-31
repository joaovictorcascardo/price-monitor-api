import { db } from "../database/connection";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { StringValue } from "ms";
import { LoginDTO } from "../dto/AuthDTO";

class AuthService {
  public async login({ email, password }: LoginDTO) {
    const user = await db("users").where({ email }).first();

    if (!user) {
      throw new Error("E-mail ou senha inválidos.");
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordCorrect) {
      throw new Error("E-mail ou senha inválidos.");
    }

    const secret = process.env.JWT_SECRET;
    const expire = process.env.JWT_EXPIRES_IN as StringValue;

    if (!secret || !expire) {
      throw new Error("Configuração interna do servidor (JWT) incompleta.");
    }

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: expire });

    delete user.password_hash;
    delete user.password_reset_token;
    delete user.password_reset_expires;

    return { user, token };
  }
}

export default new AuthService();
