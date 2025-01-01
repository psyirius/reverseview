import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
    content: {
        filesystem: [
            'src/**/*.html',
            'src/**/*.jsx',
            'src/**/*.tsx',
        ],
    },
    rules: [
    ],
    presets: [
        presetUno(),
    ],
})