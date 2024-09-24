import { rollup } from 'rollup'
import json from '@rollup/plugin-json'
import cjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import swc from '@rollup/plugin-swc'
import buble from '@rollup/plugin-buble'
import alias from '@rollup/plugin-alias'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import inject from '@rollup/plugin-inject'
import yaml from '@rollup/plugin-yaml'
import virtual from '@rollup/plugin-virtual'
import multi from '@rollup/plugin-multi-entry'
import strip from '@rollup/plugin-strip'
import eslint from '@rollup/plugin-eslint'
import run from '@rollup/plugin-run'
import legacy from '@rollup/plugin-legacy'
// import html from '@rollup/plugin-html'

import * as path from 'node:path'

import styles from 'rollup-styles'
import copy from 'rollup-plugin-copy'
import esbuild from 'rollup-plugin-esbuild'
import postcss from 'rollup-plugin-postcss'
import prettier from 'rollup-plugin-prettier'
import unbundle from 'rollup-plugin-unbundle'
import vanillaExtract from '@vanilla-extract/rollup-plugin'
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets'
import { optimizeLodashImports } from "@optimize-lodash/rollup-plugin"
import { rollupPluginHTML } from '@web/rollup-plugin-html';
import { corejsPlugin } from 'rollup-plugin-corejs'
import multiInput from 'rollup-plugin-multi-input'
import tsConfigPaths from 'rollup-plugin-tsconfig-paths'
// import posthtml from 'rollup-plugin-posthtml'
// import html from '@open-wc/rollup-plugin-html'

import externalize from './rollup/utils/externalize'
import {
    prepare as prepareDefine
} from './rollup/utils/define'

!(async () => {
    const bundle = await rollup({
        input: [
            // 'input/index.html',
            'input/xyz.tsx',
        ],
        plugins: [
            // html({
            //     files: 'input/index.html',
            //     rootDir: 'input',
            //     publicPath: 'static',
            // }),
            // rollupPluginHTML({
            //     input: 'input/index.html',
            // }),
            // virtual({
            //     batman: `export default 'na na na na na'`,
            //     'src/robin.js': `export default 'batmannnnn'`
            // }),
            postcss({
                plugins: []
            }),
            // posthtml({
            //
            // }),
            // tsConfigPaths(),
            // multi(),
            // importMetaAssets(),
            // legacy({
            //     'vendor/some-library.js': 'someLibrary',
            //     'vendor/another-library.js': {
            //         foo: 'anotherLib.foo',
            //         bar: 'anotherLib.bar',
            //         baz: 'anotherLib.baz'
            //     }
            // }),
            inject({
                // import { Promise } from 'es6-promise';
                Promise: ['es6-promise', 'Promise'],

                // import { Map, Set } from 'es6-collections';
                Map: [ 'es6-collections', 'Map' ],
                Set: [ 'es6-collections', 'Set' ],

                // import { Symbol } from 'es6-symbol';
                Symbol: [ 'es6-symbol', 'Symbol' ],

                // import { WeakMap } from 'es6-weak-map';
                WeakMap: [ 'es6-weak-map', 'WeakMap' ],

                // import { queueMicrotask } from 'web-shims';
                queueMicrotask: [ 'web-shims', 'queueMicrotask' ],

                // import { globalThis } from 'web-shims';
                globalThis: [ 'web-shims', 'globalThis' ],

                // import { fetch } from 'web-shims';
                fetch: [ 'web-shims', 'fetch' ],

                // import Array$of from 'es6-array-of';
                'Array.of': 'es6-array-of',

                // import Array$from from 'es6-array-from';
                'Array.from': 'es6-array-from',

                // import Object$assign from 'es6-object-assign';
                'Object.assign': 'es6-object-assign',

                // import Object$is from 'es6-object-is';
                'Object.is': 'es6-object-is',

                // import Object$isObject from 'es6-object-is';
                'Object.isObject': 'es6-object-is',

                // import Object$freeze from 'es6-object-freeze';
                'Object.freeze': 'es6-object-freeze',

                // import Object$mixin from 'es6-object-mixin';
                'Object.mixin': 'es6-object-mixin',

                // import Object$getOwnPropertyKeys from 'es6-object-getownpropertykeys';
                'Object.getOwnPropertyKeys': 'es6-object-getownpropertykeys',

                // Function.bind

                // // import { Promise as P } from 'es6-promise'
                // P: [ 'es6-promise', 'Promise' ],
                //
                // // import $ from 'jquery'
                // $: 'jquery',
                //
                // // import * as fs from 'fs'
                // fs: [ 'fs', '*' ],
                //
                // 'Object.assign': path.resolve('src/helpers/object-assign.js'),
                // 'Object.freeze': path.resolve('src/helpers/object-freeze.js'),
            }),
            // cjs(),
            // replace({}),
            // alias({
            //     entries: [
            //         { find: 'preact', replacement: 'v0x' },
            //     ]
            // }),
            nodeResolve(),
            json(),
            yaml(),
            // optimizeLodashImports(),
            typescript({
                tsconfig: 'tsconfig.xooo.json',
            }),
            // strip({
            //     labels: [
            //         // 'TRACE',
            //         // 'DEV',
            //         // 'TEST',
            //     ],
            //     functions: [
            //         'console.log',
            //     ],
            // }),
            esbuild({
                drop: [
                    // 'debugger',
                    // 'console',
                ],
                dropLabels: [
                    // 'DEV',
                    // 'TEST',
                    // 'TRACE',
                ],
                define: prepareDefine({

                }),
                loaders: {},
                supported: {
                    'bigint': false,
                    'arrow': false,
                    'decorators': false,
                    'destructuring': false,
                    'dynamic-import': false,
                    'class': false,
                    'for-await': false,
                    'for-of': false,
                    'import-meta': false,
                    'new-target': false,
                    'template-literal': false,
                    'generator': false,
                    'object-extensions': false,
                    'node-colon-prefix-import': false,
                    'node-colon-prefix-require': false,
                    'async-await': false,
                    'top-level-await': false,
                    'async-generator': false,
                    'const-and-let': false,
                    'import-assertions': false,
                    'import-attributes': false,
                },
                target: [
                    // 'safari5'
                ],
            }),
            swc({
                swc: {
                    jsc: {
                        target: 'es3',
                        externalHelpers: true,
                    }
                }
            }),
        ],
        external: externalize([
            'tslib',

            'lodash',

            'preact',
            'preact/*',

            // 'inferno',
            // 'inferno/*',

            // 'million',

            '@swc/helpers/_/*',
        ]),
        // treeshake: false,
    })

    console.dir(bundle, { depth: 6, showHidden: false });

    await bundle.write({
        dir: 'out',
        format: 'esm',
    })
})()