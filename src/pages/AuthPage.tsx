import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import SignInForm from '../components/Auth/SignInForm';
import { useAuthStore } from '../store/authStore';

const AuthPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const { user } = useAuthStore();

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {type === 'signin' && <SignInForm />}
        {type === 'signup' && <SignInForm />} {/* TODO: Create SignUpForm component */}
        {!type && <SignInForm />}
      </div>
    </div>
  );
};

export default AuthPage;