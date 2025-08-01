import { useState, useEffect } from 'react';
import { retryManager } from '../../utils/retry';

const OfflineIndicator = ({ onRetry, isOffline, retrying }) => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (isOffline) {
      setShowBanner(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => setShowBanner(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowBanner(false);
    }
  }, [isOffline]);

  if (!isOffline && !showBanner) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-yellow-800">
              {isOffline ? 'Offline Mode' : 'Connection Restored'}
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              {isOffline ? (
                <p>
                  You're viewing cached data. Some features may be limited.
                  {onRetry && (
                    <button
                      onClick={onRetry}
                      disabled={retrying}
                      className="ml-2 text-yellow-800 underline hover:text-yellow-900 disabled:opacity-50"
                    >
                      {retrying ? 'Retrying...' : 'Retry Connection'}
                    </button>
                  )}
                </p>
              ) : (
                <p>Connection restored. Data is now live.</p>
              )}
            </div>
          </div>
          <div className="ml-auto pl-3">
            <button
              onClick={() => setShowBanner(false)}
              className="inline-flex text-yellow-400 hover:text-yellow-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineIndicator; 