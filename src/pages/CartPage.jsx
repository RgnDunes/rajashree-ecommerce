import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import OrderSummary from '../components/OrderSummary';

export default function CartPage() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-[#1A1A1A]/10 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 className="font-display text-2xl font-semibold text-[#1A1A1A] mb-2">
          Your cart is empty
        </h2>
        <p className="text-[#1A1A1A]/50 mb-6">Looks like you haven't added anything yet.</p>
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-[#1A1A1A] text-white text-sm font-medium rounded-full hover:bg-[#C9A84C] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-3xl font-bold text-[#1A1A1A] mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6">
            <div className="divide-y divide-[#1A1A1A]/10">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-4 text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Continue Shopping
          </Link>
        </div>

        <div>
          <OrderSummary />
          <Link
            to="/checkout"
            className="block w-full mt-4 py-3 text-center text-sm font-medium bg-[#1A1A1A] text-white rounded-full hover:bg-[#C9A84C] transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
