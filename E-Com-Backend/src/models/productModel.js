import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Category from "./categoryModel.js";

const Product = sequelize.define(
  "products",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },

    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isTrending: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

  },
  { timestamps: true }
);

// Relations
Product.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Product, { foreignKey: "categoryId" });

export default Product;
