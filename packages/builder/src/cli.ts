import { Command, Option } from 'commander'
import fs from 'node:fs'
import path from 'node:path'

import { rollup, Plugin, RollupCache } from 'rollup'

import resolve from '@rollup/plugin-node-resolve'
import alias from '@rollup/plugin-alias'
import swc from '@rollup/plugin-swc'
import inject from '@rollup/plugin-inject'
import terser from '@rollup/plugin-terser'
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

import esbuild from 'rollup-plugin-esbuild'
import tsConfigPaths from 'rollup-plugin-tsconfig-paths'
import { visualizer } from 'rollup-plugin-visualizer'
import { rollupPluginHTML } from '@web/rollup-plugin-html'

import externalize from './rollup/utils/externalize'
import * as defineUtils from './rollup/utils/define'
import PluginWatcher from './rollup/utils/plugin-watcher'

import typescript from './rollup/plugins/typescript'
import svelte from 'rollup-plugin-svelte';
import * as swc_ from '@swc/core'
import * as esbuild_ from 'esbuild'

const prog = new Command()
    .name('build.src')
    .version('0.0.0')
    .description('Air App Builder')
    .addOption(
        new Option('-c, --config <config>', 'choose a config')
    )
    .addOption(
        new Option('-w, --cwd <working-dir>', 'working directory')
    )

prog.parse(process.argv);

const options = prog.opts();

// console.log(options);

const WORKING_DIR = path.resolve(options.cwd || process.cwd());

// console.log(WORKING_DIR);

type OutputFormat = 'amd' | 'cjs' | 'es' | 'iife' | 'umd' | 'system';

type Config = {
    input?: string | string[] | Record<string, string>,
    output?: {
        format: OutputFormat,
        dir: string,
    },
    strip?: {
        labels: string[],
        comments: boolean | RegExp,
        console: boolean,
        debugger: boolean,
    },
    define?: Record<string, any>,
    external?: string[],
    compact?: boolean,
    minify?: boolean,
    treeshake?: boolean,
}

function loadConfig(config?: string): Config {
    // TODO
    return {};
}

const config = loadConfig(options.config);

function MxPlugin(): Plugin {
    return {
        name: 'zwing',
        // buildStart(options) {
        //     console.log('buildStart', options);
        // },
        // resolveId(id) {
        //     console.log('Resolve:', id);
        // },
        // load(id) {
        //     console.log('Load:', id);
        // },
        // moduleParsed(info) {
        //     console.log('Parsed:', info);
        // },
        // transform(code, id) {
        //     console.log('Transform:', id);
        // },
        // buildEnd(options) {
        //     console.log('buildEnd', options);
        // }
    };
}

const pw = new PluginWatcher();

// const DIST_DIR = path.resolve(WORKING_DIR, 'out');
const DIST_DIR = path.resolve(WORKING_DIR, '.air/js');

!(async () => {
    let cache;

    const bundle = await rollup({
        cache,
        input: {
            // __preload__: path.resolve(WORKING_DIR, 'src/__preload__.ts'),
            // boot: path.resolve(WORKING_DIR, 'src/boot.ts'), // loads the main app (index)

            // app
            'app/main': path.resolve(WORKING_DIR, 'src/app/main.ts'),

            // presentation
            'presentation/main': path.resolve(WORKING_DIR, 'src/presentation/main.ts'),

            // stageview
            'stageview/main': path.resolve(WORKING_DIR, 'src/stageview/main.ts'),

            // test/svelte
            // 'test/svelte/main': path.resolve(WORKING_DIR, 'src/test/svelte/main.ts'),

            // sandbox
            // 'sandbox/boot': path.resolve(WORKING_DIR, 'src/sandbox/boot.ts'),
        },
        plugins: pw.wrap([
            [
                MxPlugin(),
                // rollupPluginHTML({
                //     input: path.resolve(WORKING_DIR, 'src/index.html'),
                //     publicPath: 'static',
                // }),
                svelte({
                    compilerOptions: {
                        // legacy: true,
                        // generate: 'client',
                        // runes: true,
                        css: 'injected',
                        // discloseVersion: false,
                        // preserveWhitespace: false,
                    },
                    emitCss: false,
                }),
                tsConfigPaths({
                    tsConfigPath: path.resolve(WORKING_DIR, 'tsconfig.x.json'),
                    respectCoreModule: true,
                }),
                inject({
                    // __spreadArray: [ 'tslib', '__spreadArray' ],

                    // // import { Promise } from 'es6-promise';
                    // Promise: ['@shims/es6-promise', 'Promise'],

                    // import { Map, Set } from 'es6-collections';
                    // Map: [ '@shims/es6-collections', 'Map' ],
                    // Set: [ '@shims/es6-collections', 'Set' ],

                    // // import { Symbol } from 'es6-symbol';
                    // Symbol: [ '@shims/es6-symbol', 'Symbol' ],
                    //
                    // // import { WeakMap } from 'es6-weak-map';
                    // WeakMap: [ '@shims/es6-weak-map', 'WeakMap' ],

                    // import WeakMap from 'es6-weak-map';
                    // WeakMap: 'es6-weak-map',

                    // import { queueMicrotask } from 'web-shims';
                    queueMicrotask: [ '@shims/web', 'queueMicrotask' ],

                    // import { MutationObserver } from 'web-shims';
                    MutationObserver: [ '@shims/web', 'MutationObserver' ],

                    // import { globalThis } from 'web-shims';
                    // globalThis: [ '@shims/web', 'globalThis' ],

                    // import { fetch } from 'web-shims';
                    fetch: [ '@shims/web', 'fetch' ],

                    // import { console } from 'web-shims';
                    // console: [ '@shims/web', 'console' ],
                }),
                commonjs({

                }),
                alias({
                    entries: [
                        // { find: '@lib/zrx/preact', replacement: 'preact' },
                    ]
                }),
                resolve({

                }),
                json(),
                typescript({
                    tsconfig: path.resolve(WORKING_DIR, 'tsconfig.x.json'),
                }),
                esbuild({
                    drop: [
                        'debugger',
                        'console',
                    ],
                    dropLabels: [
                        'DEV',
                        'TEST',
                        'TRACE',
                    ],
                    define: defineUtils.prepare({
                        'import.meta.env': {
                            // ENV: 'production',
                            // DEV: false,
                            // TEST: false,
                            // TRACE: false,
                        }
                    }),
                    loaders: {
                    },
                    supported: {
                        // 'bigint': false,
                        // 'arrow': false,
                        // 'decorators': false,
                        // 'destructuring': false,
                        // 'dynamic-import': false,
                        // 'class': false,
                        // 'for-await': false,
                        // 'for-of': false,
                        // 'import-meta': false,
                        // 'new-target': false,
                        // 'template-literal': false,
                        // 'generator': false,
                        // 'object-extensions': false,
                        // 'node-colon-prefix-import': false,
                        // 'node-colon-prefix-require': false,
                        // 'async-await': false,
                        // 'top-level-await': false,
                        // 'async-generator': false,
                        // 'const-and-let': false,
                        // 'import-assertions': false,
                        // 'import-attributes': false,
                    },
                }),
                swc({
                    swc: {
                        jsc: {
                            target: 'es5',
                            // target: 'es3',
                            externalHelpers: true,
                        }
                    }
                }),
            ],
            // terser({
            //     ecma: 5,
            // }),
            visualizer({
                emitFile: true,
                filename: "stats.html",
                open: true,
            }),
        ]),
        external: externalize([
            'jquery', // global jQuery is still needed cuz we have global plugins

            // 'tslib',
            // '@swc/helpers/_/*',
        ]),
        // treeshake: false,
    });

    cache = bundle.cache;

    const ro = await bundle.write({
        format: 'esm',
        dir: DIST_DIR,
        generatedCode: {
            preset: 'es5',
            arrowFunctions: false,
            constBindings: true,
            objectShorthand: false,
            reservedNamesAsProps: true,
            symbols: false,
        },
        compact: false,
    });

    // The final es3 adjustments needed
    for (const op of ro.output) {
        // console.log(op);
        if (op.type === 'chunk' && op.preliminaryFileName.endsWith('.js')) {
            const file = path.resolve(DIST_DIR, op.preliminaryFileName);

            const isApp = op.preliminaryFileName.endsWith('app/main.js')

            let code = op.code;

            // const res = esbuild_.transformSync(code, {
            //     target: 'es5',
            //     format: 'esm',
            // });
            //
            // code = res.code;

            code = swc_.transformSync(code, {
                jsc: {
                    target: 'es3',
                    externalHelpers: false,
                },
                module: {
                    type: 'amd',
                    importInterop: 'node',
                },
                minify: false,
                isModule: 'unknown',
            }).code;

            // code = swc_.transformSync(code, {
            //     jsc: {
            //         target: 'es3',
            //         // externalHelpers: true,
            //     },
            //     minify: false,
            //     isModule: false,
            // }).code;

            fs.writeFileSync(file, code);
        }
    }

    // console.dir(ro, { depth: 10 });
})();