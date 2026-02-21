import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/react.tsx', 'src/vue.ts'],
  format: ['esm', 'cjs'],
  dts: { tsConfigPath: './tsconfig.build.json' },
  clean: true,
  outDir: 'dist',
  target: 'es2020',
  minify: false,
  sourcemap: true,
  external: ['react', 'vue'],
});
