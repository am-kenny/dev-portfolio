import type { PortfolioData, ErrorKind, SectionLoadingState } from './index'

export interface UsePortfolioDataResult {
  data: PortfolioData | null
  loading: boolean
  error: string | null
  errorKind: ErrorKind
  sectionLoading: SectionLoadingState
  updateData: (newData: PortfolioData, token: string) => Promise<boolean>
  updateSection: (
    section: string,
    newSectionData: unknown,
    token: string
  ) => Promise<boolean>
  fetchSection: (section: string) => Promise<unknown>
  refreshData: () => Promise<void>
}
