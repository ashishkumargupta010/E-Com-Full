import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// ⭐ UPDATE NAME
export const updateName = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    req.user.name = name;
    await req.user.save();

    res.json({ message: "Name updated", user: req.user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ⭐ UPDATE CONTACT (email or phone)
export const updateContact = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // password verify required
    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    const user = await User.findByPk(req.user.id);

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Update fields
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();

    res.json({ message: "Contact updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
