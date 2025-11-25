# Supabase Integration Guide

## Setup Instructions

### 1. Run the SQL Schema in Supabase

1. Go to your Supabase dashboard: https://remgafeltdylcbpkpfcd.supabase.co
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL script to create all tables and policies

### 2. Files Updated

The following files have been updated to use Supabase:

- `js/supabase-client.js` - Supabase client configuration
- `js/db.js` - Database layer (now uses Supabase instead of localStorage)
- `js/auth.js` - Authentication layer (updated for async operations)
- `index.html` - Added Supabase CDN
- `login.html` - Updated with async login
- `register.html` - Updated with async registration
- Dashboard files (need to be updated)

### 3. Database Schema

**Tables:**
- `users` - User accounts (Admin, Trek Guide, Trekker)
- `treks` - Trek events created by guides
- `registrations` - Trekker registrations for treks

**Column Naming:**
- Supabase uses snake_case (e.g., `full_name`, `trek_count`)
- JavaScript uses camelCase (e.g., `fullName`, `trekCount`)

### 4. Key Changes

1. All database operations are now async (use `await`)
2. Data persists in Supabase cloud database (not localStorage)
3. Data is shared across all devices
4. Row Level Security (RLS) is enabled for security

### 5. Test Credentials

After running the schema, the seed data will create:

**Admin:**
- Email: admin@himalayan.com
- Password: admin1234

**Guide:**
- Email: guide@himalayan.com
- Password: guide123

### 6. Next Steps

1. Run the SQL schema in Supabase
2. Test the login and registration
3. Update dashboard files to use async operations

## Password Reset Configuration (Forgot Password Feature)

The app includes a password reset feature (\orgot-password.html\ and \
eset-password.html\) that sends password reset emails to users. Follow these steps to enable email delivery:

### Prerequisites

- Supabase project with Auth enabled
- SMTP configured (optional but recommended for production)
- Users created in **Supabase Auth**, not just in the \users\ table

### Step 1: Add Localhost to Allowed Redirect URLs

Password reset emails contain a link that redirects users back to your app. You must whitelist your app's URL in Supabase:

1. Go to your **Supabase Dashboard**  **Authentication**  **URL Configuration**
2. Under **Allowed Redirect URLs**, add:
   \\\
   http://localhost:8000
   http://localhost:8000/reset-password.html
   \\\
3. If you deploy to production (e.g., Vercel, Netlify), also add:
   \\\
   https://yourdomain.com
   https://yourdomain.com/reset-password.html
   \\\
4. Click **Save**

### Step 2: Ensure Users are in Supabase Auth

Password reset emails are sent via **Supabase Auth**, so users must exist in the Auth system. There are two approaches:

#### Option A: Migrate Existing Users to Supabase Auth

If you have existing users in the \users\ table created via the seed script, migrate them to Supabase Auth:

1. In the **Supabase Dashboard**, go to **Authentication**  **Users**
2. Manually create test accounts:
   - Email: \guide@himalayan.com\, Password: \guide123\
   - Email: \dmin@himalayan.com\, Password: \dmin123\
   - Or invite users and have them set their own passwords

#### Option B: Register Users via Supabase Auth Signup (Recommended)

Update the registration flow to create users in both Supabase Auth and the \users\ table. See js/auth.js register function for implementation details.

### Step 3: Configure Email Delivery

#### Option A: Use Supabase's Default SMTP (Recommended for Testing)

Supabase includes a default SMTP provider. Password reset emails will be sent automatically. No additional configuration needed.

#### Option B: Configure Custom SMTP (Production)

For more control and higher email volume:

1. Go to **Supabase Dashboard**  **Project Settings**  **Auth**  **SMTP Settings**
2. Enter your SMTP credentials:
   - **Sender Name**: Himalayan Runners
   - **Sender Email**: harshithshankar.23ci045@amceducation.in
   - **SMTP Host**: your-smtp-provider.com
   - **SMTP Port**: 587 (or 465)
   - **SMTP User**: your-smtp-user
   - **SMTP Password**: your-smtp-password
3. Click **Save**

Your SMTP is now configured with sender email: `harshithshankar.23ci045@amceducation.in`

Popular SMTP providers:
- **SendGrid**: https://sendgrid.com (free tier: 100 emails/day)
- **Mailgun**: https://mailgun.com (free tier: 1000 emails/month)
- **AWS SES**: https://aws.amazon.com/ses/
- **Gmail**: smtp.gmail.com (use app password, not your regular password)

### Step 4: Customize the Reset Email Template (Optional)

To customize the email body and styling:

1. Go to **Supabase Dashboard**  **Authentication**  **Email Templates**
2. Click on **Reset Password** template
3. Update the HTML template. Use \{{ .ConfirmationURL }}\ as the placeholder for the reset link:
   \\\html
   <h2>Reset Password</h2>
   <p>Follow this link to reset the password for your user:</p>
   <p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
   \\\
4. Click **Save**

### Testing Password Reset Locally

1. Start your app at \http://localhost:8000\
2. Go to \login.html\ and click **Forgot password?**
3. Enter an email for a user that exists in **Supabase Auth**
4. Click **Send Reset Link**
5. Check the email inbox for the reset email from Supabase
6. If using the default SMTP, emails may be delayed or go to spam � check spam folder
7. Click the reset link in the email to return to your app's reset password page
8. Enter a new password and confirm

### Troubleshooting

**Problem:** "Password reset email sent" but no email received
- **Solution 1:** Check spam/junk folder
- **Solution 2:** Ensure the user email is registered in **Supabase Auth** (not just the \users\ table)
- **Solution 3:** Check Supabase project logs: **Logs**  **Auth** to see if email send failed
- **Solution 4:** If using custom SMTP, verify SMTP credentials are correct

**Problem:** Reset link in email doesn't work
- **Solution 1:** Ensure \http://localhost:8000\ is in the **Allowed Redirect URLs** list
- **Solution 2:** If deployed, ensure production URL is in the **Allowed Redirect URLs** list

**Problem:** "Invalid or expired token" after clicking reset link
- **Solution:** Token expires after 1 hour by default in Supabase. Ask user to request a fresh reset link

### SMS Password Reset (Advanced)

Currently, password reset emails are supported. To add SMS delivery as an alternative:

1. Use a third-party SMS provider (Twilio, MessageBird, AWS SNS)
2. Create a serverless function or backend endpoint to send SMS with the reset link
3. Call that endpoint from the forgot-password flow
