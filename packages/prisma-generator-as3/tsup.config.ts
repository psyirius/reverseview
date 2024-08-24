import { defineConfig } from 'tsup'

export default defineConfig({
    target: 'node16',
    format: [
        'esm',
        'cjs'
    ],
    outExtension: (ctx) => ({
        js: (ctx.format === 'cjs') ? '.cjs' : '.mjs',
    }),
    entry: [
        'src/generator.ts',
    ],
    outDir: 'dist'
})