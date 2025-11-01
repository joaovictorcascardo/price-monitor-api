import bcrypt from "bcryptjs";
import { db } from "../database/connection";
import { CreateUserDTO, UserGetMeDTO } from "../dto/UserDTO";

class UserService {
  async findById(id: number): Promise<UserGetMeDTO | null> {
    const user = await db("users").where({ id }).first();

    if (!user) {
      return null;
    }

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(data: CreateUserDTO): Promise<UserGetMeDTO> {
    const existingUser = await db("users").where({ email: data.email }).first();

    if (existingUser) {
      throw new Error("Este e-mail já está em uso.");
    }

    const password_hash = await bcrypt.hash(data.password, 10);

    const [newUser] = await db("users")
      .insert({
        name: data.name,
        email: data.email,
        password_hash: password_hash,
        birth_date: data.birth_date,
        phone: data.phone,
      })
      .returning(["id", "name", "email", "birth_date", "phone"]);

    return newUser;
  }
}

export default new UserService();
