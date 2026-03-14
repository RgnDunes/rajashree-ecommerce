import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import CartItem from './CartItem';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, cartSubtotal } = useCart();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#F9F7F4] z-50 shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-[#1A1A1A]/10">
            <h2 className="font-display text-xl font-semibold text-[#1A1A1A]">
              Your Cart ({items.length})
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
              aria-label="Close cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#1A1A1A]/15 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-[#1A1A1A]/50 text-sm">Your cart is empty</p>
                <button
                  onClick={onClose}
                  className="mt-4 text-sm font-medium text-[#C9A84C] hover:underline"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[#1A1A1A]/10">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} compact />
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t border-[#1A1A1A]/10">
              <div className="flex justify-between mb-4">
                <span className="text-sm text-[#1A1A1A]/60">Subtotal</span>
                <span className="text-sm font-semibold">{formatCurrency(cartSubtotal)}</span>
              </div>
              <Link
                to="/cart"
                onClick={onClose}
                className="block w-full py-3 text-center text-sm font-medium border border-[#1A1A1A] text-[#1A1A1A] rounded-full hover:bg-[#1A1A1A] hover:text-white transition-colors mb-2"
              >
                View Cart
              </Link>
              <Link
                to="/checkout"
                onClick={onClose}
                className="block w-full py-3 text-center text-sm font-medium bg-[#1A1A1A] text-white rounded-full hover:bg-[#C9A84C] transition-colors"
              >
                Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
