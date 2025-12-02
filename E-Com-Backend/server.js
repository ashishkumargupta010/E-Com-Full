import dotenv from "dotenv";
import sequelize from "./src/config/db.js";
import app from "./src/app.js";

dotenv.config();

// Connect DB
sequelize.sync()
  .then(() => console.log("📦 Database synced"))
  .catch(err => console.log(err));

// Start actual express app
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
