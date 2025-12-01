import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js"; 

const adminOnly = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check admin user in Admin table
    const admin = await Admin.findByPk(decoded.id);

    if (!admin) {
      return res.status(403).json({ message: "Admin not found" });
    }

    if (admin.role !== "admin") {
      return res.status(403).json({ message: "Admin access only ❌" });
    }

    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid or expired token",
      error: err.message,
    });
  }
};

export default adminOnly;
