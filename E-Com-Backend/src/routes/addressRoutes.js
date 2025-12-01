import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addAddress, getAddresses, deleteAddress } from "../controllers/addressController.js";

const router = express.Router();

router.post("/", authMiddleware, addAddress);
router.get("/", authMiddleware, getAddresses);
router.delete("/:id", authMiddleware, deleteAddress);

export default router;
