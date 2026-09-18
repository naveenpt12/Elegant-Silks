import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiArrowRight } from 'react-icons/fi';

const offers = [
  {
    id: 1,
    title: 'Flat 40% Off',
    subtitle: 'On All Handloom Sarees',
    description: 'Premium handloom cotton sarees at unbeatable prices. Limited time offer!',
    code: 'HANDLOOM40',
    bg: 'from-purple-600 via-purple-700 to-indigo-800',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=400&fit=crop',
    badge: '🔥 Hot Deal',
    timer: true,
  },
  {
    id: 2,
    title: 'Buy 2 Get 1 Free',
    subtitle: 'On Printed Cotton Sarees',
    description: 'Mix and match from our stunning printed collection. Add 3 to cart, pay for 2!',
    code: 'B2G1FREE',
    bg: 'from-rose-500 via-pink-600 to-rose-700',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&h=400&fit=crop',
    badge: '🎁 Special Offer',
    timer: false,
  },
  {
    id: 3,
    title: 'Festival Collection',
    subtitle: 'Up to 50% Off',
    description: 'Celebrate every occasion in style. Exclusive festival sarees at half price!',
    code: 'FESTIVAL50',
    bg: 'from-amber-500 via-orange-600 to-red-600',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&h=400&fit=crop',
    badge: '✨ Festival Special',
    timer: true,
  },
];

function CountdownTimer() {
  const [time, setTime] = useState({ h: 5, m: 42, s: 17 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-1.5 mt-2">
      <FiClock size={12} className="text-white/80" />
      <span className="text-white/80 text-xs">Ends in:</span>
      {[time.h, time.m, time.s].map((val, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-white/20 text-white text-xs font-bold px-1.5 py-0.5 rounded">{pad(val)}</span>
          {i < 2 && <span className="text-white/60 text-xs">:</span>}
        </span>
      ))}
    </div>
  );
}

export default function OffersSection() {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="offers" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-purple-600 font-semibold text-sm uppercase tracking-widest">Limited Time</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1" style={{ fontFamily: 'Playfair Display, serif' }}>
            Exclusive Offers
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${offer.bg} p-6 cursor-pointer group`}
              onClick={() => scrollTo('#featured')}
            >
              {/* Background image */}
              <div className="absolute inset-0 opacity-20">
                <img src={offer.image} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="relative z-10">
                <span className="inline-block bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full mb-3 border border-white/30">
                  {offer.badge}
                </span>
                <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {offer.title}
                </h3>
                <p className="text-white/90 font-semibold text-sm mb-2">{offer.subtitle}</p>
                <p className="text-white/70 text-xs leading-relaxed mb-3">{offer.description}</p>

                {offer.timer && <CountdownTimer />}

                <div className="mt-4 flex items-center justify-between">
                  <div className="bg-white/20 border border-white/30 rounded-lg px-3 py-1.5">
                    <p className="text-white/70 text-[10px] uppercase tracking-wider">Use Code</p>
                    <p className="text-white font-bold text-sm tracking-widest">{offer.code}</p>
                  </div>
                  <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <FiArrowRight size={16} className="text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
