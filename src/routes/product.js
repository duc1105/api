import express from "express";
import {
  createProduct,
  getAllProduct,
  getProductById,
  removeProduct,
  updateProduct,
} from "../controllers/product";
import { checkPermission } from "../middlewares/checkPermission";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  allowedFormats: ["jpg", "png"],
  params: {
    folder: "images",
  },
});

const uploadCloud = multer({ storage });
router.get("/products", getAllProduct);
router.get("/products/:id", getProductById);
router.post("/products/add", uploadCloud.array("image", 10), createProduct);
router.delete("/products/:id", checkPermission, removeProduct);
router.patch(
  "/products/update/:id",

  uploadCloud.array("image", 10),
  updateProduct
);

export default router;
