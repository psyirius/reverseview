import axios from 'axios';
import * as fs from 'node:fs';
import * as path from 'node:path';

const yui3Version = '3.18.1';

// const baseURL = 'https://yui-s.yahooapis.com/combo?';
const baseURL = `http://yui.yahooapis.com/${yui3Version}/build/`;

async function downloadModule(moduleName, extension = 'js', minified = true, filename = null) {
    try {
        filename ??= `${moduleName}${minified ? '-min' : ''}.${extension}`
        const outputPath = path.join(path.dirname(import.meta.dirname), `app/lib/yui3/${yui3Version}`, moduleName, filename);
        if (fs.existsSync(outputPath)) {
            // console.warn("Skipping module '" + moduleName + "'");
            return;
        }

        const response = await axios.get(`${baseURL}${moduleName}/${filename}`, {
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
            'yui',
            'oop',
            'timers',
            'promise',
            'dd-ddm-base',
            'yui-throttle',
            'button-core',
            'button',
            'escape',
            'dd-drag',
            'dd-proxy',
            'transition',
            'gesture-simulate',
            'tabview',
            'tabview-base',
            'arraylist',
            'widget-parent',
            'widget-child',
            'node-focusmanager',
            'async-queue',
            'event-simulate',
            'event-custom-base',
            'event-custom-complex',
            'event-base',
            'dom-core',
            'base-core',
            'base-base',
            'base-pluginhost',
            'base-observable',
            'dom-base',
            'selector-native',
            'selector',
            'node-core',
            'base-build',
            'panel',
            'attribute-complex',
            'widget-position-constrain',
            'widget-position-align',
            'widget-stack',
            'widget-position',
            'widget-modality',
            'widget-buttons',
            'widget-stdmod',
            'widget-autohide',
            'button-plugin',
            'attribute-core',
            'attribute-observable',
            'attribute-extras',
            'attribute-base',
            'paginator-core',
            'paginator',
            'dom-style',
            'node-base',
            'event-delegate',
            'node-event-delegate',
            'pluginhost-base',
            'pluginhost-config',
            'node-pluginhost',
            'dom-screen',
            'node-screen',
            'node-style',
            'datatype-xml-parse',
            'datatype-xml-format',
            'datatype-number-parse',
            'datatype-number-format',
            'plugin',
            'resize-proxy',
            'resize-constrain',
            'event-hover',
            'event-outside',
            'event-key',
            'event-resize',
            'event-flick',
            'event-tap',
            'widget-base',
            'widget-skin',
            'widget-htmlparser',
            'widget-uievents',
            'event-synthetic',
            'classnamemanager',
            'selector-css2',
            'event-focus',
            'event-mousewheel',
            'event-mouseenter',
        ];

        for (const moduleName of modules) {
            await downloadModule(moduleName, 'js', true);
        }
    }

    // css modules
    {
        const modules = [
            'cssbase',
            'cssfonts',
            'cssgrids',
            'cssreset',
            'cssnormalize',

            'cssbutton',
        ];

        for (const moduleName of modules) {
            await downloadModule(moduleName, 'css', true);
        }
    }

    // assets
    {
        const modules = [
            ['widget-base', 'assets/skins/sam/widget-base.css'],
            ['tabview', 'assets/skins/sam/tabview.css'],
            ['widget-modality', 'assets/skins/sam/widget-modality.css'],
            ['widget-stack', 'assets/skins/sam/widget-stack.css'],
            ['panel', 'assets/skins/sam/panel.css'],
        ];

        for (const [moduleName, filename] of modules) {
            await downloadModule(moduleName, null, null, filename);
        }
    }
})();