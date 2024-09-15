import * as ts from 'typescript'
import * as esbuild from 'esbuild'

import * as fs from 'node:fs'
import * as path from 'node:path'
import * as process from 'node:process'
import { rollup } from 'rollup'

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

rollup({
    input: 'input/xooo.tsx',
    output: {
        generatedCode: 'es5',
    },
    plugins: [
        // resolve(), // resolves third-party modules in node_modules
        // commonjs(), // converts CommonJS modules to ES6
        typescript({
            tsconfig: 'tsconfig.xooo.json',
        }), // compiles TypeScript
        postcss({
            // Extract CSS to an external file instead of bundling it inline
            extract: true,
            // Enable CSS modules (optional)
            modules: true,
            // Minify CSS (optional)
            minimize: false,
        }),
    ],
    external: [
        'tslib',
        'preact',
        'preact/hooks',
        'preact/jsx-runtime',
    ],
}).then(r => {
    console.dir(r, { depth: 5 });

    // r.generate({}).then(g => {
    //     console.log(g)
    // });

    r.write({
        file: 'out/xooo.js',
    }).then(() => {
        console.log('done')
    }).catch(e => {
        console.error(e)
    })
}).catch(e => {
    console.error(e)
})