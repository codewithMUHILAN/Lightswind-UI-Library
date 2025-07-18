// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // Entry point for your library
  format: ['esm', 'cjs'], // Export formats: ESM (for modern browsers) and CJS (for compatibility)
  target: 'esnext', // Target modern JavaScript
  clean: true, // Clean dist folder before building
  dts: true, // Generate TypeScript declaration files
  external: [], // Add external dependencies if any
  minify: true, // Minify the output for smaller file size
});
