import {
  FaUser,
  FaInfoCircle,
  FaBriefcase,
  FaProjectDiagram,
  FaEnvelope,
  FaTools,
} from 'react-icons/fa'
import type { ReactNode } from 'react'

const sectionIcons: Record<string, ReactNode> = {
  personalInfo: <FaUser className="text-blue-600 w-6 h-6" />,
  about: <FaInfoCircle className="text-green-600 w-6 h-6" />,
  skills: <FaTools className="text-indigo-600 w-6 h-6" />,
  experience: <FaBriefcase className="text-yellow-600 w-6 h-6" />,
  projects: <FaProjectDiagram className="text-purple-600 w-6 h-6" />,
  contact: <FaEnvelope className="text-pink-600 w-6 h-6" />,
}

export interface SectionIconProps {
  section: string
}

const formatSectionName = (sectionName: string): string =>
  sectionName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())

const SectionIcon = ({ section }: SectionIconProps): JSX.Element => {
  return (
    <span className="flex items-center gap-2">
      {sectionIcons[section] || null}
      <span className="capitalize">{formatSectionName(section)}</span>
    </span>
  )
}

export default SectionIcon
