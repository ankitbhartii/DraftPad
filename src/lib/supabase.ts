import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

// 1. Standard Client (Uses Anon Key, adheres to RLS policies)
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey || 'dummy-anon-key'
);

// 2. Admin Client (Uses Service Role Key, bypasses RLS - server-only)
// This client is used in the migration API route to ingest stories
// when the user has not logged in or we are doing a server-to-server migration.
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || 'dummy-service-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
