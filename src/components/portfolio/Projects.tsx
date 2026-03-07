import { useState } from 'react'
import { usePortfolio } from '../../context/PortfolioContext'
import type { PortfolioData, ProjectItem, ProjectsSection } from '../../types'

const VISIBLE_INITIALLY = 4

const Projects = (): JSX.Element => {
  const { data, loading } = usePortfolio()
  const [showAll, setShowAll] = useState(false)

  if (loading || !data) {
    return (
      <section id="projects" className="py-20 bg-white dark:bg-gray-900">
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
  const hasProjects =
    (projects?.projects?.length ?? 0) > 0 || (projects?.items?.length ?? 0) > 0
  const initialItems = items.slice(0, VISIBLE_INITIALLY)
  const moreItems = items.slice(VISIBLE_INITIALLY)
  const hasMore = moreItems.length > 0

  const renderProject = (
    project: ProjectItem,
    index: number,
    reverse: boolean,
    hideImageShadow = false
  ): JSX.Element => (
    <article
      key={project.name}
      className={`flex flex-col gap-6 md:flex-row md:gap-8 md:items-stretch ${reverse ? 'md:flex-row-reverse' : ''}`}
    >
      {project.image && (
        <div
          className={`flex-shrink-0 w-full md:w-72 h-48 md:h-56 rounded-xl overflow-hidden [&_img]:rounded-xl ${hideImageShadow ? '' : 'shadow-md'}`}
        >
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-mono text-blue-600 dark:text-blue-400">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {project.name}
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
          {project.description}
        </p>
        {project.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-4 mt-auto">
          {project.github && (
            <a
              href={project.github}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          )}
          {project.link && (
            <a
              href={project.link}
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View project
            </a>
          )}
        </div>
      </div>
    </article>
  )

  return (
    <>
      <div id="projects" className="scroll-mt-20" aria-hidden="true" />
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
            My Projects
          </h2>
          <div className={hasMore ? 'relative' : ''}>
            <div className="space-y-12">
              {initialItems.map((project, index) =>
                renderProject(
                  project,
                  index,
                  index % 2 === 1,
                  hasMore && !showAll && index === initialItems.length - 1
                )
              )}
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
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${showAll ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden min-h-0">
                <div
                  className={`pt-12 space-y-12 transition-opacity duration-300 ease-out ${showAll ? 'opacity-100' : 'opacity-0'}`}
                >
                  {moreItems.map((project, i) =>
                    renderProject(
                      project,
                      VISIBLE_INITIALLY + i,
                      (VISIBLE_INITIALLY + i) % 2 === 1,
                      false
                    )
                  )}
                </div>
              </div>
            </div>
          )}
          {hasMore && (
            <div className="text-center mt-10">
              <button
                type="button"
                onClick={() => setShowAll((prev) => !prev)}
                className="px-6 py-3 rounded-lg font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900"
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
        </div>
      </section>
      {!hasProjects && (
        <section className="py-8 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
            No projects added yet. Add some from the admin panel!
          </div>
        </section>
      )}
    </>
  )
}

export default Projects
