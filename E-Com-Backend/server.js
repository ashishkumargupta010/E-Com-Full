import dotenv from "dotenv";
import sequelize from "./src/config/db.js";
import app from "./src/app.js";
import setupAssociations from "./src/models/associations.js";

dotenv.config();

// Very Important: Load associations BEFORE sync()
setupAssociations();

// Connect DB
sequelize
  .sync({ alter: true })  // you can keep alter:false if tables are final
  .then(() => console.log("📦 Database synced"))
  .catch((err) => console.log("❌ DB Sync Error:", err));

// Start Express Server
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
