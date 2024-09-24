import { defineConfig } from 'tsup'

export default defineConfig({
    entry: [
        'src/index.ts',
        'src/cli.ts',
    ],
    format: ['cjs', 'esm'],
    outExtension: (ctx) => ({ js: (ctx.format === 'cjs') ? '.cjs' : '.mjs' }),
    splitting: false,
    sourcemap: true,
    clean: true,
})