import express from "express";
import {
  adminGetUsers,
  adminAddProduct,
  adminUpdateProduct,
  adminDeleteProduct
} from "../controllers/adminController.js";

import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/users", adminOnly, adminGetUsers);
router.post("/products", adminOnly, adminAddProduct);
router.put("/products/:id", adminOnly, adminUpdateProduct);
router.delete("/products/:id", adminOnly, adminDeleteProduct);

export default router;
