import { type ElementType, type ReactNode, useCallback, useState } from 'react'
import LoadTransition, { type LoadTransitionPhase } from './LoadTransition'
import SectionContent, { type SectionContentMaxWidth } from './SectionContent'
import { SectionSkeletonBody } from './LoadingSkeleton'
import { sectionSkeletonFromId } from './sectionSkeletonVariant'

export interface SectionLoadTransitionProps {
  id: string
  loading: boolean
  className?: string
  maxWidth?: SectionContentMaxWidth | false
  revealIndex?: number
  statusLabel?: string
  ariaLabelledBy?: string
  as?: ElementType
  children: ReactNode
}

const isBusyPhase = (phase: LoadTransitionPhase): boolean =>
  phase === 'loading' || phase === 'transitioning'

/** Section shell with skeleton → content crossfade. */
const SectionLoadTransition = ({
  id,
  loading,
  className = 'py-20',
  maxWidth = '5xl',
  revealIndex = 0,
  statusLabel = 'Loading section',
  ariaLabelledBy,
  as: Wrapper = 'section',
  children,
}: SectionLoadTransitionProps): JSX.Element => {
  const variant = sectionSkeletonFromId(id)
  const [sectionBusy, setSectionBusy] = useState(loading)

  const handlePhaseChange = useCallback((phase: LoadTransitionPhase) => {
    setSectionBusy(isBusyPhase(phase))
  }, [])

  const body = (
    <LoadTransition
      loading={loading}
      revealIndex={revealIndex}
      onPhaseChange={handlePhaseChange}
      loader={
        <div role="status" aria-live="polite">
          <span className="sr-only">{statusLabel}</span>
          <SectionSkeletonBody variant={variant} />
        </div>
      }
    >
      {children}
    </LoadTransition>
  )

  return (
    <Wrapper
      id={id}
      className={className}
      aria-busy={sectionBusy || undefined}
      aria-labelledby={loading ? undefined : ariaLabelledBy}
    >
      {maxWidth === false ? (
        body
      ) : (
        <SectionContent maxWidth={maxWidth}>{body}</SectionContent>
      )}
    </Wrapper>
  )
}

export default SectionLoadTransition
