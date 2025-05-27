import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching for critical requests
    if (config.method === 'get' && config.params) {
      config.params._t = Date.now();
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh and error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const authStore = await import('../stores/authStore');
        const success = await authStore.useAuthStore.getState().refreshAccessToken();
        
        if (success) {
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        const authStore = await import('../stores/authStore');
        authStore.useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }

    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    // Handle other HTTP errors
    const status = error.response.status;
    const message = error.response.data?.detail || error.response.data?.message;

    switch (status) {
      case 400:
        toast.error(message || 'Bad request');
        break;
      case 403:
        toast.error('Access forbidden');
        break;
      case 404:
        toast.error('Resource not found');
        break;
      case 429:
        toast.error('Too many requests. Please try again later.');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        if (status >= 500) {
          toast.error('Server error occurred');
        }
    }

    return Promise.reject(error);
  }
);

// API service methods
export const authAPI = {
  login: (credentials) => api.post('/api/users/login/', credentials),
  register: (userData) => api.post('/api/users/register/', userData),
  refreshToken: (refreshToken) => api.post('/api/users/refresh/', { refresh: refreshToken }),
  getProfile: () => api.get('/api/users/profile/'),
  updateProfile: (data) => api.put('/api/users/profile/', data),
};

export const monitoringAPI = {
  getMetrics: (params) => api.get('/api/monitoring/metrics/', { params }),
  collectMetrics: () => api.post('/api/monitoring/collect/'),
  getPingResults: (params) => api.get('/api/monitoring/pings/', { params }),
  pingIP: (ip) => api.post('/api/monitoring/ping/', { ip }),
};

export const automationAPI = {
  getRules: (params) => api.get('/api/automation/rules/', { params }),
  createRule: (data) => api.post('/api/automation/rules/', data),
  updateRule: (id, data) => api.put(`/api/automation/rules/${id}/`, data),
  deleteRule: (id) => api.delete(`/api/automation/rules/${id}/`),
  getActionLogs: (params) => api.get('/api/automation/logs/', { params }),
};

// Cache implementation for frequently accessed data
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.timeouts = new Map();
  }

  set(key, data, ttl = 300000) { // Default 5 minutes TTL
    this.cache.set(key, data);
    
    // Clear existing timeout
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key));
    }
    
    // Set new timeout
    const timeout = setTimeout(() => {
      this.cache.delete(key);
      this.timeouts.delete(key);
    }, ttl);
    
    this.timeouts.set(key, timeout);
  }

  get(key) {
    return this.cache.get(key);
  }

  has(key) {
    return this.cache.has(key);
  }

  clear() {
    this.cache.clear();
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
  }
}

export const cache = new CacheManager();

// Cached API methods for better performance
export const cachedAPI = {
  getMetrics: async (params) => {
    const cacheKey = `metrics_${JSON.stringify(params)}`;
    
    if (cache.has(cacheKey)) {
      return { data: cache.get(cacheKey) };
    }
    
    const response = await monitoringAPI.getMetrics(params);
    cache.set(cacheKey, response.data, 60000); // 1 minute cache
    
    return response;
  },
  
  getRules: async (params) => {
    const cacheKey = `rules_${JSON.stringify(params)}`;
    
    if (cache.has(cacheKey)) {
      return { data: cache.get(cacheKey) };
    }
    
    const response = await automationAPI.getRules(params);
    cache.set(cacheKey, response.data, 300000); // 5 minute cache
    
    return response;
  },
};

export default api;