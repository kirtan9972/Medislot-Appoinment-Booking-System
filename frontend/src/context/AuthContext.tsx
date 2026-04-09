import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../services/api.ts';

interface AuthContextType {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('userInfo');

      if (token) {
        try {
          const profile = await API.fetchUserProfile();
          setUser(profile);
          localStorage.setItem('userInfo', JSON.stringify(profile));
        } catch (error) {
          console.error('Auth initialization failed', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          setUser(null);
        }
      } else if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
