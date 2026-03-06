/** Valid values for VITE_DATA_SOURCE. Single source of truth for app and vite.config. */
export const VALID_DATA_SOURCES = ['api', 'embedded', 'external'] as const

export type DataSourceOption = (typeof VALID_DATA_SOURCES)[number]
