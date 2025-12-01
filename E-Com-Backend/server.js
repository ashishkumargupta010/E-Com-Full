import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./src/config/db.js";
import routes from "./src/routes/index.js";  // If combined

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// Register All Routes
app.use("/api", routes);

sequelize.sync().then(() => {
  console.log("📦 Tables Synced Successfully");
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
