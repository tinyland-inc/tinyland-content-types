import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));


export default defineConfig({
  root: __dirname,
  test: {
    name: 'tinyland-content-types',
    root: __dirname,
    globals: true,
    exclude: ['**/bazel-*/**', '**/node_modules/**'],
    environment: 'node',
    pool: 'threads',
    deps: {
      interopDefault: true,
    },
    server: {
      deps: {
        inline: ['@fast-check/vitest'],
      },
    },
  },
});
