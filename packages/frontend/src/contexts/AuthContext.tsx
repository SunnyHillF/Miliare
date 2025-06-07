import React, { createContext, useContext, useState, useEffect } from 'react';
import { signIn, signUp, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
/* eslint react-refresh/only-export-components: 0 */

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  groups: string[];
  uplineSMD?: string;
  uplineEVC?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'groups'> & { password: string }) => Promise<boolean>;
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
        const groups =
          (session.tokens.idToken?.payload['cognito:groups'] as string[]) || [];

        // Convert Amplify user to our User type
        const userData: User = {
          id: currentUser.userId,
          firstName: 'User', // Will be populated from user attributes
          lastName: '', // Will be populated from user attributes
          email: currentUser.signInDetails?.loginId || '',
          company: 'WFG', // Default for now, could come from user attributes
          groups,
          uplineSMD: undefined, // Could come from user attributes
          uplineEVC: undefined, // Could come from user attributes
        };
        setUser(userData);
      }
    } catch (error) {
      // Only log errors that aren't expected "not authenticated" scenarios
      if (error && typeof error === 'object' && 'name' in error && error.name !== 'UserUnAuthenticatedException') {
        console.error('Error checking auth status:', error);
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // If a user is already authenticated, sign them out first to avoid
      // "UserAlreadyAuthenticatedException" errors from Amplify.
      try {
        await getCurrentUser();
        await signOut();
      } catch {
        // getCurrentUser throws if no user is signed in; ignore in that case
      }

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

  const register = async (
    userData: Omit<User, 'id' | 'groups'> & { password: string }
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { isSignUpComplete } = await signUp({
        username: userData.email,
        password: userData.password,
        options: {
          userAttributes: {
            email: userData.email,
            given_name: userData.firstName,
            family_name: userData.lastName,
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
        // login() will handle setting isLoading(false) via checkAuthStatus
        return true;
      } else {
        // User needs to verify email - not complete yet
        setIsLoading(false);
        return false;
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
