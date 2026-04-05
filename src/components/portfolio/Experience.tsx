import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import ScrollReveal from '../common/ScrollReveal'
import SectionContent from '../common/SectionContent'
import { usePortfolio } from '../../context/PortfolioContext'
import { formatEnumValue } from '../../utils/formatters'
import type { PortfolioData } from '../../types'

/**
 * Matches `ScrollReveal` default `rootMargin` bottom -5%: the Y (viewport px from top)
 * of the intersection root’s bottom edge — same “visibility line” the cards use.
 */
const ROOT_MARGIN_BOTTOM_SHRINK = 0.05

/** Matches `top-6` on the connector track. */
const LINE_START_OFFSET_PX = 24
/** Matches `top-2` + half of `w-5` dot for the next row anchor. */
const NEXT_DOT_ANCHOR_OFFSET_PX = 8 + 10

const Experience = (): JSX.Element => {
  const { data, loading } = usePortfolio()
  const experience = data ? (data as PortfolioData).experience : undefined
  const jobs = experience?.jobs ?? []
  const segmentCount = Math.max(0, jobs.length - 1)

  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const segmentMaxProgressRef = useRef<number[]>([])
  const reducedMotionRef = useRef(false)
  const [segments, setSegments] = useState<
    { progress: number; heightPx: number }[]
  >(() =>
    Array.from({ length: segmentCount }, () => ({ progress: 0, heightPx: 1 }))
  )

  useLayoutEffect(() => {
    if (rowRefs.current.length > jobs.length) {
      rowRefs.current.length = jobs.length
    }
    if (segmentMaxProgressRef.current.length > segmentCount) {
      segmentMaxProgressRef.current.length = segmentCount
    }
  }, [jobs.length, segmentCount])

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
    if (segmentCount === 0) return undefined

    const update = () => {
      const reduced = reducedMotionRef.current
      const next: { progress: number; heightPx: number }[] = []
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

        // Scroll-based fill: avoid interHeight/fullCardHeight (tall cards jump past 8% in one frame).
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
    const onScrollOrResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    window.addEventListener('resize', onScrollOrResize)
    if (!reducedMotionRef.current) {
      window.addEventListener('scroll', onScrollOrResize, { passive: true })
    }
    update()

    return () => {
      window.removeEventListener('resize', onScrollOrResize)
      window.removeEventListener('scroll', onScrollOrResize)
      cancelAnimationFrame(raf)
    }
  }, [segmentCount])

  if (loading || !data) {
    return (
      <section className="py-20">
        <SectionContent maxWidth="5xl">
          <div className="text-center text-lg text-gray-400 dark:text-gray-500">
            Loading...
          </div>
        </SectionContent>
      </section>
    )
  }

  const { experience: loadedExperience } = data as PortfolioData

  return (
    <section id="experience" className="py-20">
      <SectionContent maxWidth="5xl">
        <ScrollReveal index={0} className="w-full">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100 drop-shadow-[0_5px_26px_rgba(56,189,248,0.16),0_2px_12px_rgba(59,130,246,0.08)] dark:drop-shadow-[0_4px_24px_rgba(0,0,0,0.32)]">
            Experience
          </h2>
        </ScrollReveal>
        {loadedExperience?.jobs?.map((job, index) => (
          <ScrollReveal key={index} index={index + 1} className="w-full">
            <div
              ref={(el) => {
                rowRefs.current[index] = el
              }}
              className={`relative pl-8 ${
                index !== loadedExperience.jobs.length - 1 ? 'pb-12' : ''
              }`}
            >
              {index !== loadedExperience.jobs.length - 1 && (
                <div
                  className="absolute left-[9px] top-6 w-0.5 overflow-hidden pointer-events-none"
                  style={{ height: segments[index]?.heightPx ?? 1 }}
                  aria-hidden
                >
                  <div
                    className="h-full w-full origin-top bg-blue-200 dark:bg-blue-800"
                    style={{
                      transform: `scaleY(${segments[index]?.progress ?? 0})`,
                      transformOrigin: 'top center',
                    }}
                  />
                </div>
              )}

              <div className="absolute left-0 top-2 z-[1] w-5 h-5 rounded-full border-4 border-blue-500 bg-white dark:bg-gray-900" />

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-white/20 dark:border-gray-700">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div className="mb-1 min-w-0">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      {job.title}
                    </h3>
                    <div className="text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                      {job.company}
                    </div>
                    <div className="w-8 h-0.5 bg-blue-500 dark:bg-blue-400 rounded-full mt-2" />
                  </div>
                  <div className="text-right">
                    <div className="text-gray-600 dark:text-gray-400">
                      {job.startDate}
                      {job.isCurrent
                        ? ' - Present'
                        : job.endDate
                          ? ` - ${job.endDate}`
                          : ''}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {formatEnumValue(job.location ?? '')}
                      {job.city && job.country
                        ? ` • ${job.city}, ${job.country}`
                        : ''}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {job.description}
                </p>

                {job.achievements?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                      Key Achievements:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {job.achievements.map((achievement) => (
                        <li key={achievement}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        ))}
        {(!loadedExperience?.jobs || loadedExperience.jobs.length === 0) && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No experience entries yet. Add some from the admin panel!
          </div>
        )}
      </SectionContent>
    </section>
  )
}

export default Experience
