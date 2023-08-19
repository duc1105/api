import express from "express";
import {
  updateCate,
  createCate,
  getAllCate,
  getCateById,
  removeCate,
} from "../controllers/category";
import { checkPermission } from "../middlewares/checkPermission";
const router = express.Router();

router.get("/categories", getAllCate);
router.get("/categories/:id", getCateById);
router.post("/categories/add", createCate);
router.delete("/categories/:id", removeCate);
router.patch("/categories/update/:id", updateCate);

export default router;
