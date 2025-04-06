import React from 'react';
import { Link } from 'react-router-dom';
import { Thread } from '../types/thread';
import { User } from '../types/user';

interface ThreadCardProps {
  thread: Thread;
  author: User;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread, author }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <Link to={`/thread/${thread.id}`} className="block">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400">
          {thread.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Posted by {author.username}
        </p>
      </Link>
    </div>
  );
};

export default ThreadCard;