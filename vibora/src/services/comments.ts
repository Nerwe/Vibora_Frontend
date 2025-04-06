import axios from 'axios';
import { Comment } from '../types/comment';

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

export const getAllCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  try {
    const response = await api.get<Comment[]>(`Comments/post/${postId}`);
    return Array.isArray(response.data)
      ? response.data.map((comment) => ({
          id: String(comment.id),
          content: String(comment.content || ''),
          userID: String(comment.userID || ''),
          postID: String(comment.postID || ''),
          createdDate: String(comment.createdDate || ''),
          score: Number(comment.score || 0),
          isHidden: Boolean(comment.isHidden),
          isDeleted: Boolean(comment.isDeleted),
        }))
      : [];
  } catch (error) {
    console.error(`Get comments by post ${postId} error: `, error);
    return [];
  }
};

export const getAllCommentsByUserId = async (userId: string): Promise<Comment[]> => {
  try {
    const response = await api.get<Comment[]>(`Comments/user/${userId}`);
    return Array.isArray(response.data)
      ? response.data.map((comment) => ({
          id: String(comment.id),
          content: String(comment.content || ''),
          userID: String(comment.userID || ''),
          postID: String(comment.postID || ''),
          createdDate: String(comment.createdDate || ''),
          score: Number(comment.score || 0),
          isHidden: Boolean(comment.isHidden),
          isDeleted: Boolean(comment.isDeleted),
        }))
      : [];
  } catch (error) {
    console.error(`Get comments by user ${userId} error: `, error);
    return [];
  }
};

export const createComment = async (data: Partial<Comment>): Promise<Comment | null> => {
  try {
    const response = await api.post<Comment>('Comments', data);
    if (!response.data) return null;

    return {
      id: String(response.data.id),
      content: String(response.data.content || ''),
      userID: String(response.data.userID || ''),
      postID: String(response.data.postID || ''),
      createdDate: new Date(response.data.createdDate || '').toISOString(),
      score: Number(response.data.score || 0),
      isHidden: Boolean(response.data.isHidden),
      isDeleted: Boolean(response.data.isDeleted),
    };
  } catch (error) {
    console.error('Create comment error: ', error);
    return null;
  }
};

export const deleteComment = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`Comments/${id}`);
    return true;
  } catch (error) {
    console.error('Delete comment error: ', error);
    return false;
  }
};