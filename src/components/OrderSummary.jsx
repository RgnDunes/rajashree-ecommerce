import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';

const TAX_RATE = 0.18;

export default function OrderSummary({ showItems = false }) {
  const { items, cartSubtotal } = useCart();
  const tax = Math.round(cartSubtotal * TAX_RATE);
  const total = cartSubtotal + tax;

  return (
    <div className="bg-white rounded-2xl p-6">
      <h3 className="font-display text-lg font-semibold text-[#1A1A1A] mb-4">
        Order Summary
      </h3>

      {showItems && (
        <div className="space-y-3 mb-4 pb-4 border-b border-[#1A1A1A]/10">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F0EDE8] flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#1A1A1A] truncate">{item.name}</p>
                <p className="text-xs text-[#1A1A1A]/50">Qty: {item.quantity}</p>
              </div>
              <span className="text-xs font-medium">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[#1A1A1A]/60">Subtotal</span>
          <span className="font-medium">{formatCurrency(cartSubtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#1A1A1A]/60">GST (18%)</span>
          <span className="font-medium">{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#1A1A1A]/60">Shipping</span>
          <span className="font-medium text-green-600">Free</span>
        </div>
        <div className="border-t border-[#1A1A1A]/10 pt-2 mt-2">
          <div className="flex justify-between">
            <span className="font-semibold text-[#1A1A1A]">Total</span>
            <span className="text-lg font-bold text-[#1A1A1A]">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
