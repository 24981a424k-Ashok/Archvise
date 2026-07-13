import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  display_mode: 'founder' | 'engineer';
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  updateDisplayMode: (mode: 'founder' | 'engineer') => void;
  setCredits: (credits: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    loading: true,
    display_mode: 'founder',
    setUser: (user) =>
      set((state) => {
        state.user = user;
        if (user) {
          state.display_mode = user.display_mode;
        }
      }),
    setLoading: (loading) =>
      set((state) => {
        state.loading = loading;
      }),
    updateDisplayMode: (mode) =>
      set((state) => {
        state.display_mode = mode;
        if (state.user) {
          state.user.display_mode = mode;
        }
      }),
    setCredits: (credits) =>
      set((state) => {
        if (state.user) {
          state.user.credits_remaining = credits;
        }
      }),
    logout: () =>
      set((state) => {
        state.user = null;
        state.loading = false;
      }),
  }))
);
