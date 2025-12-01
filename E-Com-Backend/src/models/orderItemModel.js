import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Order from "./orderModel.js";
import Product from "./productModel.js";

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

    // review object: { rating, text, imageUrl, date }
    review: { type: DataTypes.JSON, allowNull: true },
  },
  { timestamps: true }
);

OrderItem.belongsTo(Order, { foreignKey: "orderId" });
Order.hasMany(OrderItem, { foreignKey: "orderId" });

OrderItem.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(OrderItem, { foreignKey: "productId" });

export default OrderItem;
