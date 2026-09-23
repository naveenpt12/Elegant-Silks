import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar, FiTrash2, FiEdit3, FiX, FiCheck } from 'react-icons/fi';
import { reviews as staticReviews } from '../data/products';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';

export default function ReviewsSection() {
  const [current, setCurrent] = useState(0);
  const [reviewsList, setReviewsList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', product: '', rating: 5, review: '' });

  const visible = 3;
  
  // Merge static reviews with DB reviews (or just use DB if we want). We'll merge them.
  const allReviews = [...staticReviews, ...reviewsList].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  const maxStart = Math.max(0, allReviews.length - visible);

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(maxStart, c + 1));

  const visibleReviews = allReviews.slice(current, current + visible);

  // GET API
  const fetchReviews = async () => {
    const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching reviews:', error);
    } else {
      setReviewsList(data || []);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // POST API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.review || !formData.product) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    const newReview = {
      ...formData,
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${formData.name}`,
      location: 'India',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const { error } = await supabase.from('reviews').insert([newReview]);
    
    setIsSubmitting(false);
    
    if (error) {
      toast.error('Failed to submit review');
      console.error(error);
    } else {
      toast.success('Review submitted successfully!');
      setIsModalOpen(false);
      setFormData({ name: '', product: '', rating: 5, review: '' });
      fetchReviews();
    }
  };

  // DELETE API
  const handleDelete = async (id, isStatic) => {
    if (isStatic) {
      toast.error('Cannot delete static demo reviews.');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this review?')) return;

    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete review');
    } else {
      toast.success('Review deleted!');
      fetchReviews();
      if (current > 0) setCurrent(c => c - 1);
    }
  };

  return (
    <section className="py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 relative"
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
            <span className="text-gray-600 text-sm font-medium">4.8/5 from {1200 + reviewsList.length}+ reviews</span>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white rounded-full font-medium transition-colors shadow-sm"
          >
            <FiEdit3 size={18} />
            Write a Review
          </button>
        </motion.div>

        {/* Reviews Carousel */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {visibleReviews.map((review, i) => (
                <motion.div
                  key={review.id || `static-${i}`}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-shadow relative group"
                >
                  {/* Delete Button (Only for DB reviews) */}
                  {review.created_at && (
                    <button 
                      onClick={() => handleDelete(review.id, false)}
                      className="absolute top-4 right-4 w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center shadow hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  )}

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

                  <div className="flex items-center gap-3 pt-3 border-t border-purple-100 mt-auto">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-200"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                      <p className="text-xs text-gray-500">{review.location || 'India'}</p>
                    </div>
                    <span className="ml-auto text-xs text-gray-400">{review.date}</span>
                  </div>

                  <div className="mt-3 bg-white/60 rounded-lg px-3 py-1.5 inline-block">
                    <p className="text-[10px] text-purple-600 font-medium">Purchased: {review.product}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          {allReviews.length > visible && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={prev}
                disabled={current === 0}
                className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-purple-50 hover:border-purple-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                <FiChevronLeft size={18} />
              </button>
              <div className="flex gap-1.5 hidden sm:flex">
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
          )}
        </div>
      </div>

      {/* Review Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-2xl z-[70] shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Your Name</label>
                  <input 
                    type="text" required
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Purchased Product</label>
                  <input 
                    type="text" required
                    value={formData.product} onChange={e => setFormData({...formData, product: e.target.value})}
                    placeholder="e.g. Kanchipuram Silk Saree"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star} type="button"
                        onClick={() => setFormData({...formData, rating: star})}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <FiStar size={24} className={star <= formData.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Your Review</label>
                  <textarea 
                    required rows={4}
                    value={formData.review} onChange={e => setFormData({...formData, review: e.target.value})}
                    placeholder="Tell us what you loved about it..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 resize-none"
                  />
                </div>

                <button 
                  type="submit" disabled={isSubmitting}
                  className="mt-2 w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? 'Submitting...' : <><FiCheck size={18} /> Submit Review</>}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
