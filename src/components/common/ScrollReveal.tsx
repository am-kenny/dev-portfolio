import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

export interface ScrollRevealProps {
  children: ReactNode
  className?: string
  /** List position; used with `staggerMs` for `animation-delay`. */
  index?: number
  staggerMs?: number
  rootMargin?: string
  threshold?: number
}

/**
 * Fades and slides content in when it enters the viewport. Siblings can pass
 * increasing `index` for a staggered sequence. Respects `prefers-reduced-motion`.
 */
const ScrollReveal = ({
  children,
  className = '',
  index = 0,
  staggerMs = 10,
  rootMargin = '0px 0px -5% 0px',
  threshold = 0.08,
}: ScrollRevealProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, threshold])

  const delayStyle: CSSProperties | undefined = visible
    ? ({ '--reveal-delay': `${index * staggerMs}ms` } as CSSProperties)
    : undefined

  return (
    <div
      ref={ref}
      className={`scroll-reveal${visible ? ' scroll-reveal--visible' : ''} ${className}`.trim()}
      style={delayStyle}
    >
      {children}
    </div>
  )
}

export default ScrollReveal
