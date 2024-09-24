import { Command, Option } from 'commander'
import path from 'node:path'

import { rollup, Plugin } from 'rollup'

import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import swc from '@rollup/plugin-swc'

import esbuild from 'rollup-plugin-esbuild'
import tsConfigPaths from 'rollup-plugin-tsconfig-paths'
import { visualizer } from 'rollup-plugin-visualizer'

import externalize from './rollup/utils/externalize'
import * as defineUtils from './rollup/utils/define'

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
        buildStart(options) {
            console.log('buildStart', options);
        },
        resolveId(id) {
            console.log('resolveId', id);
        },
        load(id) {
            console.log('load', id);
        },
        moduleParsed(info) {
            console.log('moduleParsed', info);
        },
        transform(code, id) {
            console.log('transform', id);
        },
        // buildEnd(options) {
        //     console.log('buildEnd', options);
        // }
    };
}

!(async () => {
    const bundle = await rollup({
        input: [
            // path.resolve(WORKING_DIR, 'src/__preload__.ts'),
            // path.resolve(WORKING_DIR, 'src/boot.ts'),
            // path.resolve(WORKING_DIR, 'src/main.ts'),
            path.resolve(WORKING_DIR, 'src/app/main.js'),
        ],
        plugins: [
            // MxPlugin(),
            // nodeResolve(),
            tsConfigPaths({
                tsConfigPath: path.resolve(WORKING_DIR, 'tsconfig.x.json'),
                respectCoreModule: true,
            }),
            typescript({
                tsconfig: path.resolve(WORKING_DIR, 'tsconfig.x.json'),
            }),
            // esbuild({
            //     drop: [
            //         // 'debugger',
            //         // 'console',
            //     ],
            //     dropLabels: [
            //         'DEV',
            //         'TEST',
            //         'TRACE',
            //     ],
            //     define: defineUtils.prepare({
            //
            //     }),
            //     loaders: {},
            //     supported: {
            //         // 'bigint': false,
            //         // 'arrow': false,
            //         // 'decorators': false,
            //         // 'destructuring': false,
            //         // 'dynamic-import': false,
            //         // 'class': false,
            //         // 'for-await': false,
            //         // 'for-of': false,
            //         // 'import-meta': false,
            //         // 'new-target': false,
            //         // 'template-literal': false,
            //         // 'generator': false,
            //         // 'object-extensions': false,
            //         // 'node-colon-prefix-import': false,
            //         // 'node-colon-prefix-require': false,
            //         // 'async-await': false,
            //         // 'top-level-await': false,
            //         // 'async-generator': false,
            //         // 'const-and-let': false,
            //         // 'import-assertions': false,
            //         // 'import-attributes': false,
            //     },
            //     target: [
            //         'ESNext',
            //     ]
            // }),
            // swc({
            //     swc: {
            //         jsc: {
            //             target: 'es3',
            //             externalHelpers: true,
            //         }
            //     }
            // }),
            visualizer({
                emitFile: true,
                filename: "stats.html",
                open: true,
            }),
        ],
        external: externalize([
            'jquery',

            // '@swc/helpers/_/*',
        ]),
        // treeshake: false,
    });

    await bundle.write({
        format: 'esm',
        dir: path.resolve(WORKING_DIR, 'out'),
    });
})();