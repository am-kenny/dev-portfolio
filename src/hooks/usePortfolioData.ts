import { useState, useEffect, useCallback } from 'react'
import config from '../services/config'
import {
  getPortfolioDataUrl,
  getDataSourceConfigError,
  isAdminEnabled,
} from '../services/dataSource'
import type { PortfolioData, ErrorKind, SectionLoadingState } from '../types'
import type { UsePortfolioDataResult } from '../types/portfolioHooks'

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`)
  }
  return (await response.json()) as T
}

const apiPut = async (
  url: string,
  body: unknown,
  token: string
): Promise<unknown> => {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  const errorData = (await response.json().catch(() => ({}))) as {
    error?: string
    details?: unknown
  }

  if (!response.ok) {
    const message =
      errorData.error === 'Validation failed'
        ? `Validation errors: ${Object.values(
            (errorData.details as Record<string, unknown>) ?? {}
          ).join(', ')}`
        : errorData.error || `Request failed: ${response.status}`
    throw new Error(message)
  }

  return errorData
}

export const usePortfolioData = (): UsePortfolioDataResult => {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [errorKind, setErrorKind] = useState<ErrorKind>(null)
  const [sectionLoading, setSectionLoading] = useState<SectionLoadingState>({})

  const portfolioDataUrl = getPortfolioDataUrl()

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      setErrorKind(null)

      if (isAdminEnabled()) {
        const apiData = await fetchJson<PortfolioData>(
          config.getApiUrl('/api/portfolio')
        )
        setData(apiData)
      } else if (portfolioDataUrl) {
        const embeddedData = await fetchJson<PortfolioData>(portfolioDataUrl)
        setData(embeddedData)
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

  const fetchSection = async (section: string): Promise<unknown> => {
    if (!isAdminEnabled()) {
      return Promise.resolve(
        data && Object.prototype.hasOwnProperty.call(data, section)
          ? (data as Record<string, unknown>)[section]
          : null
      )
    }

    try {
      setSectionLoading((prev) => ({ ...prev, [section]: true }))
      const sectionData = await fetchJson<unknown>(
        config.getApiUrl(`/api/portfolio/${section}`)
      )
      setData((prev) => ({
        ...(prev ?? {}),
        [section]: sectionData,
      }))
      setError(null)
      setErrorKind(null)
      return sectionData
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch section.'
      setError(message)
      setErrorKind('unavailable')
      throw err
    } finally {
      setSectionLoading((prev) => ({ ...prev, [section]: false }))
    }
  }

  const updateData = async (
    newData: PortfolioData,
    token: string
  ): Promise<boolean> => {
    if (!isAdminEnabled()) return false
    try {
      setLoading(true)
      await apiPut(config.getApiUrl('/api/portfolio'), newData, token)
      setData(newData)
      setError(null)
      setErrorKind(null)
      return true
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update data.'
      setError(message)
      setErrorKind('unavailable')
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateSection = async (
    section: string,
    newSectionData: unknown,
    token: string
  ): Promise<boolean> => {
    if (!isAdminEnabled()) return true
    try {
      setSectionLoading((prev) => ({ ...prev, [section]: true }))
      await apiPut(
        config.getApiUrl(`/api/portfolio/${section}`),
        newSectionData,
        token
      )
      setData((prev) => ({
        ...(prev ?? {}),
        [section]: newSectionData,
      }))
      setError(null)
      setErrorKind(null)
      return true
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update section.'
      setError(message)
      setErrorKind('unavailable')
      throw err
    } finally {
      setSectionLoading((prev) => ({ ...prev, [section]: false }))
    }
  }

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    errorKind,
    sectionLoading,
    updateData,
    updateSection,
    fetchSection,
    refreshData: fetchData,
  }
}

export default usePortfolioData
