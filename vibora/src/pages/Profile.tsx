import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThreadCard from '../components/ThreadCard';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import { getAllThreadsByUserId } from '../services/threads';
import { getPostsByUserId } from '../services/posts';
import { Thread } from '../types/thread';
import { Post } from '../types/post';

const Profile = () => {
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  const [userThreads, setUserThreads] = useState<Thread[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const threads = await getAllThreadsByUserId(currentUser.id);
        const posts = await getPostsByUserId(currentUser.id);
        setUserThreads(threads);
        setUserPosts(posts);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentUser.username}'s Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{currentUser.email}</p>
            <p className="text-gray-600 dark:text-gray-400">
              Role: {Array.isArray(currentUser.roles) ? currentUser.roles.join(', ') : 'User'}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Member since: {new Date(currentUser.createdDate).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Threads</h2>
        {userThreads.length > 0 ? (
          <div className="space-y-4">
            {userThreads.map(thread => (
              <ThreadCard key={thread.id} thread={thread} author={currentUser} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">You haven't created any threads yet.</p>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Posts</h2>
        {userPosts.length > 0 ? (
          <div className="space-y-6">
            {userPosts.map(post => (
              <PostCard key={post.id} post={post} author={currentUser} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">You haven't created any posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;