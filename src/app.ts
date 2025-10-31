import express, { Request, Response } from "express";
import { userRoutes } from "./routes/user.routes";
import { authRoutes } from "./routes/authRoutes";
import { productRoutes } from "./routes/product.routes";

const app = express();

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/products", productRoutes);

export { app };
