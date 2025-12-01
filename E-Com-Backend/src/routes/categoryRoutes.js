import express from "express";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";
import {
  getCategories,
  createCategory,
  deleteCategory
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getCategories);                 
router.post("/", authMiddleware, adminOnly, createCategory);
router.delete("/:id", authMiddleware, adminOnly, deleteCategory);

export default router;
