import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { User } from '@/types';
import { toast } from 'sonner';

// Minimal logger to prevent unresolved references
const logger = {
  error: (...args: any[]) => {
    console.error(...args);
  }
};

export function useAuth() {
  const { user, loading, setUser, setLoading, logout: clearStore } = useAuthStore();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);

      const accessToken = data.session!.access_token;
      localStorage.setItem('archvise_token', accessToken);

      // Verify token with backend and create/load DB user
      const dbUser = await api.post<User>('/auth/verify-token', { access_token: accessToken });
      setUser(dbUser);
      toast.success('Welcome back to Archvise!');
      return dbUser;
    } catch (e: any) {
      localStorage.removeItem('archvise_token');
      toast.error(e.message || 'Failed to sign in. Please verify credentials.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });
      if (error) throw new Error(error.message);

      const accessToken = data.session?.access_token;
      if (!accessToken) {
        // Email confirmation required — inform user
        toast.success('Account created! Please check your email to confirm your account.');
        setLoading(false);
        return null;
      }

      localStorage.setItem('archvise_token', accessToken);

      // Verify token with backend — creates DB user
      const dbUser = await api.post<User>('/auth/verify-token', { access_token: accessToken });
      setUser(dbUser);
      toast.success('Welcome to Archvise! Your account has been created.');
      return dbUser;
    } catch (e: any) {
      localStorage.removeItem('archvise_token');
      toast.error(e.message || 'Failed to sign up.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const guestLogin = async () => {
    setLoading(true);
    try {
      localStorage.setItem('archvise_token', 'guest_token_session_2026');
      const dbUser = await api.post<User>('/auth/guest', {});
      setUser(dbUser);
      toast.success('Welcome! Entered as Guest.');
      return dbUser;
    } catch (e: any) {
      localStorage.removeItem('archvise_token');
      toast.error(e.message || 'Failed to enter as guest.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      await api.post('/auth/logout', {});
    } catch (e: any) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('archvise_token');
      clearStore();
      toast.info('Logged out successfully');
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      if (error) throw new Error(error.message);
    } catch (e: any) {
      toast.error(e.message || 'Failed to initialize Google login.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    login,
    signUp,
    guestLogin,
    loginWithGoogle,
    logout: handleLogout
  };
}
