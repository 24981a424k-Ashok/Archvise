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
  const [loading, setLoading] = useState(true);
  const { user, setUser, logout: clearStore } = useAuthStore();

  // Sync user state on reload via Supabase session listener
  useEffect(() => {
    const syncBackend = async (accessToken: string) => {
      try {
        localStorage.setItem('archvise_token', accessToken);
        const dbUser = await api.get<User>('/auth/me');
        setUser(dbUser);
      } catch (e) {
        logger.error('Failed to sync backend session:', e);
        localStorage.removeItem('archvise_token');
        clearStore();
      }
      setLoading(false);
    };

    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        syncBackend(session.access_token);
      } else {
        // Check if we have a guest token
        const token = localStorage.getItem('archvise_token');
        if (token === 'guest_token_session_2026') {
          api.get<User>('/auth/me')
            .then(dbUser => { setUser(dbUser); setLoading(false); })
            .catch(() => { clearStore(); setLoading(false); });
        } else {
          clearStore();
          setLoading(false);
        }
      }
    });

    // Listen for auth state changes (sign-in / sign-out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.access_token) {
        await syncBackend(session.access_token);
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('archvise_token');
        clearStore();
        setLoading(false);
      } else if (event === 'TOKEN_REFRESHED' && session?.access_token) {
        // Update stored token on refresh
        localStorage.setItem('archvise_token', session.access_token);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, clearStore]);

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
