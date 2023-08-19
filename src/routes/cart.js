import express from "express";

import { checkPermission } from "../middlewares/checkPermission";
import {
  createCart,
  getAllCart,
  getCartByUserId,
  getOneCartById,
  updateCart,
} from "../controllers/cart";
const router = express.Router();

router.get("/carts", getAllCart);
router.get("/carts/:id", getOneCartById);
router.post("/carts/add", createCart);
router.patch("/carts/update/:id", updateCart);
router.get("/carts/user/:id", getCartByUserId);

export default router;
