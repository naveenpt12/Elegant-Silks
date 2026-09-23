import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiX,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useScrolled } from '../hooks/useScrolled';
import CartDrawer from './CartDrawer';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Collections', href: '#collections' },
  { label: 'Trending', href: '#trending' },
  { label: 'Offers', href: '#offers' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const scrolled = useScrolled(20);
  const { cartCount, wishlist } = useCart();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const scrollTo = (href) => {
    setMenuOpen(false);
    if (href === '/') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Top bar */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white text-xs py-1.5 text-center font-medium tracking-wide">
          🎉 Free Shipping on Orders Above ₹999 | Use Code: <span className="font-bold">ELEGANTFREE</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src="/elegant-silks-logo.svg" alt="Elegant Silks and Sarees" className="w-36 sm:w-44 h-auto" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <AnimatePresence>
                {searchOpen ? (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleSearch}
                    className="overflow-hidden"
                  >
                    <input
                      ref={searchRef}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search sarees..."
                      className="w-full border border-purple-300 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </motion.form>
                ) : null}
              </AnimatePresence>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all"
              >
                {searchOpen ? <FiX size={18} /> : <FiSearch size={18} />}
              </button>

              <button
                onClick={() => scrollTo('#wishlist')}
                className="relative p-2 text-gray-600 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
              >
                <FiHeart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all"
              >
                <FiShoppingCart size={18} />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-purple-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>

              <Link to="/admin" className="hidden sm:flex p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all">
                <FiUser size={18} />
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all"
              >
                {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden bg-white border-t border-gray-100 shadow-lg"
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => scrollTo(link.href)}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
