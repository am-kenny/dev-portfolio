import { createContext, useContext } from 'react'
import usePortfolioData from '../hooks/usePortfolioData'
import type { ReactNode } from 'react'
import type { UsePortfolioDataResult } from '../types/portfolioHooks'

const PortfolioContext = createContext<UsePortfolioDataResult | null>(null)

export interface PortfolioProviderProps {
  children: ReactNode
}

export const PortfolioProvider = ({
  children,
}: PortfolioProviderProps): JSX.Element => {
  const portfolioData = usePortfolioData()

  return (
    <PortfolioContext.Provider value={portfolioData}>
      {children}
    </PortfolioContext.Provider>
  )
}

export const usePortfolio = (): UsePortfolioDataResult => {
  const context = useContext(PortfolioContext)
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider')
  }
  return context
}

export default PortfolioContext
