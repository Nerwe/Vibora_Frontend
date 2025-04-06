import axios from 'axios';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth';

const api = axios.create({
  baseURL: 'https://localhost:7203/api/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<string>('auth/login', credentials);
    const token = response.data;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      token,
      userID: payload.userID,
    };
  } catch (error) {
    console.error('Login error: ', error);
    throw error;
  }
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<string>('auth/register', credentials);
    const token = response.data;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      token,
      userID: payload.userId,
    };
  } catch (error) {
    console.error('Register error: ', error);
    throw error;
  }
};