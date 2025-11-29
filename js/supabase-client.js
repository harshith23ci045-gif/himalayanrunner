import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const supabase = createClient(
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL,
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
