import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import HelpCenter from "./pages/HelpCenter";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import ReturnPolicy from "./pages/ReturnPolicy";
import About from "./pages/About";
import Footer from "./components/Footer";

// checkout
import Checkout from "./pages/Checkout";
import PaymentPage from "./pages/PaymentPage";
import OrderSuccess from "./pages/OrderSuccess";
import SelectAddress from "./pages/SelectAddress";
import ReviewPage from "./pages/ReviewPage";

// user panel
import UserPanel from "./components/UserPanel/UserPanel";
import DashboardHome from "./components/UserPanel/DashboardHome";
import EditProfile from "./components/UserPanel/EditProfile";
import AddressPage from "./components/UserPanel/AddressPage";
import OrdersPage from "./components/UserPanel/OrdersPage";

// admin
import AdminDashboard from "./admin/AdminDashboard";
import AdminAuth from "./admin/AdminAuth";
import AdminProducts from "./admin/AdminProducts";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // 🔥 Correct admin session
  const admin = JSON.parse(localStorage.getItem("adminInfo") || "null");
  const adminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";

  // ✔ Correct user session (unchanged)
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");

  return (
    <div className="app-container">
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* USER ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/returns" element={<ReturnPolicy />} />
        <Route path="/about" element={<About />} />

        <Route path="/select-address" element={<SelectAddress />} />
        <Route path="/review" element={<ReviewPage />} />

        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        {/* USER PANEL */}
        <Route path="/userpanel" element={<UserPanel />}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<EditProfile />} />
          <Route path="address" element={<AddressPage />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>

        {/* ADMIN ROUTES FIXED */}
        <Route
          path="/admin/*"
          element={
            admin && adminLoggedIn ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        >
          <Route path="products" element={<AdminProducts />} />
        </Route>

        <Route path="/admin/login" element={<AdminAuth />} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
