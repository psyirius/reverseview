import {rollup} from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import swc from '@rollup/plugin-swc'
import terser from '@rollup/plugin-terser';
import alias from "@rollup/plugin-alias";
import strip from "@rollup/plugin-strip";
import legacy from '@rollup/plugin-legacy';
import typescript from "@rollup/plugin-typescript";
import svelte from 'rollup-plugin-svelte';
import esbuild from 'rollup-plugin-esbuild';
// import cleanup from 'rollup-plugin-cleanup';

rollup({
    input: [
        // 'input/App.svelte',
        'input/app.js',
    ],
    plugins: [
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
        resolve(),
        commonjs(),
        swc({
            swc: {
                jsc: {
                    target: 'es3',
                    externalHelpers: true,
                }
            }
        }),
        // terser({
        //     compress: false,
        //     ie8: true,
        //     safari10: true,
        //     ecma: 5,
        // }),
        // cleanup({
        //     comments: 'some',
        // }),
    ],
    external: [
        // 'svelte/internal',
        // 'svelte/internal/client',
        // 'svelte/internal/server',

        // 'svelte',
        // 'svelte/store',
        // 'svelte/transition',
        // 'svelte/action',
        // 'svelte/animate',
        // 'svelte/motion',
        // 'svelte/easing',

        // '@swc/helpers/_/_type_of',
        // '@swc/helpers/_/_get_prototype_of',
        // '@swc/helpers/_/_inherits',
        // '@swc/helpers/_/_array_like_to_array',
        // '@swc/helpers/_/_create_for_of_iterator_helper_loose',
        // '@swc/helpers/_/_class_private_field_loose_key',
        // '@swc/helpers/_/_class_private_field_loose_base',
    ],
    // treeshake: false,
}).then(bundle => {
    console.dir(bundle, { depth: 6, showHidden: false });

    bundle.write({
        dir: 'out',
        format: 'iife',
        indent: ' '.repeat(2),
        compact: false,
        minifyInternalExports: true,
        strict: false,
        generatedCode: {
            preset: 'es5',
        },
    }).then(ro => {
        console.dir(ro, { depth: 6, showHidden: false });
    }).catch(err => {
        console.error(err);
    });
}).catch(err => {
    console.error(err);
})