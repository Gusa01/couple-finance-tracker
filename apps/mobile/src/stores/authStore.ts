import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { validateSession } from '@/lib/api';
import { User } from '@cft/shared';
import { Messages } from '@/constants/messages';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,

  initializeAuth: async () => {
    try {
      set({ isLoading: true, error: null });

      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // Validate session with backend
        const userData = await validateSession();
        if (userData) {
          set({
            user: {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              avatarUrl: userData.avatarUrl,
              createdAt: new Date().toISOString(),
            },
            isLoading: false
          });
          return;
        }
        // Session invalid, sign out
        await supabase.auth.signOut();
      }

      set({ user: null, isLoading: false });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ user: null, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(Messages.errors.invalidCredentials);
      }

      if (data.session) {
        const userData = await validateSession();
        if (userData) {
          set({
            user: {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              avatarUrl: userData.avatarUrl,
              createdAt: new Date().toISOString(),
            },
            isLoading: false
          });
          return;
        }
      }

      throw new Error(Messages.errors.generic);
    } catch (error) {
      const message = error instanceof Error ? error.message : Messages.errors.generic;
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          throw new Error(Messages.errors.emailInUse);
        }
        throw new Error(Messages.errors.generic);
      }

      if (data.session) {
        const userData = await validateSession();
        if (userData) {
          set({
            user: {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              avatarUrl: userData.avatarUrl,
              createdAt: new Date().toISOString(),
            },
            isLoading: false
          });
          return;
        }
      }

      // If no session, user needs to confirm email
      set({ isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : Messages.errors.generic;
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await supabase.auth.signOut();
      set({ user: null, isLoading: false, error: null });
    } catch (error) {
      console.error('Logout error:', error);
      set({ user: null, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
