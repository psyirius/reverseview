import {
    generateFonts,
    FontAssetType,
    OtherAssetType,
} from '@zupit-it/fantasticon'
import * as fs from 'node:fs'
import * as path from 'node:path'
import resolve from 'resolve'

const PACKAGE_NAME = 'heroicons'

const pkgPath = resolve.sync(
    path.join(PACKAGE_NAME, 'package.json'),
    {
        basedir: import.meta.dirname,
    }
);
const pkgRoot = path.dirname(pkgPath);

fs.mkdirSync('dist/heroicons', { recursive: true });

const pathMap = {
    outline: '24/outline',
    solid: '24/solid',
    mini: '20/solid',
    micro: '16/solid',
}

type IconTypes = keyof typeof pathMap;

const getConfig = (type: IconTypes, prefix: string) => ({
    name: `heroicons-${type}`,
    inputDir: path.resolve(pkgRoot, pathMap[type]),
    outputDir: 'dist/heroicons',
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

// Outline
generateFonts(
    getConfig('outline', 'hio')
).then(() => {
    console.log('Heroicons Outline generated successfully');
})

// Solid
generateFonts(
    getConfig('solid', 'his')
).then(() => {
    console.log('Heroicons Solid generated successfully');
})

// Mini
generateFonts(
    getConfig('mini', 'him')
).then(() => {
    console.log('Heroicons Mini generated successfully');
})

// Micro
generateFonts(
    getConfig('micro', 'hiu')
).then(() => {
    console.log('Heroicons Micro generated successfully');
})