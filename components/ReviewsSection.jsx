import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';
import { reviews } from '../data/products';

export default function ReviewsSection() {
  const [current, setCurrent] = useState(0);
  const visible = 3;
  const maxStart = reviews.length - visible;

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(maxStart, c + 1));

  const visibleReviews = reviews.slice(current, current + visible);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-purple-600 font-semibold text-sm uppercase tracking-widest">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1" style={{ fontFamily: 'Playfair Display, serif' }}>
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <FiStar key={i} size={16} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-gray-600 text-sm font-medium">4.8/5 from 1,200+ reviews</span>
          </div>
        </motion.div>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="wait">
              {visibleReviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-shadow"
                >
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }, (_, j) => (
                      <FiStar
                        key={j}
                        size={14}
                        className={j < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{review.review}"</p>

                  <div className="flex items-center gap-3 pt-3 border-t border-purple-100">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-200"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                      <p className="text-xs text-gray-500">{review.location}</p>
                    </div>
                    <span className="ml-auto text-xs text-gray-400">{review.date}</span>
                  </div>

                  <div className="mt-3 bg-white/60 rounded-lg px-3 py-1.5">
                    <p className="text-[10px] text-purple-600 font-medium">Purchased: {review.product}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={prev}
              disabled={current === 0}
              className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-purple-50 hover:border-purple-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <FiChevronLeft size={18} />
            </button>
            <div className="flex gap-1.5">
              {Array.from({ length: maxStart + 1 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === current ? 'w-6 h-2 bg-purple-600' : 'w-2 h-2 bg-gray-300 hover:bg-purple-300'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              disabled={current >= maxStart}
              className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-purple-50 hover:border-purple-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
