"use client"

import React, { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { User } from '@/types'

const logger = {
  error: (...args: any[]) => {
    console.error(...args)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, logout: clearStore } = useAuthStore()

  useEffect(() => {
    const syncBackend = async (accessToken: string) => {
      try {
        localStorage.setItem('archvise_token', accessToken)
        const dbUser = await api.get<User>('/auth/me')
        setUser(dbUser)
      } catch (e) {
        logger.error('Failed to sync backend session:', e)
        localStorage.removeItem('archvise_token')
        clearStore()
      } finally {
        setLoading(false)
      }
    }

    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        syncBackend(session.access_token)
      } else {
        const token = localStorage.getItem('archvise_token')
        if (token === 'guest_token_session_2026') {
          api.get<User>('/auth/me')
            .then(dbUser => {
              setUser(dbUser)
              setLoading(false)
            })
            .catch(() => {
              clearStore()
              setLoading(false)
            })
        } else {
          clearStore()
          setLoading(false)
        }
      }
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.access_token) {
        setLoading(true)
        await syncBackend(session.access_token)
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('archvise_token')
        clearStore()
        setLoading(false)
      } else if (event === 'TOKEN_REFRESHED' && session?.access_token) {
        localStorage.setItem('archvise_token', session.access_token)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, setLoading, clearStore])

  return <>{children}</>
}
