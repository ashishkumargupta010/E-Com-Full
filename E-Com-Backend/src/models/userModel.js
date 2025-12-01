import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "users",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    name: { type: DataTypes.STRING, allowNull: false },

    email: { type: DataTypes.STRING, unique: true, allowNull: true },  // <-- email optional

    phone: { type: DataTypes.STRING, unique: true, allowNull: true },  // <-- phone optional

    password: { type: DataTypes.STRING, allowNull: false },

    role: { type: DataTypes.STRING, defaultValue: "user" },
  },
  { timestamps: true }
);

export default User;
