import { useState, useEffect, useCallback } from 'react'
import {
  getPortfolioDataUrl,
  getDataSourceConfigError,
} from '../services/dataSource'
import type { PortfolioData, ErrorKind } from '../types'
import type { UsePortfolioDataResult } from '../types/portfolioHooks'

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, { cache: 'no-cache' })
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`)
  }
  return (await response.json()) as T
}

export const usePortfolioData = (): UsePortfolioDataResult => {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [errorKind, setErrorKind] = useState<ErrorKind>(null)

  const portfolioDataUrl = getPortfolioDataUrl()

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      setErrorKind(null)

      if (portfolioDataUrl) {
        const portfolioData = await fetchJson<PortfolioData>(portfolioDataUrl)
        setData(portfolioData)
      } else {
        setError(
          getDataSourceConfigError() ||
            'Data source misconfigured. Check .env and VITE_DATA_SOURCE, VITE_EMBEDDED_JSON_PATH, or VITE_EXTERNAL_JSON_URL.'
        )
        setErrorKind('config')
      }
    } catch {
      setError('Data is not available.')
      setErrorKind('unavailable')
    } finally {
      setLoading(false)
    }
  }, [portfolioDataUrl])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    errorKind,
    refreshData: fetchData,
  }
}

export default usePortfolioData
