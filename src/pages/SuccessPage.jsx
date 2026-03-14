import { Link } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function SuccessPage() {
  const { order } = useOrder();

  if (!order) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <h2 className="font-display text-2xl font-semibold text-[#1A1A1A] mb-4">No order found</h2>
        <Link to="/" className="text-sm font-medium text-[#C9A84C] hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center animate-fade-in">
      <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
        Order Placed!
      </h1>
      <p className="mt-3 text-[#1A1A1A]/60">
        Thank you for your order. A confirmation email has been sent to{' '}
        <span className="font-medium text-[#1A1A1A]">{order.customer.email}</span>.
      </p>

      <div className="mt-8 bg-white rounded-2xl p-6 text-left">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#1A1A1A]/10">
          <div>
            <p className="text-xs text-[#1A1A1A]/50">Order ID</p>
            <p className="font-mono text-sm font-semibold text-[#1A1A1A]">{order.orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#1A1A1A]/50">Date</p>
            <p className="text-sm text-[#1A1A1A]">{order.orderDate}</p>
          </div>
        </div>

        <div className="space-y-3 mb-4 pb-4 border-b border-[#1A1A1A]/10">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F0EDE8] flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1A1A1A] truncate">{item.name}</p>
                <p className="text-xs text-[#1A1A1A]/50">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-1 mb-4 pb-4 border-b border-[#1A1A1A]/10">
          <div className="flex justify-between text-sm">
            <span className="text-[#1A1A1A]/60">Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#1A1A1A]/60">GST (18%)</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold pt-1">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>

        <div>
          <p className="text-xs text-[#1A1A1A]/50 mb-1">Shipping to</p>
          <p className="text-sm text-[#1A1A1A]">{order.customer.fullName}</p>
          <p className="text-sm text-[#1A1A1A]/70">{order.shippingAddress}</p>
        </div>
      </div>

      <Link
        to="/"
        className="inline-block mt-8 px-8 py-3 bg-[#1A1A1A] text-white text-sm font-medium rounded-full hover:bg-[#C9A84C] transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
