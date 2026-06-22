import { type CSSProperties, type ReactNode } from 'react'

import { useLoadTransition } from '../../../context/LoadTransitionContext'
import { revealClassName } from './revealMode'
import { useScrollReveal } from './useScrollReveal'

export interface ScrollRevealProps {
  children: ReactNode
  className?: string
  /** List position; used with `staggerMs` for `animation-delay`. */
  index?: number
  staggerMs?: number
}

/**
 * Fades and slides content in when it enters the viewport. Siblings can pass
 * increasing `index` for a staggered sequence. Respects `prefers-reduced-motion`.
 */
const ScrollReveal = ({
  children,
  className = '',
  index = 0,
  staggerMs = 10,
}: ScrollRevealProps): JSX.Element => {
  const { fromCrossfade } = useLoadTransition()
  const { ref, mode } = useScrollReveal()

  const revealClass = revealClassName(mode, fromCrossfade)

  const delayStyle: CSSProperties | undefined =
    mode === 'animating'
      ? ({ '--reveal-delay': `${index * staggerMs}ms` } as CSSProperties)
      : undefined

  return (
    <div
      ref={ref}
      className={`scroll-reveal${revealClass ? ` ${revealClass}` : ''} ${className}`.trim()}
      style={delayStyle}
    >
      {children}
    </div>
  )
}

export default ScrollReveal
