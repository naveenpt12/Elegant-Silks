import { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useProducts } from '../context/ProductContext';
import ProductCard from './ProductCard';
import { useDebounce } from '../hooks/useScrolled';

const sortOptions = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'discount', label: 'Best Discount' },
];

export default function FeaturedProducts({ searchQuery = '' }) {
  const { allProducts } = useProducts();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sort, setSort] = useState('default');
  const [search, setSearch] = useState(searchQuery);
  const [viewMode, setViewMode] = useState('scroll'); // 'scroll' | 'grid'
  const debouncedSearch = useDebounce(search, 300);
  const scrollRef = useRef(null);

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (activeCategory !== 'All') list = list.filter(p => p.category === activeCategory);
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      );
    }
    switch (sort) {
      case 'price-asc': return list.sort((a, b) => a.price - b.price);
      case 'price-desc': return list.sort((a, b) => b.price - a.price);
      case 'rating': return list.sort((a, b) => b.rating - a.rating);
      case 'discount': return list.sort((a, b) => b.discount - a.discount);
      default: return list;
    }
  }, [activeCategory, allProducts, debouncedSearch, sort]);

  const allCategories = ['All', ...new Set(allProducts.map(p => p.category).filter(Boolean))];

  return (
    <section id="featured" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-purple-600 font-semibold text-sm uppercase tracking-widest">Handpicked For You</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1" style={{ fontFamily: 'Playfair Display, serif' }}>
            Featured Products
          </h2>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sarees..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white cursor-pointer"
          >
            {sortOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count & Toggle */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-800">{filtered.length}</span> products
          </p>
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
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500 font-medium">No products found. Try a different search.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4 sm:gap-5"
          >
            {filtered.map((product, i) => (
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
              onClick={() => {
                if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-12 h-12 rounded-full bg-white border border-gray-100 items-center justify-center text-gray-700 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-purple-50 hover:text-purple-600 hover:scale-110 hidden sm:flex"
            >
              <FiChevronLeft size={24} />
            </button>

            <motion.div
              ref={scrollRef}
              layout
              className="flex overflow-x-auto gap-4 sm:gap-5 pb-6 pt-2 px-4 sm:px-2 scrollbar-hide snap-x snap-mandatory"
            >
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="w-[220px] sm:w-[240px] flex-shrink-0 snap-start"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            <button
              onClick={() => {
                if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-12 h-12 rounded-full bg-white border border-gray-100 items-center justify-center text-gray-700 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-purple-50 hover:text-purple-600 hover:scale-110 hidden sm:flex"
            >
              <FiChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
