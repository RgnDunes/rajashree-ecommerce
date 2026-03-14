import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar({ onCartClick }) {
  const { cartCount } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#F9F7F4]/95 backdrop-blur-sm border-b border-[#1A1A1A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-display text-2xl font-bold text-[#1A1A1A] tracking-tight">
            Rajashree
          </Link>

          <div className="hidden sm:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors">
              Shop
            </Link>
            <Link to="/cart" className="text-sm font-medium text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors">
              Cart
            </Link>
          </div>

          <button
            onClick={onCartClick}
            className="relative p-2 text-[#1A1A1A] hover:text-[#C9A84C] transition-colors"
            aria-label="Open cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C9A84C] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
