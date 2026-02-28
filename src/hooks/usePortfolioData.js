import { useState, useEffect } from 'react';
import config from '../services/config.js';
import { dataSource, getPortfolioDataUrl, getDataSourceConfigError, isAdminEnabled } from '../services/dataSource.js';

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
  return response.json();
};

const apiPut = async (url, body, token) => {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  const errorData = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = errorData.error === 'Validation failed'
      ? `Validation errors: ${Object.values(errorData.details || {}).join(', ')}`
      : errorData.error || `Request failed: ${response.status}`;
    throw new Error(message);
  }
  return errorData;
};

export const usePortfolioData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorKind, setErrorKind] = useState(null); // 'config' | 'unavailable'
  const [sectionLoading, setSectionLoading] = useState({});

  const portfolioDataUrl = getPortfolioDataUrl();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setErrorKind(null);

      if (isAdminEnabled()) {
        setData(await fetchJson(config.getApiUrl('/api/portfolio')));
      } else if (portfolioDataUrl) {
        setData(await fetchJson(portfolioDataUrl));
      } else {
        setError(getDataSourceConfigError() || 'Data source misconfigured. Check .env and VITE_DATA_SOURCE, VITE_EMBEDDED_JSON_PATH, or VITE_EXTERNAL_JSON_URL.');
        setErrorKind('config');
      }
    } catch (err) {
      setError('Data is not available.');
      setErrorKind('unavailable');
    } finally {
      setLoading(false);
    }
  };

  const fetchSection = async (section) => {
    if (!isAdminEnabled()) {
      return Promise.resolve(data?.[section] ?? null);
    }
    try {
      setSectionLoading(prev => ({ ...prev, [section]: true }));
      const sectionData = await fetchJson(config.getApiUrl(`/api/portfolio/${section}`));
      setData(prev => ({ ...prev, [section]: sectionData }));
      setError(null);
      setErrorKind(null);
      return sectionData;
    } catch (err) {
      setError(err.message);
      setErrorKind('unavailable');
      throw err;
    } finally {
      setSectionLoading(prev => ({ ...prev, [section]: false }));
    }
  };

  const updateData = async (newData, token) => {
    if (!isAdminEnabled()) return false;
    try {
      setLoading(true);
      await apiPut(config.getApiUrl('/api/portfolio'), newData, token);
      setData(newData);
      setError(null);
      setErrorKind(null);
      return true;
    } catch (err) {
      setError(err.message);
      setErrorKind('unavailable');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (section, newSectionData, token) => {
    if (!isAdminEnabled()) return true;
    try {
      setSectionLoading(prev => ({ ...prev, [section]: true }));
      await apiPut(config.getApiUrl(`/api/portfolio/${section}`), newSectionData, token);
      setData(prev => ({ ...prev, [section]: newSectionData }));
      setError(null);
      setErrorKind(null);
      return true;
    } catch (err) {
      setError(err.message);
      setErrorKind('unavailable');
      throw err;
    } finally {
      setSectionLoading(prev => ({ ...prev, [section]: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    errorKind,
    sectionLoading,
    updateData,
    updateSection,
    fetchSection,
    refreshData: fetchData
  };
};

export default usePortfolioData;
