import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getTrendingProducts,
  toggleTrending
} from "../controllers/productController.js";

import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/trending", getTrendingProducts);
router.get("/:id", getProductById);

// Admin
router.post("/", authMiddleware, adminOnly, createProduct);
router.put("/:id", authMiddleware, adminOnly, updateProduct);
router.put("/:id/trending", authMiddleware, adminOnly, toggleTrending);
router.delete("/:id", authMiddleware, adminOnly, deleteProduct);

export default router;
