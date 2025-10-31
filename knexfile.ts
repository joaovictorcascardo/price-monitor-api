import type { Knex } from "knex";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DB_HOST || !process.env.DB_PASSWORD) {
  console.error(
    "ERRO: Variáveis de ambiente do banco (DB_HOST, DB_PASSWORD) não carregadas do .env"
  );
}

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || "5432"),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: path.join(__dirname, "src", "database", "migrations"),
      extension: "ts",
    },
  },
};

module.exports = config;
