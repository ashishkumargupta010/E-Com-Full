import dotenv from "dotenv";
dotenv.config();  

import app from "./src/app.js";
import sequelize from "./src/config/db.js";

// Import ALL MODELS + RELATIONS
import "./src/models/index.js";

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.error("❌ ERROR: JWT_SECRET missing in .env");
  process.exit(1);
}

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("📦 Tables Synced Successfully");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ Error:", err));
