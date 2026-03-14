import SectionContent from '../common/SectionContent'
import { usePortfolio } from '../../context/PortfolioContext'
import type { PortfolioData } from '../../types'

const About = (): JSX.Element => {
  const { data, loading } = usePortfolio()

  if (loading || !data) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
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
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900">
      <SectionContent maxWidth="4xl">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
          About Me
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {about?.content}
        </p>
      </SectionContent>
    </section>
  )
}

export default About
