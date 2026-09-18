import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  FiAward, FiTruck, FiShield, FiRefreshCw, FiDollarSign, FiPackage,
} from 'react-icons/fi';

const features = [
  {
    icon: FiAward,
    title: 'Premium Cotton Quality',
    description: '100% pure cotton sourced from the finest farms. Breathable, soft, and durable.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
  },
  {
    icon: FiPackage,
    title: 'Direct Manufacturing',
    description: 'We manufacture directly, cutting out middlemen to bring you the best prices.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
  },
  {
    icon: FiDollarSign,
    title: 'Affordable Prices',
    description: 'Premium quality sarees at factory prices. No compromise on quality or cost.',
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-100',
  },
  {
    icon: FiTruck,
    title: 'Fast Delivery',
    description: 'Express delivery across India. Most orders delivered within 2-3 business days.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: FiShield,
    title: 'Secure Payments',
    description: '100% secure payment gateway. UPI, cards, net banking — all accepted.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    icon: FiRefreshCw,
    title: 'Easy Returns',
    description: 'Not satisfied? Return within 7 days for a full refund. No questions asked.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
  },
];

function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 20);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function WhyChooseUs() {
  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-purple-600 font-semibold text-sm uppercase tracking-widest">Our Promise</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1" style={{ fontFamily: 'Playfair Display, serif' }}>
            Why Choose Elegant Silks?
          </h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">
            We're committed to bringing you the finest cotton sarees with an unmatched shopping experience
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { value: 10000, suffix: '+', label: 'Happy Customers' },
            { value: 500, suffix: '+', label: 'Saree Designs' },
            { value: 15, suffix: '+', label: 'Years Experience' },
            { value: 50, suffix: '+', label: 'Cities Delivered' },
          ].map(({ value, suffix, label }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100"
            >
              <p className="text-3xl font-bold text-purple-600">
                <Counter target={value} suffix={suffix} />
              </p>
              <p className="text-sm text-gray-500 mt-1 font-medium">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`bg-white rounded-2xl p-6 border ${feat.border} hover:shadow-lg transition-all duration-300`}
            >
              <div className={`w-12 h-12 ${feat.bg} rounded-xl flex items-center justify-center mb-4`}>
                <feat.icon size={22} className={feat.color} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{feat.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
