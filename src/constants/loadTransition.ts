/** Fallback when `--load-transition-duration` is unavailable (SSR/tests). */
const FALLBACK_MS = 550

export const LOAD_TRANSITION_STAGGER_MS = 70

/** Read `--load-transition-duration` from `:root` (single source of truth in CSS). */
export function readLoadTransitionMs(): number {
  if (typeof document === 'undefined') return FALLBACK_MS

  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--load-transition-duration')
    .trim()

  if (!raw) return FALLBACK_MS
  if (raw.endsWith('ms')) return parseFloat(raw) || FALLBACK_MS
  if (raw.endsWith('s')) return (parseFloat(raw) || 0.55) * 1000
  return parseFloat(raw) || FALLBACK_MS
}
