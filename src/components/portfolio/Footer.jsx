import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { usePortfolio } from '../../context/PortfolioContext'

const getSocialUrl = (socialLinks, platform) => {
  if (!socialLinks?.length) return null
  const link = socialLinks.find(
    (l) => l.platform?.toLowerCase() === platform.toLowerCase()
  )
  return link?.url || null
}

const Footer = () => {
  const { data } = usePortfolio()
  const socialLinks = data?.contact?.socialLinks ?? []
  const email = data?.contact?.email || data?.personal?.email
  const githubUrl = getSocialUrl(socialLinks, 'GitHub')
  const linkedInUrl = getSocialUrl(socialLinks, 'LinkedIn')

  return (
    <footer className="bg-gray-950 dark:bg-black text-gray-500 py-8 border-t border-gray-800 dark:border-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 text-sm">
          <div className="flex items-center justify-center gap-6">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="GitHub"
              >
                <FaGithub className="w-6 h-6" />
              </a>
            )}
            {linkedInUrl && (
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-6 h-6" />
              </a>
            )}
          </div>
          {email && (
            <a
              href={`mailto:${email}`}
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              {email}
            </a>
          )}
          <p className="text-gray-500">Built with React & Vite</p>
          <p className="text-gray-600 dark:text-gray-500">
            © {new Date().getFullYear()} Andrii Prykhodko
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
