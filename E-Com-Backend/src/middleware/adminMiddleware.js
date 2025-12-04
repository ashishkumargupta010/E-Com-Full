// src/middleware/adminMiddleware.js
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

const adminOnly = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 👇 Debug ke liye (chaho to baad me hata dena)
    console.log("🔐 Decoded admin token:", decoded);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const admin = await Admin.findByPk(decoded.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    req.admin = admin;
    next();
  } catch (err) {
    console.error("Admin Middleware Error:", err);
    return res.status(401).json({
      message: "Invalid token",
      error: err.message,
    });
  }
};

export default adminOnly;
