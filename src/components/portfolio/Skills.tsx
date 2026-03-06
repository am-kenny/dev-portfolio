import { usePortfolio } from '../../context/PortfolioContext'
import { formatEnumValue } from '../../utils/formatters'
import type { PortfolioData, SkillCategoryValue, SkillEntry } from '../../types'

const Skills = (): JSX.Element => {
  const { data, loading } = usePortfolio()

  if (loading || !data) {
    return (
      <section className="py-12 bg-slate-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const { skills } = data as PortfolioData

  const getLevelStyles = (
    level: string
  ): { color: string; bg: string; border: string } => {
    switch (level) {
      case 'expert':
        return {
          color: 'text-purple-700 dark:text-purple-300',
          bg: 'bg-purple-100 dark:bg-purple-900/50',
          border: 'border-purple-200 dark:border-purple-700',
        }
      case 'advanced':
        return {
          color: 'text-green-700 dark:text-green-300',
          bg: 'bg-green-100 dark:bg-green-900/50',
          border: 'border-green-200 dark:border-green-700',
        }
      case 'intermediate':
        return {
          color: 'text-blue-700 dark:text-blue-300',
          bg: 'bg-blue-100 dark:bg-blue-900/50',
          border: 'border-blue-200 dark:border-blue-700',
        }
      case 'beginner':
      default:
        return {
          color: 'text-gray-700 dark:text-gray-300',
          bg: 'bg-gray-100 dark:bg-gray-700',
          border: 'border-gray-200 dark:border-gray-600',
        }
    }
  }

  const renderSkillTags = (categorySkills: SkillCategoryValue): JSX.Element => {
    if (Array.isArray(categorySkills)) {
      return (
        <div className="flex flex-wrap gap-2">
          {categorySkills.map((skill: SkillEntry) => {
            const levelStyles = getLevelStyles(skill.level)
            return (
              <div
                key={skill.name}
                className={`group relative inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${levelStyles.bg} ${levelStyles.color} ${levelStyles.border} hover:scale-105 transition-all duration-300 cursor-pointer`}
              >
                <span className="transition-all duration-300">
                  {skill.name}
                </span>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none bg-white dark:bg-gray-800 shadow-lg rounded-lg px-2 py-1 text-xs border dark:border-gray-600">
                  {formatEnumValue(skill.level)}
                </span>
              </div>
            )
          })}
        </div>
      )
    }

    return (
      <>
        {Object.entries(categorySkills).map(
          ([subcategory, subcategorySkills]) => (
            <div key={subcategory} className="mb-3">
              <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                {subcategory}
              </h5>
              <div className="flex flex-wrap gap-2">
                {subcategorySkills.map((skill) => {
                  const levelStyles = getLevelStyles(skill.level)
                  return (
                    <div
                      key={`${subcategory}-${skill.name}`}
                      className={`group relative inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${levelStyles.bg} ${levelStyles.color} ${levelStyles.border} hover:scale-105 transition-all duration-300 cursor-pointer`}
                    >
                      <span className="transition-all duration-300">
                        {skill.name}
                      </span>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none bg-white dark:bg-gray-800 shadow-lg rounded-lg px-2 py-1 text-xs border dark:border-gray-600">
                        {formatEnumValue(skill.level)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        )}
      </>
    )
  }

  return (
    <section id="skills" className="py-12 bg-slate-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Skills &amp; Technologies
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Technical expertise and proficiency levels
            </p>
          </div>

          <div className="space-y-4">
            {Object.entries(skills?.skillCategories || {}).map(
              ([category, categorySkills]) => (
                <div
                  key={category}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20 dark:border-gray-700"
                >
                  <div className="mb-3">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      {category}
                    </h4>
                    <div className="w-8 h-0.5 bg-blue-500 dark:bg-blue-400 rounded-full transition-colors duration-300"></div>
                  </div>

                  <div>{renderSkillTags(categorySkills)}</div>
                </div>
              )
            )}
          </div>

          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm border border-transparent dark:border-gray-700">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Proficiency:
              </span>
              <div className="flex items-center space-x-2">
                {(
                  ['expert', 'advanced', 'intermediate', 'beginner'] as const
                ).map((level) => {
                  let legendColor: string
                  switch (level) {
                    case 'expert':
                      legendColor = 'bg-purple-400 border-purple-500'
                      break
                    case 'advanced':
                      legendColor = 'bg-green-400 border-green-500'
                      break
                    case 'intermediate':
                      legendColor = 'bg-blue-400 border-blue-500'
                      break
                    case 'beginner':
                    default:
                      legendColor = 'bg-gray-400 border-gray-500'
                      break
                  }
                  return (
                    <div key={level} className="flex items-center space-x-1">
                      <div
                        className={`w-2 h-2 rounded-full ${legendColor}`}
                      ></div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 capitalize">
                        {formatEnumValue(level)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills
