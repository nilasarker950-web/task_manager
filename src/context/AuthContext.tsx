import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  updatePassword,
  sendPasswordResetEmail,
  signInAnonymously,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider, testFirestoreConnection } from '../lib/firebase';
import { syncUserProfile } from '../services/taskService';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isOnline: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: { name?: string; avatarUrl?: string; avatarColor?: string }) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_GUEST_KEY = 'taskpulse_guest_user_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Test initial Firestore connection per guidelines
    testFirestoreConnection().then((connected) => {
      setIsOnline(connected);
    });

    // Check for saved local guest session
    const savedGuest = localStorage.getItem(LOCAL_GUEST_KEY);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        // Clear local guest session when actual Firebase user logs in
        localStorage.removeItem(LOCAL_GUEST_KEY);
        const profile: UserProfile = {
          id: user.uid,
          name: user.displayName || (user.isAnonymous ? 'Guest User' : user.email?.split('@')[0] || 'User'),
          email: user.email || (user.isAnonymous ? 'guest@taskpulse.local' : 'user@taskpulse.local'),
          avatarUrl: user.photoURL || undefined,
          isAnonymous: user.isAnonymous,
        };
        setCurrentUser(profile);
        try {
          await syncUserProfile(profile);
        } catch (e) {
          console.warn('Syncing user profile warning:', e);
        }
      } else if (savedGuest) {
        try {
          const guestProfile: UserProfile = JSON.parse(savedGuest);
          setCurrentUser(guestProfile);
        } catch {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      localStorage.removeItem(LOCAL_GUEST_KEY);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in popup closed. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setAuthError('Sign-in popup was blocked by the browser. Please allow popups.');
      } else {
        setAuthError(err.message || 'Failed to sign in with Google');
      }
      throw err;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setAuthError(null);
    try {
      localStorage.removeItem(LOCAL_GUEST_KEY);
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err: any) {
      console.error('Email Sign-In Error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setAuthError('Invalid email or password. Please check your credentials.');
      } else if (err.code === 'auth/invalid-email') {
        setAuthError('Please enter a valid email address.');
      } else if (err.code === 'auth/too-many-requests') {
        setAuthError('Too many failed attempts. Please try again in a few minutes.');
      } else {
        setAuthError(err.message || 'Failed to sign in with email.');
      }
      throw err;
    }
  };

  const signUpWithEmail = async (name: string, email: string, password: string) => {
    setAuthError(null);
    try {
      localStorage.removeItem(LOCAL_GUEST_KEY);
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name.trim() || email.split('@')[0],
        });
      }
    } catch (err: any) {
      console.error('Email Sign-Up Error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setAuthError('An account with this email already exists. Please log in instead.');
      } else if (err.code === 'auth/weak-password') {
        setAuthError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setAuthError('Please enter a valid email address.');
      } else {
        setAuthError(err.message || 'Failed to register account.');
      }
      throw err;
    }
  };

  const signInAsGuest = async () => {
    setAuthError(null);
    try {
      await signInAnonymously(auth);
    } catch (err: any) {
      console.warn('Firebase Anonymous auth notice, enabling instant local guest mode:', err.code);
      // Fallback to instant local guest mode
      const guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
      const guestProfile: UserProfile = {
        id: guestId,
        name: 'Guest Explorer',
        email: 'guest@taskpulse.local',
        isAnonymous: true,
      };
      localStorage.setItem(LOCAL_GUEST_KEY, JSON.stringify(guestProfile));
      setCurrentUser(guestProfile);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem(LOCAL_GUEST_KEY);
      setCurrentUser(null);
      await signOut(auth);
    } catch (err: any) {
      console.error('Sign Out Error:', err);
      setAuthError(err.message || 'Failed to sign out');
    }
  };

  const updateUserProfile = async (updates: { name?: string; avatarUrl?: string; avatarColor?: string }) => {
    setAuthError(null);
    try {
      if (auth.currentUser) {
        const fbUpdates: { displayName?: string; photoURL?: string } = {};
        if (updates.name !== undefined) fbUpdates.displayName = updates.name.trim();
        if (updates.avatarUrl !== undefined) fbUpdates.photoURL = updates.avatarUrl;
        await updateProfile(auth.currentUser, fbUpdates);
      }

      const updatedProfile: UserProfile = {
        id: currentUser?.id || auth.currentUser?.uid || 'user',
        name: updates.name !== undefined ? updates.name.trim() : (currentUser?.name || 'User'),
        email: currentUser?.email || auth.currentUser?.email || 'user@taskpulse.local',
        avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : currentUser?.avatarUrl,
        avatarColor: updates.avatarColor !== undefined ? updates.avatarColor : currentUser?.avatarColor,
        isAnonymous: currentUser?.isAnonymous ?? auth.currentUser?.isAnonymous ?? false,
      };

      setCurrentUser(updatedProfile);

      if (updatedProfile.isAnonymous || updatedProfile.id.startsWith('guest_')) {
        localStorage.setItem(LOCAL_GUEST_KEY, JSON.stringify(updatedProfile));
      } else {
        await syncUserProfile(updatedProfile);
      }
    } catch (err: any) {
      console.error('Update Profile Error:', err);
      setAuthError(err.message || 'Failed to update profile');
      throw err;
    }
  };

  const changePassword = async (newPassword: string) => {
    setAuthError(null);
    try {
      if (!auth.currentUser) {
        throw new Error('No authenticated user found.');
      }
      await updatePassword(auth.currentUser, newPassword);
    } catch (err: any) {
      console.error('Change Password Error:', err);
      if (err.code === 'auth/requires-recent-login') {
        const msg = 'For security reasons, changing your password requires recent authentication. Please log out and log in again.';
        setAuthError(msg);
        throw new Error(msg);
      } else if (err.code === 'auth/weak-password') {
        const msg = 'Password should be at least 6 characters.';
        setAuthError(msg);
        throw new Error(msg);
      } else {
        const msg = err.message || 'Failed to update password.';
        setAuthError(msg);
        throw new Error(msg);
      }
    }
  };

  const sendPasswordReset = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: any) {
      console.error('Password Reset Error:', err);
      if (err.code === 'auth/user-not-found') {
        const msg = 'No account was found with this email address.';
        setAuthError(msg);
        throw new Error(msg);
      } else if (err.code === 'auth/invalid-email') {
        const msg = 'Please enter a valid email address.';
        setAuthError(msg);
        throw new Error(msg);
      } else {
        const msg = err.message || 'Failed to send password reset email.';
        setAuthError(msg);
        throw new Error(msg);
      }
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        loading,
        isOnline,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signInAsGuest,
        logout,
        updateUserProfile,
        changePassword,
        sendPasswordReset,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
