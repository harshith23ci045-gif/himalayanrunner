import { supabase } from "./supabase-client.js";

// IMPORTANT: Replace with your LIVE or TEST Razorpay Key ID
const RAZORPAY_KEY_ID = "rzp_test_1AxmWbqzHbVEpR";

/**
 * Payment Gateway – Razorpay Standard Checkout
 */
const PaymentGateway = {

    /**
     * Start payment
     * @param {Object} trek - { id, location, amount }
     * @param {Object} user - { id, full_name, email, phone }
     * @param {Function} onSuccess
     * @param {Function} onError
     */
    initiatePayment(trek, user, onSuccess, onError) {
        if (!window.Razorpay) {
            onError("Razorpay library not loaded");
            return;
        }

        const options = {
            key: RAZORPAY_KEY_ID,
            amount: trek.amount * 100, // INR → paise
            currency: "INR",
            name: "Himalayan Runners",
            description: `Trek Registration – ${trek.location}`,

            prefill: {
                name: user.full_name,
                email: user.email,
                contact: user.phone
            },

            notes: {
                trek_id: trek.id,
                trek_location: trek.location,
                user_id: user.id
            },

            theme: { color: "#1976d2" },

            handler: async (response) => {
                // Payment success – store in DB
                const paymentRecord = {
                    payment_id: response.razorpay_payment_id,
                    amount: trek.amount,
                    trek_id: trek.id,
                    trekker_id: user.id,
                    status: "success",
                    created_at: new Date().toISOString()
                };

                try {
                    await supabase.from("payments").insert(paymentRecord);
                    if (onSuccess) onSuccess(paymentRecord);
                } catch (err) {
                    console.error("DB store error:", err);
                    onError("Payment succeeded but saving failed.");
                }
            },

            modal: {
                ondismiss: () => {
                    if (onError) onError("Payment cancelled");
                }
            }
        };

        const razorpayObject = new Razorpay(options);

        razorpayObject.on("payment.failed", (res) => {
            onError(res.error.description || "Payment failed");
        });

        razorpayObject.open();
    },

    /**
     * Store payment record manually
     */
    async storePaymentRecord(payment) {
        try {
            await supabase.from("payments").insert(payment);
        } catch (err) {
            console.error("Error storing payment:", err);
        }
    },

    /**
     * Fetch payment history for trekker
     */
    async getPaymentHistory(trekkerId) {
        try {
            const { data } = await supabase
                .from("payments")
                .select("*")
                .eq("trekker_id", trekkerId)
                .order("created_at", { ascending: false });

            return data || [];
        } catch (err) {
            console.error("Error fetching payments:", err);
            return [];
        }
    }
};

export default PaymentGateway;

console.log("Razorpay config loaded");
