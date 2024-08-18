import { defineConfig } from 'tsup'

export default defineConfig({
    entry: [
        'src/index.js',
    ],
    format: ['cjs', 'esm'],
    legacyOutput: true,
    splitting: false,
    sourcemap: true,
    clean: true,
})