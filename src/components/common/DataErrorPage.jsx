import { useState } from 'react'

const DataErrorPage = ({ message, isConfigError, onRetry }) => {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    if (!onRetry) return
    setIsRetrying(true)
    try {
      await onRetry()
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="text-center max-w-lg mx-auto px-4">
        <div className="mb-8">
          <div
            className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center ${isConfigError ? 'bg-amber-500' : 'bg-red-500'}`}
          >
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">
          {isConfigError ? 'Configuration Error' : 'Data not available'}
        </h1>
        <p className="text-gray-300 mb-8 text-lg whitespace-pre-line">
          {isConfigError ? message : 'The portfolio could not be loaded.'}
        </p>

        {isConfigError && (
          <div className="text-left mb-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400">
              Check your <code className="text-amber-400">.env</code> file and
              ensure the variables for the selected data source are set. See{' '}
              <code className="text-amber-400">.env.example</code> for
              reference.
            </p>
          </div>
        )}

        {onRetry && (
          <div className="space-y-4">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
            >
              {isRetrying ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Retrying...
                </>
              ) : (
                'Try Again'
              )}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full border-2 border-white hover:bg-white hover:text-black text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              Refresh Page
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DataErrorPage
