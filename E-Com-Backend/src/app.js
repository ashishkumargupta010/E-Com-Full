import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import heroRoutes from "./routes/heroRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import CouponRoute from "./routes/CouponRoute.js";

const app = express();

/* -------------------------------
   CORS
-------------------------------- */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------------------
   USER ROUTES
-------------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);   // ✅ FIXED (frontend uses /api/user)

/* -------------------------------
   PUBLIC ROUTES
-------------------------------- */
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/reviews", reviewRoutes);

/* -------------------------------
   ADMIN ROUTES
-------------------------------- */
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);

/* -------------------------------
   COUPON ROUTES
-------------------------------- */
app.use("/api/coupons", CouponRoute);

app.use("/api/contact", contactRoutes);

export default app;
