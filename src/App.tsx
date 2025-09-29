import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';

function App() {
  const { initialize, initialized } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center mb-4 mx-auto animate-pulse">
            <span className="text-white font-bold text-2xl">X</span>
          </div>
          <p className="text-gray-600">Loading XolveTech...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="kits" element={<div className="p-8 text-center">Kits Page - Coming Soon</div>} />
            <Route path="courses" element={<div className="p-8 text-center">Courses Page - Coming Soon</div>} />
            <Route path="community" element={<div className="p-8 text-center">Community Page - Coming Soon</div>} />
            <Route path="cart" element={<div className="p-8 text-center">Cart Page - Coming Soon</div>} />
            <Route path="profile" element={<div className="p-8 text-center">Profile Page - Coming Soon</div>} />
            <Route path="settings" element={<div className="p-8 text-center">Settings Page - Coming Soon</div>} />
          </Route>
          
          <Route path="/auth/:type" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#374151',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;