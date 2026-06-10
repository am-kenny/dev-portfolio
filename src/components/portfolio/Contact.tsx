/**
 * Contact: `#contact`. Mailto/tel/social links and optional CV download.
 * Desktop: centered link row; mobile: card stack.
 */
import { FaDownload, FaGithub, FaLinkedin } from 'react-icons/fa'
import ScrollReveal from '../common/ScrollReveal'
import SectionContent from '../common/SectionContent'
import SectionLoading from '../common/SectionLoading'
import { usePortfolio } from '../../context/PortfolioContext'
import type { PortfolioData } from '../../types'

const platformIcons: Record<string, typeof FaGithub> = {
  github: FaGithub,
  linkedin: FaLinkedin,
}

const platformLabels: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
}

const downloadCvSeparatorWrap =
  'mt-8 w-full border-t border-slate-200/50 pt-8 dark:border-gray-600/45'

const downloadCvSeparatorWrapPills =
  'mt-10 w-full max-w-2xl border-t border-slate-200/50 pt-10 dark:border-gray-600/45 flex justify-center'

const downloadCvButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-full border border-slate-300/90 bg-white/70 px-6 py-2.5 text-sm font-medium text-slate-800 shadow-[0_4px_20px_rgba(15,23,42,0.06)] transition-colors hover:bg-white/95 hover:border-slate-400 dark:border-slate-500/70 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-800/80 dark:shadow-none'

function downloadCvLinkProps(
  href: string
):
  | { target: '_blank'; rel: 'noopener noreferrer' }
  | { download: string | true } {
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return { target: '_blank', rel: 'noopener noreferrer' }
  }
  const pathOnly = href.split('?')[0] ?? href
  const segment = pathOnly.split('/').filter(Boolean).pop()
  if (segment?.includes('.')) {
    return { download: segment }
  }
  return { download: true }
}

function DownloadCvLink({
  href,
  fullWidth,
}: {
  href: string
  fullWidth?: boolean
}): JSX.Element {
  return (
    <a
      href={href}
      {...downloadCvLinkProps(href)}
      className={`${downloadCvButtonClass}${fullWidth ? ' w-full' : ''}`}
      aria-label="Download CV"
    >
      <FaDownload className="h-4 w-4 flex-shrink-0 opacity-80" aria-hidden />
      <span>Download CV</span>
    </a>
  )
}

function getCvUrl(
  contact: PortfolioData['contact'] | undefined
): string | undefined {
  const raw =
    contact && typeof contact.cvUrl === 'string' ? contact.cvUrl.trim() : ''
  return raw || undefined
}

function getPlatformLabel(platform: string | undefined): string {
  if (!platform) return ''
  const key = platform.toLowerCase()
  return platformLabels[key] ?? platform
}

const iconEmail = (
  <svg
    className="w-5 h-5 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

const iconPhone = (
  <svg
    className="w-5 h-5 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
)

function ContactLinks({
  contact,
  personal,
}: {
  contact: PortfolioData['contact']
  personal?: { email?: string }
}) {
  const email = contact?.email || personal?.email
  return (
    <>
      {email && (
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
        >
          {iconEmail}
          <span>{email}</span>
        </a>
      )}
      {contact?.phone && (
        <a
          href={`tel:${contact.phone}`}
          className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
        >
          {iconPhone}
          <span>{contact.phone}</span>
        </a>
      )}
      {contact?.socialLinks?.length
        ? contact.socialLinks.map((link) => {
            const Icon =
              platformIcons[link.platform?.toLowerCase() ?? ''] ?? null
            return (
              <a
                key={link.platform ?? link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                {Icon ? <Icon className="w-5 h-5 flex-shrink-0" /> : null}
                <span>{getPlatformLabel(link.platform)}</span>
              </a>
            )
          })
        : null}
    </>
  )
}

const Contact = (): JSX.Element => {
  const { data, loading } = usePortfolio()

  if (loading || !data) {
    return (
      <SectionLoading
        id="contact"
        className="pt-20 pb-36 md:pb-44 text-slate-900 dark:text-white"
        maxWidth="4xl"
      />
    )
  }

  const { contact, personal } = data as PortfolioData & {
    personal?: { email?: string }
  }

  const tagline =
    "I'm always interested in hearing about new projects and opportunities."

  const hasEmail = contact?.email || personal?.email
  const hasPhone = contact?.phone
  const hasSocial = contact?.socialLinks?.length
  const hasAnyLink = hasEmail || hasPhone || hasSocial
  const cvUrl = getCvUrl(contact)

  return (
    <div id="contact" className="pb-16 md:pb-24">
      <section className="md:hidden py-20 text-slate-900 dark:text-white overflow-visible">
        <SectionContent maxWidth="4xl">
          <div className="relative overflow-visible px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-14">
            <div className="relative z-10">
              <ScrollReveal index={0} className="w-full">
                <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100 drop-shadow-[0_5px_28px_rgba(56,189,248,0.2),0_2px_12px_rgba(139,92,246,0.08)] dark:drop-shadow-[0_4px_28px_rgba(0,0,0,0.45)]">
                  Get in touch
                </h2>
                <p className="text-lg text-slate-600 dark:text-gray-300 text-center mb-12 max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_18px_rgba(14,165,233,0.1)] dark:drop-shadow-[0_2px_16px_rgba(0,0,0,0.35)]">
                  {tagline}
                </p>
              </ScrollReveal>
              <div className="grid gap-6 max-w-md mx-auto">
                <ScrollReveal index={1} className="w-full">
                  <div className="rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-sm p-8 shadow-lg shadow-slate-900/[0.06] hover:border-slate-300/90 dark:border-gray-700/80 dark:bg-gray-800/40 dark:shadow-xl dark:hover:border-gray-600/80">
                    <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4 drop-shadow-[0_2px_14px_rgba(56,189,248,0.14)] dark:drop-shadow-none">
                      Contact
                    </h3>
                    <div className="flex flex-col gap-3">
                      <ContactLinks contact={contact} personal={personal} />
                    </div>
                    {cvUrl && (
                      <div className={downloadCvSeparatorWrap}>
                        <DownloadCvLink href={cvUrl} fullWidth />
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </SectionContent>
      </section>

      <section className="hidden md:block py-20 text-slate-900 dark:text-white overflow-visible">
        <SectionContent maxWidth="4xl">
          <div className="relative overflow-visible px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-14">
            <div className="relative z-10">
              <div className="max-w-2xl mx-auto text-center">
                <ScrollReveal index={0} className="w-full">
                  <h2 className="text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100 drop-shadow-[0_5px_28px_rgba(56,189,248,0.2),0_2px_12px_rgba(139,92,246,0.08)] dark:drop-shadow-[0_4px_28px_rgba(0,0,0,0.45)]">
                    Get in touch
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-gray-300 mb-8 leading-relaxed drop-shadow-[0_2px_18px_rgba(14,165,233,0.1)] dark:drop-shadow-[0_2px_16px_rgba(0,0,0,0.35)]">
                    {tagline}
                  </p>
                </ScrollReveal>
                {(hasAnyLink || cvUrl) && (
                  <ScrollReveal index={1} className="w-full">
                    <div className="flex flex-col items-center gap-4">
                      {hasAnyLink && (
                        <div className="flex flex-wrap justify-center gap-3 w-full">
                          {hasEmail && (
                            <a
                              href={`mailto:${contact?.email || personal?.email}`}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-300 text-slate-800 hover:bg-blue-500 hover:text-white hover:border-blue-500 shadow-md shadow-slate-900/[0.06] dark:bg-gray-700/80 dark:hover:bg-blue-600 dark:text-gray-200 dark:border-gray-600 dark:shadow-none"
                            >
                              {iconEmail}
                              <span>Email</span>
                            </a>
                          )}
                          {hasPhone && (
                            <a
                              href={`tel:${contact!.phone}`}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-300 text-slate-800 hover:bg-blue-500 hover:text-white hover:border-blue-500 shadow-md shadow-slate-900/[0.06] dark:bg-gray-700/80 dark:hover:bg-blue-600 dark:text-gray-200 dark:border-gray-600 dark:shadow-none"
                            >
                              {iconPhone}
                              <span>Phone</span>
                            </a>
                          )}
                          {contact?.socialLinks?.map((link) => {
                            const Icon =
                              platformIcons[
                                link.platform?.toLowerCase() ?? ''
                              ] ?? null
                            return (
                              <a
                                key={link.platform ?? link.url}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-300 text-slate-800 hover:bg-blue-500 hover:text-white hover:border-blue-500 shadow-md shadow-slate-900/[0.06] dark:bg-gray-700/80 dark:hover:bg-blue-600 dark:text-gray-200 dark:border-gray-600 dark:shadow-none"
                              >
                                {Icon ? <Icon className="w-5 h-5" /> : null}
                                <span>{getPlatformLabel(link.platform)}</span>
                              </a>
                            )
                          })}
                        </div>
                      )}
                      {cvUrl && (
                        <div
                          className={
                            hasAnyLink
                              ? downloadCvSeparatorWrapPills
                              : 'flex justify-center'
                          }
                        >
                          <DownloadCvLink href={cvUrl} />
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                )}
              </div>
            </div>
          </div>
        </SectionContent>
      </section>
    </div>
  )
}

export default Contact
