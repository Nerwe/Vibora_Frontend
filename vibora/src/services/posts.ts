import axios from 'axios';
import { Post } from '../types/post';

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

export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get<Post[]>(`Posts`);
    return Array.isArray(response.data)
      ? response.data.map((post) => ({
          id: String(post.id),
          userID: String(post.userID || ''),
          threadID: String(post.threadID || ''),
          title: String(post.title || ''),
          content: String(post.content || ''),
          score: Number(post.score || 0),
          createdDate: String(post.createdDate || ''),
          lastUpdateDate: String(post.lastUpdateDate || ''),
          isHidden: Boolean(post.isHidden),
          isDeleted: Boolean(post.isDeleted),
        }))
      : [];
  } catch (error) {
    console.error(`Get posts error: `, error);
    return [];
  }
};

export const getAllPostsByThreadId = async (threadId: string): Promise<Post[]> => {
  try {
    const response = await api.get<Post[]>(`Posts/thread/${threadId}`);
    return Array.isArray(response.data)
      ? response.data.map((post) => ({
          id: String(post.id),
          userID: String(post.userID || ''),
          threadID: String(post.threadID || ''),
          title: String(post.title || ''),
          content: String(post.content || ''),
          score: Number(post.score || 0),
          createdDate: String(post.createdDate || ''),
          lastUpdateDate: String(post.lastUpdateDate || ''),
          isHidden: Boolean(post.isHidden),
          isDeleted: Boolean(post.isDeleted),
        }))
      : [];
  } catch (error) {
    console.error(`Get posts by thread ${threadId} error: `, error);
    return [];
  }
};

export const getPostsByUserId = async (userId: string): Promise<Post[]> => {
  try {
    const response = await api.get<Post[]>(`Posts/user/${userId}`);
    return Array.isArray(response.data)
      ? response.data.map((post) => ({
          id: String(post.id),
          userID: String(post.userID || ''),
          threadID: String(post.threadID || ''),
          title: String(post.title || ''),
          content: String(post.content || ''),
          score: Number(post.score || 0),
          createdDate: String(post.createdDate || ''),
          lastUpdateDate: String(post.lastUpdateDate || ''),
          isHidden: Boolean(post.isHidden),
          isDeleted: Boolean(post.isDeleted),
        }))
      : [];
  } catch (error) {
    console.error(`Get posts by user ${userId} error: `, error);
    return [];
  }
};

export const getPostById = async (id: string): Promise<Post | null> => {
  try {
    const response = await api.get<Post>(`Posts/${id}`);
    if (!response.data) return null;

    return {
      id: String(response.data.id),
      userID: String(response.data.userID || ''),
      threadID: String(response.data.threadID || ''),
      title: String(response.data.title || ''),
      content: String(response.data.content || ''),
      score: Number(response.data.score || 0),
      createdDate: String(response.data.createdDate || ''),
      lastUpdateDate: String(response.data.lastUpdateDate || ''),
      isHidden: Boolean(response.data.isHidden),
      isDeleted: Boolean(response.data.isDeleted),
    };
  } catch (error) {
    console.error(`Error fetching post with ID ${id}: `, error);
    return null;
  }
};

export const createPost = async (data: Partial<Post>): Promise<Post | null> => {
  try {
    const response = await api.post<Post>('Posts', data);
    if (!response.data) return null;

    return {
      id: String(response.data.id),
      userID: String(response.data.userID || ''),
      threadID: String(response.data.threadID || ''),
      title: String(response.data.title || ''),
      content: String(response.data.content || ''),
      score: Number(response.data.score || 0),
      createdDate: String(response.data.createdDate || ''),
      lastUpdateDate: String(response.data.lastUpdateDate || ''),
      isHidden: Boolean(response.data.isHidden),
      isDeleted: Boolean(response.data.isDeleted),
    };
  } catch (error) {
    console.error('Create post error: ', error);
    return null;
  }
};

export const updatePost = async (id: string, data: Partial<Post>): Promise<Post | null> => {
  try {
    const response = await api.put<Post>(`Posts/${id}`, data);
    if (!response.data) return null;

    return {
      id: String(response.data.id),
      userID: String(response.data.userID || ''),
      threadID: String(response.data.threadID || ''),
      title: String(response.data.title || ''),
      content: String(response.data.content || ''),
      score: Number(response.data.score || 0),
      createdDate: String(response.data.createdDate || ''),
      lastUpdateDate: String(response.data.lastUpdateDate || ''),
      isHidden: Boolean(response.data.isHidden),
      isDeleted: Boolean(response.data.isDeleted),
    };
  } catch (error) {
    console.error('Update post error: ', error);
    return null;
  }
};

export const deletePost = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`Posts/${id}`);
    return true;
  } catch (error) {
    console.error('Delete post error: ', error);
    return false;
  }
};