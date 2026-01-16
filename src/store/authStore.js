import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      role: null,
      isAuthenticated: false,
      isLoading: true,
      login: (userData, userRole) => 
        set({ 
          user: userData, 
          role: userRole, 
          isAuthenticated: true,
          isLoading: false,
        }),
      logout: () => 
        set({ 
          user: null, 
          role: null, 
          isAuthenticated: false,
          isLoading: false,
        }),
      updateUser: (userData) => 
        set((state) => ({ 
          user: { ...state.user, ...userData } 
        })),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
    }
  )
);