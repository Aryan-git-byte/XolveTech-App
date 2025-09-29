// src/components/Auth/AuthFlow.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, ArrowRight, User, Phone, Calendar, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

// Validation schemas
const emailSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
});

const passwordSchema = yup.object({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain an uppercase letter')
    .matches(/[a-z]/, 'Password must contain a lowercase letter')
    .matches(/[0-9]/, 'Password must contain a number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

const otpSchema = yup.object({
  otp: yup
    .string()
    .length(6, 'OTP must be 6 digits')
    .matches(/^\d+$/, 'OTP must contain only numbers')
    .required('OTP is required'),
});

const profileSchema = yup.object({
  fullName: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  dateOfBirth: yup
    .date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  phoneNumber: yup
    .string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .required('Phone number is required'),
  grade: yup.string().required('Please select your grade'),
  interests: yup
    .array()
    .min(1, 'Please select at least one interest')
    .required('Please select your interests'),
});

const signInSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

type AuthStep = 'landing' | 'signin' | 'email' | 'password' | 'otp' | 'profile' | 'complete';

const AuthFlow = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('landing');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [isGoogleFlow, setIsGoogleFlow] = useState(false);
  
  const { signIn, signUp, signInWithGoogle } = useAuthStore();

  // Landing Page Component
  const LandingStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center mb-6">
            <span className="text-white font-bold text-3xl">X</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to XolveTech</h1>
          <p className="text-gray-600">Your journey in STEM learning starts here</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setCurrentStep('signin')}
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-4 px-4 text-lg font-medium text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          >
            Sign In
          </button>

          <button
            onClick={() => setCurrentStep('email')}
            className="w-full rounded-lg border-2 border-blue-600 py-4 px-4 text-lg font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          >
            Create Account
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center rounded-lg border border-gray-300 bg-white py-4 px-4 text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <svg className="h-6 w-6 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Sign In Component
  const SignInStep = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: yupResolver(signInSchema),
    });

    const onSubmit = async (data: any) => {
      setLoading(true);
      try {
        await signIn(data.email, data.password);
        toast.success('Welcome back!');
      } catch (error: any) {
        toast.error(error.message || 'Failed to sign in');
      } finally {
        setLoading(false);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCurrentStep('landing')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 ml-4">Sign In</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 py-3 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-12 py-3 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 px-4 text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </motion.div>
    );
  };

  // Email Step Component
  const EmailStep = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: yupResolver(emailSchema),
    });

    const onSubmit = async (data: any) => {
      setUserEmail(data.email);
      setCurrentStep('password');
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCurrentStep('landing')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
              <p className="text-sm text-gray-600">Step 1 of 4</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">What's your email?</h3>
            <p className="text-gray-600">We'll send you a verification code to confirm your email address.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 py-3 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 px-4 text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>
        </div>
      </motion.div>
    );
  };

  // Password Step Component
  const PasswordStep = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm({
      resolver: yupResolver(passwordSchema),
    });

    const password = watch('password', '');

    const getPasswordStrength = (pwd: string) => {
      let strength = 0;
      if (pwd.length >= 8) strength++;
      if (/[A-Z]/.test(pwd)) strength++;
      if (/[a-z]/.test(pwd)) strength++;
      if (/[0-9]/.test(pwd)) strength++;
      if (/[^A-Za-z0-9]/.test(pwd)) strength++;
      return strength;
    };

    const strengthColors = ['bg-red-500', 'bg-red-400', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

    const onSubmit = async (data: any) => {
      setLoading(true);
      setUserPassword(data.password);
      
      // For demo purposes, we'll skip actual email OTP and go directly to profile
      // In production, you would send OTP here
      
      try {
        // Simulate OTP sending
        toast.success('For demo: skipping OTP verification');
        setTimeout(() => {
          setLoading(false);
          setCurrentStep('profile'); // Skip OTP for demo
        }, 1000);
      } catch (error) {
        setLoading(false);
        toast.error('Failed to send verification code');
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCurrentStep('email')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">Create Password</h2>
              <p className="text-sm text-gray-600">Step 2 of 4</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">Create a strong password for your account.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-12 py-3 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${strengthColors[getPasswordStrength(password) - 1] || 'bg-gray-200'}`}
                        style={{ width: `${(getPasswordStrength(password) / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">
                      {strengthLabels[getPasswordStrength(password) - 1] || ''}
                    </span>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-12 py-3 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 px-4 text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {loading ? 'Sending OTP...' : 'Continue'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>
        </div>
      </motion.div>
    );
  };

  // OTP Step Component
  const OTPStep = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: yupResolver(otpSchema),
    });

    const [timeLeft, setTimeLeft] = useState(60);
    
    React.useEffect(() => {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      }
    }, [timeLeft]);

    const onSubmit = async (data: any) => {
      setLoading(true);
      // Simulate OTP verification and then create account
      try {
        setTimeout(async () => {
          // For demo, we'll skip actual email verification
          // and just create the account
          setCurrentStep('profile');
          setLoading(false);
        }, 2000);
      } catch (error) {
        setLoading(false);
        toast.error('Invalid OTP. Please try again.');
      }
    };

    const resendOTP = () => {
      setTimeLeft(60);
      toast.success('OTP sent again!');
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCurrentStep('password')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">Verify Email</h2>
              <p className="text-sm text-gray-600">Step 3 of 4</p>
            </div>
          </div>

          <div className="mb-6 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-gray-600">
              We've sent a 6-digit verification code to
            </p>
            <p className="font-medium text-gray-900">{userEmail}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                {...register('otp')}
                type="text"
                maxLength={6}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-center text-2xl font-mono tracking-widest transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="000000"
              />
              {errors.otp && (
                <p className="mt-2 text-sm text-red-600">{errors.otp.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 px-4 text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            <div className="text-center">
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend code in {timeLeft} seconds
                </p>
              ) : (
                <button
                  type="button"
                  onClick={resendOTP}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Resend verification code
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    );
  };

  // Profile Step Component
  const ProfileStep = () => {
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
      resolver: yupResolver(profileSchema),
    });

    const watchedInterests = watch('interests', []);

    const interests = [
      'Electronics', 'Robotics', 'Programming', 'Physics', 'Chemistry',
      'Biology', 'Mathematics', 'Engineering', 'AI/ML', '3D Printing'
    ];

    const grades = [
      '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade',
      '11th Grade', '12th Grade', 'Undergraduate', 'Graduate', 'Other'
    ];

    const toggleInterest = (interest: string) => {
      const currentInterests = watchedInterests || [];
      const newInterests = currentInterests.includes(interest)
        ? currentInterests.filter((i: string) => i !== interest)
        : [...currentInterests, interest];
      setValue('interests', newInterests);
    };

    const onSubmit = async (data: any) => {
      setLoading(true);
      try {
        if (isGoogleFlow) {
          // For Google users, we don't need to create account again, just update profile
          // You can save additional profile data to your database here
          toast.success('Profile completed successfully!');
          setCurrentStep('complete');
        } else {
          // Create the account with collected information for email signups
          await signUp(userEmail, userPassword, data.fullName);
          setCurrentStep('complete');
          toast.success('Account created successfully!');
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to save profile');
      } finally {
        setLoading(false);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-lg mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCurrentStep(isGoogleFlow ? 'landing' : 'otp')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">Complete Profile</h2>
              <p className="text-sm text-gray-600">Step 4 of 4</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('fullName')}
                  type="text"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 py-3 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('dateOfBirth')}
                  type="date"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 py-3 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              {errors.dateOfBirth && (
                <p className="mt-2 text-sm text-red-600">{errors.dateOfBirth.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('phoneNumber')}
                  type="tel"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 py-3 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-2 text-sm text-red-600">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade/Level
              </label>
              <select
                {...register('grade')}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select your grade</option>
                {grades.map((grade) => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
              {errors.grade && (
                <p className="mt-2 text-sm text-red-600">{errors.grade.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Interests (Select at least one)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`p-3 text-sm font-medium rounded-lg border transition-all ${
                      (watchedInterests || []).includes(interest)
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              {errors.interests && (
                <p className="mt-2 text-sm text-red-600">{errors.interests.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 px-4 text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        </div>
      </motion.div>
    );
  };

  // Complete Step Component
  const CompleteStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to XolveTech!</h2>
        
        <p className="text-gray-600 mb-8">
          Your account has been created successfully. You're now ready to start your STEM learning journey!
        </p>

        <div className="space-y-4">
          <button
            onClick={() => {
              // This will trigger a refresh of the user state
              window.location.reload();
            }}
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 px-4 text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          >
            Get Started
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">What would you like to do first?</p>
            <div className="flex justify-center space-x-4">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Browse Kits
              </button>
              <span className="text-gray-300">•</span>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Take a Course
              </button>
              <span className="text-gray-300">•</span>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Join Community
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Google Sign Up Handler
  const handleGoogleSignUp = async () => {
    setIsGoogleFlow(true);
    setLoading(true);
    try {
      await signInWithGoogle();
      // After Google OAuth completes successfully, redirect to profile completion
      // This will be handled by the auth state change listener
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
      setLoading(false);
      setIsGoogleFlow(false);
    }
  };

  // Listen for auth state changes to handle Google OAuth callback
  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user && isGoogleFlow) {
        // Check if this is a new user (first time signing up with Google)
        const isNewUser = session?.user?.created_at === session?.user?.last_sign_in_at;
        
        if (isNewUser) {
          // New Google user - redirect to profile completion
          setUserEmail(session.user.email || '');
          setCurrentStep('profile');
          setLoading(false);
          toast.success('Welcome! Please complete your profile.');
        } else {
          // Existing Google user - they're already signed in
          setLoading(false);
          toast.success('Welcome back!');
        }
        setIsGoogleFlow(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [isGoogleFlow]);

  // Step Components Map
  const stepComponents = {
    landing: LandingStep,
    signin: SignInStep,
    email: EmailStep,
    password: PasswordStep,
    otp: OTPStep,
    profile: ProfileStep,
    complete: CompleteStep,
  };

  const CurrentStepComponent = stepComponents[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4">
      {/* Progress Bar */}
      {!['landing', 'signin', 'complete'].includes(currentStep) && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: currentStep === 'email' ? '25%' : 
                           currentStep === 'password' ? '50%' : 
                           currentStep === 'otp' ? '75%' : 
                           currentStep === 'profile' ? '100%' : '0%' 
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600">
                {currentStep === 'email' ? '1/4' : 
                 currentStep === 'password' ? '2/4' : 
                 currentStep === 'otp' ? '3/4' : 
                 currentStep === 'profile' ? '4/4' : ''}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={!['landing', 'signin', 'complete'].includes(currentStep) ? 'mt-20' : ''}>
        <AnimatePresence mode="wait">
          <CurrentStepComponent />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthFlow;