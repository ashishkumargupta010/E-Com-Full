import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Order = sequelize.define(
  "orders",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    userId: { type: DataTypes.INTEGER, allowNull: false },

    address: { type: DataTypes.JSON, allowNull: false },

    paymentMethod: { type: DataTypes.STRING, allowNull: false },

    paymentResult: { type: DataTypes.JSON, allowNull: true },

    total: { type: DataTypes.FLOAT, allowNull: false },

    status: { type: DataTypes.STRING, defaultValue: "Pending" },

    cancelReason: { type: DataTypes.TEXT, allowNull: true },
    returnReason: { type: DataTypes.TEXT, allowNull: true },

    deliveredDate: { type: DataTypes.DATE, allowNull: true },
    returnDeadline: { type: DataTypes.DATE, allowNull: true },

    placedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { timestamps: true }
);

export default Order;
