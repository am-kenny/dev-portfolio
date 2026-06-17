/**
 * Contact: `#contact`. Mailto/tel/social links and optional CV download.
 * Desktop: centered link row; mobile: card stack.
 */
import { FaDownload, FaGithub, FaLinkedin } from 'react-icons/fa'

import { usePortfolio } from '../../context/PortfolioContext'
import type { PortfolioData } from '../../types'
import ScrollReveal from '../common/ScrollReveal'
import SectionContent from '../common/SectionContent'
import SectionLoadTransition from '../common/SectionLoadTransition'
import {
  contactDesktopPillClass,
  contactInnerWrapClass,
  contactMobileCardClass,
  contactSectionClass,
  downloadCvButtonClass,
  downloadCvSeparatorWrap,
  downloadCvSeparatorWrapPills,
} from './contact/constants'

const platformIcons: Record<string, typeof FaGithub> = {
  github: FaGithub,
  linkedin: FaLinkedin,
}

const platformLabels: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
}

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
  personalInfo,
}: {
  contact: PortfolioData['contact']
  personalInfo?: PortfolioData['personalInfo']
}) {
  const email = contact?.email || personalInfo?.email
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
  const isLoading = loading || !data

  return (
    <SectionLoadTransition
      id="contact"
      as="div"
      className="pb-16 md:pb-24"
      maxWidth={false}
      loading={isLoading}
      revealIndex={5}
    >
      {data ? <ContactContent data={data} /> : null}
    </SectionLoadTransition>
  )
}

const ContactContent = ({ data }: { data: PortfolioData }): JSX.Element => {
  const { contact, personalInfo } = data

  const tagline =
    "I'm always interested in hearing about new projects and opportunities."

  const hasEmail = contact?.email || personalInfo?.email
  const hasPhone = contact?.phone
  const hasSocial = contact?.socialLinks?.length
  const hasAnyLink = hasEmail || hasPhone || hasSocial
  const cvUrl = getCvUrl(contact)

  return (
    <>
      <section className={`md:hidden ${contactSectionClass}`}>
        <SectionContent maxWidth="4xl">
          <div className={contactInnerWrapClass}>
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
                  <div className={contactMobileCardClass}>
                    <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4 drop-shadow-[0_2px_14px_rgba(56,189,248,0.14)] dark:drop-shadow-none">
                      Contact
                    </h3>
                    <div className="flex flex-col gap-3">
                      <ContactLinks
                        contact={contact}
                        personalInfo={personalInfo}
                      />
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

      <section className={`hidden md:block ${contactSectionClass}`}>
        <SectionContent maxWidth="4xl">
          <div className={contactInnerWrapClass}>
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
                              href={`mailto:${contact?.email || personalInfo?.email}`}
                              className={`${contactDesktopPillClass} hover:bg-blue-500 hover:text-white hover:border-blue-500 dark:hover:bg-blue-600`}
                            >
                              {iconEmail}
                              <span>Email</span>
                            </a>
                          )}
                          {hasPhone && (
                            <a
                              href={`tel:${contact!.phone}`}
                              className={`${contactDesktopPillClass} hover:bg-blue-500 hover:text-white hover:border-blue-500 dark:hover:bg-blue-600`}
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
                                className={`${contactDesktopPillClass} hover:bg-blue-500 hover:text-white hover:border-blue-500 dark:hover:bg-blue-600`}
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
    </>
  )
}

export default Contact
