import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  db: {
    schema: 'public'
  }
})

// Monitor auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event)
  if (event === 'SIGNED_IN') {
    console.log('User signed in successfully')
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out')
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Auth token refreshed')
  }
})