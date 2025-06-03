import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Initial session check
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (mounted) {
          setUser(session?.user ?? null)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Auth init error:', error)
        if (mounted) {
          setUser(null)
          setIsLoading(false)
        }
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        if (mounted) {
          setUser(session?.user ?? null)
          setIsLoading(false)

          // If logged out, redirect to login
          if (event === 'SIGNED_OUT') {
            window.location.href = '/login'
          }
          // If signed in, make sure we're not on login/signup pages
          else if (event === 'SIGNED_IN' && (window.location.pathname === '/login' || window.location.pathname === '/signup')) {
            window.location.href = '/'
          }
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signOut
  }
}
