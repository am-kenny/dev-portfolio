import { useCallback, useEffect, useState } from 'react'

import {
  getDataSourceConfigError,
  getPortfolioDataUrl,
} from '../services/dataSource'
import type { ErrorKind, PortfolioData } from '../types'
import type { UsePortfolioDataResult } from '../types/portfolioHooks'

const fetchJson = async <T>(url: string): Promise<T> => {
  let response: Response
  try {
    response = await fetch(url, { cache: 'no-cache' })
  } catch {
    throw new Error('Network error while loading portfolio data.')
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch portfolio data (HTTP ${response.status})`)
  }
  try {
    return (await response.json()) as T
  } catch {
    throw new Error('Invalid JSON in portfolio data.')
  }
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
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Data is not available.'
      setError(message)
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
