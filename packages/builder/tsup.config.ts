import { defineConfig } from 'tsup'

export default defineConfig({
    entry: [
        // 'src/index.js',
        'src/build.js',
    ],
    format: ['cjs', 'esm'],
    outExtension: (ctx) => ({ js: (ctx.format === 'cjs') ? '.cjs' : '.mjs' }),
    legacyOutput: true,
    splitting: false,
    sourcemap: true,
    clean: true,
})