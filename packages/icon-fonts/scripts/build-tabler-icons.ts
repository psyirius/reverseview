import {
    generateFonts,
    FontAssetType,
    OtherAssetType,
} from '@zupit-it/fantasticon'
import * as fs from 'node:fs'
import * as path from 'node:path'
import resolve from 'resolve'

const PACKAGE_NAME = '@tabler/icons'

const pkgPath = resolve.sync(
    path.join(PACKAGE_NAME, 'package.json'),
    {
        basedir: import.meta.dirname,
    }
);
const pkgRoot = path.dirname(pkgPath);

fs.mkdirSync('dist/tabler-icons', { recursive: true });

const getConfig = (type: string, prefix: string) => ({
    name: `tabler-icons-${type}`,
    inputDir: path.resolve(pkgRoot, 'icons', type),
    outputDir: 'dist/tabler-icons',
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

// Filled
generateFonts(
    getConfig('filled', 'tif')
).then(() => {
    console.log('Tabler Icons Filled generated successfully');
})

// Outline
generateFonts(
    getConfig('outline', 'tio')
).then(() => {
    console.log('Tabler Icons Outline generated successfully');
})