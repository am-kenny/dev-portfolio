import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  LOAD_TRANSITION_STAGGER_MS,
  readLoadTransitionMs,
} from '../../constants/loadTransition'

export type LoadTransitionPhase = 'loading' | 'transitioning' | 'ready'

export interface LoadTransitionProps {
  loading: boolean
  loader: ReactNode
  children: ReactNode
  /** Stagger content reveal across sections (0 = hero, 1 = about, …). */
  revealIndex?: number
  className?: string
  onPhaseChange?: (phase: LoadTransitionPhase) => void
}

/**
 * Crossfades loader → content when portfolio data arrives.
 * Loader overlays content during the fade so layout height stays stable.
 */
const LoadTransition = ({
  loading,
  loader,
  children,
  revealIndex = 0,
  className = '',
  onPhaseChange,
}: LoadTransitionProps): JSX.Element => {
  const [phase, setPhase] = useState<LoadTransitionPhase>(
    loading ? 'loading' : 'ready'
  )
  const wasLoading = useRef(loading)
  const containerRef = useRef<HTMLDivElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onPhaseChange?.(phase)
  }, [phase, onPhaseChange])

  useEffect(() => {
    if (loading) {
      wasLoading.current = true
      setPhase('loading')
      return
    }

    if (wasLoading.current) {
      wasLoading.current = false
      setPhase('transitioning')
      const duration = readLoadTransitionMs()
      const timer = window.setTimeout(() => setPhase('ready'), duration)
      return () => window.clearTimeout(timer)
    }

    setPhase('ready')
  }, [loading])

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return

    if (phase === 'loading') {
      el.style.minHeight = ''
      return
    }

    if (phase === 'transitioning') {
      const loaderH = loaderRef.current?.offsetHeight ?? 0
      const contentH = contentRef.current?.offsetHeight ?? 0
      el.style.minHeight = `${Math.max(loaderH, contentH)}px`
      return
    }

    const contentH = contentRef.current?.offsetHeight ?? 0
    if (contentH > 0) {
      el.style.minHeight = `${contentH}px`
    }
    requestAnimationFrame(() => {
      el.style.minHeight = ''
    })
  }, [phase, loading])

  const showLoader = phase === 'loading' || phase === 'transitioning'
  const showContent = !loading
  const contentActive = phase === 'transitioning' || phase === 'ready'
  const loaderExiting = phase === 'transitioning'
  const overlayLoader = phase === 'transitioning'
  const loaderHiddenFromAT = phase !== 'loading'
  const contentHiddenFromAT = phase !== 'ready'

  const delayStyle = {
    '--load-reveal-delay': `${revealIndex * LOAD_TRANSITION_STAGGER_MS}ms`,
  } as CSSProperties

  return (
    <div
      ref={containerRef}
      className={`load-transition${overlayLoader ? ' load-transition--overlay' : ''} ${className}`.trim()}
      style={delayStyle}
    >
      {showLoader && (
        <div
          ref={loaderRef}
          className={`load-transition__loader${loaderExiting ? ' load-transition__loader--exit' : ''}`}
          aria-hidden={loaderHiddenFromAT || undefined}
        >
          {loader}
        </div>
      )}
      {showContent && (
        <div
          ref={contentRef}
          className={`load-transition__content${contentActive ? ' load-transition__content--enter' : ''}`}
          aria-hidden={contentHiddenFromAT || undefined}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default LoadTransition
