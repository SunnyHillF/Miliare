import React, { createContext, useContext, useState, useEffect } from 'react';
import { signIn, signUp, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
/* eslint react-refresh/only-export-components: 0 */

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
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      
      if (currentUser && session.tokens) {
        // Convert Amplify user to our User type
        const userData: User = {
          id: currentUser.userId,
          name: currentUser.username, // Will be populated from registration form
          email: currentUser.signInDetails?.loginId || '',
          company: 'WFG', // Default for now, could come from user attributes
          uplineSMD: undefined, // Could come from user attributes
          uplineEVC: undefined  // Could come from user attributes
        };
        setUser(userData);
      }
    } catch (error) {
      // User is not authenticated
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { isSignedIn } = await signIn({
        username: email,
        password: password,
      });
      
      if (isSignedIn) {
        await checkAuthStatus();
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }) => {
    setIsLoading(true);
    try {
      const { isSignUpComplete } = await signUp({
        username: userData.email,
        password: userData.password,
        options: {
          userAttributes: {
            email: userData.email,
            name: userData.name,
            // You can add custom attributes for company, upline, etc.
            'custom:company': userData.company,
            'custom:uplineSMD': userData.uplineSMD || '',
            'custom:uplineEVC': userData.uplineEVC || '',
          },
        },
      });
      
      if (isSignUpComplete) {
        // Auto-sign in after successful registration
        await login(userData.email, userData.password);
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
