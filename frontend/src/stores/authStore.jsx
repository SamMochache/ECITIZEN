import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/api/users/login/', credentials);
          const { access, refresh, user } = response.data;
          
          set({
            user,
            token: access,
            refreshToken: refresh,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          // Set default authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
          
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.detail || 'Login failed';
          set({ 
            error: errorMessage, 
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
            refreshToken: null,
          });
          return { success: false, error: errorMessage };
        }
      },

      // Register action
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/api/users/register/', userData);
          set({ isLoading: false, error: null });
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.email?.[0] || 
                              error.response?.data?.password?.[0] || 
                              'Registration failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Logout action
      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
        
        // Remove authorization header
        delete api.defaults.headers.common['Authorization'];
        
        // Clear persisted state
        localStorage.removeItem('auth-storage');
      },

      // Refresh token action
      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          get().logout();
          return false;
        }

        try {
          const response = await api.post('/api/users/refresh/', {
            refresh: refreshToken,
          });
          const { access } = response.data;
          
          set({ token: access });
          api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
          
          return true;
        } catch (error) {
          get().logout();
          return false;
        }
      },

      // Update profile
      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.put('/api/users/profile/', profileData);
          set({ 
            user: response.data, 
            isLoading: false,
            error: null 
          });
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.detail || 'Profile update failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Initialize auth from storage
      initialize: () => {
        const { token } = get();
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Initialize auth store on app load
useAuthStore.getState().initialize();