import {
  HiOutlineGlobeAlt,
  HiOutlineLocationMarker,
  HiOutlineOfficeBuilding,
  HiOutlineSwitchHorizontal,
} from 'react-icons/hi'
import type { JobLocationParts } from './experienceFormatters'

type JobLocationProps = JobLocationParts

const metadataRowClass =
  'inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400'

const metadataIconClass = 'size-3.5 shrink-0 text-gray-400 dark:text-gray-500'

const WorkModeIcon = ({ workMode }: { workMode: string }): JSX.Element => {
  const normalized = workMode.toLowerCase()
  if (normalized.includes('remote')) {
    return <HiOutlineGlobeAlt className={metadataIconClass} aria-hidden />
  }
  if (normalized.includes('hybrid')) {
    return (
      <HiOutlineSwitchHorizontal className={metadataIconClass} aria-hidden />
    )
  }
  return <HiOutlineOfficeBuilding className={metadataIconClass} aria-hidden />
}

const JobLocation = ({
  workMode,
  place,
}: JobLocationProps): JSX.Element | null => {
  if (!workMode && !place) return null

  return (
    <div className="flex flex-col items-start gap-1 shrink-0 text-left">
      {place ? (
        <span className={metadataRowClass}>
          <HiOutlineLocationMarker className={metadataIconClass} aria-hidden />
          <span className="text-pretty">{place}</span>
        </span>
      ) : null}
      {workMode ? (
        <span className={metadataRowClass}>
          <WorkModeIcon workMode={workMode} />
          <span>{workMode}</span>
        </span>
      ) : null}
    </div>
  )
}

export default JobLocation
