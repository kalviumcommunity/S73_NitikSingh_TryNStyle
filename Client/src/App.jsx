import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import UserProfile from "./pages/UserProfile";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import { CartProvider } from "./contexts/CartContext";

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          {/* Auth Route */}
          <Route path="/auth" element={<Auth />} />

          {/* Admin Route (Protected inside AdminPage) */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Product Routes */}
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          
          {/* Cart Route */}
          <Route path="/cart" element={<CartPage />} />

          {/* User Profile Route */}
          <Route path="/profile" element={<UserProfile />} />

          {/* Checkout Routes */}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/order/:orderId" element={<OrderTrackingPage />} />

          {/* Static Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* 404 Not Found */}
          <Route path="*" element={<p className="text-center mt-10 text-gray-500">404 - Page Not Found</p>} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
