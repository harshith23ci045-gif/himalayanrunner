// js/razorpay-client.js
// Replace CREATE_ORDER_URL with your deployed server endpoint
export const CREATE_ORDER_URL = "https://REPLACE_WITH_YOUR_SERVER/create-order"; // replace

export async function createRazorpayOrder(amount) {
  const resp = await fetch(CREATE_ORDER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error("Order creation failed: " + txt);
  }
  return resp.json();
}

export function openRazorpayCheckout(order, keyId, options = {}) {
  return new Promise((resolve, reject) => {
    const opts = {
      key: keyId,
      amount: order.amount,
      currency: order.currency,
      name: options.name || "Himalayan Runners",
      description: options.description || "Trek booking",
      order_id: order.id,
      handler: (response) => resolve(response),
      prefill: options.prefill || {},
      theme: { color: "#1d4f9c" },
    };
    const rzp = new window.Razorpay(opts);
    rzp.open();
  });
}
