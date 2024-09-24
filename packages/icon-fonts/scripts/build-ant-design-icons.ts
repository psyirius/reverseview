import {
    generateFonts,
    FontAssetType,
    OtherAssetType,
} from '@zupit-it/fantasticon'
import * as fs from 'node:fs'
import * as path from 'node:path'
import resolve from 'resolve'

const PACKAGE_NAME = '@ant-design/icons-svg'

const pkgPath = resolve.sync(
    path.join(PACKAGE_NAME, 'package.json'),
    {
        basedir: import.meta.dirname,
    }
);
const pkgRoot = path.dirname(pkgPath);

fs.mkdirSync('dist/ant-design-icons', { recursive: true });

const getConfig = (type: string, prefix: string) => ({
    name: `ant-design-icons-${type}`,
    inputDir: path.resolve(pkgRoot, 'inline-svg', type),
    outputDir: 'dist/ant-design-icons',
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
    getConfig('filled', 'adi-filled')
).then(() => {
    console.log('Ant Design Icons Filled generated successfully');
})

// Outlined
generateFonts(
    getConfig('outlined', 'adi-outlined')
).then(() => {
    console.log('Ant Design Icons Outlined generated successfully');
})

// Twotone
generateFonts(
    getConfig('twotone', 'adi-twotone')
).then(() => {
    console.log('Ant Design Icons Twotone generated successfully');
})