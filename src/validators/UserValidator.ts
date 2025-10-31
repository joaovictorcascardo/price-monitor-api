import { z } from "zod";

const createUser = z.object({
  body: z.object({
    name: z
      .string({ message: "O nome deve ser um texto." })
      .min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
    email: z.email({ message: "Formato de e-mail inválido." }),
    password: z
      .string()
      .min(6, { message: "A senha precisa ter no mínimo 6 caracteres." }),

    birth_date: z.string().transform((date) => new Date(date)),

    phone: z
      .string()
      .min(10, { message: "Telefone inválido." })
      .max(15, { message: "Telefone inválido." })
      .nullable()
      .optional(),
  }),
});

export const UserValidator = {
  createUser,
};
