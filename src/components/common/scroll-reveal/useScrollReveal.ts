import {
  type MutableRefObject,
  type Ref,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import {
  useLoadTransition,
  useScrollRevealAllowed,
} from '../../../context/LoadTransitionContext'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import {
  resolveIntersectionOptions,
  subscribeIntersection,
} from '../../../utils/intersection'
import { isRevealed, type RevealMode } from './revealMode'

const SCROLL_REVEAL_IO = resolveIntersectionOptions()

const applyCrossfadeVisible = (
  setMode: (value: RevealMode | ((current: RevealMode) => RevealMode)) => void,
  wasShownDuringCrossfadeRef: MutableRefObject<boolean>
): void => {
  wasShownDuringCrossfadeRef.current = true
  setMode((current) =>
    current === 'settled' || current === 'animating' ? current : 'crossfade'
  )
}

const applyReveal = (
  setMode: (value: RevealMode) => void,
  instant: boolean
): void => {
  setMode(instant ? 'settled' : 'animating')
}

/**
 * Scroll-triggered reveal with optional load-crossfade handoff.
 * Uses a single native `IntersectionObserver` per element until revealed.
 */
export const useScrollReveal = (): {
  ref: Ref<HTMLDivElement>
  mode: RevealMode
} => {
  const { phase, fromCrossfade } = useLoadTransition()
  const scrollRevealAllowed = useScrollRevealAllowed()
  const reducedMotion = usePrefersReducedMotion()

  const ref = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<RevealMode>('hidden')
  const [intersecting, setIntersecting] = useState(false)
  const wasShownDuringCrossfadeRef = useRef(false)
  const handoffDoneRef = useRef(false)
  const intersectingRef = useRef(false)
  const disconnectRef = useRef<(() => void) | null>(null)
  const modeRef = useRef(mode)
  modeRef.current = mode

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return

    disconnectRef.current = subscribeIntersection(
      el,
      SCROLL_REVEAL_IO,
      (visible) => {
        if (isRevealed(modeRef.current)) return
        intersectingRef.current = visible
        setIntersecting(visible)
      }
    )

    return () => {
      disconnectRef.current?.()
      disconnectRef.current = null
    }
  }, [reducedMotion])

  useLayoutEffect(() => {
    if (!isRevealed(mode)) return
    disconnectRef.current?.()
    disconnectRef.current = null
  }, [mode])

  useLayoutEffect(() => {
    if (reducedMotion) return
    if (!fromCrossfade || phase !== 'transitioning' || !intersecting) return
    applyCrossfadeVisible(setMode, wasShownDuringCrossfadeRef)
  }, [phase, fromCrossfade, intersecting, reducedMotion])

  useLayoutEffect(() => {
    if (reducedMotion) return
    if (!fromCrossfade || phase !== 'ready' || handoffDoneRef.current) return

    handoffDoneRef.current = true

    if (wasShownDuringCrossfadeRef.current) {
      applyReveal(setMode, true)
      return
    }

    if (intersecting) {
      applyReveal(setMode, false)
    }
  }, [phase, fromCrossfade, intersecting, reducedMotion])

  useLayoutEffect(() => {
    if (reducedMotion) return
    if (!scrollRevealAllowed || mode !== 'hidden' || !intersecting) return
    applyReveal(setMode, false)
  }, [scrollRevealAllowed, mode, intersecting, reducedMotion])

  useEffect(() => {
    if (reducedMotion || !fromCrossfade || phase !== 'ready') return
    if (isRevealed(modeRef.current)) return

    const tryAfterScrollRestore = (): void => {
      if (isRevealed(modeRef.current) || !intersectingRef.current) return
      applyReveal(setMode, wasShownDuringCrossfadeRef.current)
    }

    window.addEventListener('pageshow', tryAfterScrollRestore)
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(tryAfterScrollRestore)
    })

    return () => {
      window.removeEventListener('pageshow', tryAfterScrollRestore)
      cancelAnimationFrame(raf)
    }
  }, [phase, fromCrossfade, reducedMotion])

  return {
    ref,
    mode: reducedMotion ? 'settled' : mode,
  }
}
