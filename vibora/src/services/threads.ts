import axios from 'axios';
import { Thread } from '../types/thread';

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

export const createThread = async (data: Partial<Thread>): Promise<Thread | null> => {
  try {
    const response = await api.post<Thread>('Threads', data);
    if (!response.data) return null;

    return {
      id: String(response.data.id),
      title: String(response.data.title || ''),
      userID: String(response.data.userID || ''),
      description: String(response.data.description || ''),
      isHidden: Boolean(response.data.isHidden),
      isDeleted: Boolean(response.data.isDeleted),
    };
  }
  catch (error) {
    console.error('Create thread error: ', error);
    return null;
  }
};

export const getAllThreadsByUserId = async (userID: string): Promise<Thread[]> => {
  try {
    const response = await api.get<Thread[]>(`Threads/user/${userID}`);
    return Array.isArray(response.data)
      ? response.data.map((thread) => ({
          id: String(thread.id),
          title: String(thread.title || ''),
          userID: String(thread.userID || ''),
          description: String(thread.description || ''),
          isHidden: Boolean(thread.isHidden),
          isDeleted: Boolean(thread.isDeleted),
        }))
      : [];
  } catch (error) {
    console.error(`Get threads by user ${userID} error: `, error);
    return [];
  }
};

export const getAllThreads = async (): Promise<Thread[]> => {
  try {
    const response = await api.get<Thread[]>(`Threads`);
    return Array.isArray(response.data)
      ? response.data.map((thread) => ({
          id: String(thread.id),
          title: String(thread.title || ''),
          userID: String(thread.userID || ''),
          description: String(thread.description || ''),
          isHidden: Boolean(thread.isHidden),
          isDeleted: Boolean(thread.isDeleted),
        }))
      : [];
  } catch (error) {
    console.error(`Get threads error: `, error);
    return [];
  }
};

export const getThreadById = async (id: string): Promise<Thread | null> => {
  try {
    const response = await api.get<Thread>(`Threads/${id}`);
    if (!response.data) return null;

    return {
      id: String(response.data.id),
      title: String(response.data.title || ''),
      userID: String(response.data.userID || ''),
      description: String(response.data.description || ''),
      isHidden: Boolean(response.data.isHidden),
      isDeleted: Boolean(response.data.isDeleted),
    };
  } catch (error) {
    console.error(`Error fetching thread with ID ${id}: `, error);
    return null;
  }
};

export const updateThread = async (id: string, data: Partial<Thread>): Promise<Thread | null> => {
  try {
    const response = await api.put<Thread>(`Threads/${id}`, data);
    if (!response.data) return null;

    return {
      id: String(response.data.id),
      title: String(response.data.title || ''),
      userID: String(response.data.userID || ''),
      description: String(response.data.description || ''),
      isHidden: Boolean(response.data.isHidden),
      isDeleted: Boolean(response.data.isDeleted),
    };
  } catch (error) {
    console.error('Update thread error: ', error);
    return null;
  }
};

export const deleteThread = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`Threads/${id}`);
    return true;
  } catch (error) {
    console.error('Delete thread error: ', error);
    return false;
  }
}