import express from "express";
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  requestReturn,
  submitItemReview,
  adminListOrders,
  adminUpdateStatus,
} from "../controllers/orderController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// ---------------- USER ROUTES ----------------
router.post("/", authMiddleware, placeOrder);
router.get("/my", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrderById);
router.put("/:id/cancel", authMiddleware, cancelOrder);
router.put("/:id/return", authMiddleware, requestReturn);
router.post("/:orderId/items/:itemId/review", authMiddleware, submitItemReview);

// ---------------- ADMIN ROUTES ----------------
// Use ADMIN middleware only — NOT User roles
router.get("/", adminOnly, adminListOrders);
router.put("/:id/status", adminOnly, adminUpdateStatus);

export default router;
