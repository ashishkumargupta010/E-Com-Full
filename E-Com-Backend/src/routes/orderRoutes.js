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
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// user routes
router.post("/", authMiddleware, placeOrder);            // place order
router.get("/my", authMiddleware, getMyOrders);          // my orders
router.get("/:id", authMiddleware, getOrderById);        // get single order
router.put("/:id/cancel", authMiddleware, cancelOrder);  // cancel
router.put("/:id/return", authMiddleware, requestReturn);// request return

// review for item
router.post("/:orderId/items/:itemId/review", authMiddleware, submitItemReview);

// admin routes
router.get("/", authMiddleware, adminOnly, adminListOrders);
router.put("/:id/status", authMiddleware, adminOnly, adminUpdateStatus);

export default router;
