import { useState, type FormEvent } from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { usePortfolio } from '../../context/PortfolioContext'
import { dataSource } from '../../services/dataSource'
import config from '../../services/config'
import type { PortfolioData } from '../../types'

const platformIcons: Record<string, typeof FaGithub> = {
  github: FaGithub,
  linkedin: FaLinkedin,
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

type ContactContentProps = {
  contact: PortfolioData['contact']
  personal?: { email?: string }
  apiAvailable: boolean
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>
  submitting: boolean
  submitStatus: 'idle' | 'success' | 'error'
  submitError: string | null
}

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
          className="inline-flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors duration-300"
        >
          {iconEmail}
          <span>{email}</span>
        </a>
      )}
      {contact?.phone && (
        <a
          href={`tel:${contact.phone}`}
          className="inline-flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors duration-300"
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
                className="inline-flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                {Icon ? <Icon className="w-5 h-5 flex-shrink-0" /> : null}
                <span>{link.platform}</span>
              </a>
            )
          })
        : null}
    </>
  )
}

function ContactFormBlock({
  onSubmit,
  submitting,
  submitStatus,
  submitError,
  inputClass,
  buttonClass,
  formIdPrefix = '',
}: Pick<
  ContactContentProps,
  'onSubmit' | 'submitting' | 'submitStatus' | 'submitError'
> & {
  inputClass: string
  buttonClass: string
  formIdPrefix?: string
}) {
  const id = (name: string) => (formIdPrefix ? `${formIdPrefix}-${name}` : name)
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label
          htmlFor={id('name')}
          className="block text-sm font-medium text-gray-300 mb-1.5"
        >
          Name
        </label>
        <input
          type="text"
          id={id('name')}
          name="name"
          className={inputClass}
          required
        />
      </div>
      <div>
        <label
          htmlFor={id('email')}
          className="block text-sm font-medium text-gray-300 mb-1.5"
        >
          Email
        </label>
        <input
          type="email"
          id={id('email')}
          name="email"
          className={inputClass}
          required
        />
      </div>
      <div>
        <label
          htmlFor={id('message')}
          className="block text-sm font-medium text-gray-300 mb-1.5"
        >
          Message
        </label>
        <textarea
          id={id('message')}
          name="message"
          rows={4}
          className={inputClass}
          required
        />
      </div>
      {submitStatus === 'success' && (
        <p className="text-green-400 text-sm">
          Message sent. Thanks for getting in touch.
        </p>
      )}
      {submitStatus === 'error' && submitError && (
        <p className="text-red-400 text-sm">{submitError}</p>
      )}
      <button type="submit" className={buttonClass} disabled={submitting}>
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}

const inputBase =
  'w-full px-4 py-2.5 rounded-lg bg-gray-800/80 dark:bg-gray-800 border border-gray-600 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-gray-500 transition duration-300'

const buttonBase =
  'w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed'

const Contact = (): JSX.Element => {
  const { data, loading } = usePortfolio()
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const apiAvailable = dataSource === 'api'

  if (loading || !data) {
    return (
      <section className="py-20 bg-gray-900 dark:bg-gray-950 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-lg text-gray-400">
            Loading...
          </div>
        </div>
      </section>
    )
  }

  const { contact, personal } = data as PortfolioData & {
    personal?: { email?: string }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setSubmitStatus('idle')
    setSubmitError(null)
    const form = e.currentTarget
    const name =
      (form.elements.namedItem('name') as HTMLInputElement)?.value ?? ''
    const email =
      (form.elements.namedItem('email') as HTMLInputElement)?.value ?? ''
    const message =
      (form.elements.namedItem('message') as HTMLTextAreaElement)?.value ?? ''
    setSubmitting(true)
    try {
      const response = await fetch(config.getApiUrl(config.endpoints.contact), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(
          body.details ?? body.error ?? `Request failed (${response.status})`
        )
      }
      setSubmitStatus('success')
      form.reset()
    } catch (err) {
      setSubmitStatus('error')
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to send message.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const tagline =
    "I'm always interested in hearing about new projects and opportunities."

  const hasEmail = contact?.email || personal?.email
  const hasPhone = contact?.phone
  const hasSocial = contact?.socialLinks?.length
  const hasAnyLink = hasEmail || hasPhone || hasSocial

  return (
    <div id="contact">
      {/* Bento: mobile only */}
      <section className="md:hidden py-24 bg-gray-900/95 dark:bg-gray-950 text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">
              Get in touch
            </h2>
            <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
              {tagline}
            </p>
            <div
              className={`grid gap-6 ${apiAvailable ? 'md:grid-cols-2' : 'max-w-md mx-auto'}`}
            >
              <div className="rounded-2xl border border-gray-700/80 dark:border-gray-700 bg-gray-800/40 dark:bg-gray-800/30 p-8 shadow-xl hover:border-gray-600/80 transition-colors duration-300">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">
                  Contact
                </h3>
                <div className="flex flex-col gap-3">
                  <ContactLinks contact={contact} personal={personal} />
                </div>
              </div>
              {apiAvailable && (
                <div className="rounded-2xl border border-gray-700/80 dark:border-gray-700 bg-gray-800/40 dark:bg-gray-800/30 p-8 shadow-xl hover:border-gray-600/80 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-blue-400 mb-5">
                    Send a message
                  </h3>
                  <ContactFormBlock
                    onSubmit={handleSubmit}
                    submitting={submitting}
                    submitStatus={submitStatus}
                    submitError={submitError}
                    inputClass={inputBase}
                    buttonClass={buttonBase}
                    formIdPrefix="1"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Desktop: Bento two-card layout when API, else centered pills */}
      <section className="hidden md:block py-24 bg-gray-900/95 dark:bg-gray-950 text-white overflow-hidden">
        <div className="container mx-auto px-4">
          {apiAvailable ? (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">
                Get in touch
              </h2>
              <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-start">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Contact Information
                  </h3>
                  <p className="text-gray-400 mb-6">{tagline}</p>
                  <div className="flex flex-col gap-3">
                    {(contact?.email || personal?.email) && (
                      <a
                        href={`mailto:${contact?.email || personal?.email}`}
                        className="inline-flex items-center gap-2 text-white hover:text-blue-400 transition-colors duration-300"
                      >
                        {iconEmail}
                        <span>{contact?.email || personal?.email}</span>
                      </a>
                    )}
                    {contact?.phone && (
                      <a
                        href={`tel:${contact.phone}`}
                        className="inline-flex items-center gap-2 text-white hover:text-blue-400 transition-colors duration-300"
                      >
                        {iconPhone}
                        <span>{contact.phone}</span>
                      </a>
                    )}
                  </div>
                  {contact?.socialLinks?.length ? (
                    <div className="flex flex-wrap gap-4 mt-4">
                      {contact.socialLinks.map((link) => {
                        const Icon =
                          platformIcons[link.platform?.toLowerCase() ?? ''] ??
                          null
                        return (
                          <a
                            key={link.platform ?? link.url}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors duration-300"
                          >
                            {Icon ? (
                              <Icon className="w-5 h-5 flex-shrink-0" />
                            ) : null}
                            <span>{link.platform}</span>
                          </a>
                        )
                      })}
                    </div>
                  ) : null}
                </div>
                <div>
                  <ContactFormBlock
                    onSubmit={handleSubmit}
                    submitting={submitting}
                    submitStatus={submitStatus}
                    submitError={submitError}
                    inputClass={inputBase}
                    buttonClass={buttonBase}
                    formIdPrefix="4"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-3">Get in touch</h2>
              <p className="text-gray-400 mb-8">{tagline}</p>
              {hasAnyLink && (
                <div className="flex flex-wrap justify-center gap-3">
                  {hasEmail && (
                    <a
                      href={`mailto:${contact?.email || personal?.email}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-700/80 hover:bg-blue-600 text-gray-200 hover:text-white border border-gray-600 hover:border-blue-500 transition-all duration-300"
                    >
                      {iconEmail}
                      <span>Email</span>
                    </a>
                  )}
                  {hasPhone && (
                    <a
                      href={`tel:${contact!.phone}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-700/80 hover:bg-blue-600 text-gray-200 hover:text-white border border-gray-600 hover:border-blue-500 transition-all duration-300"
                    >
                      {iconPhone}
                      <span>Phone</span>
                    </a>
                  )}
                  {contact?.socialLinks?.map((link) => {
                    const Icon =
                      platformIcons[link.platform?.toLowerCase() ?? ''] ?? null
                    return (
                      <a
                        key={link.platform ?? link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-700/80 hover:bg-blue-600 text-gray-200 hover:text-white border border-gray-600 hover:border-blue-500 transition-all duration-300"
                      >
                        {Icon ? <Icon className="w-5 h-5" /> : null}
                        <span>{link.platform}</span>
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Contact
