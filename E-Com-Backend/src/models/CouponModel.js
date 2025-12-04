import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Coupon = sequelize.define("Coupon", {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  discount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  minAmount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  // ⭐ VERY IMPORTANT FIELD
  // Admin can deactivate coupon → user should NOT see it
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,   // coupon active by default
  }
}, {
  timestamps: true,
});

export default Coupon;
