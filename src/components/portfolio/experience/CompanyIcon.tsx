import { useEffect, useState, type SyntheticEvent } from 'react'

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
  sm: 'w-9 h-9 rounded-lg',
  md: 'w-11 h-11 rounded-xl',
  lg: 'w-14 h-14 rounded-xl',
} as const

type IconSize = keyof typeof iconSizeClasses

interface CompanyIconProps {
  company?: string
  companyIcon?: string
  size?: IconSize
}

const companyInitials = (company: string | undefined): string =>
  (company ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

const CompanyIconFallback = ({
  company,
  size,
}: {
  company?: string
  size: IconSize
}): JSX.Element => {
  const box = iconSizeClasses[size]
  const initials = companyInitials(company)

  return (
    <div
      className={`${box} shrink-0 flex items-center justify-center bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50`}
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
  company,
  companyIcon,
  size = 'md',
}: CompanyIconProps): JSX.Element => {
  const [imageFailed, setImageFailed] = useState(false)
  const box = iconSizeClasses[size]
  const iconUrl = companyIcon?.trim()

  useEffect(() => {
    setImageFailed(false)
  }, [iconUrl])

  if (!iconUrl || imageFailed) {
    return <CompanyIconFallback company={company} size={size} />
  }

  const onImageError = (_e: SyntheticEvent<HTMLImageElement>): void => {
    setImageFailed(true)
  }

  return (
    <div
      className={`${box} shrink-0 overflow-hidden bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-600`}
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
