
import React, { createContext, useContext, useState, useEffect } from 'react';
import { tokenManager } from '@/utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'CLIENT' | 'FREELANCER';
  profileImage?: string;
  bio?: string;
  location?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing token and user data on mount
    const savedToken = tokenManager.getToken();
    const savedUser = tokenManager.getUserData();
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
  }, []);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    tokenManager.setToken(newToken);
    tokenManager.setUserRole(userData.role);
    tokenManager.setUserData(userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    tokenManager.removeToken();
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      tokenManager.setUserData(updatedUser);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
