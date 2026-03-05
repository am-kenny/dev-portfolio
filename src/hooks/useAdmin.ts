import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth'
import { usePortfolioData } from './usePortfolioData'
import type { PortfolioData, SectionLoadingState } from '../types'

export interface UseAdminResult {
  data: PortfolioData | null
  loading: boolean
  error: string | null
  sectionLoading: SectionLoadingState
  handleLogout: () => void
  handleSectionSave: (section: string, newData: unknown) => Promise<void>
  refreshData: () => Promise<void>
}

export const useAdmin = (): UseAdminResult => {
  const navigate = useNavigate()
  const { data, loading, error, sectionLoading, updateSection, refreshData } =
    usePortfolioData()

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/admin/login')
    }
  }, [navigate])

  const handleLogout = (): void => {
    authService.logout()
    navigate('/admin/login')
  }

  const handleSectionSave = async (
    section: string,
    newData: unknown
  ): Promise<void> => {
    const token = authService.getToken()
    if (!token) {
      throw new Error('Not authenticated.')
    }
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
