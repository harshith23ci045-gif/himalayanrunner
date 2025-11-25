# Himalayan Runners - Static Website

## 📁 Folder Structure

```
himalayan-runners-static/
├── index.html              # Landing page
├── register.html           # Registration form
├── login.html              # Login page
├── dashboard-trekker.html  # Trekker dashboard
├── dashboard-guide.html    # Guide dashboard
├── dashboard-admin.html    # Admin dashboard
├── css/
│   └── styles.css          # All styles
├── js/
│   ├── db.js               # localStorage database
│   └── auth.js             # Authentication utilities
└── images/
    └── hero-image.png      # Trekking group image
```

## 🚀 How to Use

### Opening the Website

Simply **double-click `index.html`** or open it in any web browser. No server required!

### Test Credentials

**Admin Account:**
- Email: `admin@himalayan.com`
- Password: `admin1234`

**Trek Guide Account:**
- Email: `guide@himalayan.com`
- Password: `guide123`

**Or create a new account** by clicking "Register"

## ✨ Features

### Landing Page
- Hero section with trekking group image
- Feature highlights (24×7 Support, Experienced Team, Comfortable Tents)
- WhatsApp contact button (removed from UI)
- Login/Register CTA

### Registration
- Full name, email, phone, Aadhaar collection
- Role selection (Trekker / Trek Guide)
- Aadhaar encryption before storage
- Only last 4 digits stored separately for masking

### Role-Based Dashboards

**Trekker Dashboard:**
- View personal stats (trek count, masked phone, masked Aadhaar)
- Browse available treks
- Register for treks
- View trek history
- Automatic discount calculation (1 trek = 10%, 3+ treks = 15%)

**Trek Guide Dashboard:**
- Create new trek events
- View participants in your treks only
- Mark participants as completed
- Export participant list as CSV
- Updates trekker's trek count automatically

**Admin Dashboard:**
- View total users, treks, and registrations
- System status overview
- Clear all data option

## 🔐 Security Features

- Aadhaar encryption using Base64 (demo-level)
- Password hashing
- Session-based authentication
- Role-based access control
- Masked display of sensitive data

## 💾 Data Storage

All data is stored in the browser's **localStorage**:
- Persists across browser sessions
- **Local to each browser/device**
- Lost if browser data is cleared
- Suitable for demos and prototypes

## 📱 Mobile-First Design

- Responsive layout optimized for mobile devices
- Sticky bottom navigation
- Touch-friendly buttons
- Glassmorphism design elements
- Mountain-themed color palette (sky blue + white)

## 🌐 Deployment Options

This static website can be deployed to:
- **GitHub Pages** (free)
- **Netlify** (free)
- **Vercel** (free)
- Any web hosting service
- Or run locally by opening `index.html`

## ⚠️ Limitations

> **Note:** This is a client-side only implementation using localStorage. For production use, you would need:
> - A proper backend server
> - Real database (PostgreSQL, MongoDB, etc.)
> - Secure authentication (JWT, OAuth)
> - Server-side encryption
> - API endpoints

This static version is perfect for:
- Demos and presentations
- Prototyping
- Testing UI/UX
- Learning purposes

## 📍 Location

The static website is located at:
```
C:\Users\Harshith\.gemini\antigravity\scratch\himalayan-runners-static\
```
"# himalayanrunner" 
