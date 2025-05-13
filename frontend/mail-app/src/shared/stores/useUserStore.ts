import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  setAuth: (token: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useUserStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      accessToken: null,
      setAuth: (token) => {
        set({ 
          isAuthenticated: true,
          accessToken: token 
        });
        localStorage.setItem('accessToken', token);
      },
      logout: () => {
        set({ 
          isAuthenticated: false,
          accessToken: null 
        });
        localStorage.removeItem('accessToken');
      },
      checkAuth: () => {
        const token = localStorage.getItem('accessToken');
        return !!token && get().isAuthenticated;
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken
      })
    }
  )
); 