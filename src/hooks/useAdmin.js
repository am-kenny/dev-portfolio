import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth'
import { usePortfolioData } from './usePortfolioData'

export const useAdmin = () => {
  const navigate = useNavigate()
  const { data, loading, error, sectionLoading, updateSection, refreshData } =
    usePortfolioData()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/admin/login')
    }
  }, [navigate])

  const handleLogout = () => {
    authService.logout()
    navigate('/admin/login')
  }

  const handleSectionSave = async (section, newData) => {
    const token = authService.getToken()
    await updateSection(section, newData, token)
  }

  return {
    data,
    loading,
    error,
    sectionLoading,
    handleLogout,
    handleSectionSave,
    refreshData,
  }
}
