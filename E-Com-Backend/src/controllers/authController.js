import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// Helper functions
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isPhone = (value) => /^\d{10}$/.test(value);

// ---------------------------------------------------------------
// REGISTER USER — EMAIL OR PHONE
// ---------------------------------------------------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: "Name & Password required" });
    }

    if (!email && !phone) {
      return res.status(400).json({ message: "Email or Phone required" });
    }

    // check existing user
    const exists = await User.findOne({
      where: {
        ...(email ? { email } : {}),
        ...(phone ? { phone } : {})
      }
    });

    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email || null,
      phone: phone || null,
      password: hashPass,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token: generateToken(user.id),
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// ---------------------------------------------------------------
// LOGIN USER — EMAIL OR PHONE
// ---------------------------------------------------------------
export const loginUser = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // Validate input
    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    if (!email && !phone) {
      return res.status(400).json({ message: "Email or Phone required" });
    }

    // find user using email or phone
    const user = await User.findOne({
      where: {
        ...(email ? { email } : {}),
        ...(phone ? { phone } : {})
      }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid login details" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid login details" });
    }

    return res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token: generateToken(user.id),
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
