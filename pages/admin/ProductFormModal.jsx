import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUpload, FiLink, FiImage } from 'react-icons/fi';
import { categories } from '../../data/products';

const BADGES = ['Bestseller', 'Limited', 'New', 'Trending', 'Sale', 'Classic', 'Premium'];

const empty = {
  name: '', category: categories[0].name, price: '', originalPrice: '',
  discount: '', rating: '4.5', reviews: '0', stock: '', badge: 'New',
  delivery: 'Free delivery in 2 days', description: '', image: '',
  trending: false, tags: '',
};

export default function ProductFormModal({ open, onClose, onSave, editProduct }) {
  const [form, setForm] = useState(empty);
  const [imgMode, setImgMode] = useState('url'); // 'url' | 'upload'
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  useEffect(() => {
    if (editProduct) {
      setForm({
        ...editProduct,
        tags: Array.isArray(editProduct.tags) ? editProduct.tags.join(', ') : editProduct.tags || '',
      });
      setPreview(editProduct.image || '');
    } else {
      setForm(empty);
      setPreview('');
    }
    setErrors({});
  }, [editProduct, open]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // Auto-calculate discount when price/originalPrice change
  useEffect(() => {
    const p = parseFloat(form.price);
    const op = parseFloat(form.originalPrice);
    if (p > 0 && op > p) {
      set('discount', Math.round(((op - p) / op) * 100));
    }
  }, [form.price, form.originalPrice]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      set('image', ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.price || isNaN(form.price) || +form.price <= 0) e.price = 'Valid price required';
    if (!form.originalPrice || +form.originalPrice <= +form.price) e.originalPrice = 'Must be greater than selling price';
    if (!form.stock || isNaN(form.stock)) e.stock = 'Stock quantity required';
    if (!form.image) e.image = 'Product image is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...form,
      price: +form.price,
      originalPrice: +form.originalPrice,
      discount: +form.discount,
      rating: +form.rating,
      reviews: +form.reviews,
      stock: +form.stock,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    onClose();
  };

  const Field = ({ label, error, children }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  const Input = ({ field, type = 'text', placeholder, ...rest }) => (
    <input
      type={type}
      value={form[field]}
      onChange={e => set(field, e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all ${errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
      {...rest}
    />
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[780px] sm:max-h-[90vh] bg-white rounded-2xl z-50 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-600 to-indigo-700">
              <h2 className="text-white font-bold text-lg">
                {editProduct ? '✏️ Edit Product' : '➕ Add New Saree'}
              </h2>
              <button onClick={onClose} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <FiX size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Product Name */}
                <div className="sm:col-span-2">
                  <Field label="Product Name *" error={errors.name}>
                    <Input field="name" placeholder="e.g. Royal Blue Handloom Cotton Saree" />
                  </Field>
                </div>

                {/* Category */}
                <Field label="Category *">
                  <select value={form.category} onChange={e => set('category', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white">
                    {categories.map(c => <option key={c.id}>{c.name}</option>)}
                  </select>
                </Field>

                {/* Badge */}
                <Field label="Badge">
                  <select value={form.badge} onChange={e => set('badge', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white">
                    {BADGES.map(b => <option key={b}>{b}</option>)}
                  </select>
                </Field>

                {/* Selling Price */}
                <Field label="Selling Price (₹) *" error={errors.price}>
                  <Input field="price" type="number" placeholder="e.g. 1499" min="1" />
                </Field>

                {/* Original Price */}
                <Field label="Original / MRP (₹) *" error={errors.originalPrice}>
                  <Input field="originalPrice" type="number" placeholder="e.g. 2499" min="1" />
                </Field>

                {/* Discount (auto-calculated) */}
                <Field label="Discount %">
                  <div className="relative">
                    <Input field="discount" type="number" placeholder="Auto-calculated" min="0" max="90" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">%</span>
                  </div>
                </Field>

                {/* Stock */}
                <Field label="Stock Quantity *" error={errors.stock}>
                  <Input field="stock" type="number" placeholder="e.g. 25" min="0" />
                </Field>

                {/* Rating */}
                <Field label="Rating (1-5)">
                  <input type="range" min="1" max="5" step="0.1" value={form.rating}
                    onChange={e => set('rating', e.target.value)}
                    className="w-full accent-purple-600 mt-1" />
                  <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                    <span>1</span>
                    <span className="font-bold text-purple-600">⭐ {(+form.rating).toFixed(1)}</span>
                    <span>5</span>
                  </div>
                </Field>

                {/* Reviews */}
                <Field label="Review Count">
                  <Input field="reviews" type="number" placeholder="e.g. 128" min="0" />
                </Field>

                {/* Delivery */}
                <div className="sm:col-span-2">
                  <Field label="Delivery Info">
                    <Input field="delivery" placeholder="e.g. Free delivery by Tomorrow" />
                  </Field>
                </div>

                {/* Tags */}
                <div className="sm:col-span-2">
                  <Field label="Tags (comma separated)">
                    <Input field="tags" placeholder="e.g. handloom, blue, festive" />
                  </Field>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <Field label="Description">
                    <textarea value={form.description} onChange={e => set('description', e.target.value)}
                      rows={3} placeholder="Describe the saree — fabric, occasion, special features..."
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none" />
                  </Field>
                </div>

                {/* Image */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Product Image *
                  </label>

                  {/* Mode toggle */}
                  <div className="flex gap-2 mb-3">
                    {[{ key: 'url', icon: FiLink, label: 'Image URL' }, { key: 'upload', icon: FiUpload, label: 'Upload File' }].map(({ key, icon: Icon, label }) => (
                      <button key={key} type="button" onClick={() => setImgMode(key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${imgMode === key ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        <Icon size={12} /> {label}
                      </button>
                    ))}
                  </div>

                  {imgMode === 'url' ? (
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={form.image.startsWith('data:') ? '' : form.image}
                        onChange={e => { set('image', e.target.value); setPreview(e.target.value); }}
                        placeholder="https://example.com/saree-image.jpg"
                        className={`flex-1 px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 ${errors.image ? 'border-red-300' : 'border-gray-200'}`}
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => fileRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:border-purple-400 hover:bg-purple-50 ${errors.image ? 'border-red-300' : 'border-gray-200'}`}
                    >
                      <FiImage size={28} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Click to upload saree image</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP up to 5MB</p>
                      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                    </div>
                  )}

                  {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}

                  {/* Preview */}
                  {preview && (
                    <div className="mt-3 relative inline-block">
                      <img src={preview} alt="Preview" onError={() => setPreview('')}
                        className="w-28 h-36 object-cover rounded-xl border border-gray-200 shadow-sm" />
                      <button type="button" onClick={() => { setPreview(''); set('image', ''); }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                        <FiX size={12} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Trending toggle */}
                <div className="sm:col-span-2 flex items-center gap-3">
                  <button type="button" onClick={() => set('trending', !form.trending)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.trending ? 'bg-purple-600' : 'bg-gray-200'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${form.trending ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                  <span className="text-sm font-medium text-gray-700">Mark as Trending</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end bg-gray-50">
              <button onClick={onClose}
                className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors">
                Cancel
              </button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md shadow-purple-200">
                {editProduct ? 'Save Changes' : 'Add Product'}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
