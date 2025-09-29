import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import AuthFlow from './components/Auth/AuthFlow';

function App() {
  const { user, initialize, initialized } = useAuthStore();

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

  // If user is authenticated, show a simple dashboard placeholder
  if (user) {
    return (
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
              <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center mb-6">
                <span className="text-white font-bold text-3xl">X</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to XolveTech!</h1>
              <p className="text-gray-600 mb-8">
                Authentication successful! You're now logged in.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-blue-900 mb-2">User Information</h2>
                <div className="text-left space-y-2 text-sm">
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  <p><span className="font-medium">User ID:</span> {user.id}</p>
                  <p><span className="font-medium">Email Verified:</span> {user.email_confirmed_at ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">Created:</span> {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <button
                onClick={() => useAuthStore.getState().signOut()}
                className="inline-flex items-center justify-center rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
          
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

  // If user is not authenticated, show the authentication flow
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/*" element={<AuthFlow />} />
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