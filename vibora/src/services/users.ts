import axios from 'axios';
import { User } from '../types/user';

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

export const getUser = async (userId: string): Promise<User> => {
  try {
    const response = await api.get<User>(`users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get user error: ', error);
    throw error;
  }
};

export const updateUser = async (userId: string, data: Partial<User>): Promise<User> => {
  try {
    const response = await api.put<User>(`users/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error('Update user error: ', error);
    throw error;
  }
};