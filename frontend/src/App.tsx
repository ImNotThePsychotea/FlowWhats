import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from 'sonner';
import './App.css';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WhatsAppAccounts from './pages/WhatsAppAccounts';
import FlowBuilder from './pages/FlowBuilder';
import Payments from './pages/Payments';
import Profile from './pages/Profile';

// Layout components
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/layout/PrivateRoute';

// Auth context
import { AuthProvider } from './context/AuthContext';

// Create a query client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected routes */}
                  <Route
                    element={(
                      <PrivateRoute>
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/whatsapp-accounts" element={<WhatsAppAccounts />} />
                          <Route path="/flows" element={<FlowBuilder />} />
                          <Route path="/payments" element={<Payments />} />
                          <Route path="/profile" element={<Profile />} />
                        </Routes>
                      </PrivateRoute>
                    )}
                  >
                    {/* Redirect to dashboard if accessing root */}
                    <Route index element={<Navigate to="/" replace />} />
                  </Route>

                  {/* Redirect to login for any other routes */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;