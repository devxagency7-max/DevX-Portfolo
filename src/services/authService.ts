import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from './firebase';
import { AdminUser } from '../types/admin';

const toAdminUser = (user: User): AdminUser => ({
  id: user.uid,
  username: user.email || 'Admin',
  role: 'admin',
  token: user.uid,
  lastLogin: new Date().toISOString()
});

export const authService = {
  login: async (email: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: toAdminUser(credential.user) };
    } catch (err: any) {
      const message =
        err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password' || err?.code === 'auth/user-not-found'
          ? 'Invalid email or password.'
          : err?.message || 'Login failed.';
      return { success: false, error: message };
    }
  },

  logout: async (): Promise<void> => {
    await signOut(auth);
  },

  getCurrentUser: (): AdminUser | null => {
    return auth.currentUser ? toAdminUser(auth.currentUser) : null;
  },

  isAuthenticated: (): boolean => {
    return !!auth.currentUser;
  },

  /** Subscribes to auth state changes; returns an unsubscribe function. */
  onAuthChange: (callback: (user: AdminUser | null) => void): (() => void) => {
    return onAuthStateChanged(auth, firebaseUser => {
      callback(firebaseUser ? toAdminUser(firebaseUser) : null);
    });
  }
};
