import User from "./userModel.js";
import Category from "./categoryModel.js";
import Product from "./productModel.js";
import Cart from "./cartModel.js";
import Order from "./orderModel.js";
import OrderItem from "./orderItemModel.js";
import Hero from "./heroModel.js";

// Category → Product
Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

// User → Cart
User.hasMany(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

// Product → Cart
Product.hasMany(Cart, { foreignKey: "productId" });
Cart.belongsTo(Product, { foreignKey: "productId" });

// User → Order
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

// Order → OrderItem
Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

// Product → OrderItem
Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

export { User, Category, Product, Cart, Order, OrderItem, Hero };
