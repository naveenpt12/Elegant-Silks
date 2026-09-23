import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiZap } from 'react-icons/fi';
import { useProducts } from '../context/ProductContext';
import ProductCard from './ProductCard';

export default function TrendingSection() {
  const [viewMode, setViewMode] = useState('scroll');
  const scrollRef = useRef(null);
  const { allProducts } = useProducts();
  const trending = allProducts.filter(p => p.trending);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
    }
  };

  return (
    <section id="trending" className="py-16 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-1">
              <FiZap className="text-amber-500 fill-amber-500" size={20} />
              <span className="text-purple-600 font-semibold text-sm uppercase tracking-widest">Hot Right Now</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Trending Sarees
            </h2>
          </motion.div>

          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('scroll')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'scroll' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Scroll
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'grid' ? (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-5"
          >
            {trending.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="relative -mx-4 sm:mx-0 group">
            <button
              onClick={() => scroll(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-700 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-purple-50 hover:text-purple-600 hover:scale-110 hidden sm:flex"
            >
              <FiChevronLeft size={24} />
            </button>

            <div
              ref={scrollRef}
              className="flex overflow-x-auto gap-4 sm:gap-5 pb-6 pt-2 px-4 sm:px-2 scrollbar-hide snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {trending.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="w-[260px] sm:w-[280px] flex-shrink-0 snap-start"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => scroll(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-700 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-purple-50 hover:text-purple-600 hover:scale-110 hidden sm:flex"
            >
              <FiChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
