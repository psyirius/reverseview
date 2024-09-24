import {
    generateFonts,
    FontAssetType,
    OtherAssetType,
} from '@zupit-it/fantasticon'
import * as fs from 'node:fs'
import * as path from 'node:path'
import resolve from 'resolve'

const PACKAGE_NAME = 'lucide-static'

const pkgPath = resolve.sync(
    path.join(PACKAGE_NAME, 'package.json'),
    {
        basedir: import.meta.dirname,
    }
);
const pkgRoot = path.dirname(pkgPath);

fs.mkdirSync('dist/lucide-icons', { recursive: true });

generateFonts({
    name: 'lucide-icons',
    inputDir: path.resolve(pkgRoot, 'icons'),
    outputDir: 'dist/lucide-icons',
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
    prefix: 'luci',
}).then(() => {
    console.log('Lucide Icons generated successfully');
})

// TODO: Add option for using the prebuilt font icon files