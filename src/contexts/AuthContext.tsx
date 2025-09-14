'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { User, AuthContextType } from '@/types/chat';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateUserId, getRandomColor } from '@/lib/chatUtils';
import { generateRandomAvatar } from '@/lib/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useLocalStorage<User | null>('chat-user', null);

  const login = (username: string) => {
    const newUser: User = {
      id: generateUserId(),
      username: username.trim(),
      avatar: generateRandomAvatar(),
      isOnline: true,
      lastSeen: new Date(),
      color: getRandomColor(),
    };
    
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}