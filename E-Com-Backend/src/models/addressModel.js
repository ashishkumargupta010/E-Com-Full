import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./userModel.js";

const Address = sequelize.define(
  "addresses",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    fullName: DataTypes.STRING,
    phone: DataTypes.STRING,
    pincode: DataTypes.STRING,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    house: DataTypes.STRING,
    area: DataTypes.STRING,
  },
  { timestamps: true }
);

Address.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Address, { foreignKey: "userId" });

export default Address;
