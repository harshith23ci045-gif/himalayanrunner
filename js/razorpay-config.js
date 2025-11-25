// Razorpay Configuration
const RAZORPAY_CONFIG = {
    KEY_ID: 'rzp_test_1AxmWbqzHbVEpR', // Replace with your Razorpay Key ID
    // Note: Never expose Key Secret in frontend code
};

// Initialize Razorpay payment handler
const PaymentGateway = {
    /**
     * Initialize a Razorpay payment for trek registration
     * @param {Object} trekData - Trek details { id, location, amount, date }
     * @param {Object} userData - User details { id, full_name, email, phone }
     * @param {Function} onSuccess - Callback on successful payment
     * @param {Function} onError - Callback on payment error
     */
    async initiatePayment(trekData, userData, onSuccess, onError) {
        try {
            if (!window.Razorpay) {
                throw new Error('Razorpay script not loaded');
            }

            const options = {
                key: RAZORPAY_CONFIG.KEY_ID,
                amount: trekData.amount * 100, // Amount in paise (multiply by 100)
                currency: 'INR',
                name: 'Himalayan Runners',
                description: `Trek: ${trekData.location}`,
                order_id: await this.createOrderId(trekData, userData), // Backend order creation (optional)
                
                // Prefill user details
                prefill: {
                    name: userData.full_name,
                    email: userData.email,
                    contact: userData.phone
                },
                
                // Notes for tracking
                notes: {
                    trek_id: trekData.id,
                    trek_location: trekData.location,
                    trek_date: trekData.date,
                    user_id: userData.id
                },
                
                // Theme customization
                theme: {
                    color: '#004e92' // Himalayan Runners primary color
                },
                
                // Handler functions
                handler: async (response) => {
                    console.log('Payment successful:', response);
                    
                    // Verify payment on backend (optional but recommended)
                    const verified = await this.verifyPayment(response, trekData, userData);
                    
                    if (verified || response.razorpay_payment_id) {
                        if (onSuccess) {
                            onSuccess({
                                payment_id: response.razorpay_payment_id,
                                order_id: response.razorpay_order_id,
                                signature: response.razorpay_signature,
                                amount: trekData.amount,
                                trek_id: trekData.id,
                                user_id: userData.id
                            });
                        }
                    } else {
                        if (onError) {
                            onError('Payment verification failed');
                        }
                    }
                },
                
                // Error handler
                modal: {
                    ondismiss: () => {
                        if (onError) {
                            onError('Payment cancelled by user');
                        }
                    }
                }
            };

            // Create and display payment modal
            const rzp = new Razorpay(options);
            
            // Handle payment errors
            rzp.on('payment.failed', (response) => {
                console.error('Payment failed:', response);
                if (onError) {
                    onError(response.error.description || 'Payment failed');
                }
            });
            
            rzp.open();
        } catch (error) {
            console.error('Error initiating payment:', error);
            if (onError) {
                onError(error.message);
            }
        }
    },

    /**
     * Create order ID on backend (optional, for better security)
     * For demo, we'll generate a client-side order ID
     */
    async createOrderId(trekData, userData) {
        try {
            // In production, this should call your backend API to create order in Razorpay
            // Backend endpoint should:
            // 1. Call Razorpay API to create order
            // 2. Store order details in database
            // 3. Return order_id to frontend
            
            // For now, generate a demo order ID
            const orderId = 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            console.log('Generated demo order ID:', orderId);
            return orderId;
        } catch (error) {
            console.error('Error creating order:', error);
            return null;
        }
    },

    /**
     * Verify payment signature (optional, for better security)
     * For demo, we'll accept the payment if payment_id exists
     */
    async verifyPayment(response, trekData, userData) {
        try {
            // In production, this should call your backend API to verify payment
            // Backend should:
            // 1. Verify Razorpay signature
            // 2. Confirm payment status
            // 3. Update database with payment details
            // 4. Return verification result
            
            // For demo, we'll just check if payment_id exists
            return !!response.razorpay_payment_id;
        } catch (error) {
            console.error('Error verifying payment:', error);
            return false;
        }
    },

    /**
     * Store payment record in database
     */
    async storePaymentRecord(paymentData) {
        try {
            // Create payments table entry
            const payment = {
                trek_id: paymentData.trek_id,
                user_id: paymentData.user_id,
                payment_id: paymentData.payment_id,
                order_id: paymentData.order_id,
                amount: paymentData.amount,
                currency: 'INR',
                status: 'completed',
                timestamp: new Date().toISOString()
            };

            // Store in Supabase (requires payments table)
            if (typeof supabase !== 'undefined' && supabase) {
                // Create payments table if not exists
                const { data, error } = await supabase
                    .from('payments')
                    .insert([payment])
                    .select()
                    .single();

                if (error) {
                    console.warn('Could not store payment in database:', error);
                    // Store locally as fallback
                    this._storePaymentLocal(payment);
                } else {
                    console.log('Payment record stored:', data);
                }
            } else {
                // Fallback: store in localStorage
                this._storePaymentLocal(payment);
            }

            return payment;
        } catch (error) {
            console.error('Error storing payment:', error);
            // Store locally as fallback
            this._storePaymentLocal(paymentData);
        }
    },

    /**
     * Store payment in localStorage (fallback)
     */
    _storePaymentLocal(payment) {
        try {
            const payments = JSON.parse(localStorage.getItem('payments') || '[]');
            payments.push(payment);
            localStorage.setItem('payments', JSON.stringify(payments));
            console.log('Payment stored locally');
        } catch (error) {
            console.error('Error storing payment locally:', error);
        }
    },

    /**
     * Get payment history
     */
    async getPaymentHistory(userId) {
        try {
            if (typeof supabase !== 'undefined' && supabase) {
                const { data, error } = await supabase
                    .from('payments')
                    .select('*')
                    .eq('user_id', userId)
                    .order('timestamp', { ascending: false });

                if (error) {
                    console.warn('Error fetching payments from database:', error);
                    return this._getPaymentHistoryLocal(userId);
                }
                return data || [];
            } else {
                return this._getPaymentHistoryLocal(userId);
            }
        } catch (error) {
            console.error('Error getting payment history:', error);
            return [];
        }
    },

    /**
     * Get payment history from localStorage
     */
    _getPaymentHistoryLocal(userId) {
        try {
            const payments = JSON.parse(localStorage.getItem('payments') || '[]');
            return payments.filter(p => p.user_id === userId);
        } catch (error) {
            return [];
        }
    }
};

console.log('Razorpay configuration loaded');
