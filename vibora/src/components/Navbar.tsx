import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, User, Podcast } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="bg-white text-gray-800 dark:bg-gray-800 dark:text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Podcast className="h-8 w-8 text-primary-500" />
            <span className="text-2xl font-bold">Vibora</span>
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/profile"
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <User className="h-5 w-5" />
                <span>{user?.username}</span>
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate('/login')}
                  className="text-primary-600 hover:text-primary-700 px-4 py-2"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;