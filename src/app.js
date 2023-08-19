import express from "express";
import productRouter from "./routes/product";
import authRouter from "./routes/auth";
import categoryRouter from "./routes/category";
import cartRouter from "./routes/cart";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

// middleware
app.use(express.json());
app.use(cors());
// router
app.use("/api", productRouter);
app.use("/api", authRouter);
app.use("/api", categoryRouter);
app.use("/api", cartRouter);
// server
mongoose.connect("mongodb://127.0.0.1:27017/asm");
export const viteNodeApp = app;

// npm i vite vite-plugin-node -D
// tạo file vite.config.js
