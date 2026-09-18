import { FiInstagram, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const footerLinks = {
  'Quick Links': ['Home', 'Collections', 'Trending', 'Offers', 'About Us'],
  'Collections': ['Handloom Sarees', 'Printed Sarees', 'Soft Cotton', 'Chettinad Sarees', 'Office Wear'],
  'Customer Support': ['Track Order', 'Return Policy', 'Size Guide', 'FAQs', 'Contact Us'],
};

export default function Footer() {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-gray-900 text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4 rounded-lg overflow-hidden w-fit">
              <img src="/elegant-silks-logo.svg" alt="Elegant Silks and Sarees" className="w-44 h-auto" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5 max-w-xs">
              Premium Pure Cotton Sarees for Every Occasion. Crafted with tradition, delivered with love.
            </p>

            {/* Contact */}
            <div className="space-y-2 mb-5">
              {[
                { icon: FiPhone, text: '+91 98765 43210' },
                { icon: FiMail, text: 'hello@elegantsilks.com' },
                { icon: FiMapPin, text: 'Coimbatore, Tamil Nadu, India' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-gray-400">
                  <Icon size={14} className="text-purple-400 flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="flex gap-2">
              {[
                { icon: FiInstagram, href: '#', color: 'hover:bg-pink-600' },
                { icon: FiFacebook, href: '#', color: 'hover:bg-blue-600' },
                { icon: FaWhatsapp, href: '#', color: 'hover:bg-green-600' },
                { icon: FiYoutube, href: '#', color: 'hover:bg-red-600' },
              ].map(({ icon: Icon, href, color }) => (
                <a
                  key={href + color}
                  href={href}
                  className={`w-9 h-9 bg-gray-800 ${color} rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110`}
                >
                  <Icon size={16} className="text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4 text-sm">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => scrollTo('#featured')}
                      className="text-sm text-gray-400 hover:text-purple-400 transition-colors text-left"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © 2025 Elegant Silks. All rights reserved. Made with ❤️ in Tamil Nadu.
          </p>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms of Service', 'Shipping Policy'].map((item) => (
              <button key={item} className="text-xs text-gray-500 hover:text-purple-400 transition-colors">
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
