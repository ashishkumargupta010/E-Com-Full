import express from "express";
import { getHero, addHero, deleteHero } from "../controllers/heroController.js";
import { adminOnly, authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getHero);
router.post("/", authMiddleware, adminOnly, addHero);
router.delete("/:id", authMiddleware, adminOnly, deleteHero);

export default router;
