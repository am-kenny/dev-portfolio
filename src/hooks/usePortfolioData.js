import { useState, useEffect } from 'react';
import config from '../services/config.js';

export const usePortfolioData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sectionLoading, setSectionLoading] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(config.getApiUrl('/api/portfolio'));
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio data');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSection = async (section) => {
    try {
      setSectionLoading(prev => ({ ...prev, [section]: true }));
      const response = await fetch(config.getApiUrl(`/api/portfolio/${section}`));
      if (!response.ok) {
        throw new Error(`Failed to fetch ${section} data`);
      }
      const sectionData = await response.json();
      setData(prev => ({ ...prev, [section]: sectionData }));
      setError(null);
      return sectionData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSectionLoading(prev => ({ ...prev, [section]: false }));
    }
  };

  const updateData = async (newData, token) => {
    try {
      setLoading(true);
      const response = await fetch(config.getApiUrl('/api/portfolio'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update portfolio data');
      }

      setData(newData);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (section, newSectionData, token) => {
    try {
      setSectionLoading(prev => ({ ...prev, [section]: true }));
      const response = await fetch(config.getApiUrl(`/api/portfolio/${section}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newSectionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error === 'Validation failed'
            ? `Validation errors: ${Object.values(errorData.details).join(', ')}`
            : errorData.error || `Failed to update ${section}`
        );
      }

      setData(prev => ({ ...prev, [section]: newSectionData }));
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
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
    sectionLoading,
    updateData,
    updateSection,
    fetchSection,
    refreshData: fetchData
  };
};

export default usePortfolioData; 