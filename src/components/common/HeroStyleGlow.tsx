/**
 * Narrow centered blur column — same treatment as Hero / About / Contact copy areas.
 * Light: warm paper bloom + soft cyan/violet (matches canvas “darklite”); dark: neon + slate depth.
 * Opacity crossfade uses `.theme-glow-crossfade` from `index.css` (single theme timing).
 */
export default function HeroStyleGlow({
  className = '',
}: {
  className?: string
}): JSX.Element {
  return (
    <div
      className={`pointer-events-none absolute left-1/2 top-[8%] bottom-[8%] w-[min(100%,18rem)] -translate-x-1/2 sm:w-[min(100%,22rem)] md:w-[min(100%,26rem)] lg:w-[min(100%,30rem)] ${className}`.trim()}
      aria-hidden
    >
      <div className="absolute inset-0 opacity-100 dark:opacity-0 theme-glow-crossfade">
        <div className="absolute inset-[-20%] rounded-[3rem] bg-gradient-to-br from-sky-300/28 via-violet-300/16 to-cyan-200/22 blur-[100px] sm:blur-[130px] md:blur-[150px]" />
        <div className="absolute inset-[-12%] rounded-[2.75rem] bg-amber-100/40 blur-[80px] sm:blur-[100px]" />
        <div className="absolute inset-[-6%] rounded-[2.5rem] bg-white/40 blur-[56px] sm:blur-[72px]" />
      </div>
      <div className="absolute inset-0 opacity-0 dark:opacity-100 theme-glow-crossfade">
        <div className="absolute inset-[-20%] rounded-[3rem] bg-gradient-to-br from-sky-400/20 via-fuchsia-400/12 to-emerald-400/18 blur-[100px] sm:blur-[130px] md:blur-[150px]" />
      </div>
    </div>
  )
}
