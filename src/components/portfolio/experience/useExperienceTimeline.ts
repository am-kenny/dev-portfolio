import {
  type MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

/** Matches `ScrollReveal` default `rootMargin` bottom -5%. */
const ROOT_MARGIN_BOTTOM_SHRINK = 0.05
/** Matches `top-6` on the connector track. */
const LINE_START_OFFSET_PX = 24
/** Matches `top-2` + half of `w-5` dot for the next row anchor. */
const NEXT_DOT_ANCHOR_OFFSET_PX = 8 + 10

export type ExperienceTimelineSegment = {
  progress: number
  heightPx: number
}

export const useExperienceTimeline = (
  jobCount: number,
  enabled = true
): {
  rowRefs: MutableRefObject<(HTMLDivElement | null)[]>
  segments: ExperienceTimelineSegment[]
} => {
  const activeJobCount = enabled ? jobCount : 0
  const segmentCount = Math.max(0, activeJobCount - 1)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const segmentMaxProgressRef = useRef<number[]>([])
  const reducedMotionRef = useRef(false)
  const [segments, setSegments] = useState<ExperienceTimelineSegment[]>(() =>
    Array.from({ length: segmentCount }, () => ({ progress: 0, heightPx: 1 }))
  )

  useLayoutEffect(() => {
    if (rowRefs.current.length > activeJobCount) {
      rowRefs.current.length = activeJobCount
    }
    if (segmentMaxProgressRef.current.length > segmentCount) {
      segmentMaxProgressRef.current.length = segmentCount
    }
  }, [activeJobCount, segmentCount])

  useLayoutEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    segmentMaxProgressRef.current = Array(segmentCount).fill(
      reducedMotionRef.current ? 1 : 0
    )
    setSegments(
      Array.from({ length: segmentCount }, () => ({
        progress: reducedMotionRef.current ? 1 : 0,
        heightPx: 1,
      }))
    )
  }, [segmentCount])

  useEffect(() => {
    if (!enabled || segmentCount === 0) return undefined

    const update = () => {
      const reduced = reducedMotionRef.current
      const next: ExperienceTimelineSegment[] = []
      for (let i = 0; i < segmentCount; i++) {
        const row = rowRefs.current[i]
        const nextRow = rowRefs.current[i + 1]
        if (!row || !nextRow) {
          next.push({ progress: reduced ? 1 : 0, heightPx: 1 })
          continue
        }
        const a = row.getBoundingClientRect()
        const b = nextRow.getBoundingClientRect()
        const lineStartY = a.top + LINE_START_OFFSET_PX
        const dotNextY = b.top + NEXT_DOT_ANCHOR_OFFSET_PX
        const segmentPx = dotNextY - lineStartY
        const heightPx = Math.max(1, segmentPx)

        if (reduced) {
          next.push({ progress: 1, heightPx })
          continue
        }

        const leadY = window.innerHeight * (1 - ROOT_MARGIN_BOTTOM_SHRINK)
        const raw = segmentPx > 1 ? (leadY - lineStartY) / segmentPx : 1
        const capped = Math.min(1, Math.max(0, raw))
        const prevMax = segmentMaxProgressRef.current[i] ?? 0
        const progress = Math.max(prevMax, capped)
        segmentMaxProgressRef.current[i] = progress
        next.push({ progress, heightPx })
      }
      setSegments((prev) => {
        if (
          prev.length === next.length &&
          prev.every(
            (v, idx) =>
              v.progress === next[idx].progress &&
              v.heightPx === next[idx].heightPx
          )
        ) {
          return prev
        }
        return next
      })
    }

    let raf = 0
    const scheduleUpdate = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    const observeRows = (): void => {
      for (let i = 0; i < activeJobCount; i++) {
        const row = rowRefs.current[i]
        if (row) resizeObserver.observe(row)
      }
    }

    const resizeObserver = new ResizeObserver(scheduleUpdate)

    window.addEventListener('resize', scheduleUpdate)
    if (!reducedMotionRef.current) {
      window.addEventListener('scroll', scheduleUpdate, { passive: true })
    }

    observeRows()
    scheduleUpdate()

    const observeRaf = requestAnimationFrame(() => {
      observeRows()
      scheduleUpdate()
    })

    return () => {
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('scroll', scheduleUpdate)
      cancelAnimationFrame(raf)
      cancelAnimationFrame(observeRaf)
      resizeObserver.disconnect()
    }
  }, [segmentCount, activeJobCount, enabled])

  return { rowRefs, segments }
}
