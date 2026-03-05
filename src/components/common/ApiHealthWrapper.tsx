import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react'
import apiHealthService from '../../services/apiHealth'
import ApiUnavailablePage from './ApiUnavailablePage'

export interface ApiHealthWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  onApiRecovered?: () => void | Promise<void>
}

const ApiHealthWrapper = ({
  children,
  fallback = null,
  onApiRecovered,
}: ApiHealthWrapperProps): JSX.Element => {
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const wasUnavailableRef = useRef(false)

  const checkApiHealth = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const isAvailable = await apiHealthService.checkApiHealth()
      setApiAvailable(isAvailable)

      if (!isAvailable) {
        setError('API_UNAVAILABLE')
        wasUnavailableRef.current = true
      } else if (wasUnavailableRef.current && onApiRecovered) {
        wasUnavailableRef.current = false
        await onApiRecovered()
      }
    } catch {
      setError('API_UNAVAILABLE')
      setApiAvailable(false)
      wasUnavailableRef.current = true
    } finally {
      setLoading(false)
    }
  }, [onApiRecovered])

  useEffect(() => {
    void checkApiHealth()
  }, [checkApiHealth])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-xl">Checking connection...</div>
        </div>
      </div>
    )
  }

  if (error === 'API_UNAVAILABLE' || apiAvailable === false) {
    return <ApiUnavailablePage onRetry={checkApiHealth} />
  }

  if (fallback && !apiAvailable) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export default ApiHealthWrapper
