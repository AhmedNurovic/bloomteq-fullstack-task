import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { AuthContext } from './AuthContextBase';
import type { User } from './AuthContextBase';
import type { AxiosError } from 'axios';

type ErrorResponse = { error?: string; message?: string };

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get(API_ENDPOINTS.PROFILE());
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN(), {
        email,
        password
      });
      
      const { access_token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      return { success: true };
    } catch (error: unknown) {
      let message = 'Login failed';
      if (
        typeof error === 'object' &&
        error !== null &&
        'isAxiosError' in error &&
        (error as AxiosError).isAxiosError &&
        typeof (error as AxiosError<ErrorResponse>).response?.data?.message === 'string'
      ) {
        message = (error as AxiosError<ErrorResponse>).response?.data?.message as string;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return { 
        success: false, 
        error: message
      };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await axios.post(API_ENDPOINTS.REGISTER(), {
        email,
        password
      });
      
      const { access_token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      return { success: true };
    } catch (error: unknown) {
      let message = 'Registration failed';
      if (
        typeof error === 'object' &&
        error !== null &&
        'isAxiosError' in error &&
        (error as AxiosError).isAxiosError &&
        typeof (error as AxiosError<ErrorResponse>).response?.data?.message === 'string'
      ) {
        message = (error as AxiosError<ErrorResponse>).response?.data?.message as string;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return { 
        success: false, 
        error: message
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 