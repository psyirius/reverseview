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
    appType: 'mpa',
    envPrefix: 'RVW_',
    build: {
        emptyOutDir: true,
        assetsDir: 'assets',
        minify: 'terser',
        cssMinify: 'lightningcss',
        reportCompressedSize: false,
        outDir: projectPath('dist'),
        rollupOptions: {
            input: {
                index: projectPath('src/index.html'),
                control: projectPath('src/control.html'),
            },
            output: {
                assetFileNames: 'assets/[name]-[hash][extname]',
                chunkFileNames: 'assets/chunks/[name]-[hash].js',
                entryFileNames: 'assets/modules/[name]-[hash].js',
            }
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:50000',
                changeOrigin: true,
            },
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