// Supabase Configuration
const SUPABASE_URL = 'https://remgafeltdylcbpkpfcd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbWdhZmVsdGR5bGNicGtwZmNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMDEyNTMsImV4cCI6MjA3OTU3NzI1M30.TQ0-yWrxSIutkGrnYLES3NcIzAqkzBEeXrxjHnCDFz4';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('Supabase client initialized successfully');
