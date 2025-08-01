import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { usePortfolioData } from './usePortfolioData';

export const useAdmin = () => {
  const navigate = useNavigate();
  const { data, loading, error, sectionLoading, updateSection } = usePortfolioData();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const handleSectionSave = async (section, newData) => {
    try {
      const token = authService.getToken();
      const success = await updateSection(section, newData, token);
      
      if (!success) {
        throw new Error('Failed to save changes');
      }
    } catch (err) {
      alert('Error saving changes: ' + err.message);
    }
  };

  return {
    data,
    loading,
    error,
    sectionLoading,
    handleLogout,
    handleSectionSave
  };
}; 