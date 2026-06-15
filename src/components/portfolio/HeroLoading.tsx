/** Shared hero headline typography. */
export const heroHeadlineClass =
  'text-4xl font-semibold leading-tight tracking-tight text-center sm:text-5xl md:text-6xl md:font-bold md:leading-[1.05]'

export const heroCtaRowClass =
  'flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row'

export const heroCtaPrimaryClass =
  'inline-flex items-center justify-center rounded-full bg-sky-500 px-8 py-3 font-semibold text-slate-950 shadow-[0_12px_32px_rgba(14,165,233,0.35)] dark:shadow-[0_18px_45px_rgba(56,189,248,0.55)]'

export const heroCtaSecondaryClass =
  'inline-flex items-center justify-center rounded-full border border-slate-300/90 bg-white/70 px-8 py-3 font-medium text-slate-800 shadow-[0_4px_20px_rgba(15,23,42,0.06)] dark:border-slate-500/70 dark:bg-slate-900/60 dark:text-slate-100 dark:shadow-none'

/** Reserves one headline line while portfolio data loads. */
export const HeroHeadlineSlot = (): JSX.Element => (
  <div className={heroHeadlineClass} aria-hidden="true">
    <span className="invisible">Hi, I&apos;m</span>
  </div>
)

export const HeroTitlePlaceholder = (): JSX.Element => (
  <div className="hero-title-flow mx-auto h-[1.35rem] max-w-md sm:h-6 sm:max-w-lg" />
)

export const HeroCtaPlaceholder = (): JSX.Element => (
  <div className={heroCtaRowClass} aria-hidden="true">
    <div className={`${heroCtaPrimaryClass} placeholder-cta`}>
      <span className="invisible">View my work</span>
    </div>
    <div
      className={`${heroCtaSecondaryClass} placeholder-cta placeholder-cta--delayed`}
    >
      <span className="invisible">Contact me</span>
    </div>
  </div>
)
