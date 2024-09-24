import {
    generateFonts,
    FontAssetType,
    OtherAssetType,
} from '@zupit-it/fantasticon'
import * as fs from 'node:fs'
import * as path from 'node:path'
import resolve from 'resolve'

const PACKAGE_NAME = '@phosphor-icons/core'

const pkgPath = resolve.sync(
    path.join(PACKAGE_NAME, 'package.json'),
    {
        basedir: import.meta.dirname,
    }
);
const pkgRoot = path.dirname(pkgPath);

fs.mkdirSync('dist/phosphor-icons', { recursive: true });

const getConfig = (type: string, prefix: string) => ({
    name: `phosphor-icons-${type}`,
    inputDir: path.resolve(pkgRoot, 'assets', type),
    outputDir: 'dist/phosphor-icons',
    fontTypes: [
        FontAssetType.TTF,
        // FontAssetType.EOT,
        // FontAssetType.WOFF,
        // FontAssetType.WOFF2,
        // FontAssetType.SVG,
    ],
    assetTypes: [
        OtherAssetType.CSS,
        // OtherAssetType.SCSS,
        OtherAssetType.HTML,
        OtherAssetType.JSON,
        // OtherAssetType.TS
    ],
    formatOptions: {
        json: {
            indent: 2,
        },
    },
    templates: {
        // css: 'templates/css.hbs'
    },
    tag: 'i',
    prefix,
});

// Bold
generateFonts(
    getConfig('bold', 'pib')
).then(() => {
    console.log('Phosphor Icons Bold generated successfully');
})

// Duotone
generateFonts(
    getConfig('duotone', 'pid')
).then(() => {
    console.log('Phosphor Icons Duotone generated successfully');
})

// Fill
generateFonts(
    getConfig('fill', 'pif')
).then(() => {
    console.log('Phosphor Icons Fill generated successfully');
})

// Light
generateFonts(
    getConfig('light', 'pil')
).then(() => {
    console.log('Phosphor Icons Light generated successfully');
})

// Regular
generateFonts(
    getConfig('regular', 'pir')
).then(() => {
    console.log('Phosphor Icons Regular generated successfully');
})

// Thin
generateFonts(
    getConfig('thin', 'pit')
).then(() => {
    console.log('Phosphor Icons Thin generated successfully');
})