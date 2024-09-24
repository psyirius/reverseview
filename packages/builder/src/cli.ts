import { Command, Option } from 'commander'
import fs from 'node:fs'
import path from 'node:path'

import { rollup, Plugin } from 'rollup'

import nodeResolve from '@rollup/plugin-node-resolve'
import swc from '@rollup/plugin-swc'
import alias from "@rollup/plugin-alias";

import esbuild from 'rollup-plugin-esbuild'
import tsConfigPaths from 'rollup-plugin-tsconfig-paths'
import { visualizer } from 'rollup-plugin-visualizer'

import externalize from './rollup/utils/externalize'
import * as defineUtils from './rollup/utils/define'
import PluginWatcher from './rollup/utils/plugin-watcher'

import typescript from './rollup/plugins/typescript'
import * as swc_ from '@swc/core'
import inject from "@rollup/plugin-inject";

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
    const bundle = await rollup({
        input: {
            // __preload__: path.resolve(WORKING_DIR, 'src/__preload__.ts'),
            // boot: path.resolve(WORKING_DIR, 'src/boot.ts'), // loads the main app (index)

            // app
            'app/main': path.resolve(WORKING_DIR, 'src/app/main.js'),

            // presentation
            'presentation/main': path.resolve(WORKING_DIR, 'src/presentation/main.js'),

            // stageview
            'stageview/main': path.resolve(WORKING_DIR, 'src/stageview/main.js'),

            // sandbox
            // 'sandbox/boot': path.resolve(WORKING_DIR, 'src/sandbox/boot.ts'),
        },
        plugins: pw.wrap([
            [
                MxPlugin(),
                tsConfigPaths({
                    tsConfigPath: path.resolve(WORKING_DIR, 'tsconfig.x.json'),
                    respectCoreModule: true,
                }),
                nodeResolve(),
                alias({
                    entries: [
                        // { find: '@lib/zrx/preact', replacement: 'preact' },
                        // { find: '@lib/zrx/hooks', replacement: 'preact/hooks' },
                        // { find: '@lib/zrx/jsx-runtime', replacement: 'preact/jsx-runtime' },
                    ]
                }),
                inject({
                    // __spreadArray: [ 'tslib', '__spreadArray' ],
                }),
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

                    }),
                    loaders: {},
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
                            externalHelpers: true,
                        }
                    }
                }),
            ],
            [
                swc({
                    swc: {
                        jsc: {
                            target: 'es3',
                            externalHelpers: true,
                        }
                    }
                }),
            ],
            visualizer({
                emitFile: true,
                filename: "stats.html",
                open: true,
            }),
        ]),
        external: externalize([
            'jquery',

            // 'tslib',
            // '@swc/helpers/_/*',
        ]),
        // treeshake: false,
    });

    const ro = await bundle.write({
        format: 'esm',
        dir: DIST_DIR,
        generatedCode: 'es5',
    });

    // The final es3 adjustments needed
    for (const op of ro.output) {
        if (op.type === 'chunk' && op.preliminaryFileName.endsWith('.js')) {
            const file = path.resolve(DIST_DIR, op.preliminaryFileName);

            let output = swc_.transformSync(op.code, {
                jsc: {
                    target: 'es3',
                    // externalHelpers: true,
                },
                module: {
                    type: 'amd',
                    importInterop: 'node',
                },
                minify: false,
                isModule: 'unknown',
            });

            output = swc_.transformSync(output.code, {
                jsc: {
                    target: 'es3',
                    // externalHelpers: true,
                },
                minify: false,
                isModule: false,
            });

            fs.writeFileSync(file, output.code);
        }
    }

    // console.dir(ro, { depth: 10 });
})();