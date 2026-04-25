import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    env: {
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
    },
    environment: 'node',
    globals: true,
    setupFiles: [],
    include: ['src/**/*.spec.ts'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'test/'],
    },
  },
});
