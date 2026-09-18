import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { FiHome, FiGrid, FiHeart, FiShoppingCart, FiUser } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-4 sm:bottom-8 sm:right-6 z-40 w-11 h-11 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
        >
          <FiArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/919876543210?text=Hi! I'm interested in your cotton sarees."
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: 'spring' }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-36 right-4 sm:bottom-20 sm:right-6 z-40 w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-green-600 transition-colors"
    >
      <FaWhatsapp size={24} />
    </motion.a>
  );
}

export function MobileBottomNav({ onCartOpen }) {
  const { cartCount, wishlist } = useCart();

  const scrollTo = (id) => {
    if (id === '/') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { icon: FiHome, label: 'Home', action: () => scrollTo('/') },
    { icon: FiGrid, label: 'Shop', action: () => scrollTo('#featured') },
    { icon: FiHeart, label: 'Wishlist', badge: wishlist.length, action: () => scrollTo('#featured') },
    { icon: FiShoppingCart, label: 'Cart', badge: cartCount, action: onCartOpen },
    { icon: FiUser, label: 'Profile', action: () => {} },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-2xl">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map(({ icon: Icon, label, badge, action }) => (
          <button
            key={label}
            onClick={action}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl hover:bg-purple-50 transition-colors relative"
          >
            <Icon size={20} className="text-gray-600" />
            {badge > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-purple-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                {badge}
              </span>
            )}
            <span className="text-[10px] text-gray-500 font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
