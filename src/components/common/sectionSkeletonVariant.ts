export type SectionSkeletonVariant =
  | 'about'
  | 'experience'
  | 'skills'
  | 'projects'
  | 'contact'
  | 'default'

const SECTION_SKELETON_IDS = new Set<string>([
  'about',
  'experience',
  'skills',
  'projects',
  'contact',
])

export const sectionSkeletonFromId = (id: string): SectionSkeletonVariant =>
  SECTION_SKELETON_IDS.has(id) ? (id as SectionSkeletonVariant) : 'default'
