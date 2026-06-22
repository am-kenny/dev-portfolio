import {
  contactDesktopPillClass,
  contactInnerWrapClass,
  contactMobileCardClass,
  contactSectionClass,
  downloadCvButtonClass,
  downloadCvSeparatorWrap,
  downloadCvSeparatorWrapPills,
} from '../../../constants/contactLayout'
import {
  experienceAsideClass,
  experienceCardClass,
} from '../../../constants/experienceLayout'
import SectionContent from '../SectionContent'
import type { SectionSkeletonVariant } from './sectionSkeletonVariant'

interface SkeletonProps {
  className?: string
}

/** Shimmer placeholder bar — pairs with `.skeleton-shimmer` in `index.css`. */
const Skeleton = ({ className = '' }: SkeletonProps): JSX.Element => {
  const rounding = /\brounded(-\S+)?/.test(className) ? '' : 'rounded-lg'

  return (
    <div
      className={`skeleton-shimmer ${rounding} ${className}`.trim()}
      aria-hidden="true"
    />
  )
}

const SectionTitleSkeleton = (): JSX.Element => (
  <Skeleton className="mx-auto h-10 w-48 sm:w-56" />
)

const AboutSkeleton = (): JSX.Element => (
  <div className="space-y-10" aria-hidden="true">
    <SectionTitleSkeleton />
    <div className="rounded-xl border border-stone-200/90 bg-white/85 px-6 py-8 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80 sm:px-10 sm:py-10">
      <div className="mb-8 flex flex-col items-center gap-4 border-b border-stone-200/80 pb-8 sm:flex-row sm:items-center dark:border-gray-700/90">
        <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
        <div className="flex w-full flex-col items-center gap-2 sm:items-start">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-52 max-w-full" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[92%]" />
        <Skeleton className="h-4 w-[78%]" />
      </div>
    </div>
  </div>
)

const ExperienceJobSkeleton = ({
  isLast,
}: {
  isLast: boolean
}): JSX.Element => (
  <div className={`relative pl-8 ${isLast ? '' : 'pb-12'}`}>
    {!isLast && (
      <div
        className="absolute bottom-0 left-[9px] top-6 w-0.5 bg-blue-200 dark:bg-blue-800"
        aria-hidden="true"
      />
    )}
    <div
      className="absolute left-0 top-2 z-[1] h-5 w-5 rounded-full border-4 border-blue-500 bg-white dark:bg-gray-900"
      aria-hidden="true"
    />
    <article
      className={`${experienceCardClass} overflow-hidden md:grid md:grid-cols-[minmax(11rem,14rem)_1fr]`}
    >
      <aside
        className={`flex flex-row gap-4 p-5 sm:p-6 md:flex-col md:border-r ${experienceAsideClass}`}
      >
        <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
        <div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-initial">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3.5 w-24" />
        </div>
      </aside>
      <div className="min-w-0 p-5 sm:p-6">
        <Skeleton className="h-7 w-52 max-w-full" />
        <Skeleton className="mt-1 h-5 w-36" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[88%]" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-14 rounded-full" />
        </div>
      </div>
    </article>
  </div>
)

const ExperienceSkeleton = (): JSX.Element => (
  <div aria-hidden="true">
    <div className="mb-8">
      <Skeleton className="mx-auto mb-12 h-10 w-44" />
    </div>
    <div>
      <ExperienceJobSkeleton isLast={false} />
      <ExperienceJobSkeleton isLast />
    </div>
  </div>
)

const skillPillSkeleton = (width: string): JSX.Element => (
  <Skeleton className={`h-8 ${width} rounded-full`} />
)

const SKILL_CATEGORY_PLACEHOLDERS: [string, string[]][] = [
  ['w-28', ['w-16', 'w-20', 'w-24', 'w-14', 'w-24']],
  ['w-36', ['w-20', 'w-16', 'w-24']],
  ['w-32', ['w-24', 'w-16', 'w-20', 'w-28']],
]

const SkillsSkeleton = (): JSX.Element => (
  <div aria-hidden="true">
    <div className="mb-8 text-center">
      <Skeleton className="mx-auto mb-2 h-9 w-64" />
      <Skeleton className="mx-auto h-4 w-72 max-w-full" />
    </div>

    <div className="space-y-4">
      {SKILL_CATEGORY_PLACEHOLDERS.map(([categoryWidth, pills], i) => (
        <div
          key={i}
          className="rounded-lg border border-white/20 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80"
        >
          <div className="mb-3">
            <Skeleton className={`mb-1 h-7 ${categoryWidth}`} />
            <Skeleton className="h-0.5 w-8 rounded-full" />
          </div>
          <div className="flex flex-wrap gap-2">
            {pills.map((pillWidth, j) => (
              <span key={j}>{skillPillSkeleton(pillWidth)}</span>
            ))}
          </div>
        </div>
      ))}
    </div>

    <div className="mt-6 text-center">
      <div className="inline-flex items-center space-x-3 rounded-full border border-transparent bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
        <Skeleton className="h-3 w-[4.75rem]" />
        <div className="flex items-center space-x-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-1">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

const ProjectRowSkeleton = ({ reverse }: { reverse: boolean }): JSX.Element => (
  <div
    className={`flex flex-col gap-6 md:flex-row md:gap-8 md:items-start ${
      reverse ? 'md:flex-row-reverse' : ''
    }`}
  >
    <Skeleton className="h-48 w-full shrink-0 rounded-xl md:h-56 md:w-72" />
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-6 w-48 max-w-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="mt-2 flex gap-2">
        <Skeleton className="h-6 w-14 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  </div>
)

const ProjectsSkeleton = (): JSX.Element => (
  <div className="space-y-12" aria-hidden="true">
    <SectionTitleSkeleton />
    <div className="space-y-12">
      <ProjectRowSkeleton reverse={false} />
      <ProjectRowSkeleton reverse />
    </div>
  </div>
)

const ContactLinkLine = ({ width }: { width: string }): JSX.Element => (
  <Skeleton className={`h-5 ${width} max-w-full`} />
)

const ContactDesktopPill = ({ label }: { label: string }): JSX.Element => (
  <div
    className={`${contactDesktopPillClass} placeholder-cta pointer-events-none`}
  >
    <span className="invisible">{label}</span>
  </div>
)

const ContactSkeleton = (): JSX.Element => (
  <>
    <section className={`md:hidden ${contactSectionClass}`} aria-hidden="true">
      <SectionContent maxWidth="4xl">
        <div className={contactInnerWrapClass}>
          <div className="relative z-10">
            <div className="text-center">
              <Skeleton className="mx-auto mb-4 h-10 w-44" />
              <Skeleton className="mx-auto h-5 w-full max-w-xl" />
              <Skeleton className="mx-auto mt-2 h-5 w-[85%] max-w-md" />
            </div>
            <div className="mx-auto mt-12 grid max-w-md gap-6">
              <div className={contactMobileCardClass}>
                <Skeleton className="mb-4 h-7 w-24" />
                <div className="flex flex-col gap-3">
                  <ContactLinkLine width="w-56" />
                  <ContactLinkLine width="w-36" />
                  <ContactLinkLine width="w-24" />
                </div>
                <div className={downloadCvSeparatorWrap}>
                  <div
                    className={`${downloadCvButtonClass} placeholder-cta placeholder-cta--delayed w-full pointer-events-none`}
                  >
                    <span className="invisible">Download CV</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContent>
    </section>

    <section
      className={`hidden md:block ${contactSectionClass}`}
      aria-hidden="true"
    >
      <SectionContent maxWidth="4xl">
        <div className={contactInnerWrapClass}>
          <div className="relative z-10">
            <div className="mx-auto max-w-2xl text-center">
              <Skeleton className="mx-auto mb-3 h-10 w-44" />
              <Skeleton className="mx-auto h-5 w-full max-w-xl" />
              <Skeleton className="mx-auto mt-2 h-5 w-[90%]" />
              <div className="mt-8 flex flex-col items-center gap-4">
                <div className="flex w-full flex-wrap justify-center gap-3">
                  <ContactDesktopPill label="Email" />
                  <ContactDesktopPill label="Phone" />
                  <ContactDesktopPill label="GitHub" />
                  <ContactDesktopPill label="LinkedIn" />
                </div>
                <div className={downloadCvSeparatorWrapPills}>
                  <div
                    className={`${downloadCvButtonClass} placeholder-cta placeholder-cta--delayed pointer-events-none`}
                  >
                    <span className="invisible">Download CV</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContent>
    </section>
  </>
)

const DefaultSkeleton = (): JSX.Element => (
  <div className="flex flex-col items-center gap-6 py-8" aria-hidden="true">
    <div className="loading-orbit" />
    <Skeleton className="h-4 w-28" />
  </div>
)

export const SectionSkeletonBody = ({
  variant,
}: {
  variant: SectionSkeletonVariant
}): JSX.Element => {
  switch (variant) {
    case 'about':
      return <AboutSkeleton />
    case 'experience':
      return <ExperienceSkeleton />
    case 'skills':
      return <SkillsSkeleton />
    case 'projects':
      return <ProjectsSkeleton />
    case 'contact':
      return <ContactSkeleton />
    default:
      return <DefaultSkeleton />
  }
}
