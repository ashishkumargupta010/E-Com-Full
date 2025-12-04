import express from "express";
import {
  addReview,
  getProductReviews,
  getAllReviewsAdmin,
  deleteReviewAdmin,
} from "../controllers/reviewController.js";

import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* --------------------------
   USER REVIEW ROUTES
--------------------------- */

// Add review (User only)
router.post("/", authMiddleware, addReview);

// Get reviews for a specific product
router.get("/product/:productId", getProductReviews);


/* --------------------------
   ADMIN REVIEW ROUTES
--------------------------- */

// Get all reviews (Admin only)
router.get("/", authMiddleware, adminOnly, getAllReviewsAdmin);

// Delete a review (Admin only)
router.delete("/:id", authMiddleware, adminOnly, deleteReviewAdmin);


export default router;
