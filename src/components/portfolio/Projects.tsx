/**
 * Projects list: `#projects` scroll target + section. Shows first `VISIBLE_INITIALLY` items, gradient hint,
 * then expandable grid for the rest. Accepts `projects.projects` or `projects.items` from API/static data.
 */
import { useState } from 'react'
import ScrollReveal from '../common/ScrollReveal'
import SectionContent from '../common/SectionContent'
import SectionLoading from '../common/SectionLoading'
import { usePortfolio } from '../../context/PortfolioContext'
import type { PortfolioData, ProjectItem, ProjectsSection } from '../../types'

/** Items shown before "See all"; remainder toggles in a height-transition grid. */
const VISIBLE_INITIALLY = 4

interface ProjectCardProps {
  project: ProjectItem
  index: number
  reverse: boolean
  hideImageShadow?: boolean
}

const ProjectCard = ({
  project,
  index,
  reverse,
  hideImageShadow = false,
}: ProjectCardProps): JSX.Element => (
  <article
    className={`flex flex-col gap-6 md:flex-row md:gap-8 md:items-start ${reverse ? 'md:flex-row-reverse' : ''}`}
  >
    {project.image && (
      <div
        className={`flex-shrink-0 w-full md:w-72 h-48 md:h-56 rounded-xl overflow-hidden aspect-[4/3] [&_img]:rounded-xl ${
          hideImageShadow ? '' : 'shadow-md'
        }`}
      >
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover object-center"
        />
      </div>
    )}
    <div className="flex-1 min-w-0 flex flex-col">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-sm font-mono text-blue-600 dark:text-blue-400">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {project.name}
        </h3>
        {project.github && (
          <a
            href={project.github}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on GitHub"
          >
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="w-4 h-4 fill-current"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            <span>GitHub</span>
          </a>
        )}
        {project.link && (
          <a
            href={project.link}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-emerald-700 dark:text-emerald-300 bg-transparent hover:bg-emerald-50 dark:hover:bg-emerald-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View live project"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping motion-reduce:animate-none rounded-full bg-emerald-500/70 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>Live</span>
          </a>
        )}
      </div>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        {project.description}
      </p>
      {project.technologies?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 px-3 py-1 rounded text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  </article>
)

const Projects = (): JSX.Element => {
  const { data, loading } = usePortfolio()
  const [showAll, setShowAll] = useState(false)

  if (loading || !data) {
    return <SectionLoading id="projects" />
  }

  const { projects } = data as PortfolioData & { projects?: ProjectsSection }
  const items: ProjectItem[] = projects?.projects ?? projects?.items ?? []
  const hasProjects = items.length > 0
  const initialItems = items.slice(0, VISIBLE_INITIALLY)
  const moreItems = items.slice(VISIBLE_INITIALLY)
  const hasMore = moreItems.length > 0

  return (
    <>
      <div id="projects" className="scroll-mt-20" aria-hidden="true" />
      <section className="py-20" aria-labelledby="projects-heading">
        <SectionContent maxWidth="5xl">
          <ScrollReveal index={0} className="w-full">
            <h2
              id="projects-heading"
              className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100 drop-shadow-[0_5px_26px_rgba(56,189,248,0.18),0_2px_12px_rgba(139,92,246,0.07)] dark:drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
            >
              Projects
            </h2>
          </ScrollReveal>
          <div className={hasMore ? 'relative' : ''}>
            <div className="space-y-12">
              {initialItems.map((project, index) => (
                <ScrollReveal
                  key={
                    project.github ?? project.link ?? `${project.name}-${index}`
                  }
                  index={index + 1}
                  className="w-full"
                >
                  <ProjectCard
                    project={project}
                    index={index}
                    reverse={index % 2 === 1}
                    hideImageShadow={
                      hasMore && !showAll && index === initialItems.length - 1
                    }
                  />
                </ScrollReveal>
              ))}
            </div>
            {hasMore && !showAll && (
              <div
                className="absolute bottom-0 left-0 right-0 h-[420px] pointer-events-none bg-gradient-to-t from-gray-50 via-gray-50/40 to-transparent dark:from-gray-900 dark:via-gray-900/40 dark:to-transparent"
                aria-hidden="true"
              />
            )}
          </div>
          {hasMore && (
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-theme ${showAll ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden min-h-0">
                <div
                  className={`pt-12 space-y-12 ${showAll ? 'opacity-100' : 'opacity-0'}`}
                >
                  {moreItems.map((project, i) => {
                    const globalIndex = VISIBLE_INITIALLY + i
                    return (
                      <ScrollReveal
                        key={
                          project.github ??
                          project.link ??
                          `${project.name}-${globalIndex}`
                        }
                        index={globalIndex + 1}
                        className="w-full"
                      >
                        <ProjectCard
                          project={project}
                          index={globalIndex}
                          reverse={globalIndex % 2 === 1}
                        />
                      </ScrollReveal>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
          {hasMore && (
            <div className="text-center mt-10">
              <button
                type="button"
                onClick={() => setShowAll((prev) => !prev)}
                aria-expanded={showAll}
                className="px-6 py-3 rounded-lg font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900"
              >
                {showAll ? 'Show less' : 'See all'}
              </button>
            </div>
          )}
          {items.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No projects to show.
            </p>
          )}
        </SectionContent>
      </section>
      {!hasProjects && (
        <section className="py-20">
          <SectionContent maxWidth="5xl">
            <div className="text-center text-gray-500 dark:text-gray-400">
              No projects in portfolio data.
            </div>
          </SectionContent>
        </section>
      )}
    </>
  )
}

export default Projects
