import { createContext, useContext, useState } from 'react';

const OrderContext = createContext();
const STORAGE_KEY = 'trt-orders';

const loadOrders = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(loadOrders);

  const persist = (nextOrders) => {
    setOrders(nextOrders);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOrders));
  };

  const createOrder = (items, total) => {
    const order = {
      id: `TRT-${Date.now()}`,
      items: items.map(({ quantity, ...item }) => ({ ...item, quantity })),
      total,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    persist([order, ...orders]);
    return order;
  };

  const updateOrderStatus = (id, status) => {
    persist(orders.map(order => order.id === id ? { ...order, status } : order));
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
};
