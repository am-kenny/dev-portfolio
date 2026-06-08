import { useState } from 'react'

/** Safe DOM id fragment from listKey (spaces/special chars → hyphens). */
const sanitizeDomId = (key: string): string => {
  const slug = key
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'list'
}

interface AchievementListProps {
  achievements: string[]
  listKey: string
}

const AchievementList = ({
  achievements,
  listKey,
}: AchievementListProps): JSX.Element => (
  <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 text-pretty marker:text-blue-500 dark:marker:text-blue-400">
    {achievements.map((achievement, index) => (
      <li
        key={`${listKey}-achievement-${index}-${achievement.slice(0, 32)}`}
        className="pl-0.5 leading-relaxed"
      >
        {achievement}
      </li>
    ))}
  </ul>
)

interface CollapsibleAchievementsProps {
  achievements?: string[]
  defaultOpen?: boolean
  label?: string
  listKey: string
}

const CollapsibleAchievements = ({
  achievements = [],
  defaultOpen = false,
  label = 'Key achievements',
  listKey,
}: CollapsibleAchievementsProps): JSX.Element | null => {
  const [open, setOpen] = useState(defaultOpen)
  if (!achievements.length) return null

  const panelId = `achievements-${sanitizeDomId(listKey)}`

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-lg border border-gray-200/60 dark:border-gray-600/60 bg-gray-50/50 dark:bg-gray-900/30 px-4 py-2.5 text-left text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${label}, ${open ? 'expanded' : 'collapsed'}, ${achievements.length} items`}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="w-5 h-5 shrink-0 text-blue-600 dark:text-blue-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <span className="flex-1 min-w-0">{label}</span>
        <span className="shrink-0 tabular-nums rounded-full bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 text-xs font-bold text-blue-800 dark:text-blue-200">
          {achievements.length}
        </span>
        <span
          aria-hidden="true"
          className={`inline-flex shrink-0 transition-transform duration-300 ease-theme motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
        >
          <svg
            viewBox="0 0 20 20"
            className="w-5 h-5 text-blue-600 dark:text-blue-400"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>
      <div
        id={panelId}
        aria-hidden={!open}
        className={`achievements-panel grid motion-reduce:transition-none motion-reduce:duration-0 ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden min-h-0">
          <div
            className={`achievements-panel__content pt-2 motion-reduce:transition-none motion-reduce:duration-0 ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <AchievementList achievements={achievements} listKey={listKey} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollapsibleAchievements
