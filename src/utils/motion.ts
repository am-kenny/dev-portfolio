/** Shared media query — keep in sync with `@media (prefers-reduced-motion: reduce)` in CSS. */
export const PREFERS_REDUCED_MOTION_MQ = '(prefers-reduced-motion: reduce)'

/** Synchronous check — safe in layout effects and `useSyncExternalStore` snapshots. */
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia(PREFERS_REDUCED_MOTION_MQ).matches

export const getReducedMotionMediaQuery = (): MediaQueryList | null =>
  typeof window !== 'undefined'
    ? window.matchMedia(PREFERS_REDUCED_MOTION_MQ)
    : null
