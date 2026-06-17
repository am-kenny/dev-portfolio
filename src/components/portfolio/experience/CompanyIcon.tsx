import { type SyntheticEvent, useEffect, useState } from 'react'

import type { ExperienceCompanyIcon } from '../../../types'

const DefaultCompanyIcon = (): JSX.Element => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="w-6 h-6 text-blue-600 dark:text-blue-400"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"
    />
  </svg>
)

const iconSizeClasses = {
  sm: 'w-9 h-9',
  md: 'w-11 h-11',
  lg: 'w-14 h-14',
} as const

const iconRadiusClasses = {
  sm: { rounded: 'rounded-lg', square: 'rounded-sm' },
  md: { rounded: 'rounded-xl', square: 'rounded-sm' },
  lg: { rounded: 'rounded-xl', square: 'rounded-sm' },
} as const

type IconSize = keyof typeof iconSizeClasses

interface CompanyIconProps {
  companyName: string
  icon?: ExperienceCompanyIcon
  size?: IconSize
}

const companyInitials = (companyName: string | undefined): string =>
  (companyName ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

const CompanyIconFallback = ({
  companyName,
  size,
  rounded,
}: {
  companyName?: string
  size: IconSize
  rounded: boolean
}): JSX.Element => {
  const box = iconSizeClasses[size]
  const radius = iconRadiusClasses[size][rounded ? 'rounded' : 'square']
  const initials = companyInitials(companyName)

  return (
    <div
      className={`${box} ${radius} shrink-0 flex items-center justify-center bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50`}
      aria-hidden
    >
      {initials ? (
        <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
          {initials}
        </span>
      ) : (
        <DefaultCompanyIcon />
      )}
    </div>
  )
}

const CompanyIcon = ({
  companyName,
  icon,
  size = 'md',
}: CompanyIconProps): JSX.Element => {
  const [imageFailed, setImageFailed] = useState(false)
  const box = iconSizeClasses[size]
  const rounded = icon?.rounded !== false
  const radius = iconRadiusClasses[size][rounded ? 'rounded' : 'square']
  const iconUrl = icon?.url?.trim()

  useEffect(() => {
    setImageFailed(false)
  }, [iconUrl])

  if (!iconUrl || imageFailed) {
    return (
      <CompanyIconFallback
        companyName={companyName}
        size={size}
        rounded={rounded}
      />
    )
  }

  const onImageError = (_e: SyntheticEvent<HTMLImageElement>): void => {
    setImageFailed(true)
  }

  return (
    <div
      className={`${box} ${radius} shrink-0 overflow-hidden bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-600`}
      aria-hidden
    >
      <img
        src={iconUrl}
        alt=""
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
        onError={onImageError}
      />
    </div>
  )
}

export default CompanyIcon
