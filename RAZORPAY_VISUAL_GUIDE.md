# 🚀 Razorpay Payment Integration - Visual Guide

## What You'll See

### BEFORE (Old Dashboard-Trekker)
```
┌─────────────────────────────────────┐
│      Available Treks                │
├─────────────────────────────────────┤
│ ┌────────────────────────────────┐  │
│ │ Everest Base Camp              │  │
│ │ May 1, 2025                    │  │
│ │                                │  │
│ │ [Register]                     │  │
│ └────────────────────────────────┘  │
│                                     │
│ ┌────────────────────────────────┐  │
│ │ Kilimanjaro                    │  │
│ │ June 15, 2025                  │  │
│ │                                │  │
│ │ [Register]                     │  │
│ └────────────────────────────────┘  │
└─────────────────────────────────────┘
```

### AFTER (New Dashboard-Trekker with Payments)
```
┌─────────────────────────────────────┐
│      Available Treks                │
├─────────────────────────────────────┤
│ ┌────────────────────────────────┐  │
│ │ Everest Base Camp              │  │
│ │ May 1, 2025                    │  │
│ │ ₹9000.00 ⭐ NEW                │  │
│ │                                │  │
│ │ [Register & Pay] ⭐ NEW        │  │
│ └────────────────────────────────┘  │
│                                     │
│ ┌────────────────────────────────┐  │
│ │ Kilimanjaro                    │  │
│ │ June 15, 2025                  │  │
│ │ ₹9000.00 ⭐ NEW                │  │
│ │                                │  │
│ │ [Register & Pay] ⭐ NEW        │  │
│ └────────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## Payment Flow Diagram

```
START
  │
  ├─→ Trekker clicks "Register & Pay"
  │
  ├─→ Razorpay Modal Opens
  │   ┌──────────────────────────────┐
  │   │ Himalayan Runners - Payment  │
  │   │ ─────────────────────────────│
  │   │ Trek: Everest Base Camp      │
  │   │ Amount: ₹9,000.00            │
  │   │                              │
  │   │ Name: [Your Name] (prefilled)│
  │   │ Email: [Your Email] (fill)   │
  │   │ Phone: [Your Phone] (fill)   │
  │   │                              │
  │   │ Payment Method:              │
  │   │ ◉ UPI (Google Pay, PhonePe)  │
  │   │ ○ Credit/Debit Card          │
  │   │ ○ Wallet (Amazon Pay)        │
  │   │ ○ NetBanking                 │
  │   │ ○ EMI                        │
  │   │                              │
  │   │ [Pay ₹9,000]                 │
  │   └──────────────────────────────┘
  │
  ├─→ User Selects Payment Method
  │   └─→ UPI / Card / Wallet / Bank
  │
  ├─→ User Enters Payment Details
  │   └─→ UPI ID / Card / Bank details
  │
  ├─→ OTP Verification
  │   └─→ Enter OTP (123456 for testing)
  │
  ├─→ Payment Processing...
  │
  ├──┬─→ ✅ SUCCESS
  │  │
  │  ├─→ Payment Saved
  │  │   └─→ Database Updated
  │  │       └─→ payments table
  │  │
  │  ├─→ Trek Registration Created
  │  │   └─→ registrations table
  │  │
  │  ├─→ Success Message
  │  │   └─→ "✅ Payment successful!"
  │  │
  │  └─→ Dashboard Refreshed
  │      └─→ Trek shows "Registered"
  │
  └──┬─→ ❌ FAILED
     │
     ├─→ Error Message Shown
     │   └─→ "❌ Payment failed: [reason]"
     │
     └─→ User Can Retry
         └─→ No charges applied
```

---

## Database Changes

### Before
```
treks table:
├── id
├── location
├── date
├── guide_id
└── status

payments table: ❌ DOESN'T EXIST
```

### After
```
treks table:
├── id
├── location
├── date
├── guide_id
├── amount ⭐ NEW
├── description ⭐ NEW
├── difficulty ⭐ NEW
├── max_participants ⭐ NEW
└── status

payments table: ⭐ NEW
├── id
├── trek_id
├── user_id
├── payment_id (Razorpay)
├── order_id (Razorpay)
├── amount
├── currency
├── status
├── payment_method
├── timestamp
└── created_at
```

---

## Setup Timeline

### Total Time: ~10 Minutes

```
Minutes 0-2: Create Razorpay Account
  └─→ Go to razorpay.com
  └─→ Click Sign Up
  └─→ Enter email
  └─→ Verify email

Minutes 2-3: Get API Key
  └─→ Dashboard → Settings → API Keys
  └─→ Copy: Test Key ID (rzp_test_xxx)

Minutes 3-4: Update Configuration
  └─→ Open: js/razorpay-config.js
  └─→ Replace: KEY_ID value
  └─→ Save file

Minutes 4-6: Update Database Schema
  └─→ Supabase Dashboard → SQL Editor
  └─→ Copy: supabase-schema.sql
  └─→ Paste: In editor
  └─→ Click: Run
  └─→ Wait: Complete ✅

Minutes 6-10: Test Payment
  └─→ Open: http://localhost:53297
  └─→ Login: Trekker account
  └─→ Click: "Register & Pay"
  └─→ Use: success@razorpay (UPI)
  └─→ Enter: OTP 123456
  └─→ Success: ✅ Trek registered!
```

---

## File Changes Summary

### Created (New Files)
```
js/razorpay-config.js
├── PaymentGateway.initiatePayment()
├── PaymentGateway.storePaymentRecord()
├── PaymentGateway.getPaymentHistory()
└── Payment verification & storage

RAZORPAY_QUICKSTART.md          (Quick setup)
RAZORPAY_INTEGRATION.md         (Complete guide)
RAZORPAY_MIGRATION.md           (Database migration)
RAZORPAY_SUMMARY.md             (Summary)
RAZORPAY_IMPLEMENTATION_CHECKLIST.md (Checklist)
PROJECT_STRUCTURE.md            (Project guide)
RAZORPAY_START_HERE.md          (This getting started)
```

### Updated (Modified Files)
```
dashboard-trekker.html
├── Added Razorpay scripts
├── Show amount: ₹9000
├── Updated button: "Register & Pay"
└── Payment handler integration

supabase-schema.sql
├── Added amount column
├── Added description column
├── Added difficulty column
├── Added max_participants column
├── Created payments table
└── Added RLS policies

js/db.js
└── Updated sample trek seeding
    └── Now includes amount: 9000
```

---

## Test Payment Scenarios

### Scenario 1: Successful UPI Payment ✅
```
1. Click: "Register & Pay"
2. Select: UPI
3. Enter: success@razorpay
4. OTP: 123456
5. Result: ✅ PAID → Trek Registered
6. Check: Database updated
```

### Scenario 2: Successful Card Payment ✅
```
1. Click: "Register & Pay"
2. Select: Credit Card
3. Card #: 4111111111111111
4. Expiry: 12/25
5. CVV: 123
6. OTP: 123456
7. Result: ✅ PAID → Trek Registered
```

### Scenario 3: Payment Failure ❌
```
1. Click: "Register & Pay"
2. Select: UPI
3. Enter: fail@razorpay
4. Result: ❌ FAILED
5. Error shown: "Payment failed"
6. Check: No charges, trek not registered
7. User can retry
```

---

## Payment Methods Breakdown

```
┌─ UPI (Most Popular in India)
│  ├─ Google Pay 🔵
│  ├─ PhonePe 📱
│  ├─ Paytm 🟡
│  ├─ WhatsApp Pay 💬
│  ├─ BHIM 🏛️
│  └─ Amazon Pay 🟠
│
├─ Cards
│  ├─ Visa 💳
│  ├─ Mastercard 💳
│  └─ Amex 💳
│
├─ NetBanking
│  ├─ HDFC 🏦
│  ├─ ICICI 🏦
│  ├─ Axis 🏦
│  ├─ SBI 🏦
│  └─ + 20 more banks
│
├─ Wallets
│  ├─ Amazon Pay
│  └─ Freecharge
│
└─ EMI Options
   ├─ 3 months
   ├─ 6 months
   ├─ 9 months
   └─ 12 months
```

---

## Cost Structure

### Development (FREE!)
```
Test Keys:  🆓 Free (unlimited)
Test Mode:  🆓 Free (no charges)
Features:   ✅ All available
Testing:    ✅ Unlimited
```

### Production (Per Transaction)
```
Domestic Cards:     1.5% - 2%
International:      2.5% - 3%
UPI:                0% - 2%
NetBanking:         0% - 2%
Wallets:            Varies
EMI:                Varies
```

**Settlement:** 1-2 business days

---

## What Trekker Sees

### Step 1: Available Treks
```
┌──────────────────────────┐
│   Available Treks        │
├──────────────────────────┤
│ ☆ Everest Base Camp      │
│   May 1, 2025            │
│   ₹9,000.00              │ ⭐ New
│   [Register & Pay]       │ ⭐ New
│                          │
│ ☆ Kilimanjaro           │
│   June 15, 2025         │
│   ₹9,000.00             │ ⭐ New
│   [Register & Pay]      │ ⭐ New
└──────────────────────────┘
```

### Step 2: Payment Modal
```
┌─────────────────────────────────┐
│ Himalayan Runners - Payment     │
├─────────────────────────────────┤
│ Trek: Everest Base Camp         │
│ Amount: ₹9,000.00               │
│                                 │
│ Your Details:                   │
│ Name: Harshith Shankar          │
│ Email: harshith@example.com     │
│ Phone: +91 98765 43210          │
│                                 │
│ Select Payment Method:          │
│ ◉ UPI - Google Pay, PhonePe     │
│ ○ Card                          │
│ ○ Wallet                        │
│ ○ NetBanking                    │
│                                 │
│ [Proceed]                       │
│ [Cancel]                        │
└─────────────────────────────────┘
```

### Step 3: Success
```
┌──────────────────────────┐
│   ✅ SUCCESS             │
├──────────────────────────┤
│ Payment received:        │
│ ₹9,000.00               │
│                         │
│ You are now registered  │
│ for Everest Base Camp   │
│ on May 1, 2025          │
│                         │
│ Reference ID:           │
│ pay_12345xyz            │
│                         │
│ [Close]                 │
└──────────────────────────┘

Dashboard Updates:
├─ Trek shows: "Registered" ✅
├─ Trek Count increases
├─ Payment recorded
└─ Loyalty discount updated
```

---

## Documentation Guide

```
START HERE 👇

RAZORPAY_START_HERE.md
    │
    ├─→ Quick? (5 min) → RAZORPAY_QUICKSTART.md
    │                     └─→ Get account
    │                     └─→ Get API key
    │                     └─→ Update config
    │                     └─→ Test payment
    │
    ├─→ Need details? (20 min) → RAZORPAY_INTEGRATION.md
    │                             └─→ Setup steps
    │                             └─→ Database schema
    │                             └─→ Backend integration
    │                             └─→ Production deploy
    │
    ├─→ Have existing DB? (10 min) → RAZORPAY_MIGRATION.md
    │                                 └─→ SQL commands
    │                                 └─→ Code updates
    │                                 └─→ Rollback steps
    │
    ├─→ Want summary? (10 min) → RAZORPAY_SUMMARY.md
    │                            └─→ What was done
    │                            └─→ Files changed
    │                            └─→ Features delivered
    │
    └─→ Debugging? → Check troubleshooting in each guide
```

---

## Troubleshooting Flowchart

```
Problem?
  │
  ├─→ Modal doesn't open
  │   └─→ Refresh page (Ctrl+F5)
  │   └─→ Check console (F12)
  │   └─→ Verify Razorpay script loaded
  │
  ├─→ "Invalid API Key"
  │   └─→ Check razorpay-config.js
  │   └─→ Copy Key ID again from dashboard
  │   └─→ Verify it starts with: rzp_test_
  │
  ├─→ Payment fails
  │   └─→ Use test credentials
  │   └─→ UPI: success@razorpay
  │   └─→ Card: 4111111111111111
  │   └─→ Check OTP is: 123456
  │
  ├─→ Amount not showing
  │   └─→ Verify SQL schema was run
  │   └─→ Check Supabase tables
  │   └─→ Verify treks have amount column
  │
  ├─→ Trek not registered after payment
  │   └─→ Check database logs
  │   └─→ Verify registrations table
  │   └─→ Check payment was recorded
  │
  └─→ Still stuck?
      └─→ Check RAZORPAY_INTEGRATION.md
      └─→ Read troubleshooting section
      └─→ Contact Razorpay support
```

---

## Quick Reference Card

```
┌─────────────────────────────────────┐
│ RAZORPAY INTEGRATION - QUICK REF    │
├─────────────────────────────────────┤
│                                     │
│ Website: razorpay.com              │
│ Dashboard: dashboard.razorpay.com   │
│ Docs: razorpay.com/docs            │
│                                     │
│ Test Key Format:                    │
│ rzp_test_xxxxxxxxxxxx              │
│                                     │
│ Live Key Format:                    │
│ rzp_live_xxxxxxxxxxxx              │
│                                     │
│ Config File:                        │
│ js/razorpay-config.js              │
│                                     │
│ Test Payment:                       │
│ UPI: success@razorpay              │
│ OTP: 123456                        │
│                                     │
│ Supported Methods:                  │
│ ✅ UPI / Cards / Wallet / Bank     │
│ ✅ NetBanking / EMI / NEFT-RTGS    │
│                                     │
│ Amount: ₹9,000 per trek            │
│                                     │
│ Status: ✅ Production Ready        │
│                                     │
└─────────────────────────────────────┘
```

---

**Everything is ready!** 🎉

**Next Step:** Read `RAZORPAY_QUICKSTART.md` (5 minutes)
