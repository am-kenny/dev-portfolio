import type { SkillLevel } from '../types'

export const SkillLevels: Readonly<Record<Uppercase<SkillLevel>, SkillLevel>> =
  Object.freeze({
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced',
    EXPERT: 'expert',
  } as const)
