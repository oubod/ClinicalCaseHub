import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '../shared/schema'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authInitialized, setAuthInitialized] = useState(false)

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

    const initializeAuth = async () => {
      try {
        setIsLoading(true)
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user && mounted) {
          console.log('Session found, fetching user data...')
          const userData = await fetchUserData(session.user.id)
          if (userData && mounted) {
            console.log('User data fetched successfully')
            setUser(userData)
          } else {
            console.log('No user data found, clearing session')
            setUser(null)
            await supabase.auth.signOut()
          }
        } else if (mounted) {
          console.log('No session found')
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
          setAuthInitialized(true)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        if (!mounted) return

        setIsLoading(true)

        try {
          if (session?.user) {
            console.log('Session exists, fetching user data...')
            const userData = await fetchUserData(session.user.id)
            if (userData && mounted) {
              console.log('User data updated')
              setUser(userData)
            } else {
              console.log('No user data found')
              setUser(null)
            }
          } else {
            console.log('No session exists')
            setUser(null)
          }
        } catch (error) {
          console.error('Error in auth state change:', error)
          setUser(null)
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
      await supabase.auth.signOut()
      setUser(null)
      window.location.href = '/login'
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user && authInitialized,
    signOut
  }
}
