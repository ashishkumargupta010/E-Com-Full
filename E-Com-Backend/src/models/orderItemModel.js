import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const OrderItem = sequelize.define(
  "order_items",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    orderId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },

    name: { type: DataTypes.STRING },
    price: { type: DataTypes.FLOAT },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    size: { type: DataTypes.STRING, allowNull: true },

    review: { type: DataTypes.JSON, allowNull: true },
  },
  { timestamps: true }
);

export default OrderItem;
