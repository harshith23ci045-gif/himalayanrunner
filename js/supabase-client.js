import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://isnbbmzcgpslxtnxmcdh.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzbmJibXpjZ3BzbHh0bnhtY2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MzI1MTksImV4cCI6MjA4MDAwODUxOX0.6GTURhIphelEUpOEnXFEFkUicNxJgrmHg4HHnvTUyOA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
