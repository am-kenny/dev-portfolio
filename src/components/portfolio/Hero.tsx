/**
 * Above-the-fold intro: name and title from `personalInfo`, CTAs to `#projects` and `#contact`.
 */
import LoadTransition from '../common/LoadTransition'
import {
  HeroCtaPlaceholder,
  HeroHeadlineSlot,
  HeroTitlePlaceholder,
  heroCtaPrimaryClass,
  heroCtaRowClass,
  heroCtaSecondaryClass,
  heroHeadlineClass,
} from './HeroLoading'
import { scrollToSection } from '../../utils/scroll'
import { usePortfolio } from '../../context/PortfolioContext'

const Hero = (): JSX.Element => {
  const { data, loading } = usePortfolio()
  const isLoading = loading || !data
  const personalInfo = data?.personalInfo

  return (
    <section
      id="hero"
      className="flex min-h-screen items-center justify-center py-24 text-slate-900 dark:text-slate-100"
      aria-busy={isLoading || undefined}
    >
      <div className="container mx-auto w-full px-4">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-visible px-6 py-10 sm:px-10 sm:py-14 md:px-14 md:py-16">
            <div className="relative z-10 space-y-6 text-center md:space-y-7">
              <p className="text-xs uppercase tracking-[0.35em] text-sky-600 dark:text-sky-300/80 drop-shadow-[0_1px_12px_rgba(14,165,233,0.2)] dark:drop-shadow-none">
                Portfolio
              </p>

              <LoadTransition
                loading={isLoading}
                revealIndex={0}
                loader={<HeroHeadlineSlot />}
              >
                {personalInfo?.name ? (
                  <h1 className={heroHeadlineClass}>
                    <span className="text-slate-900 dark:text-slate-100">
                      Hi, I&apos;m{' '}
                    </span>
                    <span className="sr-only">{personalInfo.name}</span>
                    <span
                      className="relative inline-block bg-gradient-to-r from-sky-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent dark:from-sky-300 dark:via-cyan-200 dark:to-indigo-300 [@media(hover:hover)_and_(pointer:fine)]:drop-shadow-[0_5px_30px_rgba(56,189,248,0.22),0_2px_14px_rgba(139,92,246,0.1)] dark:[@media(hover:hover)_and_(pointer:fine)]:drop-shadow-[0_10px_40px_rgba(15,23,42,0.9)]"
                      aria-hidden
                    >
                      {personalInfo.name}
                    </span>
                  </h1>
                ) : null}
              </LoadTransition>

              <LoadTransition
                loading={isLoading}
                revealIndex={1}
                loader={
                  <div aria-hidden="true">
                    <div className="mx-auto max-w-2xl pt-1">
                      <HeroTitlePlaceholder />
                    </div>
                    <HeroCtaPlaceholder />
                  </div>
                }
              >
                {data ? (
                  <>
                    {personalInfo?.title ? (
                      <p className="mx-auto max-w-2xl text-base text-slate-700 drop-shadow-[0_1px_14px_rgba(148,163,184,0.2)] dark:text-slate-200/95 dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)] sm:text-lg md:text-xl">
                        {personalInfo.title}
                      </p>
                    ) : null}
                    <HeroActions />
                  </>
                ) : null}
              </LoadTransition>
            </div>
          </div>
        </div>
      </div>
      {isLoading && (
        <span className="sr-only" role="status" aria-live="polite">
          Loading portfolio
        </span>
      )}
    </section>
  )
}

const HeroActions = (): JSX.Element => (
  <div className={heroCtaRowClass}>
    <a
      href="#projects"
      onClick={(e) => scrollToSection(e, 'projects')}
      className={`${heroCtaPrimaryClass} hover:bg-sky-400`}
    >
      View my work
    </a>
    <a
      href="#contact"
      onClick={(e) => scrollToSection(e, 'contact')}
      className={`${heroCtaSecondaryClass} hover:bg-white/95 dark:hover:bg-slate-800/80`}
    >
      Contact me
    </a>
  </div>
)

export default Hero
