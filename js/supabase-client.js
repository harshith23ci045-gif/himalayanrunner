// js/supabase-client.js
// Clean, correct supabase client setup

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

export const SUPABASE_URL = "https://isnbbmzcgpslxtnxmcdh.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzbmJibXpjZ3BzbHh0bnhtY2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MzI1MTksImV4cCI6MjA4MDAwODUxOX0.6GTURhIphelEUpOEnXFEFkUicNxJgrmHg4HHnvTUyOA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
