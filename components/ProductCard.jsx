import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiEye, FiStar, FiTruck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import QuickViewModal from './QuickViewModal';

const badgeColors = {
  Bestseller: 'bg-amber-500',
  Limited: 'bg-red-500',
  New: 'bg-green-500',
  Trending: 'bg-blue-500',
  Sale: 'bg-orange-500',
  Classic: 'bg-purple-500',
  Premium: 'bg-indigo-600',
};

export default function ProductCard({ product }) {
  const { dispatch, isInWishlist, isInCart } = useCart();
  const [quickView, setQuickView] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const inCart = isInCart(product.id);

  const addToCart = (e) => {
    e.stopPropagation();
    dispatch({ type: 'ADD_TO_CART', payload: product });
    toast.success(`${product.name.split(' ').slice(0, 3).join(' ')} added to cart!`, {
      icon: '🛒',
    });
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
    toast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist ❤️', {
      icon: inWishlist ? '💔' : '❤️',
    });
  };

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(product.rating));

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -10, scale: 1.05 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 hover:border-purple-300 transition-all duration-500 group cursor-pointer relative"
        onClick={() => setQuickView(true)}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/0 via-purple-600/0 to-indigo-600/0 group-hover:from-purple-600/5 group-hover:via-transparent group-hover:to-indigo-600/5 transition-colors duration-500 z-10 pointer-events-none" />

        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50 aspect-[4/5]">
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-white to-gray-100 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
            </div>
          )}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=No+Image'; setImgLoaded(true); }}
            className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-1 ${imgLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
          />

          {/* Badge */}
          {product.badge && (
            <span className={`absolute top-2 left-2 ${badgeColors[product.badge] || 'bg-gray-500'} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
              {product.badge}
            </span>
          )}

          {/* Discount */}
          <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{product.discount}%
          </span>

          {/* Hover actions */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); setQuickView(true); }}
              className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-50 transition-colors"
            >
              <FiEye size={15} className="text-gray-700" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleWishlist}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                inWishlist ? 'bg-rose-500 text-white' : 'bg-white hover:bg-rose-50 text-gray-700'
              }`}
            >
              <FiHeart size={15} className={inWishlist ? 'fill-current' : ''} />
            </motion.button>
          </div>

          {/* Stock warning */}
          {product.stock <= 5 && (
            <div className="absolute bottom-2 left-2 right-2 bg-red-500/90 text-white text-[10px] font-medium text-center py-1 rounded-lg">
              Only {product.stock} left!
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <p className="text-[10px] text-purple-600 font-medium uppercase tracking-wide mb-1">{product.category}</p>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-2">{product.name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center gap-0.5">
              {stars.map((filled, i) => (
                <FiStar
                  key={i}
                  size={11}
                  className={filled ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-500">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
            <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
          </div>

          {/* Delivery */}
          <div className="flex items-center gap-1 mb-3">
            <FiTruck size={11} className="text-green-500" />
            <span className="text-[10px] text-green-600 font-medium">{product.delivery}</span>
          </div>

          {/* Add to Cart */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={addToCart}
            className={`w-full py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              inCart
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-sm hover:shadow-purple-200 hover:shadow-md'
            }`}
          >
            {inCart ? '✓ Added to Cart' : (
              <span className="flex items-center justify-center gap-1.5">
                <FiShoppingCart size={13} /> Add to Cart
              </span>
            )}
          </motion.button>
        </div>
      </motion.div>

      <QuickViewModal product={product} open={quickView} onClose={() => setQuickView(false)} />
    </>
  );
}
