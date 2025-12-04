import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// --------------------------------------------
// ⭐ UPDATE NAME
// --------------------------------------------
export const updateName = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name.trim();
    await user.save();

    const cleanUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone
    };

    res.json({ message: "Name updated", user: cleanUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --------------------------------------------
// ⭐ UPDATE CONTACT (Email + Phone) WITH PASSWORD CHECK
// --------------------------------------------
export const updateContact = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // verify old password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Incorrect password" });

    // UNIQUE EMAIL CHECK
    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });
      if (exists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    // UNIQUE PHONE CHECK
    if (phone && phone !== user.phone) {
      const exists = await User.findOne({ where: { phone } });
      if (exists) {
        return res.status(400).json({ message: "Phone already in use" });
      }
      user.phone = phone;
    }

    await user.save();

    const cleanUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone
    };

    res.json({ message: "Contact updated", user: cleanUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// --------------------------------------------
// ⭐ CHANGE PASSWORD
// --------------------------------------------
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // match old password
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect old password" });
    }

    // hash new password
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(newPassword, salt);

    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
