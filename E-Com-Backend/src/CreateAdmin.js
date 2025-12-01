import bcrypt from "bcryptjs";
import Admin from "./models/adminModel.js";
import sequelize from "./config/db.js";

const createAdmin = async () => {
  try {
    await sequelize.authenticate();

    const hash = await bcrypt.hash("admin123", 10);

    const admin = await Admin.create({
      name: "Super Admin",
      email: "admin@example.com",
      password: hash,
      role: "admin",
    });

    console.log("Admin created successfully:", admin.email);
    process.exit();
  } catch (err) {
    console.log("Error:", err.message);
    process.exit();
  }
};

createAdmin();
