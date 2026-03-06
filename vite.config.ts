import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import {
  VALID_DATA_SOURCES,
  type DataSourceOption,
} from './src/constants/dataSourceOptions'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const raw = env.VITE_DATA_SOURCE || ''
  const normalized = raw.toLowerCase().trim()

  const isValidDataSource = (value: string): value is DataSourceOption =>
    (VALID_DATA_SOURCES as readonly string[]).includes(value)

  if (raw && !isValidDataSource(normalized)) {
    console.warn(
      `[Portfolio] VITE_DATA_SOURCE is invalid ("${raw}"). App is misconfigured. Valid values: ${VALID_DATA_SOURCES.join(
        ', '
      )}. Defaulting to "embedded".`
    )
  }

  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          main: './index.html',
        },
      },
    },
  }
})
