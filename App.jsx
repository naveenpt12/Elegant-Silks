import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { ScrollToTop, WhatsAppButton, MobileBottomNav } from './components/FloatingButtons';
import CartDrawer from './components/CartDrawer';

function StoreLayout() {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-[calc(2rem+64px)]">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
      <Footer />
      <ScrollToTop />
      <WhatsAppButton />
      <MobileBottomNav onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <OrderProvider>
          <CartProvider>
            <BrowserRouter>
            <Routes>
              <Route path="/admin" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/*" element={<StoreLayout />} />
            </Routes>

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 2500,
                style: {
                  borderRadius: '12px',
                  background: '#1a1a1a',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: '500',
                },
              }}
            />
            </BrowserRouter>
          </CartProvider>
        </OrderProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
