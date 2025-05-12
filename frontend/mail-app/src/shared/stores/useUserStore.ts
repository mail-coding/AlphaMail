import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  setUser: (user: User | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      login: (user, token) => {
        set({ 
          user, 
          isAuthenticated: true,
          accessToken: token 
        });
        localStorage.setItem('accessToken', token);
      },
      logout: () => {
        set({ 
          user: null, 
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
      name: 'user-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken
      })
    }
  )
); 