import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        sourcemap: true,
        emptyOutDir: true,
        minify: false,
        lib: {
            entry: [
                resolve(__dirname, 'src/index.js'),
                resolve(__dirname, 'src/cli.ts'),
            ],
            formats: ['es', 'cjs'],
            fileName: (format, name) => {
                switch (format) {
                    case 'es': return `${name}.mjs`;
                    case 'cjs': return `${name}.cjs`;
                    default: return `${name}.${format}.js`;
                }
            },
        },
        rollupOptions: {
            external: [
                /node:*/, // node builtins
            ]
        },
    },
})