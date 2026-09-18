import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHeart, FiShoppingCart, FiStar, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function QuickViewModal({ product, open, onClose }) {
  const { dispatch, isInWishlist, isInCart } = useCart();
  const inWishlist = isInWishlist(product?.id);
  const inCart = isInCart(product?.id);

  if (!product) return null;

  const addToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    toast.success('Added to cart! 🛒');
  };

  const toggleWishlist = () => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
    toast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist ❤️');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[700px] sm:max-h-[85vh] bg-white rounded-2xl z-50 overflow-hidden shadow-2xl flex flex-col"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
            >
              <FiX size={16} />
            </button>

            <div className="flex flex-col sm:flex-row overflow-y-auto">
              {/* Image */}
              <div className="sm:w-2/5 bg-gray-50 flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 sm:h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 p-5 overflow-y-auto">
                <p className="text-xs text-purple-600 font-semibold uppercase tracking-wider mb-1">{product.category}</p>
                <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-0.5 bg-green-500 text-white px-2 py-0.5 rounded-md">
                    <span className="text-xs font-bold">{product.rating}</span>
                    <FiStar size={10} className="fill-current" />
                  </div>
                  <span className="text-sm text-gray-500">{product.reviews} ratings</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  <span className="text-base text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="bg-green-100 text-green-700 text-sm font-bold px-2 py-0.5 rounded-lg">
                    {product.discount}% OFF
                  </span>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-4">{product.description}</p>

                {/* Delivery */}
                <div className="flex items-center gap-2 mb-4 p-2.5 bg-green-50 rounded-lg">
                  <FiTruck className="text-green-600" size={16} />
                  <span className="text-sm text-green-700 font-medium">{product.delivery}</span>
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { icon: FiShield, label: 'Secure Payment' },
                    { icon: FiRefreshCw, label: 'Easy Returns' },
                    { icon: FiTruck, label: 'Fast Delivery' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg">
                      <Icon size={16} className="text-purple-600" />
                      <span className="text-[10px] text-gray-600 text-center font-medium">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={addToCart}
                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      inCart
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                    }`}
                  >
                    {inCart ? '✓ Added to Cart' : (
                      <span className="flex items-center justify-center gap-1.5">
                        <FiShoppingCart size={14} /> Add to Cart
                      </span>
                    )}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={toggleWishlist}
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
                      inWishlist ? 'bg-rose-500 border-rose-500 text-white' : 'border-gray-200 text-gray-600 hover:border-rose-300 hover:text-rose-500'
                    }`}
                  >
                    <FiHeart size={16} className={inWishlist ? 'fill-current' : ''} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
