import {
  API_URL,
  RAZORPAY_KEY_ID,
  BUSINESS_NAME,
  THEME_COLOR,
} from '../config/razorpay';

const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

export const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector(`script[src="${CHECKOUT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = CHECKOUT_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const postJson = async (path, body) => {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

/**
 * Real payment: create order on server -> open Razorpay -> verify on server.
 * Resolves with { orderId, paymentId } only after the server verified the signature.
 * Rejects with Error('PAYMENT_CANCELLED') if the user closes the window.
 */
export const payWithRazorpay = async ({ serviceName, amount, customer }) => {
  const loaded = await loadRazorpayScript();
  if (!loaded) throw new Error('Could not load Razorpay. Check your internet connection.');

  const order = await postJson('/create-order', {
    serviceName,
    amount,
    customer,
  });

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: BUSINESS_NAME,
      description: serviceName,
      prefill: { name: customer.name, email: customer.email },
      theme: { color: THEME_COLOR },
      modal: { ondismiss: () => reject(new Error('PAYMENT_CANCELLED')) },
      handler: async (response) => {
        try {
          await postJson('/verify-payment', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          resolve({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
          });
        } catch (err) {
          reject(err);
        }
      },
    });
    rzp.on('payment.failed', (resp) =>
      reject(new Error(resp?.error?.description || 'Payment failed'))
    );
    rzp.open();
  });
};

/** Demo payment used while no Razorpay keys are configured. */
export const simulateDemoPayment = async () => {
  await new Promise((r) => setTimeout(r, 1500));
  const id = Date.now();
  return { orderId: `order_DEMO_${id}`, paymentId: `pay_DEMO_${id}` };
};
