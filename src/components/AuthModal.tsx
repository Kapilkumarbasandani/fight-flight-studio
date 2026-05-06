'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (res: { credential: string }) => void }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load Google Identity Services script once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (document.getElementById('google-gsi-script')) return;
    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  const handleGoogleSignIn = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError('Google sign-in is not configured. Please contact support.');
      return;
    }
    if (!window.google?.accounts?.id) {
      setError('Google sign-in is still loading. Please try again in a moment.');
      return;
    }
    setGoogleLoading(true);
    setError('');
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async ({ credential }) => {
        try {
          const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential }),
          });
          const data = await res.json();
          if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            window.dispatchEvent(new Event('storage'));
            setSuccess('Signed in with Google!');
            const isAdminUser = data.user.role === 'admin';
            const defaultUrl = isAdminUser ? '/admin' : '/app';
            const redirectUrl = !isAdminUser ? localStorage.getItem('redirectAfterLogin') : null;
            if (redirectUrl) localStorage.removeItem('redirectAfterLogin');
            setTimeout(() => {
              onClose();
              setSuccess('');
              window.location.href = redirectUrl || defaultUrl;
            }, 1000);
          } else {
            setError(data.message || 'Google sign-in failed');
          }
        } catch {
          setError('Google sign-in failed. Please try again.');
        } finally {
          setGoogleLoading(false);
        }
      },
    });
    window.google.accounts.id.prompt();
  };
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    whatsapp: '',
    confirmPassword: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }

        // Sign up
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            whatsapp: formData.whatsapp,
            password: formData.password,
          }),
        });

        // Check if response is JSON and successful
        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Server returned an invalid response. Please check if the server is running.');
          }
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned an invalid response. Please check if the server is running.');
        }

        const data = await response.json();

        if (data.success) {
          setSuccess('Account created successfully! You can now sign in.');
          setFormData({
            email: '',
            password: '',
            name: '',
            whatsapp: '',
            confirmPassword: '',
          });
          // Auto switch to sign in after 2 seconds
          setTimeout(() => {
            setIsSignUp(false);
            setSuccess('');
          }, 2000);
        } else {
          setError(data.message || 'Failed to create account');
        }
      } else {
        // Sign in
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        // Check if response is JSON and successful
        if (!response.ok) {
          const ct = response.headers.get('content-type');
          if (!ct || !ct.includes('application/json')) {
            throw new Error('Server returned an invalid response. Please check if the server is running.');
          }
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned an invalid response. Please check if the server is running.');
        }

        const data = await response.json();

        if (data.success) {
          setSuccess('Signed in successfully!');
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify(data.user));
          // Trigger storage event for Navigation component
          window.dispatchEvent(new Event('storage'));
          
          // Admins always land on /admin regardless of any stored redirect
          const isAdminUser = data.user.role === 'admin';
          const defaultUrl = isAdminUser ? '/admin' : '/app';
          const redirectUrl = !isAdminUser ? localStorage.getItem('redirectAfterLogin') : null;
          const targetUrl = redirectUrl || defaultUrl;
          
          // Clean up stored redirect
          if (redirectUrl) {
            localStorage.removeItem('redirectAfterLogin');
          }
          
          setTimeout(() => {
            onClose();
            setSuccess('');
            // Redirect to target page
            window.location.href = targetUrl;
          }, 1500);
        } else {
          setError(data.message || 'Failed to sign in');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-start justify-center p-4 pt-8 overflow-y-auto bg-black/50 backdrop-blur-sm"
      style={{ 
        zIndex: 99999,
        /* Use dvh so the overlay fills the visible area even when iOS keyboard is open */
        minHeight: '100dvh',
      }}
      onClick={onClose}
    >
      {/* Modal */}
      <div 
        className="relative w-full max-w-md bg-black/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8)'
        }}
      >
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neonGreen via-neonPink to-neonGreen" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
          >
            <X size={24} />
          </button>

          {/* Content */}
          <div className="p-6">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="headline-font text-2xl mb-1 leading-tight">
              <span className="text-neonGreen">FIGHT</span>
              <span className="text-white">&</span>
              <span className="text-neonPink">FLIGHT</span>
            </h2>
            <p className="text-white/60 text-sm">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-3 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-3 p-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-sm">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-neonGreen/50 focus:ring-2 focus:ring-neonGreen/20 transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}

            {isSignUp && (
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-white/80 mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-neonGreen/50 focus:ring-2 focus:ring-neonGreen/20 transition-all"
                  placeholder="+91 XXXXX XXXXX"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                {isSignUp ? 'Email' : 'Email / Username'}
              </label>
              <input
                type={isSignUp ? "email" : "text"}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-neonGreen/50 focus:ring-2 focus:ring-neonGreen/20 transition-all"
                placeholder={isSignUp ? "your.email@example.com" : "admin or your.email@example.com"}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-neonGreen/50 focus:ring-2 focus:ring-neonGreen/20 transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-neonGreen/50 focus:ring-2 focus:ring-neonGreen/20 transition-all"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-neonGreen hover:text-neonGreen/80 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-6 bg-neonGreen text-black font-bold rounded-xl hover:shadow-lg hover:shadow-neonGreen/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neonGreen/90"
            >
              {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          {/* Toggle Sign In/Sign Up */}
          <div className="mt-4 text-center">
            <p className="text-white/60 text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              {' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-neonGreen hover:text-neonGreen/80 font-semibold transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black text-white/40">or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              Google
            </button>
            <a
              href="https://www.instagram.com/fightandflight.in"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              {/* Instagram gradient icon */}
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="url(#ig-gradient)">
                <defs>
                  <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f09433"/>
                    <stop offset="25%" stopColor="#e6683c"/>
                    <stop offset="50%" stopColor="#dc2743"/>
                    <stop offset="75%" stopColor="#cc2366"/>
                    <stop offset="100%" stopColor="#bc1888"/>
                  </linearGradient>
                </defs>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
