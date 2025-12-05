import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Contact = sequelize.define("Contact", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },

  status: {
    type: DataTypes.ENUM("pending", "resolved"),
    defaultValue: "pending",
  },
});

export default Contact;
