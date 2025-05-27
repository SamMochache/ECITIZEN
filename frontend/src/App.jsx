import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';


// Lazy load components for better performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Monitoring = lazy(() => import('./pages/Monitoring'));
const Automation = lazy(() => import('./pages/Automation'));
const Profile = lazy(() => import('./pages/Profile'));

// Create a client with optimized settings for 5M users
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error?.response?.status === 401) return false;
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="App">
            {isAuthenticated && <Navbar />}
            <main className={isAuthenticated ? 'main-content' : 'auth-main'}>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Public Routes */}
                  <Route 
                    path="/login" 
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    } 
                  />
                  <Route 
                    path="/register" 
                    element={
                      <PublicRoute>
                        <Register />
                      </PublicRoute>
                    } 
                  />
                  
                  {/* Protected Routes */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/monitoring" 
                    element={
                      <ProtectedRoute>
                        <Monitoring />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/automation" 
                    element={
                      <ProtectedRoute>
                        <Automation />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Default redirect */}
                  <Route 
                    path="/" 
                    element={
                      <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
                    } 
                  />
                  
                  {/* 404 fallback */}
                  <Route 
                    path="*" 
                    element={
                      <div className="container mt-5 text-center">
                        <h1>404 - Page Not Found</h1>
                        <p>The page you're looking for doesn't exist.</p>
                      </div>
                    } 
                  />
                </Routes>
              </Suspense>
            </main>
            
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  theme: {
                    primary: 'green',
                    secondary: 'black',
                  },
                },
              }}
            />
          </div>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;