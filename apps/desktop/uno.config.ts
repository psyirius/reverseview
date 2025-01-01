import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
    content: {
        filesystem: [
            'src/**/*.{ts,js,html,jsx,tsx}',
        ],
    },
    rules: [
    ],
    presets: [
        presetUno(),
    ],
})