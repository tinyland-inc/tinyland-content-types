import { configDefaults, defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  test: {
    name: 'tinyland-content-types',
    root: __dirname,
    include: ['tests/**/*.test.ts'],
    // Under Bazel the vitest root also holds test_/test.runfiles; without this
    // exclude every file runs twice.
    exclude: [...configDefaults.exclude, '**/bazel-*/**', '**/*.runfiles/**'],
    globals: true,
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
