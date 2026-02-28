import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VALID_DATA_SOURCES } from './src/constants/dataSourceOptions.js'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const raw = env.VITE_DATA_SOURCE || ''
  const normalized = raw.toLowerCase().trim()
  if (raw && !VALID_DATA_SOURCES.includes(normalized)) {
    console.warn(
      `[Portfolio] VITE_DATA_SOURCE is invalid ("${raw}"). App is misconfigured. Valid values: ${VALID_DATA_SOURCES.join(', ')}. Defaulting to "embedded".`
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
