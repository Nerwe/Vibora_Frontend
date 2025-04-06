import { Link } from 'react-router-dom';
import ThreadCard from '../components/ThreadCard';
import PostCard from '../components/PostCard';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAllThreads } from '../services/threads';
import { getAllPosts } from '../services/posts';
import { Thread } from '../types/thread';
import { Post } from '../types/post';
import { getUser } from '../services/users';
import { User } from '../types/user';
import { useEffect, useState } from 'react';

const Home = () => {
  const { user: currentUser } = useAuth();
  const [topThreads, setTopThreads] = useState<Thread[]>([]);
  const [topPosts, setTopPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all threads and posts
        const threads = await getAllThreads();
        const posts = await getAllPosts();

        // Fetch users for author data
        const uniqueUserIds = Array.from(new Set([...threads.map(t => t.userID), ...posts.map(p => p.userID)]));
        const fetchedUsers = await Promise.all(uniqueUserIds.map(id => getUser(id)));
        setUsers(fetchedUsers);

        // Calculate top threads based on total post scores
        const threadsWithRatings = threads.map(thread => ({
          ...thread,
          totalRating: posts
            .filter(post => post.threadID === thread.id)
            .reduce((sum, post) => sum + post.score, 0),
        }));
        const sortedThreads = threadsWithRatings
          .sort((a, b) => b.totalRating - a.totalRating)
          .slice(0, 3);
        setTopThreads(sortedThreads);

        // Get top 5 posts by score
        const sortedPosts = posts.sort((a, b) => b.score - a.score).slice(0, 5);
        setTopPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getAuthor = (userID: string): User | undefined => users.find(user => user.id === userID);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to Vibora
        </h1>
        {currentUser && (
          <Link
            to="/new-thread"
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            New Thread
          </Link>
        )}
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Popular Threads
        </h2>
        <div className="space-y-4">
          {topThreads.map(thread => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              author={getAuthor(thread.userID) || { id: '', email: '', username: 'Unknown', password: '', createdDate: '', lastActiveDate: '', roles: [] }}
            />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Top Posts
        </h2>
        <div className="space-y-6">
          {topPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              author={getAuthor(post.userID) || { id: '', email: '', username: 'Unknown', password: '', createdDate: '', lastActiveDate: '', roles: [] }}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;