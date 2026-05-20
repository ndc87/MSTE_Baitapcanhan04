import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Lazy-load e-commerce pages
const Home          = lazy(() => import('./pages/Home'));
const Shop          = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const CartPage      = lazy(() => import('./pages/CartPage'));
const CheckoutPage  = lazy(() => import('./pages/CheckoutPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage'));

// Auth pages (existing — not lazy, smaller)
import Register      from './pages/Register';
import VerifyOTP     from './pages/VerifyOTP';
import Login         from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile       from './pages/Profile';

// Global cart drawer (rendered outside routes so it persists)
import CartDrawer from './components/cart/CartDrawer';

// Fallback while lazy pages load
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-primary-500 animate-spin" />
  </div>
);

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 3000 }} />
      
      {/* Cart drawer — always rendered, visibility controlled by Redux */}
      <CartDrawer />

      <Routes>
        {/* E-commerce pages */}
        <Route path="/" element={
          <Suspense fallback={<PageLoader />}><Home /></Suspense>
        } />
        <Route path="/shop" element={
          <Suspense fallback={<PageLoader />}><Shop /></Suspense>
        } />
        <Route path="/products/:slug" element={
          <Suspense fallback={<PageLoader />}><ProductDetail /></Suspense>
        } />
        <Route path="/cart" element={
          <Suspense fallback={<PageLoader />}><CartPage /></Suspense>
        } />
        <Route path="/checkout" element={
          <Suspense fallback={<PageLoader />}><CheckoutPage /></Suspense>
        } />
        <Route path="/orders" element={
          <Suspense fallback={<PageLoader />}><OrderHistoryPage /></Suspense>
        } />
        <Route path="/orders/:id" element={
          <Suspense fallback={<PageLoader />}><OrderTrackingPage /></Suspense>
        } />

        {/* Auth pages */}
        <Route path="/register"        element={<Register />} />
        <Route path="/verify-otp"      element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />
        <Route path="/user/profile"    element={<Profile />} />
        <Route path="/login"           element={<Login />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
