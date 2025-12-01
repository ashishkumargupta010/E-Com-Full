import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addItem,
  getUserCart,
  updateItem,
  deleteItem,
  clearCart
} from "../controllers/cartController.js";

const router = express.Router();

// Cart routes
router.get("/items", authMiddleware, getUserCart);
router.post("/add", authMiddleware, addItem);

// CLEAR FULL CART – must be ABOVE /:id
router.delete("/clear", authMiddleware, clearCart);

router.put("/:id", authMiddleware, updateItem);
router.delete("/:id", authMiddleware, deleteItem);

export default router;
