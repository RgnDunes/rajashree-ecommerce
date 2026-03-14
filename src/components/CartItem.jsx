import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function CartItem({ item, compact = false }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 py-4">
      <div className={`${compact ? 'w-16 h-16' : 'w-20 h-20'} flex-shrink-0 rounded-lg overflow-hidden bg-[#F0EDE8]`}>
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-[#1A1A1A] truncate`}>
          {item.name}
        </h4>
        <p className={`${compact ? 'text-xs' : 'text-sm'} text-[#1A1A1A]/60 mt-0.5`}>
          {formatCurrency(item.price)}
        </p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-[#1A1A1A]/15 rounded-full">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            onClick={() => removeItem(item.id)}
            className="text-xs text-[#1A1A1A]/40 hover:text-red-500 transition-colors"
            aria-label="Remove item"
          >
            Remove
          </button>
        </div>
      </div>
      <div className={`${compact ? 'text-xs' : 'text-sm'} font-semibold text-[#1A1A1A] flex-shrink-0`}>
        {formatCurrency(item.price * item.quantity)}
      </div>
    </div>
  );
}
