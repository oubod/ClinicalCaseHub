import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Log for debugging Netlify deployment
console.log('[Supabase Init] URL:', supabaseUrl);
console.log('[Supabase Init] Anon Key Loaded:', !!supabaseAnonKey); // Just check if it's loaded, not the key itself for security in shared logs

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables! URL:', supabaseUrl, 'Key Loaded:', !!supabaseAnonKey);
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey) 