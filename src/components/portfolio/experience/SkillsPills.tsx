interface SkillsPillsProps {
  skills: string[]
  listKey: string
}

const SkillsPills = ({
  skills,
  listKey,
}: SkillsPillsProps): JSX.Element | null => {
  const items = skills ?? []
  if (!items.length) return null

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {items.map((skill, index) => (
        <span
          key={`${listKey}-skill-${skill}-${index}`}
          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm"
        >
          {skill}
        </span>
      ))}
    </div>
  )
}

export default SkillsPills
