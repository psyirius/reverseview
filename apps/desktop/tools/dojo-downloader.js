import axios from 'axios';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Get from https://downloads.dojotoolkit.org/

const dojoVersion = '1.17.3';

const dojoBaseURL = `https://download.dojotoolkit.org/release-${dojoVersion}/dojo.js`;
const dojoFullURL = `https://download.dojotoolkit.org/release-${dojoVersion}/dojo-release-${dojoVersion}.zip`;

// const baseURL = `https://cdn.jsdelivr.net/npm/dojo@${dojoVersion}`;
// const baseURL = `https://ajax.googleapis.com/ajax/libs/dojo/${dojoVersion}`;
const baseURL = `https://downloads.dojotoolkit.org/release-${dojoVersion}/dojo-release-${dojoVersion}`;

async function downloadModule(packageName = 'dojo', moduleName, extension = 'js', minified = true, filename = null) {
    try {
        filename ??= `${moduleName}${minified ? '' : '.uncompressed.js'}.${extension}`
        const outputPath = path.join(path.dirname(import.meta.dirname), `static/lib/${packageName}`, moduleName, filename);
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
        console.error(`Error downloading ${moduleName}:`, error.config.url);
    }
}

(async function main() {
    // dojo
    {
        const modules = [
            // base
            ['dojo', 'dojo.js'],

            // individual modules
            ['dojo', '_firebug/firebug.js'],

            ['dojo', '_base/Deferred.js'],
            ['dojo', '_base/Color.js'],
            ['dojo', '_base/NodeList.js'],
            ['dojo', '_base/declare.js'],
            ['dojo', '_base/config.js'],
            ['dojo', '_base/event.js'],
            ['dojo', '_base/fx.js'],
            ['dojo', '_base/html.js'],
            ['dojo', '_base/connect.js'],
            ['dojo', '_base/browser.js'],
            ['dojo', '_base/array.js'],
            ['dojo', '_base/kernel.js'],
            ['dojo', '_base/lang.js'],
            ['dojo', '_base/loader.js'],
            ['dojo', '_base/sniff.js'],
            ['dojo', '_base/json.js'],
            ['dojo', '_base/query.js'],
            ['dojo', '_base/unload.js'],
            ['dojo', '_base/url.js'],
            ['dojo', '_base/window.js'],
            ['dojo', '_base/xhr.js'],

            // modules
            ['dojo', 'Deferred.js'],
            ['dojo', 'DeferredList.js'],
            ['dojo', 'Evented.js'],
            ['dojo', 'NodeList.js'],
            ['dojo', 'NodeList-data.js'],
            ['dojo', 'NodeList-dom.js'],
            ['dojo', 'NodeList-fx.js'],
            ['dojo', 'NodeList-html.js'],
            ['dojo', 'NodeList-traverse.js'],
            ['dojo', 'NodeList-manipulate.js'],
            ['dojo', 'Stateful.js'],

            ['dojo', 'on.js'],
            ['dojo', 'json.js'],
            ['dojo', 'json5.js'],
            ['dojo', 'json5/parse.js'],
            ['dojo', 'json5/unicode.js'],
            ['dojo', 'json5/util.js'],
            ['dojo', 'back.js'],
            ['dojo', 'behavior.js'],
            ['dojo', 'aspect.js'],
            ['dojo', 'cache.js'],
            ['dojo', 'colors.js'],
            ['dojo', 'date.js'],
            ['dojo', 'debounce.js'],
            ['dojo', 'dom-attr.js'],
            ['dojo', 'dom-class.js'],
            ['dojo', 'dom-construct.js'],
            ['dojo', 'dom-prop.js'],
            ['dojo', 'dom-style.js'],
            ['dojo', 'dom.js'],
            ['dojo', 'domReady.js'],
            ['dojo', 'global.js'],
            ['dojo', 'has.js'],
            ['dojo', 'hash.js'],
            ['dojo', 'hccss.js'],
            ['dojo', 'html.js'],
            ['dojo', 'i18n.js'],
            ['dojo', 'io-query.js'],
            ['dojo', 'mouse.js'],
            ['dojo', 'node.js'],
            ['dojo', 'number.js'],
            ['dojo', 'parser.js'],
            ['dojo', 'query.js'],
            ['dojo', 'regexp.js'],
            ['dojo', 'request.js'],
            ['dojo', 'require.js'],
            ['dojo', 'sniff.js'],
            ['dojo', 'string.js'],
            ['dojo', 'text.js'],
            ['dojo', 'throttle.js'],
            ['dojo', 'topic.js'],
            ['dojo', 'uacss.js'],
            ['dojo', 'when.js'],
            ['dojo', 'window.js'],
            ['dojo', 'robot.js'],
            ['dojo', 'robotx.js'],
            ['dojo', 'router.js'],
            ['dojo', 'ready.js'],
            ['dojo', 'cookie.js'],
            ['dojo', 'touch.js'],
            ['dojo', 'store/util/SimpleQueryEngine.js'],
            ['dojo', 'store/util/QueryResults.js'],
            ['dojo', 'dom-geometry.js'],
            ['dojo', 'keys.js'],
        ];

        for (const [moduleName, filename] of modules) {
            await downloadModule('', moduleName, undefined, true, filename);
        }
    }

    // dojox
    {
        const modules = [
            ['dojox', 'collections.js'],
            ['dojox', 'color.js'],
            ['dojox', 'jq.js'],
            ['dojox', 'jsonPath.js'],
            ['dojox', 'math.js'],
            ['dojox', 'html.js'],
            ['dojox', 'mvc.js'],
            ['dojox', 'socket.js'],
            ['dojox', 'sql.js'],
            ['dojox', 'uuid.js'],
            ['dojox', 'validate.js'],
            ['dojox', 'wire.js'],
        ];

        for (const [moduleName, filename] of modules) {
            await downloadModule('', moduleName, undefined, true, filename);
        }
    }

    // dijit
    {
        const modules = [
            // base
            ['dijit', 'dijit.js'],

            // full
            ['dijit', 'dijit-all.js'],

            // individual modules
            ['dijit', 'Editor.js'],
            ['dijit', 'WidgetSet.js'],
            ['dijit', 'Destroyable.js'],
            ['dijit', '_TemplatedMixin.js'],
            ['dijit', 'Menu.js'],
            ['dijit', 'MenuBar.js'],
            ['dijit', 'TitlePane.js'],
            ['dijit', 'Toolbar.js'],
            ['dijit', '_WidgetBase.js'],
            ['dijit', 'Tooltip.js'],
            ['dijit', 'TooltipDialog.js'],
            ['dijit', 'ColorPalette.js'],
            ['dijit', 'ConfirmDialog.js'],
            ['dijit', 'ConfirmTooltipDialog.js'],
            ['dijit', '_WidgetsInTemplateMixin.js'],
            ['dijit', 'Declaration.js'],
            ['dijit', 'layout/BorderContainer.js'],
            ['dijit', 'layout/TabContainer.js'],
            ['dijit', 'layout/ContentPane.js'],
            ['dijit', 'Tree.js'],
            ['dijit', 'Viewport.js'],
            ['dijit', 'Dialog.js'],
            ['dijit', 'DialogUnderlay.js'],
            ['dijit', 'DropDownMenu.js'],
            ['dijit', 'Fieldset.js'],
            ['dijit', 'InlineEditBox.js'],
            ['dijit', 'a11y.js'],
            ['dijit', 'a11yclick.js'],
            ['dijit', '_base.js'],
            ['dijit', '_base/focus.js'],
            ['dijit', '_base/manager.js'],
            ['dijit', '_base/place.js'],
            ['dijit', '_base/popup.js'],
            ['dijit', '_base/scroll.js'],
            ['dijit', '_base/sniff.js'],
            ['dijit', '_base/typematic.js'],
            ['dijit', '_base/wai.js'],
            ['dijit', '_base/window.js'],
            ['dijit', '_Widget.js'],
            ['dijit', '_Templated.js'],
            ['dijit', '_Container.js'],
            ['dijit', '_MenuBase.js'],
            ['dijit', 'focus.js'],
            ['dijit', 'hccss.js'],
            ['dijit', 'place.js'],
            ['dijit', 'popup.js'],
            ['dijit', 'registry.js'],
            ['dijit', 'robot.js'],
            ['dijit', 'robotx.js'],
            ['dijit', 'selection.js'],
            ['dijit', 'layout/utils.js'],
            ['dijit', 'layout/TabController.js'],
            ['dijit', 'layout/ScrollingTabController.js'],
            ['dijit', 'layout/_ContentPaneResizeMixin.js'],
            ['dijit', 'layout/_TabContainerBase.js'],
            ['dijit', 'layout/LayoutContainer.js'],
            ['dijit', '_KeyNavContainer.js'],
            ['dijit', '_CssStateMixin.js'],
            ['dijit', 'BackgroundIframe.js'],
            ['dijit', 'main.js'],
            ['dijit', '_HasDropDown.js'],
            ['dijit', 'form/Button.js'],
            ['dijit', 'nls/common.js'],
            ['dijit', 'nls/loading.js'],
            ['dijit', 'MenuItem.js'],
            ['dijit', 'layout/StackController.js'],
            ['dijit', 'layout/StackContainer.js'],
            ['dijit', 'layout/_LayoutWidget.js'],
            ['dijit', '_FocusMixin.js'],
            ['dijit', '_OnDijitClickMixin.js'],

            // themes
            ['dijit', 'themes/claro/claro.css'],
        ];

        for (const [moduleName, filename] of modules) {
            await downloadModule('', moduleName, undefined, true, filename);
        }
    }
})();