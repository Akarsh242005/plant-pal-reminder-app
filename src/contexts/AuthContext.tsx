
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '@/types';
import { toast } from "sonner";

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// For demo purposes, we'll use localStorage to store mock auth data
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('plantpal_auth');
    if (storedAuth) {
      try {
        setAuth(JSON.parse(storedAuth));
      } catch (error) {
        console.error('Failed to parse auth data', error);
        localStorage.removeItem('plantpal_auth');
      }
    }
    setIsLoading(false);
  }, []);

  // Save auth to localStorage whenever it changes
  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      localStorage.setItem('plantpal_auth', JSON.stringify(auth));
    } else {
      localStorage.removeItem('plantpal_auth');
    }
  }, [auth]);

  // Mock login function (would connect to actual API in production)
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, just check email format and any password
      if (!email.includes('@') || password.length < 6) {
        throw new Error('Invalid credentials');
      }
      
      // Mock successful login
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
      };
      
      const mockToken = 'mock_jwt_token_' + Date.now();
      
      setAuth({
        user: mockUser,
        isAuthenticated: true,
        token: mockToken,
      });
      
      toast.success("Successfully logged in!");
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function
  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Basic validation
      if (!email.includes('@') || password.length < 6) {
        throw new Error('Invalid registration data');
      }
      
      // Mock successful registration
      const mockUser: User = {
        id: '1',
        email,
        name,
      };
      
      const mockToken = 'mock_jwt_token_' + Date.now();
      
      setAuth({
        user: mockUser,
        isAuthenticated: true,
        token: mockToken,
      });
      
      toast.success("Successfully registered!");
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Registration failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setAuth({
      user: null,
      isAuthenticated: false,
      token: null,
    });
    toast.info("You have been logged out.");
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout, isLoading }}>
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
