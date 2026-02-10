'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { updatePassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { rtdb } from '@/lib/firebase';
import Icon from '@/components/ui/AppIcon';

type NotificationType = 'success' | 'error' | 'info';

export default function SettingsClient() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Notification state
  const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);

  // Username change
  const [newUsername, setNewUsername] = useState('');
  const [updatingUsername, setUpdatingUsername] = useState(false);

  // Password change with verification
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVerificationCode, setPasswordVerificationCode] = useState('');
  const [passwordCodeSent, setPasswordCodeSent] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/homepage');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setNewUsername(user.displayName || '');
    }
  }, [user]);

  const showNotification = (message: string, type: NotificationType = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Username Change
  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUsername.trim()) {
      showNotification('Please enter a username', 'error');
      return;
    }

    if (!user) {
      showNotification('User not found', 'error');
      return;
    }

    try {
      setUpdatingUsername(true);
      await set(ref(rtdb, `users/${user.uid}/name`), newUsername.trim());
      showNotification('Username updated successfully!', 'success');
    } catch (err: any) {
      console.error('Error updating username:', err);
      showNotification('Failed to update username', 'error');
    } finally {
      setUpdatingUsername(false);
    }
  };

  // Password Change - Send Verification Code
  const handleSendPasswordCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      return;
    }

    if (!user?.email) {
      showNotification('User email not found', 'error');
      return;
    }

    try {
      setUpdatingPassword(true);

      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });

      if (!response.ok) {
        throw new Error('Failed to send verification code');
      }

      setPasswordCodeSent(true);
      showNotification('Verification code sent to your email!', 'info');
    } catch (err: any) {
      console.error('Error sending code:', err);
      showNotification('Failed to send verification code', 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Password Change - Verify Code and Update
  const handleVerifyPasswordCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.email) {
      showNotification('User email not found', 'error');
      return;
    }

    try {
      setUpdatingPassword(true);

      const response = await fetch('/api/auth/send-code', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, code: passwordVerificationCode })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Invalid verification code');
      }

      await updatePassword(user, newPassword);

      showNotification('Password updated successfully!', 'success');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordVerificationCode('');
      setPasswordCodeSent(false);
      setShowPasswordChange(false);
    } catch (err: any) {
      console.error('Error updating password:', err);
      showNotification(err.message || 'Failed to update password', 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-32">
      {/* Animated Notification */}
      {notification && (
        <div className={`fixed top-24 right-6 z-50 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slideInRight max-w-md ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <Icon 
            name={
              notification.type === 'success' ? 'CheckCircleIcon' :
              notification.type === 'error' ? 'XCircleIcon' :
              'InformationCircleIcon'
            } 
            size={24} 
          />
          <span className="font-medium">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-80">
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>
      )}

      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
          Account Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account preferences and security
        </p>
      </div>

      <div className="space-y-8">
        {/* Account Information */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="UserCircleIcon" size={24} />
            Account Information
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <p className="text-foreground font-medium">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Current Username</label>
              <p className="text-foreground font-medium">{user?.displayName || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Account Created</label>
              <p className="text-foreground font-medium">
                {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        {/* Change Username */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="PencilIcon" size={24} />
            Change Username
          </h2>

          <form onSubmit={handleUsernameChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                New Username
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
                placeholder="Enter new username"
                required
              />
            </div>

            <button
              type="submit"
              disabled={updatingUsername}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {updatingUsername ? (
                <>
                  <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Icon name="CheckIcon" size={20} />
                  Update Username
                </>
              )}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="LockClosedIcon" size={24} />
            Change Password
          </h2>

          {!showPasswordChange ? (
            <button
              onClick={() => setShowPasswordChange(true)}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
            >
              <Icon name="KeyIcon" size={20} />
              Change Password
            </button>
          ) : (
            <div className="space-y-4">
              {!passwordCodeSent ? (
                <form onSubmit={handleSendPasswordCode} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
                      placeholder="Enter new password (min. 6 characters)"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
                      placeholder="Confirm new password"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={updatingPassword}
                      className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {updatingPassword ? (
                        <>
                          <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Icon name="PaperAirplaneIcon" size={20} />
                          Send Verification Code
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordChange(false);
                        setNewPassword('');
                        setConfirmPassword('');
                        setPasswordVerificationCode('');
                        setPasswordCodeSent(false);
                      }}
                      className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyPasswordCode} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Verification Code
                    </label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Enter the 6-digit code sent to <strong>{user?.email}</strong>
                    </p>
                    <input
                      type="text"
                      value={passwordVerificationCode}
                      onChange={(e) => setPasswordVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground text-center text-2xl tracking-widest font-mono"
                      placeholder="000000"
                      maxLength={6}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={updatingPassword || passwordVerificationCode.length !== 6}
                      className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {updatingPassword ? (
                        <>
                          <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Icon name="CheckIcon" size={20} />
                          Verify & Update Password
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPasswordCodeSent(false);
                        setPasswordVerificationCode('');
                      }}
                      className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border-2 border-red-200 p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-red-700 mb-4 flex items-center gap-2">
            <Icon name="ExclamationTriangleIcon" size={24} />
            Danger Zone
          </h2>
          <p className="text-sm text-red-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={() => alert('Account deletion feature - Contact support to delete your account')}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <Icon name="TrashIcon" size={20} />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}