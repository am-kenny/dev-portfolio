import { useEffect, useState } from 'react'
import { usePortfolio } from '../../context/PortfolioContext'
import { scrollToSection } from '../../utils/scroll'

const SECTIONS = [
  { id: 'hero', label: 'Intro' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
] as const

type SectionId = (typeof SECTIONS)[number]['id']

/** Viewport Y (px from top) — active = last section in order whose top is at or above this line. */
const ACTIVE_TRIGGER_FRACTION = 0.28

/** Past this distance from max scroll, treat as “end of page” (subpixel / browser chrome). */
const BOTTOM_SCROLL_EPSILON = 8

function computeActiveSectionId(): SectionId {
  const scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  )
  const maxScroll = Math.max(0, scrollHeight - window.innerHeight)
  const atBottom =
    maxScroll > 0 && window.scrollY >= maxScroll - BOTTOM_SCROLL_EPSILON

  if (atBottom) {
    for (let i = SECTIONS.length - 1; i >= 0; i--) {
      const { id } = SECTIONS[i]
      if (document.getElementById(id)) return id
    }
  }

  const lineY = window.innerHeight * ACTIVE_TRIGGER_FRACTION
  let active: SectionId = SECTIONS[0].id
  for (const { id } of SECTIONS) {
    const el = document.getElementById(id)
    if (!el) continue
    if (el.getBoundingClientRect().top <= lineY) {
      active = id
    }
  }
  return active
}

const SectionNav = (): JSX.Element => {
  const { loading } = usePortfolio()
  const [activeId, setActiveId] = useState<SectionId>('hero')

  useEffect(() => {
    let raf = 0

    const flush = (): void => {
      raf = 0
      const next = computeActiveSectionId()
      setActiveId((prev) => (prev === next ? prev : next))
    }

    const schedule = (): void => {
      if (raf !== 0) return
      raf = window.requestAnimationFrame(flush)
    }

    flush()

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.cancelAnimationFrame(raf)
    }
  }, [loading])

  return (
    <nav
      className="pointer-events-none fixed inset-y-0 right-0 z-40 hidden items-center pr-5 lg:flex"
      aria-label="Section navigation"
    >
      <ul className="pointer-events-auto relative flex flex-col items-center gap-3">
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-2 bottom-2 z-0 w-px -translate-x-1/2 bg-slate-300/60 dark:bg-slate-600/60"
        />
        {SECTIONS.map(({ id, label }) => {
          const active = activeId === id
          return (
            <li key={id} className="relative z-10">
              <a
                href={`#${id}`}
                title={label}
                aria-label={label}
                aria-current={active ? 'location' : undefined}
                onClick={(e) => scrollToSection(e, id)}
                className="group relative inline-flex h-6 w-6 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                <span
                  aria-hidden
                  className="absolute -inset-y-2 -left-28 -right-2"
                />
                <span
                  className={`pointer-events-none absolute right-full mr-3 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.2em] transition-opacity duration-200 ${
                    active
                      ? 'text-sky-600 opacity-100 dark:text-sky-300'
                      : 'text-slate-500 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 dark:text-slate-400'
                  }`}
                  aria-hidden
                >
                  {label}
                </span>
                <span
                  className={`block h-2 w-2 shrink-0 rounded-full transition-all duration-200 ${
                    active
                      ? 'scale-125 bg-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.55)] dark:bg-sky-400 dark:shadow-[0_0_14px_rgba(56,189,248,0.45)]'
                      : 'bg-slate-400/70 group-hover:bg-slate-500 dark:bg-slate-600 group-hover:dark:bg-slate-500'
                  }`}
                />
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default SectionNav
