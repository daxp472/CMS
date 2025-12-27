import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getUser, setUser, clearUser, initializeSampleData } from '../utils/localStorage';

interface AuthContextType {
  user: User | null;
  login: (role: User['role'], name: string, badge?: string, station?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = getUser();
    if (savedUser) {
      setUserState(savedUser);
    }
    initializeSampleData();
  }, []);

  const login = (role: User['role'], name: string, badge?: string, station?: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      role,
      badge,
      station
    };
    setUser(newUser);
    setUserState(newUser);
  };

  const logout = () => {
    clearUser();
    setUserState(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};