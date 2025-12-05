import express from "express";
import {
  submitContact,
  getAllContacts,
  updateContactStatus,
} from "../controllers/contactController.js";
import adminOnly from "../middleware/adminMiddleware.js"; // ✅ FIXED IMPORT

const router = express.Router();

/* ======================================================
   USER → Submit Contact Form
====================================================== */
router.post("/", submitContact);

/* ======================================================
   ADMIN → Get All Messages
====================================================== */
router.get("/", adminOnly, getAllContacts);

/* ======================================================
   ADMIN → Update Contact Status (pending ↔ resolved)
====================================================== */
router.put("/:id/status", adminOnly, updateContactStatus);

export default router;
