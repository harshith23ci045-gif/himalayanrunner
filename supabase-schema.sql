-- Himalayan Runners Database Schema for Supabase

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Admin', 'Trek Guide', 'Trekker')),
    password TEXT NOT NULL,
    aadhaar_encrypted TEXT NOT NULL,
    aadhaar_last4 TEXT NOT NULL,
    trek_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create treks table
CREATE TABLE IF NOT EXISTS treks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location TEXT NOT NULL,
    date DATE NOT NULL,
    guide_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) DEFAULT 9000.00,
    description TEXT,
    difficulty TEXT DEFAULT 'moderate',
    max_participants INTEGER DEFAULT 20,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trek_id UUID REFERENCES treks(id) ON DELETE CASCADE,
    trekker_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'completed', 'cancelled')),
    discount_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(trek_id, trekker_id)
);

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_treks_guide_id ON treks(guide_id);
CREATE INDEX IF NOT EXISTS idx_treks_status ON treks(status);
CREATE INDEX IF NOT EXISTS idx_registrations_trek_id ON registrations(trek_id);
CREATE INDEX IF NOT EXISTS idx_registrations_trekker_id ON registrations(trekker_id);
CREATE INDEX IF NOT EXISTS idx_payments_trek_id ON payments(trek_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_id ON payments(payment_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE treks ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read all users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can insert themselves" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update themselves" ON users
    FOR UPDATE USING (true);

-- Create policies for treks table
CREATE POLICY "Anyone can read treks" ON treks
    FOR SELECT USING (true);

CREATE POLICY "Guides and admins can create treks" ON treks
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Guides can update their own treks" ON treks
    FOR UPDATE USING (true);

-- Create policies for registrations table
CREATE POLICY "Anyone can read registrations" ON registrations
    FOR SELECT USING (true);

CREATE POLICY "Trekkers can register for treks" ON registrations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Guides can update registrations" ON registrations
    FOR UPDATE USING (true);

-- Create policies for payments table
CREATE POLICY "Anyone can read payments" ON payments
    FOR SELECT USING (true);

CREATE POLICY "Users can create payments" ON payments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their payments" ON payments
    FOR UPDATE USING (true);

-- Grant permissions
GRANT ALL ON users TO anon, authenticated;
GRANT ALL ON treks TO anon, authenticated;
GRANT ALL ON registrations TO anon, authenticated;
