# Razorpay Payment Integration - Migration Guide

## For Existing Setups (Already Have Database)

If you already have the app running with the old schema, follow these steps to add Razorpay payment support.

---

## 🔄 Step 1: Update Your Treks Table

Run these SQL commands in your Supabase SQL Editor to add the new columns:

```sql
-- Add amount column to treks
ALTER TABLE treks ADD COLUMN IF NOT EXISTS amount DECIMAL(10, 2) DEFAULT 9000.00;

-- Add description column
ALTER TABLE treks ADD COLUMN IF NOT EXISTS description TEXT;

-- Add difficulty column
ALTER TABLE treks ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'moderate';

-- Add max_participants column
ALTER TABLE treks ADD COLUMN IF NOT EXISTS max_participants INTEGER DEFAULT 20;

-- Set default amount for existing treks
UPDATE treks SET amount = 9000.00 WHERE amount IS NULL;
```

---

## 🔄 Step 2: Create Payments Table

Run this command to create the payments table:

```sql
-- Create payments table for Razorpay integration
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trek_id UUID REFERENCES treks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    payment_id TEXT NOT NULL UNIQUE,
    order_id TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    payment_method TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_trek_id ON payments(trek_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_id ON payments(payment_id);
```

---

## 🔄 Step 3: Enable Row Level Security (RLS)

```sql
-- Enable RLS on payments table
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read payments" ON payments
    FOR SELECT USING (true);

CREATE POLICY "Users can create payments" ON payments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their payments" ON payments
    FOR UPDATE USING (true);

-- Grant permissions
GRANT ALL ON payments TO anon, authenticated;
```

---

## 📝 Step 4: Update Your Code

### 4.1 Add Razorpay Script to dashboard-trekker.html:

Find this section:
```html
<script src="js/auth.js"></script>
```

Add these lines **after** it:
```html
<script src="js/razorpay-config.js"></script>
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### 4.2 Copy New Files to Your Project:

Copy these new files from the updated project:
- `js/razorpay-config.js` - Razorpay configuration
- `RAZORPAY_INTEGRATION.md` - Full documentation
- `RAZORPAY_QUICKSTART.md` - Quick start guide

### 4.3 Update Dashboard Code:

Replace the `registerTrek` function in `dashboard-trekker.html` with the new payment-enabled version from the updated `dashboard-trekker.html`.

---

## ✅ Verification Checklist

After completing the migration:

- [ ] All SQL commands ran without errors
- [ ] Razorpay scripts added to HTML
- [ ] New files copied to project
- [ ] Test login works ✓
- [ ] Trek amount displays: ₹9000 ✓
- [ ] "Register & Pay" button appears ✓
- [ ] Click button → Razorpay modal opens ✓
- [ ] Test payment with `success@razorpay` ✓
- [ ] Payment recorded in database ✓
- [ ] User registered for trek after payment ✓

---

## 🧪 Test the Integration

1. Start your app: `http://localhost:53297`
2. Login as a Trekker
3. Go to **Available Treks** section
4. Click **"Register & Pay"**
5. Razorpay modal opens
6. Select **UPI**
7. Enter: `success@razorpay`
8. Click **Pay**
9. Success! ✅

---

## 🆘 If Something Goes Wrong

### Error: "Column does not exist"

**Reason:** The column wasn't added to the table
**Solution:** Run the ALTER TABLE commands again

### Error: "Relation 'payments' does not exist"

**Reason:** The payments table wasn't created
**Solution:** Run the CREATE TABLE command for payments

### Error: "Razorpay is not defined"

**Reason:** razorpay-config.js or checkout.js not loaded
**Solution:** 
1. Verify scripts are added to HTML
2. Refresh the page (hard refresh: Ctrl+F5)
3. Check browser console for errors

### Payment modal doesn't open

**Reason:** JavaScript error or missing script
**Solution:**
1. Open browser DevTools (F12)
2. Check Console for errors
3. Verify razorpay-config.js is loaded

---

## 💾 Backup Before Migration

Before running SQL commands, **backup your database**:

1. Go to Supabase Dashboard
2. Click **Project Settings**
3. Click **Backups**
4. Click **Create backup**
5. Wait for backup to complete

---

## 🔄 Rollback (If Needed)

If something goes wrong, rollback the changes:

```sql
-- Remove new columns from treks
ALTER TABLE treks DROP COLUMN IF EXISTS amount;
ALTER TABLE treks DROP COLUMN IF EXISTS description;
ALTER TABLE treks DROP COLUMN IF EXISTS difficulty;
ALTER TABLE treks DROP COLUMN IF EXISTS max_participants;

-- Drop payments table
DROP TABLE IF EXISTS payments CASCADE;
```

---

## 📞 Need Help?

- Check `RAZORPAY_INTEGRATION.md` for detailed documentation
- Check `RAZORPAY_QUICKSTART.md` for quick setup
- Contact Razorpay support: https://razorpay.com/support

---

**Congratulations! Razorpay payments are now integrated into your app.** 🎉
