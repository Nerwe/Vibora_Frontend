import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types/post';
import { User } from '../types/user';
import { ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updatePost } from '../services/posts';

interface PostCardProps {
  post: Post;
  author: User;
  showModeration?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, author, showModeration = true }) => {
  const { isAuthenticated, user } = useAuth();
  const [localPost, setLocalPost] = React.useState(post);

  const canModerate = isAuthenticated && (
    user?.roles?.includes('Admin') ||
    user?.roles?.includes('Moderator')
  );

  const handleRating = async (increment: boolean) => {
    if (isAuthenticated) {
      try {
        const updatedPost = await updatePost(localPost.id, {
          score: localPost.score + (increment ? 1 : -1),
          title: localPost.title,
          content: localPost.content,
        });
        if (updatedPost) {
          setLocalPost((prev) => ({ ...prev, score: updatedPost.score }));
        }
      } catch (error) {
        console.error('Error updating post score:', error);
      }
    }
  };

  const togglePostVisibility = async (postId: string) => {
    if (canModerate) {
      try {
        const updatedPost = await updatePost(postId, {
          isHidden: !localPost.isHidden,
          title: localPost.title,
          content: localPost.content,
        });
        if (updatedPost) {
          setLocalPost((prev) => ({ ...prev, isHidden: updatedPost.isHidden })); // Обновляем локальное состояние
        }
      } catch (error) {
        console.error('Error toggling post visibility:', error);
      }
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${
        localPost.isHidden ? 'opacity-60' : ''
      }`}
    >
      <div className="flex gap-4">
        {/* Rating Section */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => handleRating(true)}
            className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            disabled={!user}
          >
            <ArrowUp className="h-6 w-6" />
          </button>
          <span className="font-semibold text-lg text-gray-900 dark:text-white">
            {localPost.score}
          </span>
          <button
            onClick={() => handleRating(false)}
            className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            disabled={!user}
          >
            <ArrowDown className="h-6 w-6" />
          </button>
        </div>

        {/* Post Content Section */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <Link to={`/post/${localPost.id}`}>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400">
                  {localPost.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Posted by {author.username} • {new Date(localPost.createdDate).toLocaleDateString()}
              </p>
            </div>

            {/* Moderation Buttons */}
            {showModeration && canModerate && (
              <button
                onClick={() => togglePostVisibility(localPost.id)}
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 p-2"
                title={localPost.isHidden ? 'Show post' : 'Hide post'}
              >
                {localPost.isHidden ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            )}
          </div>

          {/* Post Content */}
          <div className={`mt-4 ${localPost.isHidden ? 'blur-sm' : ''}`}>
            <Link to={`/post/${localPost.id}`} className="block hover:text-gray-700 dark:hover:text-gray-300">
              <p className="text-gray-800 dark:text-gray-200">{localPost.content}</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;