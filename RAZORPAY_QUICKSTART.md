# Razorpay Payment Gateway - Quick Start

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Free Test API Key

Razorpay provides **free test keys** for development. No credit card required!

1. Go to https://razorpay.com/docs/integration/test-key
2. Or create account at https://razorpay.com and get test keys from Dashboard

### Step 2: Update Your Configuration

Open `js/razorpay-config.js` and update the KEY_ID:

```javascript
const RAZORPAY_CONFIG = {
    KEY_ID: 'rzp_test_1AxmWbqzHbVEpR', // Sample key (replace with your own)
};
```

**Get your own free test key:**
1. Create account at https://razorpay.com
2. Dashboard → Settings → API Keys
3. Copy your **Test Key ID** (starts with `rzp_test_`)

### Step 3: Test Payment

1. Open app at `http://localhost:53297`
2. Login as Trekker
3. Click **"Register & Pay"** on any trek
4. Razorpay modal opens → use test credentials below

### Step 4: Complete Test Payment

Use these **free test credentials** (provided by Razorpay):

#### Option A: Test with UPI (Recommended)
- Payment Method: **UPI**
- UPI ID: `success@razorpay`
- OTP: `123456`
- Status: ✅ Success

#### Option B: Test with Card
- Card Number: `4111111111111111`
- Expiry: `12/25` (any future date)
- CVV: `123`
- OTP: `123456`
- Status: ✅ Success

#### Option C: Test Payment Failure
- UPI ID: `fail@razorpay`
- Status: ❌ Fails intentionally

---

## 💡 Payment Flow

```
Trekker clicks "Register & Pay"
    ↓
Razorpay modal opens
    ↓
Choose payment method (UPI/Card/Wallet/etc)
    ↓
Enter payment details
    ↓
Razorpay processes payment
    ↓
Payment successful ✅ → Trek registration created
              OR
Payment failed ❌ → Error message shown
```

---

## 📊 Available Payment Methods in Test Mode

| Method | UPI ID | Card | NetBank |
|--------|--------|------|---------|
| Success | `success@razorpay` | `4111111111111111` | Test Bank |
| Failure | `fail@razorpay` | `4111111111111112` | Test Bank |

All test payments are **completely free** and won't charge anything.

---

## 🎯 What Gets Displayed

### Trek Card Shows:
- Trek Location
- Trek Date
- **Trek Amount: ₹9000** ← New!
- "Register & Pay" Button ← New!

### Payment Modal Shows:
- Trek name and amount
- Your name, email, phone (pre-filled)
- Multiple payment options:
  - 💳 Credit/Debit Card
  - 📱 UPI (Google Pay, PhonePe, etc.)
  - 💰 Wallet (Amazon Pay, etc.)
  - 🏦 NetBanking

### After Payment:
- Confirmation message
- You're registered for the trek
- Payment recorded in database
- Can see payment history

---

## 📋 Database Updates

### New Columns in `treks` table:
- `amount` - Trek price (₹9000 by default)
- `description` - Trek description
- `difficulty` - Trek difficulty (easy/moderate/hard)
- `max_participants` - Max trekkers allowed

### New `payments` table:
- Records every payment
- Stores: Payment ID, amount, method, timestamp
- Linked to user and trek

---

## ⚙️ Next Steps

### For Development/Testing:
✅ Use test keys (you're set!)

### For Production (Going Live):
1. Complete KYC in Razorpay
2. Switch to **Live Keys**
3. Update `razorpay-config.js` with Live Key ID
4. Real payments will be processed ✓
5. Funds settle to your bank account

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Modal doesn't open | Refresh page, check browser console |
| "Invalid API Key" | Verify Key ID in razorpay-config.js |
| Payment fails | Use test credentials above |
| Can't find Key ID | Go to razorpay.com → Dashboard → Settings → API Keys |

---

## 📞 Support

- **Razorpay Docs**: https://razorpay.com/docs/
- **Test Credentials**: https://razorpay.com/docs/integration/test-key
- **Support Chat**: Available in Razorpay Dashboard

---

**That's it! Your payment gateway is ready to use.** 🎉

Test with UPI ID `success@razorpay` and see the magic happen!
