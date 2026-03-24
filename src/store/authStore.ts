import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  initAuth: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      set({
        user: {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
        },
        loading: false,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Login failed';
      const friendly = message.includes('invalid-credential')
        ? 'Invalid email or password'
        : message.includes('too-many-requests')
          ? 'Too many attempts. Please try again later.'
          : message.includes('network-request-failed')
            ? 'Network error. Check your connection.'
            : 'Login failed. Please try again.';
      set({ error: friendly, loading: false });
    }
  },

  signup: async (email, password, name) => {
    set({ loading: true, error: null });
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      set({
        user: {
          uid: result.user.uid,
          email: result.user.email,
          displayName: name,
        },
        loading: false,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Signup failed';
      const friendly = message.includes('email-already-in-use')
        ? 'An account with this email already exists'
        : message.includes('weak-password')
          ? 'Password is too weak. Use at least 6 characters.'
          : message.includes('invalid-email')
            ? 'Invalid email address'
            : message.includes('network-request-failed')
              ? 'Network error. Check your connection.'
              : 'Signup failed. Please try again.';
      set({ error: friendly, loading: false });
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },

  clearError: () => set({ error: null }),

  initAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        set({
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          },
          loading: false,
        });
      } else {
        set({ user: null, loading: false });
      }
    });
    return unsubscribe;
  },
}));
