import Admin from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & Password required" });

    const admin = await Admin.findOne({ where: { email } });

    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: "Admin login successful",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
      token: generateToken(admin.id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
