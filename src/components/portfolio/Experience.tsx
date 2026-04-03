import SectionContent from '../common/SectionContent'
import { usePortfolio } from '../../context/PortfolioContext'
import { formatEnumValue } from '../../utils/formatters'
import type { PortfolioData } from '../../types'

const Experience = (): JSX.Element => {
  const { data, loading } = usePortfolio()

  if (loading || !data) {
    return (
      <section className="py-20">
        <SectionContent maxWidth="5xl">
          <div className="text-center text-lg text-gray-400 dark:text-gray-500">
            Loading...
          </div>
        </SectionContent>
      </section>
    )
  }

  const { experience } = data as PortfolioData

  return (
    <section id="experience" className="py-20">
      <SectionContent maxWidth="5xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100 drop-shadow-[0_5px_26px_rgba(56,189,248,0.16),0_2px_12px_rgba(59,130,246,0.08)] dark:drop-shadow-[0_4px_24px_rgba(0,0,0,0.32)]">
          Experience
        </h2>
        {experience?.jobs?.map((job, index) => (
          <div
            key={index}
            className={`relative pl-8 ${
              index !== experience.jobs.length - 1 ? 'pb-12' : ''
            }`}
          >
            {index !== experience.jobs.length - 1 && (
              <div className="absolute left-[9px] top-6 w-0.5 h-full bg-blue-200 dark:bg-blue-800"></div>
            )}

            <div className="absolute left-0 top-2 w-5 h-5 rounded-full border-4 border-blue-500 bg-white dark:bg-gray-900"></div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-white/20 dark:border-gray-700">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div className="mb-1 min-w-0">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {job.title}
                  </h3>
                  <div className="text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                    {job.company}
                  </div>
                  <div className="w-8 h-0.5 bg-blue-500 dark:bg-blue-400 rounded-full mt-2" />
                </div>
                <div className="text-right">
                  <div className="text-gray-600 dark:text-gray-400">
                    {job.startDate}
                    {job.isCurrent
                      ? ' - Present'
                      : job.endDate
                        ? ` - ${job.endDate}`
                        : ''}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {formatEnumValue(job.location ?? '')}
                    {job.city && job.country
                      ? ` • ${job.city}, ${job.country}`
                      : ''}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {job.description}
              </p>

              {job.achievements?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    Key Achievements:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    {job.achievements.map((achievement) => (
                      <li key={achievement}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {job.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {(!experience?.jobs || experience.jobs.length === 0) && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No experience entries yet. Add some from the admin panel!
          </div>
        )}
      </SectionContent>
    </section>
  )
}

export default Experience
