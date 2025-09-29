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
            // Fetch user profile
            const { data: profile } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            set({ user: session.user, profile, initialized: true });
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
            const { data: profile } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single();
            
            set({ user: data.user, profile });
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
            // Create user profile
            const { data: profile, error: profileError } = await supabase
              .from('users')
              .insert({
                id: data.user.id,
                email: data.user.email!,
                full_name: fullName,
                points: 0,
                level: 1,
                badges: [],
              })
              .select()
              .single();
            
            if (profileError) throw profileError;
            
            set({ user: data.user, profile });
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
              redirectTo: `${window.location.origin}/auth/callback`,
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
        const { user } = get();
        if (!user) return;
        
        set({ loading: true });
        try {
          const { data, error } = await supabase
            .from('users')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', user.id)
            .select()
            .single();
          
          if (error) throw error;
          
          set({ profile: data });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, profile: state.profile }),
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