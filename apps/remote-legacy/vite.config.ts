import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import tsconfigPaths from 'vite-tsconfig-paths'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sc from './svelte.config'

const projectPath = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
    base: '/',
    root: projectPath('src'),
    publicDir: projectPath('static'),
    envDir: projectPath('.'),
    envPrefix: 'RVW_',
    appType: 'mpa',
    build: {
        emptyOutDir: true,
        assetsDir: 'assets',
        minify: 'terser',
        cssMinify: 'lightningcss',
        reportCompressedSize: false,
        outDir: projectPath('dist'),
        rollupOptions: {
            input: {
                _index: projectPath('src/index.html'),
            },
            output: {
                assetFileNames: 'assets/[name]-[hash][extname]',
                chunkFileNames: 'assets/chunks/[name]-[hash].js',
                entryFileNames: 'assets/modules/[name]-[hash].js',
            }
        },
    },
    css: {
        transformer: 'postcss',
    },
    plugins: [
        svelte(sc),
        tsconfigPaths(),
    ],
});