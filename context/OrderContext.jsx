import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Fetch orders from Supabase Database
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const createOrder = async (items, total, customerDetails) => {
    const order = {
      id: `TRT-${Date.now()}`,
      customer_name: customerDetails.name,
      customer_phone: customerDetails.phone,
      customer_address: customerDetails.address,
      items: items.map(({ quantity, ...item }) => ({ ...item, quantity })),
      total,
      status: 'Pending',
    };
    
    // Insert into Supabase
    const { error } = await supabase.from('orders').insert([order]);
    
    if (error) {
      console.error('Failed to create order in DB:', error);
      toast.error('Failed to place order');
    } else {
      fetchOrders();
      toast.success('Order placed successfully!');
    }
    
    return order;
  };

  const updateOrderStatus = async (id, status) => {
    // Update local state optimistically
    setOrders(prev => prev.map(order => order.id === id ? { ...order, status } : order));
    
    // Update in Supabase
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);
      
    if (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
      fetchOrders(); // Revert on failure
    } else {
      toast.success('Order status updated!');
    }
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, updateOrderStatus, refreshOrders: fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
};
