import type { ReactNode } from 'react'
import type { ExperienceTimelineSegment } from './useExperienceTimeline'

interface ExperienceTimelineRowProps {
  index: number
  jobCount: number
  segment?: ExperienceTimelineSegment
  rowRef: (el: HTMLDivElement | null) => void
  children: ReactNode
}

const ExperienceTimelineRow = ({
  index,
  jobCount,
  segment,
  rowRef,
  children,
}: ExperienceTimelineRowProps): JSX.Element => (
  <div
    ref={rowRef}
    className={`relative pl-8 ${index !== jobCount - 1 ? 'pb-12' : ''}`}
  >
    {index !== jobCount - 1 && (
      <div
        className="absolute left-[9px] top-6 w-0.5 overflow-hidden pointer-events-none"
        style={{ height: segment?.heightPx ?? 1 }}
        aria-hidden
      >
        <div
          className="h-full w-full origin-top bg-blue-200 dark:bg-blue-800"
          style={{
            transform: `scaleY(${segment?.progress ?? 0})`,
            transformOrigin: 'top center',
          }}
        />
      </div>
    )}
    <div className="absolute left-0 top-2 z-[1] w-5 h-5 rounded-full border-4 border-blue-500 bg-white dark:bg-gray-900" />
    {children}
  </div>
)

export default ExperienceTimelineRow
