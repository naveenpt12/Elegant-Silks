import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

export default function CartDrawer({ open, onClose }) {
  const { items, dispatch, cartTotal } = useCart();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const [step, setStep] = useState('cart'); // 'cart' | 'checkout'
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset step when closed
  useEffect(() => {
    if (!open) {
      setTimeout(() => setStep('cart'), 300);
    }
  }, [open]);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!customer.name || !customer.phone || !customer.address) {
      toast.error('Please fill all details');
      return;
    }
    
    setIsSubmitting(true);
    const order = await createOrder(items, cartTotal, customer);
    setIsSubmitting(false);
    
    dispatch({ type: 'CLEAR_CART' });
    setCustomer({ name: '', phone: '', address: '' });
    onClose();
    navigate('/?order=placed');
  };

  const remove = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    toast.success('Removed from cart');
  };

  const updateQty = (id, quantity) => {
    if (quantity < 1) return remove(id);
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
              <div className="flex items-center gap-2">
                {step === 'checkout' ? (
                  <button onClick={() => setStep('cart')} className="p-1.5 hover:bg-white rounded-full transition-colors mr-1">
                    <FiArrowLeft className="text-gray-600" size={18} />
                  </button>
                ) : (
                  <FiShoppingBag className="text-purple-600" size={20} />
                )}
                <h2 className="font-bold text-gray-900 text-lg">
                  {step === 'checkout' ? 'Shipping Details' : 'Shopping Cart'}
                </h2>
                {step === 'cart' && (
                  <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <FiX size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 relative overflow-x-hidden">
              <AnimatePresence mode="wait">
                {step === 'cart' ? (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {items.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center gap-4 mt-20">
                        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center">
                          <FiShoppingBag size={36} className="text-purple-300" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">Your cart is empty</p>
                          <p className="text-sm text-gray-400 mt-1">Add some beautiful sarees!</p>
                        </div>
                        <button
                          onClick={onClose}
                          className="bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors mt-4"
                        >
                          Continue Shopping
                        </button>
                      </div>
                    ) : (
                      items.map((item) => (
                        <div key={item.id} className="flex gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 line-clamp-2">{item.name}</p>
                            <p className="text-purple-600 font-bold text-sm mt-1">₹{item.price.toLocaleString()}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => updateQty(item.id, item.quantity - 1)}
                                className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-purple-50 hover:border-purple-300 transition-colors"
                              >
                                <FiMinus size={10} />
                              </button>
                              <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQty(item.id, item.quantity + 1)}
                                className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-purple-50 hover:border-purple-300 transition-colors"
                              >
                                <FiPlus size={10} />
                              </button>
                              <button
                                onClick={() => remove(item.id)}
                                className="ml-auto p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                ) : (
                  <motion.form
                    key="checkout"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleCheckoutSubmit}
                    className="flex flex-col gap-4 h-full"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Full Name *</label>
                      <input 
                        type="text" required
                        value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})}
                        placeholder="e.g. Priya Sharma"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Phone Number *</label>
                      <input 
                        type="tel" required
                        value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Full Delivery Address *</label>
                      <textarea 
                        required rows={4}
                        value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})}
                        placeholder="House no, Street name, City, State, PIN Code"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 focus:bg-white transition-colors resize-none"
                      />
                    </div>

                    <div className="mt-auto bg-purple-50 rounded-xl p-4 border border-purple-100">
                      <h4 className="font-bold text-gray-900 text-sm mb-2">Order Summary</h4>
                      <div className="flex justify-between items-center text-sm mb-1 text-gray-600">
                        <span>Items ({items.length})</span>
                        <span>₹{cartTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm mb-3 text-gray-600">
                        <span>Delivery</span>
                        <span className="text-green-600 font-bold">FREE</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-purple-200/50">
                        <span className="font-bold text-gray-900">Total to Pay</span>
                        <span className="font-bold text-lg text-purple-700">₹{cartTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-gray-100 space-y-3 bg-white">
                {step === 'cart' ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Subtotal</span>
                      <span className="text-xl font-bold text-gray-900">₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => setStep('checkout')}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-200"
                    >
                      Proceed to Checkout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleCheckoutSubmit}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-200 disabled:opacity-70"
                  >
                    {isSubmitting ? 'Processing...' : <><FiCheck size={18} /> Confirm Order</>}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
