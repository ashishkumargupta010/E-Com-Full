import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Product from "./productModel.js";

const Trending = sequelize.define("trending", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productId: { type: DataTypes.INTEGER, allowNull: false },
});

Trending.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Trending, { foreignKey: "productId" });



export default Trending;
