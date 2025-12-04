import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If token contains role "admin" → no need to check DB
    if (decoded.role === "admin") {
      req.user = {
        id: decoded.id,
        role: "admin",
        name: decoded.name || "Admin",
        email: decoded.email || "",
      };

      req.userSafe = req.user;
      return next();
    }

    // -------- Normal User Token → Load from DB --------
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    req.userSafe = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
      error: err.message,
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};
