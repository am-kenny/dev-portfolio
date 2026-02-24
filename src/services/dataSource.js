/**
 * Data source configuration for portfolio data.
 * Modes: api (backend API + admin), embedded (static JSON in app), external (e.g. S3 URL).
 * Configure via environment variables.
 */

const VALID_SOURCES = ['api', 'embedded', 'external'];

const getDataSource = () => {
  const raw = import.meta.env.VITE_DATA_SOURCE || 'api';
  const normalized = raw.toLowerCase().trim();
  return VALID_SOURCES.includes(normalized) ? normalized : 'api';
};

const getEmbeddedPath = () => {
  return import.meta.env.VITE_EMBEDDED_JSON_PATH || '/data/portfolio.json';
};

const getExternalUrl = () => {
  return import.meta.env.VITE_EXTERNAL_JSON_URL || '';
};

/**
 * Current data source: 'api' | 'embedded' | 'external'
 */
export const dataSource = getDataSource();

/**
 * Whether the admin panel and API editing are available (only when source is 'api').
 */
export const isAdminEnabled = () => dataSource === 'api';

/**
 * URL to fetch portfolio JSON for read-only modes. Null for api or when misconfigured.
 * - embedded: same-origin path (e.g. /data/portfolio.json)
 * - external: full URL (e.g. https://bucket.s3.amazonaws.com/portfolio.json)
 */
export const getPortfolioDataUrl = () => {
  if (dataSource === 'embedded') {
    const path = getEmbeddedPath();
    return path.startsWith('http')
      ? path
      : `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`;
  }
  if (dataSource === 'external') {
    const url = getExternalUrl()?.trim();
    return url || null;
  }
  return null;
};

/**
 * Returns a user-facing error message if the data source is misconfigured, otherwise null.
 */
export const getDataSourceConfigError = () => {
  if (dataSource === 'external') {
    const url = getExternalUrl()?.trim();
    if (!url) {
      return 'External storage is selected but VITE_EXTERNAL_JSON_URL is not set or is empty. Set it in .env to the full URL of your portfolio JSON (e.g. S3 or CDN).';
    }
  }
  if (dataSource === 'embedded') {
    const path = getEmbeddedPath()?.trim();
    if (!path) {
      return 'Embedded storage is selected but VITE_EMBEDDED_JSON_PATH is not set or is empty. Set it in .env (e.g. /data/portfolio.json).';
    }
  }
  return null;
};

export default { dataSource, isAdminEnabled, getPortfolioDataUrl, getDataSourceConfigError, getEmbeddedPath, getExternalUrl };
