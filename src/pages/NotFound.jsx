import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import ThemeToggle from '../components/common/ThemeToggle';

const NotFound = () => {
  useEffect(() => {
    document.title = 'Page not found - Portfolio';
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <HiOutlineExclamationCircle
            className="mx-auto w-20 h-20 text-gray-400 dark:text-gray-500"
            aria-hidden
          />
        </div>

        <p className="text-6xl font-bold text-blue-500 dark:text-blue-400 mb-2">404</p>
        <h1 className="text-2xl font-bold mb-3">Page not found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-block bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
