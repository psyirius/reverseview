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
            'test',
            'console-filters',
            'test-console',
            'timers',
            'promise',
            'event-touch',
            'event-move',
            'widget-anim',
            'dd-ddm-base',
            'yui-throttle',
            'button-core',
            'button',
            'escape',
            'dd-drag',
            'dd-proxy',
            'transition',
            'io-queue',
            'dump',
            'queue-promote',
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
            'overlay',
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
            'io-base',
            'io-xdr',
            'io-form',
            'history-base',
            'history-hash',
            'app-base',
            'pjax-base',
            'view',
            'model',
            'parallel',
            'router',
            'pjax-content',
            'app-content',
            'app-transitions',
            'history-html5',
            'io-upload-iframe',
            'event-mousewheel',
            'event-mouseenter',
            'node-event-simulate',
            'array-extras',
            'model-sync-rest',
            'model-sync-local',
            'view-node-map',
            'app-transitions-native',
            'view-node-map',
            'json-stringify',
            'lazy-model-list',
            'model-list',
            'json-parse',
            'array-invoke',
            'querystring-stringify-simple',
            'intl',
            'console',
            'dd-plugin',
            'color-base',
            'anim-base',
            'anim-color',
            'anim-xy',
            'anim-curve',
            'anim-easing',
            'anim-node-plugin',
            'anim-scroll',
            'autocomplete-list',
            'autocomplete-list-keys',
            'shim-plugin',
            'autocomplete-base',
            'event-valuechange',
            'autocomplete-sources',
            'selector-css3',
            'array-extras',
            'autocomplete-plugin',
            'text-data-wordbreak',
            'text-wordbreak',
            'autocomplete-filters',
            'autocomplete-filters',
            'highlight-base',
            'autocomplete-highlighters',
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
            'app-transitions-css',
        ];

        for (const moduleName of modules) {
            await downloadModule(moduleName, 'css', true);
        }
    }

    // assets
    {
        const modules = [
            ['widget-base', 'assets/skins/sam/widget-base.css'],
            ['widget-base', 'assets/skins/night/widget-base.css'],

            ['tabview', 'assets/skins/sam/tabview.css'],
            ['tabview', 'assets/skins/night/tabview.css'],

            ['widget-modality', 'assets/skins/sam/widget-modality.css'],
            ['widget-modality', 'assets/skins/night/widget-modality.css'],

            ['widget-stack', 'assets/skins/sam/widget-stack.css'],
            ['widget-stack', 'assets/skins/night/widget-stack.css'],

            ['panel', 'assets/skins/sam/panel.css'],
            ['panel', 'assets/skins/night/panel.css'],

            ['overlay', 'assets/skins/sam/overlay.css'],
            ['overlay', 'assets/skins/night/overlay.css'],

            ['console', 'assets/skins/sam/console.css'],
            ['test-console', 'assets/skins/sam/test-console.css'],
            ['console-filters', 'assets/skins/sam/console-filters.css'],

            ['autocomplete-list', 'assets/skins/sam/autocomplete-list.css'],
            ['autocomplete-list', 'assets/skins/night/autocomplete-list.css'],

            ['console', 'lang/console.js'],
            ['console', 'lang/console_en.js'],

            ['autocomplete-list', 'lang/autocomplete-list.js'],
            ['autocomplete-list', 'lang/autocomplete-list_en.js'],
        ];

        for (const [moduleName, filename] of modules) {
            await downloadModule(moduleName, null, null, filename);
        }
    }
})();