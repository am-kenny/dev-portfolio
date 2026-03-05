import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import EnvDebug from '../components/debug/EnvDebug'
import ThemeToggle from '../components/common/ThemeToggle'

const Debug = (): JSX.Element | null => {
  const navigate = useNavigate()

  const isDebugEnabled = import.meta.env.VITE_APP_DEBUG === 'true'

  useEffect(() => {
    if (!isDebugEnabled) {
      navigate('/')
    }
  }, [isDebugEnabled, navigate])

  if (!isDebugEnabled) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Debug Page
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Environment and configuration debugging tools
          </p>
        </div>

        <EnvDebug />
      </div>
    </div>
  )
}

export default Debug
