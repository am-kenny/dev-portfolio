export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export interface SocialLink {
  platform: string
  url: string
}

export interface ContactSection {
  email: string
  phone?: string
  socialLinks: SocialLink[]
}

export interface PersonalSection {
  name: string
  title?: string
  location?: string
  bio?: string
  email?: string
}

export interface AboutSection {
  content: string
}

export interface ProjectItem {
  name: string
  description: string
  technologies: string[]
  link?: string
  github?: string
  image?: string
}

export interface ProjectsSection {
  projects?: ProjectItem[]
  items?: ProjectItem[]
}

export interface ExperienceJob {
  title: string
  company: string
  startDate: string
  endDate?: string
  isCurrent?: boolean
  location?: string
  country?: string
  city?: string
  description?: string
  achievements: string[]
  skills: string[]
}

export interface ExperienceSection {
  jobs: ExperienceJob[]
}

export interface SkillEntry {
  name: string
  level: SkillLevel
}

export type SkillCategoryFlat = SkillEntry[]
export type SkillCategoryHierarchical = Record<string, SkillEntry[]>
export type SkillCategoryValue = SkillCategoryFlat | SkillCategoryHierarchical

export interface SkillsSection {
  skillCategories: Record<string, SkillCategoryValue>
}

export type ErrorKind = 'config' | 'unavailable' | null

export interface SectionLoadingState {
  [section: string]: boolean
}

export interface PortfolioData {
  personal?: PersonalSection
  about?: AboutSection
  projects?: ProjectsSection
  experience?: ExperienceSection
  skills?: SkillsSection
  contact?: ContactSection
  // Allow additional sections managed by the admin panel
  [section: string]: unknown
}
