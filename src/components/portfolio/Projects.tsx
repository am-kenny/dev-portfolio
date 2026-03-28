import { useState } from 'react'
import SectionContent from '../common/SectionContent'
import { usePortfolio } from '../../context/PortfolioContext'
import type { PortfolioData, ProjectItem, ProjectsSection } from '../../types'

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
    <div className="relative isolate overflow-visible flex-1 min-w-0 flex flex-col">
      {/* Soft glow behind copy — muted so it doesn’t compete with the canvas */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 bottom-0 z-0 w-[min(100%,24rem)] sm:w-[min(100%,28rem)] md:w-[min(100%,32rem)] -translate-x-1/2 min-h-[10rem]"
        aria-hidden
      >
        <div className="absolute inset-0 opacity-100 dark:opacity-0 theme-glow-crossfade">
          <div className="absolute inset-[-8%] rounded-[2.75rem] bg-gradient-to-br from-sky-200/45 via-white/70 to-violet-200/40 blur-[52px] sm:blur-[68px]" />
          <div className="absolute inset-[-14%] rounded-[3rem] bg-gradient-to-br from-cyan-200/30 via-sky-100/35 to-indigo-200/25 blur-[72px] sm:blur-[92px] md:blur-[108px]" />
        </div>
        <div className="absolute inset-0 opacity-0 dark:opacity-100 theme-glow-crossfade">
          <div className="absolute inset-[-6%] rounded-[2.75rem] bg-slate-950/70 blur-[52px] sm:blur-[64px]" />
          <div className="absolute inset-[-16%] rounded-[3rem] bg-gradient-to-br from-sky-500/18 via-fuchsia-500/10 to-cyan-500/14 blur-[80px] sm:blur-[100px] md:blur-[118px]" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-sm font-mono text-blue-600 dark:text-blue-400">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 drop-shadow-[0_3px_18px_rgba(56,189,248,0.18),0_1px_8px_rgba(99,102,241,0.08)] dark:drop-shadow-[0_2px_14px_rgba(2,6,23,0.85)]">
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
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>Live</span>
            </a>
          )}
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 drop-shadow-[0_2px_14px_rgba(14,165,233,0.08)] dark:drop-shadow-[0_1px_10px_rgba(2,6,23,0.75)]">
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
    </div>
  </article>
)

const Projects = (): JSX.Element => {
  const { data, loading } = usePortfolio()
  const [showAll, setShowAll] = useState(false)

  if (loading || !data) {
    return (
      <section id="projects" className="py-20">
        <div className="container mx-auto px-4">
          <div className="col-span-full text-center text-gray-400 dark:text-gray-500">
            Loading...
          </div>
        </div>
      </section>
    )
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
          <h2
            id="projects-heading"
            className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100 drop-shadow-[0_5px_26px_rgba(56,189,248,0.18),0_2px_12px_rgba(139,92,246,0.07)] dark:drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
          >
            Projects
          </h2>
          <div className={hasMore ? 'relative' : ''}>
            <div className="space-y-12">
              {initialItems.map((project, index) => (
                <ProjectCard
                  key={
                    project.github ?? project.link ?? `${project.name}-${index}`
                  }
                  project={project}
                  index={index}
                  reverse={index % 2 === 1}
                  hideImageShadow={
                    hasMore && !showAll && index === initialItems.length - 1
                  }
                />
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
                  {moreItems.map((project, i) => (
                    <ProjectCard
                      key={
                        project.github ??
                        project.link ??
                        `${project.name}-${VISIBLE_INITIALLY + i}`
                      }
                      project={project}
                      index={VISIBLE_INITIALLY + i}
                      reverse={(VISIBLE_INITIALLY + i) % 2 === 1}
                    />
                  ))}
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
              No projects added yet. Add some from the admin panel!
            </div>
          </SectionContent>
        </section>
      )}
    </>
  )
}

export default Projects
