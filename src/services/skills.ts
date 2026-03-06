import config from './config'
import { authService } from './auth'
import type { SkillCategoryValue, SkillEntry, SkillsSection } from '../types'

export interface SkillsStructure {
  availableRoles: string[]
  roleSubcategories: Record<string, SkillCategoryValue>
}

export interface SkillsCategorizationSettings {
  useSubcategories: boolean
  minSkillsForSubcategory: number
  categoryOverrides: Record<string, unknown>
}

export const getSkillsStructure = async (): Promise<SkillsStructure> => {
  const response = await fetch(
    config.getApiUrl(config.endpoints.skillsStructure)
  )
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return (await response.json()) as SkillsStructure
}

export const getSkillsCategorization =
  async (): Promise<SkillsCategorizationSettings> => {
    try {
      const token = authService.getToken()
      if (!token) {
        throw new Error('Authentication required. Please log in again.')
      }

      const response = await fetch(
        config.getApiUrl(config.endpoints.skillsCategorization),
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        if (response.status === 404) {
          return {
            useSubcategories: true,
            minSkillsForSubcategory: 3,
            categoryOverrides: {},
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = (await response.json()) as SkillsCategorizationSettings
      return data
    } catch (error) {
      console.error('Error fetching skills categorization:', error)
      return {
        useSubcategories: true,
        minSkillsForSubcategory: 3,
        categoryOverrides: {},
      }
    }
  }

export const getFlattenedSkills = async (): Promise<
  SkillsSection['skillCategories']
> => {
  const response = await fetch(config.getApiUrl(config.endpoints.skillsFlat))
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return (await response.json()) as SkillsSection['skillCategories']
}

export const configureSkillsCategorization = async (
  categorization: SkillsCategorizationSettings
): Promise<SkillsCategorizationSettings> => {
  const token = authService.getToken()
  if (!token) {
    throw new Error('Authentication required. Please log in again.')
  }

  const response = await fetch(
    config.getApiUrl(config.endpoints.skillsCategorization),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ categorization }),
    }
  )

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Authentication failed. Please log in again.')
    } else if (response.status === 401) {
      throw new Error('Unauthorized. Please check your credentials.')
    } else {
      const errorData = (await response.json().catch(() => ({}))) as {
        error?: string
      }
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      )
    }
  }

  const data = (await response.json()) as SkillsCategorizationSettings
  return data
}

export const flattenSkills = (
  skillCategories: SkillsSection['skillCategories']
): SkillsSection['skillCategories'] => {
  const flattened: SkillsSection['skillCategories'] = {}

  Object.entries(skillCategories).forEach(([category, skills]) => {
    if (Array.isArray(skills)) {
      flattened[category] = skills
    } else if (typeof skills === 'object' && skills !== null) {
      const allSkills: SkillEntry[] = []
      Object.values(skills).forEach((subcategorySkills) => {
        if (Array.isArray(subcategorySkills)) {
          allSkills.push(...subcategorySkills)
        }
      })
      flattened[category] = allSkills
    }
  })

  return flattened
}

export const isHierarchical = (skills: SkillCategoryValue | null): boolean => {
  if (!skills || typeof skills !== 'object') return false

  return Object.values(skills).some(
    (skillGroup) => typeof skillGroup === 'object' && !Array.isArray(skillGroup)
  )
}

export const getAllSkills = (
  skillCategories: SkillsSection['skillCategories']
): SkillEntry[] => {
  const allSkills: SkillEntry[] = []

  Object.values(skillCategories).forEach((skills) => {
    if (Array.isArray(skills)) {
      allSkills.push(...skills)
    } else if (typeof skills === 'object' && skills !== null) {
      Object.values(skills).forEach((subcategorySkills) => {
        if (Array.isArray(subcategorySkills)) {
          allSkills.push(...subcategorySkills)
        }
      })
    }
  })

  return allSkills
}
