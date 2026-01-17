import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
// Use real Firebase auth
import { auth } from '../config/firebase';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string, username: string) => {
    // Use the new signup module
    const { signupUser } = await import('../auth/signup');
    await signupUser(email, password, username);
  };

  const login = async (email: string, password: string) => {
    // Use the new login module
    const { loginUser } = await import('../auth/login');
    await loginUser(email, password);
  };

  const logout = async () => {
    // Use the new logout module
    const { logoutUser } = await import('../auth/logout');
    await logoutUser();
  };

  const updateUsername = async (username: string) => {
    if (currentUser) {
      await updateProfile(currentUser, { displayName: username });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    updateUsername,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 