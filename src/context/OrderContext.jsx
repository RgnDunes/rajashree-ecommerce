import { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [order, setOrder] = useState(null);

  const placeOrder = (orderData) => {
    const orderId = `ORD-${Date.now()}`;
    const orderDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setOrder({ ...orderData, orderId, orderDate });
    return { orderId, orderDate };
  };

  const clearOrder = () => setOrder(null);

  return (
    <OrderContext.Provider value={{ order, placeOrder, clearOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrder must be used within OrderProvider');
  return context;
};
