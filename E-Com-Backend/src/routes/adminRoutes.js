import express from "express";
import adminOnly from "../middleware/adminMiddleware.js";
import { getAllReviews } from "../controllers/adminReviewController.js";

import {
  adminGetUsers,
  adminAddProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
} from "../controllers/adminController.js";

import {
  getCoupons,
  createCoupon,
  deleteCoupon,
} from "../controllers/adminCouponController.js";

const router = express.Router();

/* ============================================
   📌 ADMIN PROFILE / SETTINGS ROUTES
=============================================== */

// Get admin profile → AdminSettings.jsx (GET)
router.get("/me", adminOnly, getAdminProfile);

// Update admin profile (PUT)
router.put("/update", adminOnly, updateAdminProfile);

// Change admin password (PUT)
router.put("/change-password", adminOnly, changeAdminPassword);


/* ============================================
   📌 USER MANAGEMENT ROUTES
=============================================== */

// List all users (AdminCustomers.jsx)
router.get("/users", adminOnly, adminGetUsers);


/* ============================================
   📌 PRODUCT CRUD ROUTES
=============================================== */

router.post("/products", adminOnly, adminAddProduct);
router.put("/products/:id", adminOnly, adminUpdateProduct);
router.delete("/products/:id", adminOnly, adminDeleteProduct);


/* ============================================
   📌 COUPON MANAGEMENT ROUTES  (NEW)
=============================================== */

// Get all coupons
router.get("/coupons", adminOnly, getCoupons);

// Add new coupon
router.post("/coupons", adminOnly, createCoupon);

// Delete coupon
router.delete("/coupons/:id", adminOnly, deleteCoupon);

// Get all reviews
router.get("/reviews", adminOnly, getAllReviews);


export default router;
