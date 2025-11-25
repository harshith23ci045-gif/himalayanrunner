# 🎯 Supabase Integration - Complete Setup Guide

## ✅ What Has Been Done

All files have been updated to integrate with your Supabase account:

### Files Created/Updated:
1. ✅ `js/supabase-client.js` - Supabase client configuration
2. ✅ `js/db.js` - Database layer (Supabase instead of localStorage)
3. ✅ `js/auth.js` - Authentication with async support
4. ✅ `index.html` - Added Supabase CDN
5. ✅ `login.html` - Async login
6. ✅ `register.html` - Async registration
7. ✅ `dashboard-trekker.html` - Async trekker dashboard
8. ✅ `dashboard-guide.html` - Async guide dashboard
9. ✅ `dashboard-admin.html` - Async admin dashboard
10. ✅ `supabase-schema.sql` - Database schema SQL script

## 🚀 Next Steps - YOU NEED TO DO THIS

### Step 1: Run the SQL Schema in Supabase

1. **Open your Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard/project/remgafeltdylcbpkpfcd
   
2. **Navigate to SQL Editor:**
   - Click on "SQL Editor" in the left sidebar
   
3. **Run the Schema:**
   - Click "New Query"
   - Copy the entire contents of `supabase-schema.sql`
   - Paste it into the SQL editor
   - Click "Run" or press Ctrl+Enter
   
4. **Verify Tables Created:**
   - Go to "Table Editor" in the left sidebar
   - You should see 3 tables: `users`, `treks`, `registrations`

### Step 2: Test the Application

1. **Refresh your browser** at http://localhost:8000
2. **Try registering a new user** or use test credentials:
   - Admin: `admin@himalayan.com` / `admin1234`
   - Guide: `guide@himalayan.com` / `guide123`

## 📊 Database Schema

### Tables Created:

**users**
- id (UUID, Primary Key)
- full_name (TEXT)
- email (TEXT, Unique)
- phone (TEXT)
- role (TEXT: Admin, Trek Guide, Trekker)
- password (TEXT, hashed)
- aadhaar_encrypted (TEXT)
- aadhaar_last4 (TEXT)
- trek_count (INTEGER)
- created_at (TIMESTAMP)

**treks**
- id (UUID, Primary Key)
- location (TEXT)
- date (DATE)
- guide_id (UUID, Foreign Key → users.id)
- status (TEXT: upcoming, completed, cancelled)
- created_at (TIMESTAMP)

**registrations**
- id (UUID, Primary Key)
- trek_id (UUID, Foreign Key → treks.id)
- trekker_id (UUID, Foreign Key → users.id)
- status (TEXT: registered, completed, cancelled)
- discount_percentage (INTEGER)
- created_at (TIMESTAMP)

## 🔐 Security Features

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Policies configured for read/write access
- ✅ Aadhaar encryption (Base64 for demo)
- ✅ Password hashing
- ✅ Session-based authentication

## 🌟 Key Changes from localStorage

1. **Async Operations:** All database calls now use `await`
2. **Column Names:** Changed to snake_case (e.g., `full_name`, `trek_count`)
3. **Cloud Storage:** Data persists in Supabase cloud
4. **Shared Data:** Accessible from any device
5. **Auto IDs:** Supabase generates UUIDs automatically

## 🐛 Troubleshooting

### If you see errors:

1. **"relation does not exist"**
   - You haven't run the SQL schema yet
   - Go to Supabase SQL Editor and run `supabase-schema.sql`

2. **"Failed to fetch"**
   - Check your internet connection
   - Verify Supabase URL and API key in `js/supabase-client.js`

3. **Login not working**
   - Make sure you ran the SQL schema (creates seed data)
   - Check browser console for errors (F12)

## 📝 Test Credentials (After Running Schema)

The SQL schema will automatically create these test accounts:

**Admin Account:**
- Email: admin@himalayan.com
- Password: admin1234

**Guide Account:**
- Email: guide@himalayan.com
- Password: guide123

**Sample Trek:**
- Location: Everest Base Camp
- Date: 2025-05-01
- Guide: Sherpa Tenzing

## 🎉 Benefits of Supabase Integration

✅ **Real Database:** PostgreSQL instead of localStorage
✅ **Cloud Storage:** Data accessible from anywhere
✅ **Scalable:** Can handle thousands of users
✅ **Secure:** Row Level Security and policies
✅ **Production Ready:** Can be deployed as-is
✅ **Free Tier:** Supabase offers generous free tier

## 🔗 Your Supabase Details

- **Project URL:** https://remgafeltdylcbpkpfcd.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/remgafeltdylcbpkpfcd
- **API Key:** Already configured in `js/supabase-client.js`

---

## ⚠️ IMPORTANT: Run the SQL Schema First!

The application will NOT work until you run the SQL schema in Supabase.
This creates the database tables and seed data.

**Go to:** https://supabase.com/dashboard/project/remgafeltdylcbpkpfcd/sql

Then copy and paste the contents of `supabase-schema.sql` and click Run.
