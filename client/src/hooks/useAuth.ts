import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '../shared/schema'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserData = async (userId: string) => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('Error fetching user data:', error)
        return null
      }
      
      return userData
    } catch (error) {
      console.error('Error in fetchUserData:', error)
      return null
    }
  }

  useEffect(() => {
    let mounted = true

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user && mounted) {
          const userData = await fetchUserData(session.user.id)
          if (userData && mounted) {
            setUser(userData)
          } else {
            setUser(null)
          }
        } else if (mounted) {
          setUser(null)
        }
      } catch (error) {
        console.error('Error during auth initialization:', error)
        if (mounted) {
          setUser(null)
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        if (mounted) {
          setIsLoading(true)
        }

        try {
          if (session?.user && mounted) {
            const userData = await fetchUserData(session.user.id)
            if (userData && mounted) {
              setUser(userData)
            } else {
              setUser(null)
            }
          } else if (mounted) {
            setUser(null)
          }
        } catch (error) {
          console.error('Error in auth state change:', error)
          if (mounted) {
            setUser(null)
          }
        } finally {
          if (mounted) {
            setIsLoading(false)
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
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signOut
  }
}
