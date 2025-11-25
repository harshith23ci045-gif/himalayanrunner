# Razorpay Payment Integration Guide

## 🎯 Overview

This guide explains how to integrate Razorpay payment gateway for trek registrations in the Himalayan Runners app. Trekkers will be able to pay for trek registrations using:
- **Credit/Debit Cards** 💳
- **UPI** (Google Pay, PhonePe, Paytm, WhatsApp Pay) 📱
- **Wallets** (Amazon Pay, Freecharge, etc.)
- **NetBanking** 🏦
- **EMI Options** 🔄

---

## 📋 Prerequisites

1. **Razorpay Account** - Sign up at https://razorpay.com
2. **Razorpay API Keys** - Get from your Razorpay Dashboard
3. **Backend Server** (Optional but recommended for production)

---

## ✅ Step 1: Create a Razorpay Account

1. Go to https://razorpay.com
2. Click **"Sign Up"**
3. Enter your email and create account
4. Verify your email
5. Complete KYC verification (Razorpay will guide you)

---

## 🔑 Step 2: Get Your API Keys

### For Testing (Sandbox Mode):

1. Log in to **Razorpay Dashboard**
2. Go to **Settings** → **API Keys**
3. You'll see **Test Keys**:
   - **Key ID** (public key) - used in frontend
   - **Key Secret** (private key) - used in backend only
4. Copy the **Key ID** and update `js/razorpay-config.js`:

```javascript
const RAZORPAY_CONFIG = {
    KEY_ID: 'rzp_test_xxxxxxxxxxxx', // Replace with your test Key ID
};
```

### For Production (Live Mode):

1. Complete KYC verification in Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. Switch to **Live Mode** (radio button at top)
4. Copy the **Live Key ID**
5. Update your production code with the **Live Key ID**

⚠️ **NEVER** expose your **Key Secret** in frontend code!

---

## 📊 Step 3: Test the Payment Flow

### Test the Integration Locally:

1. Start your app: `http://localhost:53297`
2. Go to **Dashboard-Trekker** (login with a trekker account)
3. Click **"Register & Pay"** on a trek
4. Razorpay payment modal will appear

### Test with Sample Credentials:

**Razorpay provides test payment details:**

#### Test Credit Card:
- Card Number: `4111111111111111`
- Expiry: Any future date (e.g., `12/25`)
- CVV: Any 3 digits (e.g., `123`)
- OTP: `123456`

#### Test UPI:
- UPI ID: `success@razorpay`
- OTP: `123456`

#### Test NetBanking:
- Select any bank → use test credentials provided

---

## 🏗️ Step 4: Update Database Schema

The integration includes a new **payments** table in your database to track all transactions.

### Run the Updated SQL Schema:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. **DELETE the old schema** (optional, or create a new project):
   ```sql
   DROP TABLE IF EXISTS payments CASCADE;
   DROP TABLE IF EXISTS registrations CASCADE;
   DROP TABLE IF EXISTS treks CASCADE;
   DROP TABLE IF EXISTS users CASCADE;
   ```
3. **Copy the entire updated `supabase-schema.sql`** from your project
4. **Paste into SQL Editor** and click **Run**

### New Tables/Columns Added:

**treks table** - Added columns:
- `amount` (DECIMAL) - Trek price (default: 9000)
- `description` (TEXT) - Trek description
- `difficulty` (TEXT) - Trek difficulty level
- `max_participants` (INTEGER) - Maximum trekkers allowed

**payments table** - New table:
- `id` - Unique payment ID
- `trek_id` - Associated trek
- `user_id` - Trekker who paid
- `payment_id` - Razorpay payment ID
- `order_id` - Razorpay order ID
- `amount` - Amount paid
- `currency` - Currency (INR)
- `status` - Payment status
- `payment_method` - Method used (card, upi, wallet, etc.)
- `timestamp` - Payment time

---

## 💾 Step 5: Payment Storage Options

### Option A: Client-Side Only (Demo Mode)

Payments are stored in browser's localStorage. Suitable for:
- Local testing
- Demos and prototypes
- Development

**No backend changes needed!** Payments work immediately after copying `razorpay-config.js`.

### Option B: Supabase Database (Recommended)

Payments are stored in Supabase cloud database. Suitable for:
- Production apps
- Shared data across devices
- Analytics and reporting

**Just run the updated SQL schema** and the app will auto-detect the payments table.

### Option C: Custom Backend (Best Practice)

Payments verified and stored on your backend server. Suitable for:
- Production apps
- High security
- Payment verification
- Compliance

---

## 🔒 Step 6: Backend Integration (Optional but Recommended)

For production, implement a backend endpoint to:
1. Create Razorpay orders
2. Verify payment signatures
3. Store payments securely
4. Handle webhooks

### Backend Pseudocode (Node.js + Express Example):

```javascript
const Razorpay = require('razorpay');
const crypto = require('crypto');

const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order endpoint
app.post('/api/create-order', async (req, res) => {
    const { amount, trekId, userId } = req.body;
    
    try {
        const order = await rzp.orders.create({
            amount: amount * 100, // Convert to paise
            currency: 'INR',
            receipt: `trek_${trekId}_user_${userId}`
        });
        
        res.json({ orderId: order.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verify payment endpoint
app.post('/api/verify-payment', (req, res) => {
    const { orderId, paymentId, signature } = req.body;
    
    try {
        const body = orderId + '|' + paymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');
        
        if (signature === expectedSignature) {
            // Payment verified - store in database
            res.json({ verified: true });
        } else {
            res.status(400).json({ verified: false });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

---

## 🎨 Step 7: Customize Payment Experience

### Customize Razorpay Modal:

Edit `js/razorpay-config.js` to customize:

```javascript
const options = {
    key: RAZORPAY_CONFIG.KEY_ID,
    amount: trekData.amount * 100,
    currency: 'INR',
    
    // Customize appearance
    theme: {
        color: '#004e92' // Your brand color
    },
    
    // Prefill user details
    prefill: {
        name: userData.full_name,
        email: userData.email,
        contact: userData.phone
    },
    
    // Add custom notes
    notes: {
        trek_id: trekData.id,
        trek_location: trekData.location
    }
};
```

---

## 📱 Payment Methods Available

### UPI Payments (Most Popular in India):

Users can pay via:
- **Google Pay** 🔵
- **PhonePe** 📱
- **Paytm** 🟡
- **WhatsApp Pay** 💬
- **BHIM**
- **Amazon Pay**

### Card Payments:

- Visa, Mastercard, Amex
- Credit & Debit cards
- International cards (for export)

### Bank Transfers:

- NetBanking for all major Indian banks
- Account transfer (NEFT/RTGS)

### Wallets:

- Amazon Pay
- Freecharge
- Airtel Payments Bank

### Subscriptions & EMI:

- EMI options (3, 6, 9, 12 months)
- Recurring payments

---

## ✔️ Testing Checklist

- [ ] Razorpay account created and KYC verified
- [ ] API Key ID copied to `js/razorpay-config.js`
- [ ] Updated SQL schema run in Supabase
- [ ] Razorpay CDN loaded in `dashboard-trekker.html` ✓
- [ ] Test payment modal appears on "Register & Pay" click
- [ ] Test payment with card: `4111111111111111`
- [ ] Test payment with UPI: `success@razorpay`
- [ ] Payment recorded in database/localStorage
- [ ] User redirected to trek history after payment
- [ ] Payment history shows correct amount and status

---

## 🐛 Troubleshooting

### ❌ "Razorpay is not defined"

**Reason:** Razorpay script not loaded
**Solution:** Ensure `<script src="https://checkout.razorpay.com/v1/checkout.js"></script>` is in your HTML

### ❌ "Invalid API Key"

**Reason:** Wrong API key used
**Solution:** Verify Key ID is copied correctly from Razorpay Dashboard

### ❌ Payment modal doesn't appear

**Reason:** JavaScript error or missing script
**Solution:** 
1. Check browser console (F12) for errors
2. Verify Razorpay script is loaded
3. Check that `razorpay-config.js` is loaded

### ❌ "Allowed payment methods not available"

**Reason:** Your Razorpay account settings restrict payment methods
**Solution:** 
1. Go to **Razorpay Dashboard** → **Settings**
2. Check **Accepted Payment Methods**
3. Enable UPI, Cards, Wallets as needed

### ❌ Payment successful but registration not created

**Reason:** Backend registration error or database issue
**Solution:**
1. Check browser console for errors
2. Verify Supabase connection
3. Check database logs in Supabase Dashboard

---

## 💰 Fees & Pricing

Razorpay charges these rates (as of 2024):

- **Domestic Cards**: 1.5% + ₹0 or 2% + ₹0
- **International Cards**: 2.5% + ₹0 or 3% + ₹0
- **UPI**: 0% + ₹0 (flat rate may apply)
- **NetBanking**: 0% + ₹0 (platform may apply)
- **Wallets**: Varies by provider

**Settlement:** Razorpay settles funds to your bank account within 1-2 business days

---

## 📞 Going Live (Production)

### Before Going Live:

1. ✅ Complete KYC verification
2. ✅ Switch from Test Keys to **Live Keys**
3. ✅ Update `js/razorpay-config.js` with **Live Key ID**
4. ✅ Implement backend verification (recommended)
5. ✅ Set up webhook handlers for async events
6. ✅ Test end-to-end payment flow
7. ✅ Ensure HTTPS enabled on your domain
8. ✅ Set up support contact for refund requests

### Environment Variables (Recommended):

Instead of hardcoding keys, use environment variables:

```javascript
// Development
const KEY_ID = process.env.NODE_ENV === 'production' 
    ? process.env.RAZORPAY_LIVE_KEY 
    : 'rzp_test_xxxxxxxxxxxx';
```

---

## 🔗 Useful Links

- **Razorpay Documentation**: https://razorpay.com/docs/
- **API Reference**: https://razorpay.com/docs/api/
- **Dashboard**: https://dashboard.razorpay.com
- **Support**: https://razorpay.com/support

---

## 📝 Summary

| Step | Action |
|------|--------|
| 1 | Create Razorpay account |
| 2 | Get API Key ID from Dashboard |
| 3 | Update `razorpay-config.js` with Key ID |
| 4 | Run updated SQL schema in Supabase |
| 5 | Test with sample credentials |
| 6 | Deploy to production (switch to Live Keys) |

---

**Last Updated:** November 25, 2025

For support: Contact Razorpay at https://razorpay.com/support
