import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { getPostById } from '../services/posts';
import { getAllCommentsByPostId, createComment } from '../services/comments';
import { getUser } from '../services/users';
import { Post } from '../types/post';
import { Comment } from '../types/comment';
import { User } from '../types/user';
import { useAuth } from '../context/AuthContext';
import { Send, Trash2 } from 'lucide-react';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newComment, setNewComment] = useState('');
  const [, setError] = useState('');

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        if (id) {
          const postData = await getPostById(id);
          const postComments = await getAllCommentsByPostId(id);

          if (postData) {
            setPost(postData);
          }

          setComments(postComments);

          const uniqueUserIds = Array.from(new Set(postComments.map(comment => comment.userID)));
          const fetchedUsers = await Promise.all(uniqueUserIds.map(userId => getUser(userId)));
          setUsers(fetchedUsers);
        }
      } catch (err) {
        console.error('Error fetching post data:', err);
        navigate('/');
      }
    };

    fetchPostData();
  }, [id, navigate]);

  const getAuthor = (userId: string): User | undefined => users.find(user => user.id === userId);

  const handleNewComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !currentUser) return;

    try {
      const newCommentData = await createComment({
        postID: post.id,
        userID: currentUser.id,
        content: newComment,
      });

      if (newCommentData) {
        setComments(prevComments => [newCommentData, ...prevComments]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Error creating comment:', err);
      setError('Failed to create comment. Please try again.');
    }
  };

  if (!post) {
    return <div>Post not found</div>;
  }

  const canDelete =
    currentUser &&
    (currentUser.roles.some(role => role === 'Admin' || role === 'Moderator') ||
      currentUser.id === post.userID);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <PostCard post={post} author={getAuthor(post.userID) || { id: '', username: 'Unknown', email: '', password: '', createdDate: '', lastActiveDate: '', roles: [] }} showModeration={false} />
        </div>
        {canDelete && (
          <button
            onClick={() => navigate('/')}
            className="ml-4 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-2"
            title="Delete post"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Comments ({comments.length})
        </h2>

        {currentUser && (
          <form onSubmit={handleNewComment} className="space-y-4">
            <div>
              <label htmlFor="comment" className="sr-only">
                Add a comment
              </label>
              <textarea
                id="comment"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                rows={3}
                className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Add a comment..."
                required
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Send className="h-4 w-4" />
              Post Comment
            </button>
          </form>
        )}

        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {getAuthor(comment.userID)?.username || 'Unknown'} •{' '}
                    {new Date(comment.createdDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-900 dark:text-white">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;