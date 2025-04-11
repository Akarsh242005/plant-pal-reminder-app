
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '@/types';
import { toast } from "sonner";
import { client, connectToMongoDB, dbName } from "@/integrations/mongodb/client";
import { v4 as uuidv4 } from 'uuid';

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AUTH_STORAGE_KEY = 'plantpal_auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initial load from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setAuth(parsedAuth);
      } catch (error) {
        console.error('Error parsing stored auth:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Update localStorage whenever auth changes
  useEffect(() => {
    if (auth.isAuthenticated) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [auth]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const db = await connectToMongoDB();
      const usersCollection = db.collection('users');
      
      // Find user by email
      const user = await usersCollection.findOne({ email });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // In a real app, you should hash passwords and compare the hashed values
      if (user.password !== password) {
        throw new Error('Invalid password');
      }
      
      // Create auth state
      const authState: AuthState = {
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name || '',
        },
        isAuthenticated: true,
        token: uuidv4(), // Generate a simple token
      };
      
      setAuth(authState);
      toast.success("Successfully logged in!");
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "Login failed. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      const db = await connectToMongoDB();
      const usersCollection = db.collection('users');
      
      // Check if user already exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user
      // In a real app, you should hash the password
      const result = await usersCollection.insertOne({
        email,
        password, // Should be hashed in production
        name,
        createdAt: new Date(),
      });
      
      if (!result.acknowledged) {
        throw new Error('Failed to create user');
      }
      
      // Create auth state
      const authState: AuthState = {
        user: {
          id: result.insertedId.toString(),
          email,
          name,
        },
        isAuthenticated: true,
        token: uuidv4(), // Generate a simple token
      };
      
      setAuth(authState);
      toast.success("Successfully registered!");
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || "Registration failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setAuth({
        user: null,
        isAuthenticated: false,
        token: null,
      });
      toast.info("You have been logged out.");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
