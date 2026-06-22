/**
 * About section: `#about`, renders `about.content` from portfolio data after load.
 */
import { useEffect, useState } from 'react'

import { usePortfolio } from '../../context/PortfolioContext'
import type { PortfolioData } from '../../types'
import { SectionLoadTransition } from '../common/load-transition'
import { ScrollReveal } from '../common/scroll-reveal'

const splitParagraphs = (text: string): string[] =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean)

const initialsFromName = (name?: string): string => {
  if (!name?.trim()) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const About = (): JSX.Element => {
  const { data, loading } = usePortfolio()
  const isLoading = loading || !data

  const aboutImage = data?.about?.image?.trim() ?? ''

  const [imageFailed, setImageFailed] = useState(false)
  useEffect(() => {
    setImageFailed(false)
  }, [aboutImage])

  return (
    <SectionLoadTransition id="about" loading={isLoading} revealIndex={1}>
      {data && (
        <AboutContent
          data={data}
          imageFailed={imageFailed}
          setImageFailed={setImageFailed}
          aboutImage={aboutImage}
        />
      )}
    </SectionLoadTransition>
  )
}

const AboutContent = ({
  data,
  aboutImage,
  imageFailed,
  setImageFailed,
}: {
  data: PortfolioData
  aboutImage: string
  imageFailed: boolean
  setImageFailed: (failed: boolean) => void
}): JSX.Element => {
  const { about, personalInfo } = data

  const rawAbout = about?.content?.trim() ?? ''
  const paragraphs = rawAbout ? splitParagraphs(rawAbout) : []
  const initials = initialsFromName(personalInfo?.name)
  const showPhoto = Boolean(aboutImage) && !imageFailed
  const showProfile =
    Boolean(personalInfo?.name?.trim()) ||
    Boolean(personalInfo?.title?.trim()) ||
    Boolean(aboutImage)

  return (
    <>
      <ScrollReveal index={0}>
        <h2 className="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100 drop-shadow-[0_5px_26px_rgba(56,189,248,0.16),0_2px_12px_rgba(59,130,246,0.08)] dark:drop-shadow-[0_4px_24px_rgba(0,0,0,0.32)]">
          About me
        </h2>
      </ScrollReveal>

      {rawAbout && (
        <ScrollReveal index={1}>
          <article className="rounded-xl border border-stone-200/90 bg-white/85 px-6 py-8 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80 sm:px-10 sm:py-10">
            {showProfile && (
              <header className="mb-8 flex flex-col items-center gap-4 border-b border-stone-200/80 pb-8 text-center dark:border-gray-700/90 sm:flex-row sm:items-center sm:text-left">
                {showPhoto ? (
                  <img
                    src={aboutImage}
                    alt={
                      personalInfo?.name?.trim()
                        ? `Photo of ${personalInfo.name.trim()}`
                        : 'Profile'
                    }
                    className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-stone-200/90 dark:ring-gray-600"
                    loading="lazy"
                    decoding="async"
                    onError={() => setImageFailed(true)}
                  />
                ) : initials ? (
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-100 text-base font-semibold text-sky-800 dark:bg-sky-950/80 dark:text-sky-200"
                    aria-hidden
                  >
                    {initials}
                  </div>
                ) : null}
                <div className="min-w-0">
                  {personalInfo?.name?.trim() ? (
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {personalInfo.name.trim()}
                    </p>
                  ) : null}
                  {personalInfo?.title?.trim() ? (
                    <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
                      {personalInfo.title.trim()}
                    </p>
                  ) : null}
                </div>
              </header>
            )}

            <div className="space-y-5">
              {paragraphs.length > 0 ? (
                paragraphs.map((block, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? 'text-[1.0625rem] leading-relaxed text-gray-800 dark:text-gray-100 sm:text-lg'
                        : 'text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-[1.0625rem]'
                    }
                  >
                    {block}
                  </p>
                ))
              ) : (
                <p className="text-[1.0625rem] leading-relaxed text-gray-800 dark:text-gray-100 sm:text-lg">
                  {rawAbout}
                </p>
              )}
            </div>
          </article>
        </ScrollReveal>
      )}
    </>
  )
}

export default About
