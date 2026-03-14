# CLAUDE.md — E-Commerce Website with Email Notifications

## Project Overview

A fully client-side e-commerce website built with React, deployable to **GitHub Pages**. Users can browse products, add items to a cart, fill in checkout details, and upon clicking "Pay" receive a confirmation email containing order details and a payment link.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React (Vite) |
| Styling | Tailwind CSS |
| Routing | React Router (HashRouter for GitHub Pages) |
| Email Service | EmailJS (client-side email, no backend needed) |
| Payment Link | Stripe Payment Links or Razorpay (pre-created links, no server needed) |
| Deployment | GitHub Pages via `gh-pages` npm package |
| State Management | React Context API (Cart + Checkout state) |

> **Why no backend?** GitHub Pages serves only static files. All dynamic features (email sending, payment links) are handled via third-party client-side SDKs.

---

## Project Structure

```
ecommerce-app/
├── public/
│   └── index.html
├── src/
│   ├── assets/               # Product images, icons
│   ├── components/
│   │   ├── Navbar.jsx        # Cart icon with item count badge
│   │   ├── ProductCard.jsx   # Product display + "Add to Cart" button
│   │   ├── CartDrawer.jsx    # Slide-in cart sidebar
│   │   ├── CartItem.jsx      # Individual cart item (qty controls, remove)
│   │   └── OrderSummary.jsx  # Price breakdown at checkout
│   ├── pages/
│   │   ├── HomePage.jsx      # Product listing grid
│   │   ├── ProductPage.jsx   # Single product detail view
│   │   ├── CartPage.jsx      # Full cart view
│   │   ├── CheckoutPage.jsx  # Checkout form
│   │   └── SuccessPage.jsx   # Order confirmation page
│   ├── context/
│   │   ├── CartContext.jsx   # Cart state: items, add, remove, update qty
│   │   └── OrderContext.jsx  # Stores completed order details
│   ├── data/
│   │   └── products.js       # Static product catalog (id, name, price, image, description, category)
│   ├── services/
│   │   └── emailService.js   # EmailJS integration — sendOrderConfirmation()
│   ├── utils/
│   │   └── formatCurrency.js # Currency formatting helpers
│   ├── App.jsx
│   └── main.jsx
├── .env.example              # VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
├── vite.config.js            # base: '/repo-name/' for GitHub Pages
├── tailwind.config.js
└── package.json
```

---

## Pages & User Flow

### 1. Home Page (`/`)
- Displays product grid with filters (optional: by category)
- Each `ProductCard` has: image, name, price, "Add to Cart" button
- Clicking a product navigates to its detail page
- Navbar shows cart icon with live item count

### 2. Product Detail Page (`/product/:id`)
- Large product image, full description, price
- Quantity selector + "Add to Cart" button
- "Back to Shop" link

### 3. Cart Page (`/cart`)
- Lists all added items with quantity controls (+/−) and remove button
- Shows subtotal, tax (e.g. 18% GST), and total
- "Continue Shopping" and "Proceed to Checkout" buttons
- Empty state with CTA if no items

### 4. Checkout Page (`/checkout`)
- **Form fields** (all required):
  - Full Name
  - Email Address ← used for sending confirmation email
  - Phone Number
  - Address Line 1 & 2
  - City, State, Postal Code, Country
- Order summary panel on the right (product list, totals)
- **"Pay Now" button** — triggers:
  1. Form validation
  2. `sendOrderConfirmation()` via EmailJS
  3. Redirect to payment link (Stripe/Razorpay pre-built link)
  4. On success, navigate to `/success`

### 5. Success Page (`/success`)
- "Order Placed!" confirmation with order ID (generated client-side: `ORD-` + timestamp)
- Summary of ordered items and customer details
- "Continue Shopping" button

---

## Email Service Setup (EmailJS)

### Why EmailJS?
Sends emails directly from the browser — no backend, no server, works perfectly with GitHub Pages.

### Setup Steps
1. Create account at [emailjs.com](https://www.emailjs.com)
2. Connect an email service (Gmail recommended)
3. Create an **Email Template** with these variables:

```
Subject: Order Confirmation — {{order_id}}

Hi {{customer_name}},

Thank you for your order!

📦 ORDER DETAILS
Order ID: {{order_id}}
Date: {{order_date}}

🛒 ITEMS ORDERED
{{order_items}}

💰 PAYMENT SUMMARY
Subtotal: {{subtotal}}
Tax: {{tax}}
Total: {{total}}

📍 SHIPPING TO
{{shipping_address}}

💳 COMPLETE YOUR PAYMENT
Click here to pay: {{payment_link}}

If you have questions, reply to this email.

Thanks,
The Store Team
```

4. Copy your **Service ID**, **Template ID**, and **Public Key** into `.env`:

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxx
```

### `emailService.js` Implementation

```js
import emailjs from '@emailjs/browser';

export const sendOrderConfirmation = async (orderData) => {
  const {
    customerName, customerEmail, orderId, orderDate,
    items, subtotal, tax, total, shippingAddress, paymentLink
  } = orderData;

  const orderItemsText = items
    .map(item => `${item.name} x${item.quantity} — $${(item.price * item.quantity).toFixed(2)}`)
    .join('\n');

  const templateParams = {
    customer_name: customerName,
    order_id: orderId,
    order_date: orderDate,
    order_items: orderItemsText,
    subtotal: `$${subtotal.toFixed(2)}`,
    tax: `$${tax.toFixed(2)}`,
    total: `$${total.toFixed(2)}`,
    shipping_address: shippingAddress,
    payment_link: paymentLink,
    to_email: customerEmail,
  };

  return emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    templateParams,
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );
};
```

---

## Payment Link Strategy

Since there's no backend, use **pre-created** payment links:

### Option A — Stripe Payment Links (Recommended)
1. Create a generic "Pay for Order" product in Stripe Dashboard
2. Generate a Payment Link (e.g. `https://buy.stripe.com/xxxxx`)
3. Append `?prefilled_email=user@example.com` to pre-fill customer email

### Option B — Razorpay Payment Links
1. Create a payment link in Razorpay Dashboard
2. Use the static URL in emails

> **Note:** For a production app, replace this with a real payment flow using a backend. For GitHub Pages demo purposes, a pre-created link is sufficient.

---

## Cart Context (`CartContext.jsx`)

Manages global cart state using `useReducer` + `localStorage` persistence.

```js
// Actions: ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART
// State: { items: [{ id, name, price, image, quantity }] }
// Computed: cartCount, cartSubtotal
```

---

## Design System

Follow the **frontend-design** skill guidelines. Suggested aesthetic: **Modern Luxury Minimal**.

- **Fonts**: Display — `Playfair Display`; Body — `DM Sans`
- **Colors**: Off-white `#F9F7F4` background, deep charcoal `#1A1A1A`, gold accent `#C9A84C`
- **Motion**: Subtle fade-ins on page load, cart drawer slide animation, button press feedback
- **Layout**: Clean product grid (3 cols desktop, 2 tablet, 1 mobile), generous white space
- **Components**: Pill badges for categories, floating cart button on mobile

---

## GitHub Pages Deployment

### 1. Vite Config (`vite.config.js`)

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/YOUR-REPO-NAME/',  // ← replace with actual GitHub repo name
})
```

### 2. React Router — Use `HashRouter`

```jsx
// main.jsx
import { HashRouter } from 'react-router-dom'
// HashRouter uses /#/path format, which works on GitHub Pages
// DO NOT use BrowserRouter (requires server-side routing)
```

### 3. `package.json` Scripts

```json
{
  "homepage": "https://YOUR-USERNAME.github.io/YOUR-REPO-NAME",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.0.0"
  }
}
```

### 4. Deploy Command

```bash
npm run deploy
```

This builds the project and pushes the `dist/` folder to the `gh-pages` branch automatically.

### 5. GitHub Settings
- Go to repo **Settings → Pages**
- Source: Deploy from branch → `gh-pages` → `/ (root)`
- Site will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

---

## Environment Variables

```env
# .env (never commit this — add to .gitignore)
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxx
VITE_PAYMENT_LINK=https://buy.stripe.com/xxxxx
```

> For GitHub Actions deployment, add these as **Repository Secrets** and reference them in the workflow.

---

## Sample Products Data (`src/data/products.js`)

```js
export const products = [
  {
    id: 1,
    name: "Minimalist Watch",
    price: 129.99,
    category: "Accessories",
    image: "/images/watch.jpg",
    description: "A sleek, minimalist timepiece with a leather strap.",
    rating: 4.5,
    stock: 15,
  },
  // Add 8–12 more products across 3–4 categories
];
```

---

## Key Implementation Notes

1. **No backend required** — EmailJS + static payment links cover all dynamic functionality
2. **HashRouter is mandatory** for GitHub Pages (no 404 on refresh)
3. **Cart persists in localStorage** so users don't lose items on refresh
4. **Order ID** is generated client-side: `` `ORD-${Date.now()}` ``
5. **Form validation** must run before calling EmailJS — show inline errors
6. **Loading state** on "Pay Now" button while email is sending
7. **Error handling** — if EmailJS fails, show a toast and still allow redirect to payment link
8. **`.env` must be in `.gitignore`** — never expose API keys in public repo
9. **Images** — use Unsplash URLs or place images in `public/images/` folder

---

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

---

## Checklist Before Deployment

- [ ] All products have images and descriptions
- [ ] EmailJS template created and tested
- [ ] `.env` values filled in (and `.env` is in `.gitignore`)
- [ ] Payment link created and set in `.env`
- [ ] `vite.config.js` `base` set to correct repo name
- [ ] `package.json` `homepage` URL is correct
- [ ] HashRouter confirmed (not BrowserRouter)
- [ ] Cart persists correctly on page refresh
- [ ] Checkout form validates all required fields
- [ ] Confirmation email received on test order
- [ ] Mobile responsive layout verified
- [ ] GitHub Pages source set to `gh-pages` branch