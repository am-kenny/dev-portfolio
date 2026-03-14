import type { ReactNode } from 'react'

export type SectionContentMaxWidth = '4xl' | '5xl'

export interface SectionContentProps {
  children: ReactNode
  /** Max width of the content area; keeps section layout consistent across the site. */
  maxWidth?: SectionContentMaxWidth
  className?: string
}

const maxWidthClasses: Record<SectionContentMaxWidth, string> = {
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
}

/**
 * Single wrapper for portfolio section content: centered container with
 * consistent padding and optional max-width. Use one per section for
 * consistent layout and a single place to change spacing/width.
 */
const SectionContent = ({
  children,
  maxWidth = '5xl',
  className = '',
}: SectionContentProps): JSX.Element => (
  <div
    className={`container mx-auto px-4 ${maxWidthClasses[maxWidth]} ${className}`.trim()}
  >
    {children}
  </div>
)

export default SectionContent
