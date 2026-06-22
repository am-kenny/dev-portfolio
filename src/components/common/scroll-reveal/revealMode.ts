export type RevealMode = 'hidden' | 'crossfade' | 'animating' | 'settled'

export const isRevealed = (mode: RevealMode): boolean =>
  mode === 'animating' || mode === 'settled'

/** Maps reveal mode to scroll-reveal CSS modifier class. */
export const revealClassName = (
  mode: RevealMode,
  fromCrossfade: boolean
): string => {
  switch (mode) {
    case 'settled':
      return 'scroll-reveal--settled'
    case 'animating':
      return 'scroll-reveal--visible'
    case 'crossfade':
      return fromCrossfade ? 'scroll-reveal--crossfade-visible' : ''
    default:
      return ''
  }
}
