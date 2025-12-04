import express from "express";
import { getHero, addHero, deleteHero } from "../controllers/heroController.js";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route → show hero banners
router.get("/", getHero);

// Admin-only add
router.post("/", authMiddleware, adminOnly, addHero);

// Admin-only delete
router.delete("/:id", authMiddleware, adminOnly, deleteHero);

export default router;
