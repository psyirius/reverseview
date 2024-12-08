import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
    content: {
        filesystem: [
            'src/**/*.html',
        ],
    },
    rules: [
        // box-sizing
        ['box-border', { '-webkit-box-sizing': 'border-box' }],
        ['box-content', { '-webkit-box-sizing': 'content-box' }],


    ],
    presets: [
        presetUno(),
    ],
})