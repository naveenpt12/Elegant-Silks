import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiLogOut, FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage,
  FiShoppingBag, FiTrendingUp, FiStar, FiGrid, FiList,
  FiAlertTriangle,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import ProductFormModal from './ProductFormModal';
import toast from 'react-hot-toast';

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <motion.div whileHover={{ y: -3 }} className={`${bg} rounded-2xl p-5 border border-white/60 shadow-sm`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${color} bg-white rounded-xl flex items-center justify-center shadow-sm`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </motion.div>
  );
}

function DeleteConfirm({ product, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50" onClick={onCancel} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 w-80 shadow-2xl"
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertTriangle size={22} className="text-red-500" />
            </div>
            <h3 className="font-bold text-gray-900 text-center mb-1">Delete Product?</h3>
            <p className="text-sm text-gray-500 text-center mb-5">
              "{product.name}" will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button onClick={onCancel}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={onConfirm}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function OrdersPanel({ orders, onStatusChange }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-900">Orders</h2>
        <p className="text-xs text-gray-500 mt-1">Review and update customer orders</p>
      </div>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No orders yet</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {orders.map(order => (
            <div key={order.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div>
                <p className="font-semibold text-gray-800">{order.id}</p>
                <p className="text-xs text-gray-500">{order.items.length} item(s) · ₹{order.total.toLocaleString()}</p>
              </div>
              <select
                value={order.status}
                onChange={event => onStatusChange(order.id, event.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"
              >
                {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardOverview({ allProducts, orders, trending, lowStock, avgRating }) {
  const pendingOrders = orders.filter(order => order.status === 'Pending').length;
  const revenue = orders.reduce((total, order) => total + order.total, 0);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiPackage} label="Total Products" value={allProducts.length} color="text-purple-600" bg="bg-purple-50" />
        <StatCard icon={FiShoppingBag} label="Total Orders" value={orders.length} color="text-green-600" bg="bg-green-50" />
        <StatCard icon={FiTrendingUp} label="Pending Orders" value={pendingOrders} color="text-blue-600" bg="bg-blue-50" />
        <StatCard icon={FiStar} label="Avg Rating" value={`${avgRating}★`} color="text-amber-500" bg="bg-amber-50" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-bold text-gray-900">Store Overview</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between"><span className="text-gray-500">Trending products</span><strong>{trending}</strong></div>
            <div className="flex items-center justify-between"><span className="text-gray-500">Low stock products</span><strong className="text-red-500">{lowStock}</strong></div>
            <div className="flex items-center justify-between"><span className="text-gray-500">Order revenue</span><strong>₹{revenue.toLocaleString()}</strong></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          {orders.length === 0 ? (
            <p className="text-sm text-gray-500 mt-4">No orders yet</p>
          ) : (
            <div className="mt-3 space-y-3">
              {orders.slice(0, 4).map(order => (
                <div key={order.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{order.id}</span>
                  <span className="text-gray-500">{order.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { allProducts, addProduct, updateProduct, deleteProduct } = useProducts();
  const { orders, updateOrderStatus } = useOrders();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' | 'table'
  const [section, setSection] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/admin');
    toast.success('Logged out successfully');
  };

  const handleSave = (data) => {
    if (editProduct) {
      updateProduct({ ...editProduct, ...data });
      toast.success('Product updated! ✅');
    } else {
      addProduct(data);
      toast.success('New saree added! 🎉');
    }
  };

  const handleDelete = () => {
    deleteProduct(deleteTarget.id);
    toast.success('Product deleted');
    setDeleteTarget(null);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setFormOpen(true);
  };

  const openAdd = () => {
    setEditProduct(null);
    setFormOpen(true);
  };

  // Unique categories from all products
  const allCategories = ['All', ...new Set(allProducts.map(p => p.category))];

  const filtered = allProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const lowStock = allProducts.filter(p => p.stock <= 5).length;
  const trending = allProducts.filter(p => p.trending).length;
  const avgRating = (allProducts.reduce((s, p) => s + p.rating, 0) / allProducts.length).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar + Main layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 fixed left-0 top-0 z-30">
          {/* Logo */}
          <div className="px-5 py-6 border-b border-white/10">
            <div className="rounded-lg overflow-hidden bg-white w-fit">
              <img src="/elegant-silks-logo.svg" alt="Elegant Silks and Sarees" className="w-40 h-auto" />
            </div>
            <p className="text-white/50 text-[10px] uppercase tracking-widest mt-3">Admin Panel</p>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {[
              { icon: FiGrid, label: 'Dashboard', value: 'dashboard' },
              { icon: FiPackage, label: 'Products', value: 'products' },
              { icon: FiShoppingBag, label: 'Orders', value: 'orders' },
            ].map(({ icon: Icon, label, value }) => (
              <button key={label}
                onClick={() => setSection(value)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${section === value ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </nav>

          {/* User */}
          <div className="px-4 py-4 border-t border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{user?.name?.[0]}</span>
              </div>
              <div>
                <p className="text-white text-xs font-semibold">{user?.name}</p>
                <p className="text-white/50 text-[10px] capitalize">{user?.role}</p>
              </div>
            </div>
            <button onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-xl text-xs font-medium transition-all">
              <FiLogOut size={13} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-60 min-h-screen">
          {/* Top bar */}
          <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm px-4 sm:px-6 py-3 flex items-center justify-between">
            <div>
              <h1 className="font-bold text-gray-900 text-lg">
                {section === 'dashboard' ? 'Dashboard' : section === 'products' ? 'Product Management' : 'Order Management'}
              </h1>
              <p className="text-xs text-gray-400">
                {section === 'dashboard' ? 'Track your store performance' : section === 'products' ? 'Manage your saree collection' : 'Review and update customer orders'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                👋 {user?.name}
              </span>
              <button onClick={handleLogout}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
                <FiLogOut size={13} /> Logout
              </button>
              {section === 'products' && (
                <motion.button whileTap={{ scale: 0.97 }} onClick={openAdd}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md shadow-purple-200">
                  <FiPlus size={15} /> Add Saree
                </motion.button>
              )}
            </div>
          </div>

            <div className="p-4 sm:p-6 space-y-6">
              {section === 'dashboard' ? (
                <DashboardOverview
                  allProducts={allProducts}
                  orders={orders}
                  trending={trending}
                  lowStock={lowStock}
                  avgRating={avgRating}
                />
              ) : section === 'orders' ? (
                <OrdersPanel orders={orders} onStatusChange={updateOrderStatus} />
              ) : (
                <>
            {/* Filters + View toggle */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-sm">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
              </div>
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white">
                {allCategories.map(c => <option key={c}>{c}</option>)}
              </select>
              <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                {[{ v: 'grid', icon: FiGrid }, { v: 'table', icon: FiList }].map(({ v, icon: Icon }) => (
                  <button key={v} onClick={() => setView(v)}
                    className={`p-2 rounded-lg transition-all ${view === v ? 'bg-white shadow-sm text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}>
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-800">{filtered.length}</span> of {allProducts.length} products
            </p>

            {/* Grid View */}
            {view === 'grid' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filtered.map((product, i) => (
                  <motion.div key={product.id}
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all group"
                  >
                    <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                      <img src={product.image} alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={e => { e.target.src = 'https://via.placeholder.com/200x250?text=No+Image'; }} />
                      {product.stock <= 5 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          Low Stock
                        </span>
                      )}
                      {product.trending && (
                        <span className="absolute top-2 right-2 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          Trending
                        </span>
                      )}
                      {/* Action overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(product)}
                          className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-purple-50 transition-colors shadow-lg">
                          <FiEdit2 size={14} className="text-purple-600" />
                        </button>
                        <button onClick={() => setDeleteTarget(product)}
                          className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors shadow-lg">
                          <FiTrash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-purple-600 font-medium truncate">{product.category}</p>
                      <p className="text-sm font-semibold text-gray-800 line-clamp-1 mt-0.5">{product.name}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-sm font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                        <span className="text-xs text-green-600 font-medium">{product.discount}% off</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-400">Stock: {product.stock}</span>
                        <span className="text-xs text-amber-500">⭐ {product.rating}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Table View */}
            {view === 'table' && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Status', 'Actions'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filtered.map((product, i) => (
                        <motion.tr key={product.id}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                          className="hover:bg-purple-50/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={product.image} alt={product.name}
                                className="w-10 h-12 object-cover rounded-lg flex-shrink-0"
                                onError={e => { e.target.src = 'https://via.placeholder.com/40x48?text=?'; }} />
                              <div>
                                <p className="font-semibold text-gray-800 line-clamp-1 max-w-[180px]">{product.name}</p>
                                <p className="text-xs text-gray-400">{product.badge}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">{product.category}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <p className="font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
                            <p className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${product.stock <= 5 ? 'bg-red-100 text-red-600' : product.stock <= 15 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                              {product.stock <= 5 ? '⚠️' : '✓'} {product.stock} units
                            </span>
                          </td>
                          <td className="px-4 py-3 text-amber-500 font-semibold whitespace-nowrap">⭐ {product.rating}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1">
                              {product.trending && (
                                <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium w-fit">Trending</span>
                              )}
                              <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium w-fit">{product.badge}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => openEdit(product)}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                                <FiEdit2 size={14} />
                              </button>
                              <button onClick={() => setDeleteTarget(product)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>

                  {filtered.length === 0 && (
                    <div className="text-center py-16">
                      <p className="text-4xl mb-3">📦</p>
                      <p className="text-gray-500 font-medium">No products found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
                </>
              )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <ProductFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditProduct(null); }}
        onSave={handleSave}
        editProduct={editProduct}
      />
      <DeleteConfirm product={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
