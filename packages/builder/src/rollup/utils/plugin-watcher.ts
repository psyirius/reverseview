import {InputPluginOption, Plugin} from 'rollup'

export default class PluginWatcher {
    constructor() {
    }

    plugins(): [Plugin, Plugin] {
        return [
            {
                name: 'rollup-plugin-watcher:pre',
            },
            {
                name: 'rollup-plugin-watcher:post',
            }
        ]
    }

    wrapPlugin(plugin: Plugin): Plugin {
        // console.log('WrapPlugin:', plugin.name);
        return plugin;
    }

    public wrap(input: InputPluginOption): InputPluginOption {
        if (!input) { return input }

        const plugins = Array.isArray(input) ? input : [input]

        const [pre, post] = this.plugins();

        plugins.unshift(pre);
        plugins.push(post);

        return plugins.map(async plugin => {
            const p = await plugin;

            if (!p) { return p }

            return Array.isArray(p) ? this.wrap(p) : this.wrapPlugin(p);
        })
    }
}