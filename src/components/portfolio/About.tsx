/**
 * About section: `#about`, renders `about.content` from portfolio data after load.
 */
import SectionContent from '../common/SectionContent'
import { usePortfolio } from '../../context/PortfolioContext'
import type { PortfolioData } from '../../types'

const About = (): JSX.Element => {
  const { data, loading } = usePortfolio()

  if (loading || !data) {
    return (
      <section className="py-20">
        <SectionContent maxWidth="4xl">
          <div className="text-center text-lg text-gray-400 dark:text-gray-500">
            Loading...
          </div>
        </SectionContent>
      </section>
    )
  }

  const { about } = data as PortfolioData

  return (
    <section id="about" className="py-20">
      <SectionContent maxWidth="4xl">
        <div className="relative overflow-visible px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-14">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100 drop-shadow-[0_5px_28px_rgba(56,189,248,0.2),0_2px_12px_rgba(139,92,246,0.08)] dark:drop-shadow-[0_4px_28px_rgba(0,0,0,0.45)]">
              About Me
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed drop-shadow-[0_2px_18px_rgba(14,165,233,0.1)] dark:drop-shadow-[0_2px_16px_rgba(0,0,0,0.35)]">
              {about?.content}
            </p>
          </div>
        </div>
      </SectionContent>
    </section>
  )
}

export default About
