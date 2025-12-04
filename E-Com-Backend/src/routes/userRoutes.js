import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { updateName, updateContact, changePassword } from "../controllers/userController.js";

const router = express.Router();

router.put("/update-name", authMiddleware, updateName);
router.put("/update-contact", authMiddleware, updateContact);
router.put("/change-password", authMiddleware, changePassword);

export default router;
