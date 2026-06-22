import { createContext, useContext } from 'react'

export type LoadTransitionPhase = 'loading' | 'transitioning' | 'ready'

export interface LoadTransitionContextValue {
  phase: LoadTransitionPhase
  /** Section content mounted via skeleton → content crossfade. */
  fromCrossfade: boolean
}

export const LoadTransitionContext = createContext<LoadTransitionContextValue>({
  phase: 'ready',
  fromCrossfade: false,
})

export const useLoadTransition = (): LoadTransitionContextValue =>
  useContext(LoadTransitionContext)

/** When false, scroll reveal must not observe or animate yet (during load crossfade). */
export const useScrollRevealAllowed = (): boolean => {
  const { phase, fromCrossfade } = useLoadTransition()
  return !fromCrossfade || phase === 'ready'
}
