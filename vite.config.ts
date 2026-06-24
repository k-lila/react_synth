import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: false,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/classes/**', 'src/utils/**', 'src/store/reducers/**'],
      exclude: ['**/*.test.ts', '**/*.tsx']
    }
  }
})
