import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Hero = sequelize.define("heroBanners", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.STRING, allowNull: false },
  src: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING },
  buttonText: { type: DataTypes.STRING },
  link: { type: DataTypes.STRING },
});

export default Hero;
