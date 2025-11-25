# Password Reset Setup Guide

## Problem: Not Receiving Reset Emails

If you're not receiving password reset emails, it's likely due to one of these issues:

1. **User doesn't exist in Supabase Auth** (most common)
2. **Allowed Redirect URLs not configured** in Supabase
3. **Site URL not set** in Supabase
4. **SMTP not enabled** in Supabase
5. **User role is "Admin"** (reset only works for Trekker and Trek Guide)

---

## Solution Steps

### Step 1: Create Test Users in Supabase Auth

Your app stores users in TWO places:
- **App Database** (`users` table) - stores user details, Aadhaar, etc.
- **Supabase Auth** - handles authentication & password resets

**Password reset emails only work if the user exists in Supabase Auth.**

#### Create a Test User:

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add user"** or **"Invite"**
3. Enter:
   - **Email**: `trekker@himalayan.com` (use a real email you can access)
   - **Password**: `TestPass123!`
   - **Confirm Password**: `TestPass123!`
4. Click **"Create user"**

Repeat for a second test user:
- **Email**: `guide@himalayan.com`
- **Password**: `GuidePass123!`

---

### Step 2: Ensure Supabase Auth is Properly Configured

#### 2.1 Set Site URL:

1. Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. Under **Site URL**, set: `http://localhost:53297` (or your actual app URL)
3. Click **Save**

#### 2.2 Add Allowed Redirect URLs:

In the same **URL Configuration** page, under **Allowed Redirect URLs**, add:

```
http://localhost:53297
http://localhost:53297/reset-password.html
http://localhost:53297/forgot-password.html
```

Click **Save**.

---

### Step 3: Enable Email Delivery

Supabase needs SMTP configured to send emails.

#### Option A: Use Supabase Default SMTP (Recommended for Testing)

**No configuration needed.** Supabase includes a default SMTP provider that should work automatically.

**Issue**: Default SMTP is slow. Emails may take 5-10 minutes or go to spam.

#### Option B: Enable Custom SMTP (Recommended for Production)

1. Go to **Supabase Dashboard** → **Project Settings** → **Auth** → **SMTP Settings**
2. Toggle **"Enable custom SMTP"** to ON
3. Fill in your SMTP credentials:
   - **Sender Name**: Himalayan Runners
   - **Sender Email**: `harshithshankar.23ci045@amceducation.in`
   - **SMTP Host**: Your provider's SMTP host (e.g., smtp.gmail.com, smtp.sendgrid.net)
   - **SMTP Port**: 587 (or 465 for SSL)
   - **SMTP User**: Your SMTP username
   - **SMTP Password**: Your SMTP app password (NOT your regular password)
   - **Enable SSL**: Check this box if using port 465
4. Click **Save**

**Common SMTP Providers:**
- **Gmail**: smtp.gmail.com (use App Password, not regular password)
- **SendGrid**: smtp.sendgrid.net
- **Mailgun**: smtp.mailgun.org
- **AWS SES**: email-smtp.[region].amazonaws.com

---

### Step 4: Configure Email Template (Optional)

1. Go to **Supabase Dashboard** → **Authentication** → **Email Templates**
2. Click **"Reset Password"** template
3. Customize the HTML template:

```html
<h2>Reset Your Password</h2>
<p>Hi there,</p>
<p>Click the link below to reset your password for Himalayan Runners:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>If you didn't request this, you can ignore this email.</p>
<p>The link expires in 1 hour.</p>
```

4. Click **Save**

---

### Step 5: Test the Password Reset Flow

#### Test with a User Created in Supabase Auth:

1. Open your app: `http://localhost:53297/login.html`
2. Click **"Forgot password?"**
3. Enter the email of a user created in Supabase Auth:
   - `trekker@himalayan.com` or `guide@himalayan.com`
4. Click **"Send Reset Link"**
5. **Check your email inbox** for the reset email from Supabase
   - **Check spam folder** if not in inbox (can take 5-10 minutes)
   - **Subject line**: "Reset Password" from Supabase

6. Click the link in the email
7. Enter your new password
8. Click **"Reset Password"**
9. Go back to login and use your new password

---

## Troubleshooting

### ❌ "No email received"

**Solution 1: Check if user exists in Supabase Auth**
- Go to **Supabase Dashboard** → **Authentication** → **Users**
- Verify the email you used exists in the list
- If not, create it (see Step 1 above)

**Solution 2: Check spam/junk folder**
- Reset emails may go to spam
- Mark as "Not spam" to improve delivery

**Solution 3: Check Supabase logs**
- Go to **Supabase Dashboard** → **Logs** → **Auth**
- Look for any error messages about email delivery
- Screenshot the error and share it

**Solution 4: Verify SMTP settings**
- Go to **Project Settings** → **Auth** → **SMTP Settings**
- Confirm all fields are filled correctly
- Test by sending another reset email

**Solution 5: Wait longer**
- Default Supabase SMTP is slow (5-10 minutes)
- If using custom SMTP, it should arrive in < 1 minute

---

### ❌ "Reset link in email doesn't work"

**Solution 1: Verify Allowed Redirect URLs**
- Go to **Authentication** → **URL Configuration**
- Ensure `http://localhost:53297` is in the **Allowed Redirect URLs** list
- Ensure **Site URL** is set to `http://localhost:53297`
- Click **Save** and try again

**Solution 2: URL doesn't match**
- If your app is running on a different port (e.g., `http://localhost:5000`), update the redirect URLs to match
- Supabase must know about every URL you use

---

### ❌ "Error: 'Email not found in Auth'"

**Reason**: The email doesn't exist in Supabase Auth yet.

**Solution**: Create the user in Supabase Auth (see Step 1 above)

---

### ❌ "Invalid or expired token"

**Reason**: The reset token expired (tokens last 1 hour by default).

**Solution**: Request a fresh password reset link

---

### ❌ Email shows "Sender email not verified"

**Reason**: Your SMTP sender email hasn't been verified.

**Solution**:
1. Go to **Project Settings** → **Auth** → **SMTP Settings**
2. Update **Sender Email** to a verified email from your SMTP provider
3. Or verify the current email with your provider
4. Click **Save**

---

## App Role Restrictions

**Important**: Password reset currently only works for these user roles:
- ✅ `Trekker`
- ✅ `Trek Guide`
- ❌ `Admin` (not allowed)

**If you want to allow Admins to reset passwords**, update this line in `js/auth.js`:

**Current (line 130):**
```javascript
if (user.role !== 'Trekker' && user.role !== 'Trek Guide') {
```

**Change to:**
```javascript
if (user.role !== 'Trekker' && user.role !== 'Trek Guide' && user.role !== 'Admin') {
```

Or remove the restriction entirely:
```javascript
// Remove the role check completely
```

---

## How Password Reset Works

1. User enters email/phone on `forgot-password.html`
2. App checks if user exists in app database
3. **App calls Supabase Auth API**: `supabase.auth.resetPasswordForEmail(email)`
4. Supabase generates a secure token and sends an email with a reset link
5. User clicks the link → redirected to Supabase reset form (or your app)
6. User enters new password
7. Password is updated in Supabase Auth and app database

---

## Quick Checklist

- [ ] User exists in **Supabase Auth** (not just app database)
- [ ] **Site URL** set to your app URL in Supabase
- [ ] **Allowed Redirect URLs** include your app URL
- [ ] **SMTP enabled** (use default or custom)
- [ ] User role is `Trekker` or `Trek Guide` (not `Admin`)
- [ ] Email provider configured (if using custom SMTP)
- [ ] Checked spam folder for reset email
- [ ] Waited 5-10 minutes (default SMTP is slow)

---

## Need More Help?

1. **Check Supabase logs**: Go to **Logs** → **Auth** and screenshot any errors
2. **Share the error message** you see in the app or email
3. **Verify SMTP credentials** are correct (ask your email provider if unsure)
4. **Test with a Gmail account** (usually most reliable for testing)

---

## Example: Using Gmail SMTP

1. Create a Gmail account or use your existing one
2. Enable **2-Factor Authentication** (if not already enabled)
3. Go to **Google Account** → **Security** → **App passwords**
4. Generate an App Password for "Mail" and "Windows"
5. Copy the 16-character password
6. In Supabase **SMTP Settings**:
   - **SMTP Host**: `smtp.gmail.com`
   - **SMTP Port**: `587`
   - **SMTP User**: `your-email@gmail.com`
   - **SMTP Password**: `xxxx xxxx xxxx xxxx` (16-char app password)
   - **Sender Email**: `your-email@gmail.com`
   - **Enable SSL**: Unchecked (TLS port 587)
7. Click **Save** and test

---

**Last Updated**: November 25, 2025

For more info: See `SUPABASE_INTEGRATION.md` in the project folder.
