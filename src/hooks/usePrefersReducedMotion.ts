import { useSyncExternalStore } from 'react'

import {
  getReducedMotionMediaQuery,
  prefersReducedMotion,
} from '../utils/motion'

const subscribeReducedMotion = (onStoreChange: () => void): (() => void) => {
  const mq = getReducedMotionMediaQuery()
  if (!mq) return () => {}
  mq.addEventListener('change', onStoreChange)
  return () => mq.removeEventListener('change', onStoreChange)
}

/** Reactive `prefers-reduced-motion` — updates when the OS setting changes mid-session. */
export const usePrefersReducedMotion = (): boolean =>
  useSyncExternalStore(
    subscribeReducedMotion,
    prefersReducedMotion,
    () => false
  )
