import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { User as AppUser } from '../types/database.types';

interface AuthState {
  user: User | null;
  profile: AppUser | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<AppUser>) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      loading: false,
      initialized: false,

      initialize: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            // For demo purposes, we'll create a mock profile if none exists
            const mockProfile: AppUser = {
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || 'Demo User',
              avatar_url: session.user.user_metadata?.avatar_url || null,
              bio: undefined,
              points: 0,
              level: 1,
              badges: [],
              created_at: session.user.created_at,
              updated_at: new Date().toISOString(),
            };
            
            set({ user: session.user, profile: mockProfile, initialized: true });
          } else {
            set({ user: null, profile: null, initialized: true });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ initialized: true });
        }
      },

      signIn: async (email: string, password: string) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) throw error;
          
          if (data.user) {
            // Create mock profile for demo
            const mockProfile: AppUser = {
              id: data.user.id,
              email: data.user.email || '',
              full_name: data.user.user_metadata?.full_name || 'Demo User',
              avatar_url: data.user.user_metadata?.avatar_url || null,
              bio: undefined,
              points: 0,
              level: 1,
              badges: [],
              created_at: data.user.created_at,
              updated_at: new Date().toISOString(),
            };
            
            set({ user: data.user, profile: mockProfile });
          }
        } finally {
          set({ loading: false });
        }
      },

      signUp: async (email: string, password: string, fullName: string) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
            },
          });
          
          if (error) throw error;
          
          if (data.user) {
            // Create mock profile for demo
            const mockProfile: AppUser = {
              id: data.user.id,
              email: data.user.email || '',
              full_name: fullName,
              avatar_url: undefined,
              bio: undefined,
              points: 0,
              level: 1,
              badges: [],
              created_at: data.user.created_at,
              updated_at: new Date().toISOString(),
            };
            
            set({ user: data.user, profile: mockProfile });
          }
        } finally {
          set({ loading: false });
        }
      },

      signInWithGoogle: async () => {
        set({ loading: true });
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}`,
            },
          });
          
          if (error) throw error;
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        set({ loading: true });
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          
          set({ user: null, profile: null });
        } finally {
          set({ loading: false });
        }
      },

      updateProfile: async (updates: Partial<AppUser>) => {
        const { user, profile } = get();
        if (!user || !profile) return;
        
        set({ loading: true });
        try {
          // For demo, just update local state
          const updatedProfile = {
            ...profile,
            ...updates,
            updated_at: new Date().toISOString(),
          };
          
          set({ profile: updatedProfile });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        profile: state.profile 
      }),
    }
  )
);

// Listen to auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
  const { initialize } = useAuthStore.getState();
  
  if (event === 'SIGNED_IN' && session?.user) {
    await initialize();
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, profile: null });
  }
});