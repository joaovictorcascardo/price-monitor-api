import bcrypt from "bcryptjs";
import { db } from "../database/connection";
import {
  CreateUserDTO,
  UserGetMeDTO,
  UserWithoutPasswordDTO,
} from "../dto/UserDTO";

class UserService {
  async create({
    name,
    email,
    password,
    birth_date,
    phone,
  }: CreateUserDTO): Promise<UserWithoutPasswordDTO> {
    const existingUser = await db("users").where({ email }).first();

    if (existingUser) {
      throw new Error("Este e-mail já está em uso.");
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [user] = await db("users")
      .insert({
        name,
        email,
        password_hash,
        birth_date,
        phone,
        role: "USER",
      })
      .returning("*");

    delete user.password_hash;
    delete user.password_reset_token;
    delete user.password_reset_expires;

    return user as UserWithoutPasswordDTO;
  }

  async findMe(id: number): Promise<UserGetMeDTO> {
    const user = await db("users")
      .select("id", "name", "email", "phone", "birth_date")
      .where({ id })
      .first();

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    return user as UserGetMeDTO;
  }
}

export default new UserService();
