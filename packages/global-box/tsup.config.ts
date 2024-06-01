import { defineConfig, type Options } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: ['./src/index.{ts,tsx}'],
  format: ['cjs', 'esm'],
  dts: true,
  banner: {
    js: "'use client'",
  },
  ...options,
}));
