import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EnvDebug from '../components/debug/EnvDebug';

const Debug = () => {
  const navigate = useNavigate();
  
  // Check if debug mode is enabled
  const isDebugEnabled = import.meta.env.VITE_APP_DEBUG === 'true';
  
  useEffect(() => {
    // Redirect to home if debug mode is not enabled
    if (!isDebugEnabled) {
      navigate('/');
    }
  }, [isDebugEnabled, navigate]);
  
  // Don't render anything if debug mode is not enabled
  if (!isDebugEnabled) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Debug Page</h1>
          <p className="text-gray-600">Environment and configuration debugging tools</p>
        </div>
        
        <EnvDebug />
      </div>
    </div>
  );
};

export default Debug; 