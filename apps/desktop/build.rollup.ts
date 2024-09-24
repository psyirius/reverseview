import {rollup} from "rollup";

import typescript from "@rollup/plugin-typescript";
import commonjs from '@rollup/plugin-commonjs';
import alias from "@rollup/plugin-alias";
import resolve from "@rollup/plugin-node-resolve";
import multi from '@rollup/plugin-multi-entry';
import strip from "@rollup/plugin-strip";
import virtual from '@rollup/plugin-virtual';
import swc from '@rollup/plugin-swc';
import terser from '@rollup/plugin-terser';
import html from "@rollup/plugin-html";
import legacy from '@rollup/plugin-legacy';
import progress from 'rollup-plugin-progress';
import { visualizer } from "rollup-plugin-visualizer";

import esbuild from 'rollup-plugin-esbuild';
import amd from 'rollup-plugin-amd';

// import consts from 'rollup-plugin-consts';
import million from 'million/compiler';

// experimental compilation

rollup({
    input: ['exp/index.tsx'],
    // context: 'window',
    plugins: [
        million.rollup({
            auto: true,
        }),
        // consts({
        //     environment: 'production',
        // }),
        // virtual({
        //     // 'src/vlib.ts': `export default function VLib(): string { return 'vlib'; }`,
        // }),
        resolve(), //
        amd({}),
        commonjs(),
        alias({
            entries: [
                { find: 'preact', replacement: 'v0x' },
            ]
        }),
        typescript({
            module: 'ESNext',
            target: 'ES3',
            jsx: 'react-jsx',
            jsxImportSource: 'preact',
            sourceMap: true,
            inlineSources: true,
            moduleResolution: "Node",
            ignoreDeprecations: "5.0",
            noEmitHelpers: true,
            importHelpers: true,
            // downlevelIteration: true,
        }),
        // esbuild({
        //     drop: [
        //         // 'console',
        //         // 'debugger',
        //     ],
        //     dropLabels: ['TEST', 'DEV'],
        // }),
        // swc({
        //     swc: {
        //         jsc: {
        //             target: 'es3',
        //             externalHelpers: true,
        //         }
        //     }
        // }),
        // strip({
        //     labels: ['TEST', 'DEV'],
        //     debugger: true,
        // }),
        // terser(),
        // multi(),
        progress({
            clearLine: false // default: true
        }),
        // visualizer({
        //     emitFile: true,
        //     open: true,
        // }),
    ],
    external: [
        // preact
        'v0x',
        'v0x/hooks',
        'v0x/jsx-runtime',

        // typescript
        'tslib',

        // swc
        '@swc/helpers/_/_type_of',
    ],
    treeshake: false,
}).then(async (bundle) => {
    console.dir(bundle, { depth: 6, showHidden: false });

    const ro = await bundle.write({
        dir: 'out',
        format: 'esm',
        indent: ' '.repeat(2),
        compact: false,
        minifyInternalExports: true,
    });

    // console.dir(ro, { depth: 6, showHidden: false });
}).catch((err) => {
    console.error(err);

    console.log('-'.repeat(80));
    console.log(err.frame);
    console.log('-'.repeat(80));
});