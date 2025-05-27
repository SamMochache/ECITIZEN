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
          console.error('Login error:', error.response?.data);
          const errorMessage = error.response?.data?.detail || 
                              error.response?.data?.non_field_errors?.[0] ||
                              'Login failed';
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
          const response = await api.post('/api/users/register/', userData);
          set({ isLoading: false, error: null });
          return { success: true, data: response.data };
        } catch (error) {
          console.error('Registration error:', error.response?.data);
          
          // Handle different types of errors from Django
          let errorMessage = 'Registration failed';
          
          if (error.response?.data) {
            const errorData = error.response.data;
            
            // Handle field-specific errors
            if (errorData.email) {
              errorMessage = Array.isArray(errorData.email) ? errorData.email[0] : errorData.email;
            } else if (errorData.username) {
              errorMessage = Array.isArray(errorData.username) ? errorData.username[0] : errorData.username;
            } else if (errorData.password) {
              errorMessage = Array.isArray(errorData.password) ? errorData.password[0] : errorData.password;
            } else if (errorData.password2) {
              errorMessage = Array.isArray(errorData.password2) ? errorData.password2[0] : errorData.password2;
            } else if (errorData.non_field_errors) {
              errorMessage = Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors[0] : errorData.non_field_errors;
            } else if (errorData.detail) {
              errorMessage = errorData.detail;
            } else if (typeof errorData === 'string') {
              errorMessage = errorData;
            }
          }
          
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
          console.error('Token refresh error:', error);
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
          console.error('Profile update error:', error.response?.data);
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