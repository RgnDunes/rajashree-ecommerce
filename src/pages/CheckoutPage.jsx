import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { sendOrderConfirmation } from '../services/emailService';
import { formatCurrency } from '../utils/formatCurrency';
import OrderSummary from '../components/OrderSummary';

const TAX_RATE = 0.18;

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, cartSubtotal, clearCart } = useCart();
  const { placeOrder } = useOrder();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  if (items.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <h2 className="font-display text-2xl font-semibold text-[#1A1A1A] mb-4">No items to checkout</h2>
        <Link to="/" className="text-sm font-medium text-[#C9A84C] hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email address';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!form.address1.trim()) newErrors.address1 = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    else if (!/^\d{6}$/.test(form.postalCode)) newErrors.postalCode = 'Enter a valid 6-digit postal code';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setEmailError('');

    const tax = Math.round(cartSubtotal * TAX_RATE);
    const total = cartSubtotal + tax;
    const shippingAddress = [form.address1, form.address2, form.city, form.state, form.postalCode, form.country]
      .filter(Boolean)
      .join(', ');

    const { orderId, orderDate } = placeOrder({
      items: [...items],
      customer: { ...form },
      subtotal: cartSubtotal,
      tax,
      total,
      shippingAddress,
    });

    const paymentLink = import.meta.env.VITE_PAYMENT_LINK
      ? `${import.meta.env.VITE_PAYMENT_LINK}?prefilled_email=${encodeURIComponent(form.email)}`
      : '#';

    try {
      await sendOrderConfirmation({
        customerName: form.fullName,
        customerEmail: form.email,
        orderId,
        orderDate,
        items,
        subtotal: cartSubtotal,
        tax,
        total,
        shippingAddress,
        paymentLink,
      });
    } catch (err) {
      console.error('EmailJS error:', err);
      setEmailError('Could not send confirmation email, but your order has been placed.');
    }

    clearCart();
    setLoading(false);
    navigate('/success');
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-lg border text-sm bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 ${
      errors[field] ? 'border-red-400' : 'border-[#1A1A1A]/15 focus:border-[#C9A84C]'
    }`;

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-3xl font-bold text-[#1A1A1A] mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6">
              <h2 className="font-display text-lg font-semibold text-[#1A1A1A] mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A]/60 mb-1">Full Name *</label>
                  <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className={inputClass('fullName')} />
                  {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A]/60 mb-1">Email Address *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass('email')} />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#1A1A1A]/60 mb-1">Phone Number *</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputClass('phone')} />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <h2 className="font-display text-lg font-semibold text-[#1A1A1A] mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A]/60 mb-1">Address Line 1 *</label>
                  <input type="text" name="address1" value={form.address1} onChange={handleChange} className={inputClass('address1')} />
                  {errors.address1 && <p className="mt-1 text-xs text-red-500">{errors.address1}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A]/60 mb-1">Address Line 2</label>
                  <input type="text" name="address2" value={form.address2} onChange={handleChange} className={inputClass('address2')} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#1A1A1A]/60 mb-1">City *</label>
                    <input type="text" name="city" value={form.city} onChange={handleChange} className={inputClass('city')} />
                    {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1A1A1A]/60 mb-1">State *</label>
                    <input type="text" name="state" value={form.state} onChange={handleChange} className={inputClass('state')} />
                    {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#1A1A1A]/60 mb-1">Postal Code *</label>
                    <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} className={inputClass('postalCode')} />
                    {errors.postalCode && <p className="mt-1 text-xs text-red-500">{errors.postalCode}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1A1A1A]/60 mb-1">Country</label>
                    <input type="text" name="country" value={form.country} onChange={handleChange} className={inputClass('country')} />
                  </div>
                </div>
              </div>
            </div>

            {emailError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                {emailError}
              </div>
            )}
          </div>

          <div>
            <div className="sticky top-24">
              <OrderSummary showItems />
              <button
                type="submit"
                disabled={loading}
                className="block w-full mt-4 py-3 text-center text-sm font-medium bg-[#1A1A1A] text-white rounded-full hover:bg-[#C9A84C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Pay ${formatCurrency(cartSubtotal + Math.round(cartSubtotal * TAX_RATE))}`}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
