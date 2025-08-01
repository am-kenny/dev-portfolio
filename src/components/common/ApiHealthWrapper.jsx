import { useState, useEffect } from 'react';
import apiHealthService from '../../services/apiHealth';
import ApiUnavailablePage from './ApiUnavailablePage';

const ApiHealthWrapper = ({ children, fallback = null }) => {
  const [apiAvailable, setApiAvailable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkApiHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const isAvailable = await apiHealthService.checkApiHealth();
      setApiAvailable(isAvailable);
      
      if (!isAvailable) {
        setError('API_UNAVAILABLE');
      }
    } catch (err) {
      setError('API_UNAVAILABLE');
      setApiAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkApiHealth();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-xl">Checking connection...</div>
        </div>
      </div>
    );
  }

  // Show API unavailable page
  if (error === 'API_UNAVAILABLE' || apiAvailable === false) {
    return <ApiUnavailablePage onRetry={checkApiHealth} />;
  }

  // Show fallback if provided and API is not available
  if (fallback && !apiAvailable) {
    return fallback;
  }

  // Show children when API is available
  return children;
};

export default ApiHealthWrapper; 