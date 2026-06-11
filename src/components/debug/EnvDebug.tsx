import { dataSource, getPortfolioDataUrl } from '../../services/dataSource'

const EnvDebug = (): JSX.Element | null => {
  const isDebugEnabled = import.meta.env.VITE_APP_DEBUG === 'true'

  if (!isDebugEnabled) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Environment Debug
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Environment Variables</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm">
              {`VITE_DATA_SOURCE: ${
                import.meta.env.VITE_DATA_SOURCE ||
                'NOT SET (default: embedded)'
              }
VITE_EMBEDDED_JSON_PATH: ${import.meta.env.VITE_EMBEDDED_JSON_PATH || 'NOT SET'}
VITE_EXTERNAL_JSON_URL: ${import.meta.env.VITE_EXTERNAL_JSON_URL || 'NOT SET'}
VITE_APP_NAME: ${import.meta.env.VITE_APP_NAME || 'NOT SET (default: Portfolio)'}
VITE_APP_DEBUG: ${import.meta.env.VITE_APP_DEBUG || 'NOT SET'}`}
            </pre>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Data source</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm">
              {`Mode: ${dataSource}
Portfolio data URL: ${getPortfolioDataUrl() || '(not configured)'}`}
            </pre>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Troubleshooting</h3>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">
              If environment variables are not loading:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
              <li>
                Create a <code>.env</code> file in the frontend root directory
              </li>
              <li>
                Add your variables, e.g. <code>VITE_DATA_SOURCE=embedded</code>
              </li>
              <li>
                Restart your development server: <code>npm run dev</code>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnvDebug
