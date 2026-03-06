/**
 * Data source configuration for portfolio data.
 * Modes:
 * - api: backend API + admin (read/write via API)
 * - embedded: static JSON in the app
 * - external: JSON stored at an external URL (e.g. S3, CDN)
 *
 * Configure via environment variables.
 */

import { VALID_DATA_SOURCES } from '../constants/dataSourceOptions'

export type DataSourceMode = 'api' | 'embedded' | 'external'

const getDataSource = (): DataSourceMode => {
  const raw = import.meta.env.VITE_DATA_SOURCE || 'api'
  const normalized = raw.toLowerCase().trim()
  return (VALID_DATA_SOURCES as readonly string[]).includes(normalized)
    ? (normalized as DataSourceMode)
    : 'embedded'
}

const getEmbeddedPath = (): string => {
  return import.meta.env.VITE_EMBEDDED_JSON_PATH || '/data/portfolio.json'
}

const getExternalUrl = (): string => {
  return import.meta.env.VITE_EXTERNAL_JSON_URL || ''
}

export const dataSource: DataSourceMode = getDataSource()

export const isAdminEnabled = (): boolean => dataSource === 'api'

export const getPortfolioDataUrl = (): string | null => {
  if (dataSource === 'embedded') {
    const path = getEmbeddedPath()
    return path.startsWith('http')
      ? path
      : `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`
  }
  if (dataSource === 'external') {
    const url = getExternalUrl()?.trim()
    return url || null
  }
  return null
}

export const getDataSourceConfigError = (): string | null => {
  if (dataSource === 'external') {
    const url = getExternalUrl()?.trim()
    if (!url) {
      return 'External storage is selected but VITE_EXTERNAL_JSON_URL is not set or is empty. Set it in .env to the full URL of your portfolio JSON (e.g. S3 or CDN).'
    }
  }
  if (dataSource === 'embedded') {
    const path = getEmbeddedPath()?.trim()
    if (!path) {
      return 'Embedded storage is selected but VITE_EMBEDDED_JSON_PATH is not set or is empty. Set it in .env (e.g. /data/portfolio.json).'
    }
  }
  return null
}

export default {
  dataSource,
  isAdminEnabled,
  getPortfolioDataUrl,
  getDataSourceConfigError,
  getEmbeddedPath,
  getExternalUrl,
}
