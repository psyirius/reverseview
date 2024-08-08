import axios from 'axios';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Get from https://downloads.dojotoolkit.org/

const dojoVersion = '1.17.3';

// const baseURL = `https://ajax.googleapis.com/ajax/libs/dojo/${dojoVersion}`;
// const baseURL = `https://cdn.jsdelivr.net/npm/dojo@${dojoVersion}`;
const baseURL = `https://downloads.dojotoolkit.org/release-${dojoVersion}/dojo-release-${dojoVersion}`;

async function downloadModule(moduleName, extension = 'js', minified = true, filename = null) {
    try {
        filename ??= `${moduleName}${minified ? '' : '.uncompressed.js'}.${extension}`
        const outputPath = path.join(path.dirname(import.meta.dirname), `app/lib/dojo/${dojoVersion}`, moduleName, filename);
        if (fs.existsSync(outputPath)) {
            // console.warn("Skipping module '" + moduleName + "'");
            return;
        }

        const response = await axios.get(`${baseURL}/${moduleName}/${filename}`, {
            responseType: 'arraybuffer'
        });

        // Ensure the download directory exists
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });

        // Write the file
        fs.writeFileSync(outputPath, response.data);

        console.log(`Downloaded: ${moduleName} | ${filename}`);
    } catch (error) {
        console.error(`Error downloading ${moduleName}:`, error);
    }
}

(async function main() {
    // js modules
    {
        const modules = [
            'dojo',
        ];

        for (const moduleName of modules) {
            await downloadModule(moduleName, 'js', true);
        }
    }

    // // css modules
    // {
    //     const modules = [
    //         'cssbase',
    //         'cssfonts',
    //         'cssgrids',
    //         'cssreset',
    //         'cssnormalize',
    //
    //         'cssbutton',
    //         'app-transitions-css',
    //     ];
    //
    //     for (const moduleName of modules) {
    //         await downloadModule(moduleName, 'css', true);
    //     }
    // }
    //
    // // assets
    // {
    //     const modules = [
    //         ['widget-base', 'assets/skins/sam/widget-base.css'],
    //         ['widget-base', 'assets/skins/night/widget-base.css'],
    //
    //         ['slider-base', 'assets/skins/sam/slider-base.css'],
    //         ['slider-base', 'assets/skins/night/slider-base.css'],
    //
    //         ['tabview', 'assets/skins/sam/tabview.css'],
    //         ['tabview', 'assets/skins/night/tabview.css'],
    //
    //         ['widget-modality', 'assets/skins/sam/widget-modality.css'],
    //         ['widget-modality', 'assets/skins/night/widget-modality.css'],
    //
    //         ['widget-stack', 'assets/skins/sam/widget-stack.css'],
    //         ['widget-stack', 'assets/skins/night/widget-stack.css'],
    //
    //         ['panel', 'assets/skins/sam/panel.css'],
    //         ['panel', 'assets/skins/night/panel.css'],
    //
    //         ['overlay', 'assets/skins/sam/overlay.css'],
    //         ['overlay', 'assets/skins/night/overlay.css'],
    //
    //         ['console', 'assets/skins/sam/console.css'],
    //         ['test-console', 'assets/skins/sam/test-console.css'],
    //         ['console-filters', 'assets/skins/sam/console-filters.css'],
    //
    //         ['autocomplete-list', 'assets/skins/sam/autocomplete-list.css'],
    //         ['autocomplete-list', 'assets/skins/night/autocomplete-list.css'],
    //
    //         ['console', 'lang/console.js'],
    //         ['console', 'lang/console_en.js'],
    //
    //         ['autocomplete-list', 'lang/autocomplete-list.js'],
    //         ['autocomplete-list', 'lang/autocomplete-list_en.js'],
    //     ];
    //
    //     for (const [moduleName, filename] of modules) {
    //         await downloadModule(moduleName, null, null, filename);
    //     }
    // }
})();