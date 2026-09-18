import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) { toast.error('Please enter a valid email'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmail('');
      toast.success('🎉 Subscribed! Check your inbox for a 10% off coupon!');
    }, 1000);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-800 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <FiMail size={26} className="text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Stay in the Loop
          </h2>
          <p className="text-white/80 mb-2">
            Subscribe to our newsletter and get <span className="text-amber-300 font-bold">10% off</span> your first order!
          </p>
          <p className="text-white/60 text-sm mb-8">
            New arrivals, exclusive offers, and styling tips — delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3.5 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
              required
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm whitespace-nowrap disabled:opacity-70"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
              ) : (
                <>Subscribe <FiArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          <p className="text-white/50 text-xs mt-4">
            No spam, ever. Unsubscribe anytime. 🔒 Your privacy is protected.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
