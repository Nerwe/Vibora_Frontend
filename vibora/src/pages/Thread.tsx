import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { getThreadById, deleteThread } from '../services/threads';
import { createPost, getAllPostsByThreadId } from '../services/posts';
import { getUser } from '../services/users';
import { Thread } from '../types/thread';
import { Post } from '../types/post';
import { User } from '../types/user';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2 } from 'lucide-react';

const ThreadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [thread, setThread] = useState<Thread | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchThreadData = async () => {
      try {
        if (id) {
          const threadData = await getThreadById(id);
          const threadPosts = await getAllPostsByThreadId(id);

          if (threadData) {
            setThread(threadData);
          }

          setPosts(threadPosts);

          const uniqueUserIds = Array.from(new Set(threadPosts.map(post => post.userID)));
          const fetchedUsers = await Promise.all(uniqueUserIds.map(userId => getUser(userId)));
          setUsers(fetchedUsers);
        }
      } catch (err) {
        console.error('Error fetching thread data:', err);
      }
    };

    fetchThreadData();
  }, [id]);

  const getAuthor = (userId: string): User | undefined => users.find(user => user.id === userId);

  const handleNewPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thread || !currentUser) return;

    try {
      const newPost = await createPost({
        threadID: thread.id,
        userID: currentUser.id,
        title: newPostTitle,
        content: newPostContent,
      });

      if (newPost) {
        setPosts(prevPosts => [newPost, ...prevPosts]);
        setNewPostTitle('');
        setNewPostContent('');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    }
  };

  const handleDeleteThread = async () => {
    if (!thread) return;

    try {
      await deleteThread(thread.id);
      navigate('/');
    } catch (err) {
      console.error('Error deleting thread:', err);
      setError('Failed to delete thread. Please try again.');
    }
  };

  if (!thread) {
    return <div>Thread not found</div>;
  }

  const canDelete =
    currentUser &&
    (currentUser.roles.includes('Admin') || currentUser.roles.includes('Moderator') ||
      currentUser.id === thread.userID);

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{thread.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Started by {getAuthor(thread.userID)?.username || 'Unknown'}
            </p>
          </div>
          {canDelete && (
            <button
              onClick={handleDeleteThread}
              className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-2"
              title="Delete thread"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {currentUser && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            New Post
          </h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleNewPost} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={newPostTitle}
                onChange={e => setNewPostTitle(e.target.value)}
                className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Content
              </label>
              <textarea
                id="content"
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Create Post
            </button>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {posts.map(post => (
          <PostCard key={post.id} post={post} author={getAuthor(post.userID) || { id: '', username: 'Unknown', email: '', password: '', createdDate: '', lastActiveDate: '', roles: [] }} />
        ))}
      </div>
    </div>
  );
};

export default ThreadPage;