import User from "./userModel.js";
import Order from "./orderModel.js";
import OrderItem from "./orderItemModel.js";
import Product from "./productModel.js";
import Review from "./reviewModel.js";

export default function setupAssociations() {
  console.log("🔗 Setting up model associations...");

  // USER ↔ ORDER
  User.hasMany(Order, { foreignKey: "userId", as: "orders" });
  Order.belongsTo(User, { foreignKey: "userId", as: "user" });

  // ORDER ↔ ORDER ITEMS
  Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
  OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

  // PRODUCT ↔ ORDER ITEMS
  Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
  OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

  // PRODUCT ↔ REVIEW
  Product.hasMany(Review, { foreignKey: "productId", as: "reviews" });
  Review.belongsTo(Product, { foreignKey: "productId", as: "product" });

  // USER ↔ REVIEW
  User.hasMany(Review, { foreignKey: "userId", as: "reviews" });
  Review.belongsTo(User, { foreignKey: "userId", as: "reviewUser" });

  console.log("✅ Associations set successfully");
}
