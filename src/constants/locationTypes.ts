export const LocationTypes = Object.freeze({
  REMOTE: 'remote',
  ON_SITE: 'on-site',
  HYBRID: 'hybrid',
} as const)

export type LocationType = (typeof LocationTypes)[keyof typeof LocationTypes]
