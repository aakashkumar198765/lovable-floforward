import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token?: string, userEmail?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Initialize state by checking localStorage immediately
    const token = localStorage.getItem('authToken');
    return !!token;
  });

  const login = (token?: string, userEmail?: string) => {
    setIsAuthenticated(true);
    if (token) {
      localStorage.setItem('authToken', token);
    }
    // Store email for later use by Redux integration
    if (userEmail) {
      localStorage.setItem('userEmail', userEmail);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 