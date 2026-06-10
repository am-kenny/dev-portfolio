/**
 * Above-the-fold intro: name and title from `personalInfo`, CTAs to `#projects` and `#contact`.
 */
import { scrollToSection } from '../../utils/scroll'
import { usePortfolio } from '../../context/PortfolioContext'

const Hero = (): JSX.Element => {
  const { data, loading } = usePortfolio()

  if (loading || !data) {
    return (
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center text-slate-600 dark:text-slate-400 py-24"
      >
        <p className="text-lg md:text-2xl tracking-wide">Loading portfolio…</p>
      </section>
    )
  }

  const { personalInfo } = data

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center text-slate-900 dark:text-slate-100 py-24"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-visible px-6 py-10 sm:px-10 sm:py-14 md:px-14 md:py-16">
            <div className="relative z-10 text-center space-y-6 md:space-y-7">
              <p className="text-xs uppercase tracking-[0.35em] text-sky-600 dark:text-sky-300/80 drop-shadow-[0_1px_12px_rgba(14,165,233,0.2)] dark:drop-shadow-none">
                Portfolio
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold md:font-bold leading-tight md:leading-[1.05] tracking-tight">
                <span className="text-slate-900 dark:text-slate-100">
                  Hi, I&apos;m{' '}
                </span>
                <span className="sr-only">{personalInfo?.name}</span>
                <span
                  className="relative inline-block bg-gradient-to-r from-sky-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent dark:from-sky-300 dark:via-cyan-200 dark:to-indigo-300 [@media(hover:hover)_and_(pointer:fine)]:drop-shadow-[0_5px_30px_rgba(56,189,248,0.22),0_2px_14px_rgba(139,92,246,0.1)] dark:[@media(hover:hover)_and_(pointer:fine)]:drop-shadow-[0_10px_40px_rgba(15,23,42,0.9)]"
                  aria-hidden
                >
                  {personalInfo?.name}
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-slate-700 dark:text-slate-200/95 max-w-2xl mx-auto drop-shadow-[0_1px_14px_rgba(148,163,184,0.2)] dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]">
                {personalInfo?.title}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <a
                  href="#projects"
                  onClick={(e) => scrollToSection(e, 'projects')}
                  className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold shadow-[0_12px_32px_rgba(14,165,233,0.35)] dark:shadow-[0_18px_45px_rgba(56,189,248,0.55)]"
                >
                  View my work
                </a>
                <a
                  href="#contact"
                  onClick={(e) => scrollToSection(e, 'contact')}
                  className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-slate-300/90 bg-white/70 hover:bg-white/95 text-slate-800 dark:border-slate-500/70 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 dark:text-slate-100 font-medium shadow-[0_4px_20px_rgba(15,23,42,0.06)] dark:shadow-none"
                >
                  Contact me
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
