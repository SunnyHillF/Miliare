import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  company: string;
  uplineSMD?: string;
  uplineEVC?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('mrn_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call to authenticate
    setIsLoading(true);
    try {
      // Simulating an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, just check if email contains "@" and password is not empty
      if (!email.includes('@') || !password) {
        throw new Error('Invalid credentials');
      }
      
      // Mock user data
      const userData: User = {
        id: '1',
        name: email.split('@')[0],
        email,
        company: 'WFG',
        uplineSMD: 'John Doe',
        uplineEVC: 'Jane Smith'
      };
      
      setUser(userData);
      localStorage.setItem('mrn_user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }) => {
    setIsLoading(true);
    try {
      // Simulating an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration
      const registeredUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: userData.name,
        email: userData.email,
        company: userData.company,
        uplineSMD: userData.uplineSMD,
        uplineEVC: userData.uplineEVC
      };
      
      setUser(registeredUser);
      localStorage.setItem('mrn_user', JSON.stringify(registeredUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mrn_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
      }}
    >
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