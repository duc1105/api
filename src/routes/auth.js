import express from "express";
import {
  forgotPassword,
  getUserById,
  getsUser,
  removeUser,
  resetPassword,
  signin,
  signup,
  updateUser,
} from "../controllers/auth";

const router = express.Router();
router.get("/users", getsUser);
router.get("/users/:id", getUserById);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", removeUser);
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
export default router;
