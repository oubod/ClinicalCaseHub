import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '../shared/schema'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
            
          if (error) {
            console.error('Error fetching user data:', error)
            setUser(null)
          } else {
            setUser(userData)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error during auth initialization:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setIsLoading(true)
        try {
          if (session?.user) {
            const { data: userData, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single()
              
            if (error) {
              console.error('Error fetching user data:', error)
              setUser(null)
            } else {
              setUser(userData)
            }
          } else {
            setUser(null)
          }
        } catch (error) {
          console.error('Error during auth state change:', error)
          setUser(null)
        } finally {
          setIsLoading(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      setIsLoading(true)
      await supabase.auth.signOut()
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
