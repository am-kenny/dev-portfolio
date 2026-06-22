/** Bottom inset shared by scroll-reveal IO and experience timeline lead line. */
export const SCROLL_REVEAL_BOTTOM_INSET_RATIO = 0.05

export const SCROLL_REVEAL_IO = {
  rootMargin: `0px 0px -${SCROLL_REVEAL_BOTTOM_INSET_RATIO * 100}% 0px`,
  threshold: 0.08,
} as const

export interface IntersectionOptions {
  rootMargin: string
  threshold: number
}

export const resolveIntersectionOptions = (
  options: Partial<IntersectionOptions> = {}
): IntersectionOptions => ({
  rootMargin: options.rootMargin ?? SCROLL_REVEAL_IO.rootMargin,
  threshold: options.threshold ?? SCROLL_REVEAL_IO.threshold,
})

const toObserverInit = (
  options: IntersectionOptions
): IntersectionObserverInit => ({
  rootMargin: options.rootMargin,
  threshold: options.threshold,
})

/**
 * Bottom Y of the default scroll-reveal trigger zone (viewport coords).
 * Experience timeline progress uses this — not custom per-element `rootMargin`.
 */
export const getRevealLeadY = (): number => {
  if (typeof window === 'undefined') return 0
  return window.innerHeight * (1 - SCROLL_REVEAL_BOTTOM_INSET_RATIO)
}

/**
 * Subscribe to native `IntersectionObserver` updates for one element.
 * Applies any records already queued via `takeRecords()` before the first frame.
 */
export const subscribeIntersection = (
  el: Element,
  options: IntersectionOptions,
  onIntersecting: (intersecting: boolean) => void
): (() => void) => {
  const observer = new IntersectionObserver((entries) => {
    const entry = entries[entries.length - 1]
    if (entry) onIntersecting(entry.isIntersecting)
  }, toObserverInit(options))

  observer.observe(el)

  const initial = observer.takeRecords()
  if (initial.length > 0) {
    onIntersecting(initial.some((entry) => entry.isIntersecting))
  }

  return () => observer.disconnect()
}

/** One-shot native IO read (for tests and rare sync probes). */
export const readIntersection = (
  el: Element,
  options: IntersectionOptions
): boolean | undefined => {
  let result: boolean | undefined

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (entry) result = entry.isIntersecting
  }, toObserverInit(options))

  observer.observe(el)
  const records = observer.takeRecords()
  observer.disconnect()

  if (records.length > 0) {
    return records.some((entry) => entry.isIntersecting)
  }

  return result
}
