import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'tinyland-content-types',
    globals: true,
    environment: 'node',
  },
});
