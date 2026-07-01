import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { User } from '@/types';
import { toast } from 'sonner';

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const { user, setUser, logout: clearStore } = useAuthStore();

  // Sync user state on reload
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Verify with backend to ensure session cookie is present and get DB user details
          const dbUser = await api.get<User>('/auth/me');
          setUser(dbUser);
        } catch (e) {
          logger.error("Failed to sync backend session:", e);
          // If backend session failed, clear client login
          await signOut(auth);
          clearStore();
        }
      } else {
        clearStore();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, clearStore]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken(true);
      
      // Verify token with backend and set secure cookie
      const dbUser = await api.post<User>('/auth/verify-token', { id_token: idToken });
      setUser(dbUser);
      toast.success("Welcome back to Archvise!");
      return dbUser;
    } catch (e: any) {
      toast.error(e.message || "Failed to sign in. Please verify credentials.");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Set display name in Firebase
      await updateProfile(userCredential.user, { displayName: name });
      
      const idToken = await userCredential.user.getIdToken(true);
      
      // Verify token with backend, sets cookie and creates database user
      const dbUser = await api.post<User>('/auth/verify-token', { id_token: idToken });
      setUser(dbUser);
      toast.success("Welcome to Archvise! Your account has been created.");
      return dbUser;
    } catch (e: any) {
      toast.error(e.message || "Failed to sign up.");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const guestLogin = async () => {
    setLoading(true);
    try {
      const dbUser = await api.post<User>('/auth/guest', {});
      setUser(dbUser);
      toast.success("Welcome! Entered as Guest.");
      return dbUser;
    } catch (e: any) {
      toast.error(e.message || "Failed to enter as guest.");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      await api.post('/auth/logout', {});
      clearStore();
      toast.info("Logged out successfully");
    } catch (e: any) {
      toast.error("Logout failed. Please try again.");
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
    logout: handleLogout
  };
}

// Minimal logger to prevent unresolved references
const logger = {
  error: (...args: any[]) => {
    console.error(...args);
  }
};
