import { z } from "zod";

const createProduct = z.object({
  body: z.object({
    url: z
      .string({ message: "A URL deve ser um texto." })
      .url({ message: "Formato de URL inválido." }),

    target_price: z
      .number({ message: "O preço-alvo deve ser um número." })
      .positive({ message: "O preço-alvo deve ser maior que zero." }),
  }),
});

export const ProductValidator = {
  createProduct,
};
