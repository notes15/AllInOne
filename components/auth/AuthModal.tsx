'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type NotificationType = 'success' | 'error' | 'info';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);
  
  // Forgot password
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetCodeSent, setResetCodeSent] = useState(false);
  
  const { signIn, signUp, signInWithGoogle } = useAuth();

  if (!isOpen) return null;

  const showNotification = (message: string, type: NotificationType = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (!name.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        
        try {
          await signUp(email, password, name);
        } catch (signUpError: any) {
          if (signUpError.code === 'auth/email-already-in-use') {
            setError('This email is already registered. Please login instead.');
            setLoading(false);
            return;
          }
          throw signUpError;
        }
      }

      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send verification code');
      }

      setNeedsVerification(true);
      showNotification('Verification code sent to your email!', 'info');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithGoogle();
      const userEmail = result?.user?.email;
      
      if (!userEmail) {
        throw new Error('Could not get email from Google account');
      }

      setEmail(userEmail);

      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send verification code');
      }

      setNeedsVerification(true);
      showNotification('Verification code sent to your email!', 'info');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Invalid code');
      }

      showNotification('Successfully logged in!', 'success');
      
      setTimeout(() => {
        setEmail('');
        setPassword('');
        setCode('');
        setName('');
        setNeedsVerification(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password - Send Reset Code
  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail })
      });

      if (!response.ok) {
        throw new Error('Failed to send reset code');
      }

      setResetCodeSent(true);
      showNotification('Reset code sent to your email!', 'info');
    } catch (err: any) {
      setError('Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password - Verify and Reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Verify code
      const verifyResponse = await fetch('/api/auth/send-code', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail, code: resetCode })
      });

      if (!verifyResponse.ok) {
        const data = await verifyResponse.json();
        throw new Error(data.error || 'Invalid code');
      }

      // Reset password using Firebase sendPasswordResetEmail
      const { sendPasswordResetEmail } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase');
      
      await sendPasswordResetEmail(auth, forgotPasswordEmail);

      showNotification('Password reset email sent! Check your inbox.', 'success');
      
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
        setResetCode('');
        setNewPassword('');
        setConfirmNewPassword('');
        setResetCodeSent(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setCode('');
    setName('');
    setError('');
    setNeedsVerification(false);
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
    setResetCode('');
    setNewPassword('');
    setConfirmNewPassword('');
    setResetCodeSent(false);
    setNotification(null);
    onClose();
  };

  // Forgot Password Flow
  if (showForgotPassword) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {notification && (
          <div className={`fixed top-24 right-6 z-50 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slideInRight max-w-md ${
            notification.type === 'success' ? 'bg-green-500 text-white' :
            notification.type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
          <h2 className="text-2xl font-bold mb-6">Reset Password</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 animate-shake">
              <span className="font-medium">{error}</span>
            </div>
          )}

          {!resetCodeSent ? (
            <form onSubmit={handleSendResetCode}>
              <p className="text-gray-600 mb-4">Enter your email to receive a password reset code</p>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full text-blue-600 hover:underline"
              >
                Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <p className="text-gray-600 mb-4">
                Enter the code sent to <strong>{forgotPasswordEmail}</strong>
              </p>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">6-Digit Code</label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-3 py-2 border rounded text-center text-2xl tracking-widest font-mono"
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  minLength={6}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || resetCode.length !== 6}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4 disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setResetCodeSent(false);
                  setResetCode('');
                }}
                className="w-full text-blue-600 hover:underline"
              >
                Use Different Email
              </button>
            </form>
          )}

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  // Verification Flow
  if (needsVerification) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {notification && (
          <div className={`fixed top-24 right-6 z-50 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slideInRight max-w-md ${
            notification.type === 'success' ? 'bg-green-500 text-white' :
            notification.type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
          <h2 className="text-2xl font-bold mb-6">Verify Your Email</h2>
          <p className="text-gray-600 mb-4">
            We sent a verification code to <strong>{email}</strong>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 animate-shake">
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleVerifyCode}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">6-Digit Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-3 py-2 border rounded text-center text-2xl tracking-widest font-mono"
                placeholder="000000"
                maxLength={6}
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </form>

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  // Login/Signup Form
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {notification && (
        <div className={`fixed top-24 right-6 z-50 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slideInRight max-w-md ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <h2 className="text-2xl font-bold mb-6">{isLogin ? 'Login' : 'Sign Up'}</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 animate-shake">
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {isLogin && (
            <div className="mb-4 text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-blue-600 hover:underline text-sm"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 mb-4 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-blue-600 hover:underline mb-4"
        >
          {isLogin ? 'Need an account? Sign up' : 'Have an account? Login'}
        </button>

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ✕
        </button>
      </div>
    </div>
  );
}