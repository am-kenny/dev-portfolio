import { useState } from 'react';
import config from '../../services/config.js';

const EnvDebug = () => {
  const [apiTestResult, setApiTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Check if debug mode is enabled
  const isDebugEnabled = import.meta.env.VITE_APP_DEBUG === 'true';

  const testApiConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch(config.getApiUrl('/api/health'));
      const data = await response.json();
      setApiTestResult({
        success: true,
        data,
        url: config.getApiUrl('/api/health')
      });
    } catch (error) {
      setApiTestResult({
        success: false,
        error: error.message,
        url: config.getApiUrl('/api/health')
      });
    } finally {
      setLoading(false);
    }
  };

  // Don't render if debug mode is not enabled
  if (!isDebugEnabled) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Environment Debug</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Environment Variables</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm">
{`VITE_API_HOSTNAME: ${import.meta.env.VITE_API_HOSTNAME || 'NOT SET'}
VITE_API_PORT: ${import.meta.env.VITE_API_PORT || 'NOT SET'}
VITE_APP_DEBUG: ${import.meta.env.VITE_APP_DEBUG || 'NOT SET'}
API_HOSTNAME: ${import.meta.env.API_HOSTNAME || 'NOT SET'}
API_PORT: ${import.meta.env.API_PORT || 'NOT SET'}`}
            </pre>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Configuration</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm">
{`API Base URL: ${config.apiBaseUrl}
All API URLs:`}
{JSON.stringify(config.getApiUrls(), null, 2)}
            </pre>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">API Connection Test</h3>
          <button
            onClick={testApiConnection}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test API Connection'}
          </button>
          
          {apiTestResult && (
            <div className={`mt-2 p-4 rounded-lg ${
              apiTestResult.success ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
            }`}>
              <h4 className="font-semibold mb-2">
                {apiTestResult.success ? '✅ Success' : '❌ Failed'}
              </h4>
              <div className="text-sm">
                <p><strong>URL:</strong> {apiTestResult.url}</p>
                {apiTestResult.success ? (
                  <pre className="mt-2 bg-white p-2 rounded">
                    {JSON.stringify(apiTestResult.data, null, 2)}
                  </pre>
                ) : (
                  <p><strong>Error:</strong> {apiTestResult.error}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Troubleshooting</h3>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">If environment variables are not loading:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
              <li>Create a <code>.env</code> file in the frontend root directory</li>
              <li>Add your variables: <code>VITE_API_HOSTNAME=localhost</code></li>
              <li>Restart your development server: <code>npm run dev</code></li>
              <li>Check that the Vite proxy in <code>vite.config.js</code> doesn't conflict</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvDebug; 