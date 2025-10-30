import React, { createContext, useState, useCallback, useMemo } from 'react';
// FIX: Import User type from the central types file.
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(() => {
    // In a real app, this would involve an OAuth flow.
    // Here, we simulate a successful login.
    const mockUser: User = {
      id: 'fb-12345',
      name: 'Alex Johnson',
      email: 'alex.j@example.com',
      profilePictureUrl: 'https://picsum.photos/seed/alex/100/100',
      bio: 'Frontend developer passionate about React, Tailwind CSS, and creating beautiful user experiences.',
      joinDate: '2023-11-15',
    };
    setUser(mockUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    login,
    logout,
  }), [user, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
