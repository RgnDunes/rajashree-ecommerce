import emailjs from '@emailjs/browser';

export const sendOrderConfirmation = async (orderData) => {
  const {
    customerName,
    customerEmail,
    orderId,
    orderDate,
    items,
    subtotal,
    tax,
    total,
    shippingAddress,
    paymentLink,
  } = orderData;

  const orderItemsText = items
    .map((item) => `${item.name} x${item.quantity} — ₹${(item.price * item.quantity).toLocaleString('en-IN')}`)
    .join('\n');

  const templateParams = {
    customer_name: customerName,
    order_id: orderId,
    order_date: orderDate,
    order_items: orderItemsText,
    subtotal: `₹${subtotal.toLocaleString('en-IN')}`,
    tax: `₹${tax.toLocaleString('en-IN')}`,
    total: `₹${total.toLocaleString('en-IN')}`,
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
