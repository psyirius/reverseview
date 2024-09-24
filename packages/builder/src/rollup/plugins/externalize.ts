import { Plugin, ResolveIdResult } from 'rollup'
import { createFilter } from '@rollup/pluginutils'
import micromatch from 'micromatch'

interface Options {
    external?: string[];
}

const DEFAULT_OPTIONS: Options = {
    external: [],
}

const PLUGIN_NAME = 'rollup-plugin-externalize';

export default function externalize(options?: Options): Plugin {
    options ??= DEFAULT_OPTIONS;

    const external = Array.from(new Set(options.external ?? []));

    return {
        name: PLUGIN_NAME,
        resolveId: {
            order: 'pre',
            handler(source, importer, options): ResolveIdResult {
                console.log('resolver', {
                    source, importer, options,
                });

                if (micromatch.isMatch(source, external)) {
                    return {
                        id: source,
                        external: true,
                        resolvedBy: PLUGIN_NAME,
                    };
                }

                return null;
            },
        },
    }
}