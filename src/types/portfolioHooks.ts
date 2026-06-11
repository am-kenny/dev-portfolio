import type { PortfolioData, ErrorKind } from './index'

export interface UsePortfolioDataResult {
  data: PortfolioData | null
  loading: boolean
  error: string | null
  errorKind: ErrorKind
  refreshData: () => Promise<void>
}
