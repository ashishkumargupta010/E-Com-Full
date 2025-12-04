import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Admin from "../models/adminModel.js";
import bcrypt from "bcryptjs";

// ==================================================
// GET ALL USERS (Used in AdminCustomers.jsx)
// ==================================================
export const adminGetUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Order,
          as: "orders",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==================================================
// GET ADMIN PROFILE (/api/admin/me)
// ==================================================
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==================================================
// UPDATE ADMIN PROFILE (/api/admin/update)
// ==================================================
export const updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;

    await admin.save();

    return res.json({
      message: "Profile Updated Successfully",
      admin,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==================================================
// CHANGE ADMIN PASSWORD (/api/admin/change-password)
// ==================================================
export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findByPk(req.admin.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Compare old password
    const match = await bcrypt.compare(currentPassword, admin.password);

    if (!match) {
      return res.status(400).json({
        message: "Incorrect current password",
      });
    }

    // Hash new password
    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    return res.json({ message: "Password Updated Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==================================================
// ADD PRODUCT (dummy placeholder)
// ==================================================
export const adminAddProduct = async (req, res) => {
  try {
    res.json({ message: "Product created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==================================================
// UPDATE PRODUCT (dummy placeholder)
// ==================================================
export const adminUpdateProduct = async (req, res) => {
  try {
    res.json({ message: "Product updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==================================================
// DELETE PRODUCT (dummy placeholder)
// ==================================================
export const adminDeleteProduct = async (req, res) => {
  try {
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
