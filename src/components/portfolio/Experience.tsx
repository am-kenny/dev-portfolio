import { useMemo } from 'react'

import { usePortfolio } from '../../context/PortfolioContext'
import type { PortfolioData } from '../../types'
import { SectionLoadTransition } from '../common/load-transition'
import { ScrollReveal } from '../common/scroll-reveal'
import CollapsibleAchievements from './experience/CollapsibleAchievements'
import CompanyIcon from './experience/CompanyIcon'
import {
  experienceAsideClass,
  experienceCardClass,
} from './experience/constants'
import {
  formatExperiencePeriod,
  parseJobLocation,
} from './experience/experienceFormatters'
import ExperienceTimelineRow from './experience/ExperienceTimelineRow'
import JobLocation from './experience/JobLocation'
import {
  experienceJobKey,
  normalizeExperienceJobs,
} from './experience/normalizeExperienceJob'
import SkillsPills from './experience/SkillsPills'
import { useExperienceTimeline } from './experience/useExperienceTimeline'

const Experience = (): JSX.Element => {
  const { data, loading } = usePortfolio()
  const isLoading = loading || !data
  const rawJobs = data ? (data as PortfolioData).experience?.jobs : undefined
  const jobs = useMemo(() => normalizeExperienceJobs(rawJobs), [rawJobs])
  const timelineReady = !isLoading
  const { rowRefs, segments } = useExperienceTimeline(
    jobs.length,
    timelineReady
  )

  return (
    <SectionLoadTransition id="experience" loading={isLoading} revealIndex={3}>
      {data && (
        <>
          <ScrollReveal index={0} className="w-full mb-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100 drop-shadow-[0_5px_26px_rgba(56,189,248,0.16),0_2px_12px_rgba(59,130,246,0.08)] dark:drop-shadow-[0_4px_24px_rgba(0,0,0,0.32)]">
              Experience
            </h2>
          </ScrollReveal>

          {!jobs.length ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No experience entries yet.
            </div>
          ) : (
            <div>
              {jobs.map((job, index) => {
                const jobKey = experienceJobKey(job)
                const jobLocation = parseJobLocation(job)
                const period = formatExperiencePeriod(
                  job.startDate,
                  job.endDate,
                  job.isCurrent
                )

                return (
                  <ScrollReveal
                    key={jobKey}
                    index={index + 1}
                    className="w-full"
                  >
                    <ExperienceTimelineRow
                      index={index}
                      jobCount={jobs.length}
                      segment={segments[index]}
                      rowRef={(el) => {
                        rowRefs.current[index] = el
                      }}
                    >
                      <article
                        className={`${experienceCardClass} overflow-hidden md:grid md:grid-cols-[minmax(11rem,14rem)_1fr]`}
                      >
                        <aside
                          className={`flex flex-row md:flex-col gap-4 p-5 sm:p-6 md:border-r ${experienceAsideClass}`}
                        >
                          <CompanyIcon
                            companyName={job.company.name}
                            icon={job.company.icon}
                            size="lg"
                          />
                          <div className="flex flex-col gap-2 min-w-0 flex-1 md:flex-initial">
                            {period ? (
                              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 tabular-nums">
                                <time dateTime={period.start.dateTime}>
                                  {period.start.label}
                                </time>
                                {period.end ? (
                                  <>
                                    {' – '}
                                    {period.end === 'present' ? (
                                      'Present'
                                    ) : (
                                      <time dateTime={period.end.dateTime}>
                                        {period.end.label}
                                      </time>
                                    )}
                                  </>
                                ) : null}
                              </p>
                            ) : null}
                            <JobLocation {...jobLocation} />
                          </div>
                        </aside>
                        <div className="p-5 sm:p-6 min-w-0">
                          <div className="min-w-0">
                            {job.title ? (
                              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                {job.title}
                              </h3>
                            ) : null}
                            {job.company.name ? (
                              <p className="text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                                {job.company.name}
                              </p>
                            ) : null}
                          </div>
                          {job.description ? (
                            <p className="text-gray-700 dark:text-gray-300 mt-4 leading-relaxed text-pretty">
                              {job.description}
                            </p>
                          ) : null}
                          <SkillsPills skills={job.skills} listKey={jobKey} />
                          <CollapsibleAchievements
                            achievements={job.achievements}
                            listKey={jobKey}
                          />
                        </div>
                      </article>
                    </ExperienceTimelineRow>
                  </ScrollReveal>
                )
              })}
            </div>
          )}
        </>
      )}
    </SectionLoadTransition>
  )
}

export default Experience
