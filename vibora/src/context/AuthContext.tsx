import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState } from '../types/auth';
import { User } from '../types/user';
import * as authService from '../services/auth';
import * as userService from '../services/users';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const extractRolesFromToken = (token: string): string[] => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.roles || [];
    } catch (error) {
      console.error('Error decoding token:', error);
      return [];
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (token && userId) {
        try {
          const user = await userService.getUser(userId);
          const roles = extractRolesFromToken(token); // Извлекаем роли из токена
          setState({
            user: { ...user, roles }, // Добавляем роли в объект пользователя
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { token, userID } = await authService.login({ email, password });
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userID);

      const user = await userService.getUser(userID);
      const roles = extractRolesFromToken(token); // Извлекаем роли из токена
      setState({
        user: { ...user, roles }, // Добавляем роли в объект пользователя
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      const { token, userID } = await authService.register({ email, password, username });
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userID);

      const user = await userService.getUser(userID);
      const roles = extractRolesFromToken(token); // Извлекаем роли из токена
      setState({
        user: { ...user, roles }, // Добавляем роли в объект пользователя
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUser = async (data: Partial<User>) => {
    if (!state.user) return;

    try {
      const updateData = {
        ...state.user,
        ...data,
      };

      const updatedUser = await userService.updateUser(state.user.id, updateData);
      setState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
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