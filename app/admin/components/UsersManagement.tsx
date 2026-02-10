'use client';
import { useState, useEffect } from 'react';
import { rtdb } from '@/lib/firebase';
import { ref, get, remove, set, onValue } from 'firebase/database';
import Icon from '@/components/ui/AppIcon';

interface User {
  uid: string;
  email: string;
  name?: string;
  displayName?: string;
  role: 'admin' | 'user';
  createdAt: number;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersRef = ref(rtdb, 'users');
    
    // Real-time listener
    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const usersArray = Object.entries(usersData).map(([uid, data]: [string, any]) => ({
          uid,
          ...data
        }));
        setUsers(usersArray);
      } else {
        setUsers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSetRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      await set(ref(rtdb, `users/${userId}/role`), newRole);
      // State updates automatically via onValue listener
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await remove(ref(rtdb, `users/${userId}`));
      // State updates automatically via onValue listener
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-card p-6 rounded-xl shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">All Users</h2>
          <span className="text-sm text-muted-foreground">
            {users.length} total users
          </span>
        </div>
        
        {/* Centered container with max-width */}
        <div className="max-w-md mx-auto space-y-4">
          {users.map((user) => (
            <div
              key={user.uid}
              className="p-4 bg-secondary rounded-lg space-y-3"
            >
              {/* User Info */}
              <div className="space-y-1">
                <p className="text-foreground font-semibold text-lg">
                  {user.name || user.displayName || 'No Name'}
                </p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              {/* Role Buttons - Same color as Add Category button */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => handleSetRole(user.uid, 'user')}
                  className={`px-8 py-3 rounded-lg text-sm font-medium transition-colors ${
                    user.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground hover:bg-accent hover:text-accent-foreground border border-border'
                  }`}
                >
                  User
                </button>
                <button
                  onClick={() => handleSetRole(user.uid, 'admin')}
                  className={`px-8 py-3 rounded-lg text-sm font-medium transition-colors ${
                    user.role === 'admin'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground hover:bg-accent hover:text-accent-foreground border border-border'
                  }`}
                >
                  Admin
                </button>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteUser(user.uid)}
                className="w-full py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Icon name="TrashIcon" size={16} />
                Delete User
              </button>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <Icon name="UserIcon" size={48} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}