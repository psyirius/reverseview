import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
    content: {
        filesystem: [
            'src/**/*.{ts,js,html,jsx,tsx}',
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