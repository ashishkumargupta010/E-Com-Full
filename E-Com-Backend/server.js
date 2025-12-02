import dotenv from "dotenv";
import sequelize from "./src/config/db.js";
import app from "./src/app.js";

dotenv.config();

const PORT = 5000;

sequelize.sync().then(() => {
  console.log("📦 Tables Synced Successfully");

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
