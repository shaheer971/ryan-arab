import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  setUser: async (user) => {
    if (!user) {
      set({ user: null, isAdmin: false });
      return;
    }

    // Check if user has admin role
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!error && profile?.role === 'admin') {
      set({ user, isAdmin: true });
    } else {
      set({ user, isAdmin: false });
    }
  },
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAdmin: false });
  },
}));
