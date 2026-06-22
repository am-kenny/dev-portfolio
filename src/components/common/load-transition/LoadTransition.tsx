import {
  type CSSProperties,
  type ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import {
  LOAD_TRANSITION_STAGGER_MS,
  readLoadTransitionMs,
} from '../../../constants/loadTransition'
import {
  LoadTransitionContext,
  type LoadTransitionContextValue,
  type LoadTransitionPhase,
} from '../../../context/LoadTransitionContext'

export type { LoadTransitionPhase }

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
  const [fromCrossfade, setFromCrossfade] = useState(false)
  const prevLoadingRef = useRef(loading)
  const crossfadeStartedRef = useRef(false)
  const readyTimerRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  /** First render after `loading` flips false, before layout effects run. */
  const enteringCrossfade = prevLoadingRef.current && !loading
  const effectiveFromCrossfade = fromCrossfade || enteringCrossfade
  const effectivePhase: LoadTransitionPhase = loading
    ? 'loading'
    : enteringCrossfade && phase === 'loading'
      ? 'transitioning'
      : phase

  useLayoutEffect(() => {
    onPhaseChange?.(effectivePhase)
  }, [effectivePhase, onPhaseChange])

  useLayoutEffect(() => {
    const wasLoading = prevLoadingRef.current
    prevLoadingRef.current = loading

    if (loading) {
      crossfadeStartedRef.current = false
      if (readyTimerRef.current !== null) {
        window.clearTimeout(readyTimerRef.current)
        readyTimerRef.current = null
      }
      setFromCrossfade(false)
      setPhase('loading')
      return
    }

    if (crossfadeStartedRef.current) return
    if (!wasLoading) return

    crossfadeStartedRef.current = true
    setFromCrossfade(true)
    setPhase('transitioning')

    const duration = readLoadTransitionMs()
    const stagger = revealIndex * LOAD_TRANSITION_STAGGER_MS
    readyTimerRef.current = window.setTimeout(() => {
      readyTimerRef.current = null
      setPhase('ready')
    }, duration + stagger)
  }, [loading, revealIndex])

  useLayoutEffect(() => {
    return () => {
      if (readyTimerRef.current !== null) {
        window.clearTimeout(readyTimerRef.current)
      }
    }
  }, [])

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return

    if (effectivePhase === 'loading') {
      el.style.minHeight = ''
      return
    }

    if (effectivePhase === 'transitioning') {
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
  }, [effectivePhase, loading])

  const showLoader =
    effectivePhase === 'loading' || effectivePhase === 'transitioning'
  const showContent = !loading
  const loaderExiting = effectivePhase === 'transitioning'
  const overlayLoader = effectivePhase === 'transitioning'
  const loaderHiddenFromAT = effectivePhase !== 'loading'
  const contentClassName = [
    'load-transition__content',
    effectivePhase === 'transitioning' && 'load-transition__content--enter',
    effectivePhase === 'ready' && 'load-transition__content--ready',
  ]
    .filter(Boolean)
    .join(' ')

  const delayStyle = {
    '--load-reveal-delay': `${revealIndex * LOAD_TRANSITION_STAGGER_MS}ms`,
  } as CSSProperties

  const transitionContext: LoadTransitionContextValue = {
    phase: effectivePhase,
    fromCrossfade: effectiveFromCrossfade,
  }

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
        <div ref={contentRef} className={contentClassName}>
          <LoadTransitionContext.Provider value={transitionContext}>
            {children}
          </LoadTransitionContext.Provider>
        </div>
      )}
    </div>
  )
}

export default LoadTransition
