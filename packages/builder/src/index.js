import * as fs from 'node:fs'
import * as path from 'node:path'

import * as ts from 'typescript'
import * as esbuild from 'esbuild'
import * as swc from '@swc/core'

/**
 * @param {{[p: string]: any}} env
 */
const prepareDefine = (env) => Object.fromEntries(
    Object.entries(env)
        .map(([key, value]) => [key, JSON.stringify(value)])
);

(async () => {
    // CHAIN
    // - ESBuild with all transforms targeting ES5
    // - TypeScript targeting ES5
    // - SWC targeting ES3

    // NOTE:
    // - no-support for async iterator
    // - async functions and generators are supported with a shim of `Promise` primitive
    // - dynamic imports are supported with a shim of `Promise` primitive

    const config = {
        downlevelIteration: false, // generates extra code which looks for the Symbol.iterator primitive
        drop: [
            // 'console',
        ],
        dropLabels: [
            'DEBUG',
            'TEST',
            'DEV',
        ],
        define: {
            'env.mode': 'production',
        },
        async: true, // needs `Promise` primitive
        // banner: {
        //     js: '/* My banner */',
        // },
        stripInternal: true,
        esModuleInterop: true,
        srcDir: './input',
        outDir: './out'
    }

    const input = [
        'app.ts',
    ];

    /** @type {Record<string, any>} */
    const files = {};

    // pass: resolve
    {
        Object.assign(files, Object.fromEntries(input.map((filename) => {
            const absPath = path.resolve(config.srcDir, filename);
            const relPath = path.relative(config.srcDir, absPath);
            const moduleName = path.basename(relPath, path.extname(relPath));

            return [moduleName, absPath];
        })))

        for (const moduleId in files) {
            console.log(`${moduleId}: ${files[moduleId]}`);
        }
    }

    // pass: load
    {
        for (const [name, filename] of Object.entries(files)) {
            files[name] = {
                filename,
                source: fs.readFileSync(filename, 'utf8'),
            }
        }
    }

    // pass: tsc
    {
        for (const [name, { path, source }] of Object.entries(files)) {
            const result = ts.transpileModule(source, {
                compilerOptions: {
                    target: ts.ScriptTarget.ES5,
                    // Preserve generating invalid code
                    module: ts.ModuleKind.ESNext,
                    newLine: ts.NewLineKind.LineFeed,
                    // removeComments: true,
                    // noEmitHelpers: true,
                    importHelpers: true, // supply tslib
                    noEmit: true,
                    // noImplicitUseStrict: true,
                    emitDecoratorMetadata: false,
                    experimentalDecorators: true,
                    downlevelIteration: config.downlevelIteration,
                    esModuleInterop: config.esModuleInterop,
                    stripInternal: config.stripInternal,
                },
                fileName: path,
                moduleName: name,
                reportDiagnostics: true,
            });

            files[name] = {
                ...files[name],
                source: result.outputText,
            }
        }
    }

    // pass: esbuild
    {
        for (const [name, { filename, source }] of Object.entries(files)) {
            const result = await esbuild.transform(source, {
                target: 'es5',
                format: 'esm',
                platform: 'browser',
                sourcefile: filename,
                sourcemap: false,
                drop: config.drop,
                dropLabels: config.dropLabels,
                define: prepareDefine(config.define),
                banner: config.banner?.js,
                pure: config.pure,
                supported: {
                    'bigint': false,
                    'top-level-await': false,
                    ...(config.supported || {}),
                },
            })

            files[name] = {
                ...files[name],
                // source: result.code,
            }
        }
    }

    // pass: swc
    {
        for (const [name, { source }] of Object.entries(files)) {
            const result = await swc.transform(source, {
                jsc: {
                    target: 'es3',
                    loose: true,
                    // externalHelpers: true,
                    preserveAllComments: true,
                },
                module: {
                    type: 'amd',
                    moduleId: name,
                    importInterop: 'node',
                },
                minify: false,
                isModule: 'unknown',
            })

            files[name] = {
                ...files[name],
                // source: result.code,
            }
        }
    }

    // pass: dump
    {
        for (const [name, { filename, source }] of Object.entries(files)) {
            const outFilename = `${name}.js`

            // console.log(`// ${outFilename}`)
            // console.log(source)

            fs.writeFileSync(path.resolve(config.outDir, outFilename), source)
        }
    }

    // const result = await esbuild.build({
    //     // api
    //     entryPoints: [
    //         'input/app.ts'
    //     ],
    //     target: 'ES2020',
    //     format: 'esm',
    //     platform: 'browser',
    //     outdir: 'out',
    //     write: true, // false to not write to disk
    //     allowOverwrite: true,
    //     // api
    //     // tsconfig: 'tsconfig.json',
    //     // tsconfigRaw: {},
    //     // api
    //     absWorkingDir: process.cwd(),
    //     // api
    //     resolveExtensions: ['.ts', '.js'],
    //     // api
    //     alias: {
    //
    //     },
    //     // api
    //     external: [],
    //     // api
    //     // entryNames: '[dir]/[name]-[hash]',
    //     // api
    //     outbase: 'input',
    //     // api
    //     chunkNames: 'chunks/[name]-[hash]',
    //     // api
    //     assetNames: 'assets/[name]-[hash]',
    //     // api
    //     loader: { '.png': 'file' },
    //     // globalName: 'MyModule', // if format is 'iife'
    //     // api
    //     // splitting: true, // for bundle splitting for dynamic imports
    //     // api
    //     legalComments: 'inline',
    //     // api
    //     // drop: ['console'],
    //     // api
    //     dropLabels: [
    //         'DEBUG',
    //         'DEV',
    //         'TEST',
    //     ],
    //     // api
    //     banner: {
    //         js: '/* My banner */',
    //     },
    //     // api
    //     footer: {
    //         js: '/* My footer */',
    //     },
    //     // api
    //     supported: {
    //         'bigint': false,
    //         'top-level-await': false,
    //         // 'object-extensions': false,
    //     },
    //     // api
    //     pure: [],
    //     // api
    //     define: prepareDefine({
    //         Envy: 1,
    //     }),
    //     // api
    //     inject: [],
    //     // api
    //     treeShaking: false,
    //     // api
    //     metafile: true,
    //     plugins: [
    //         // envPlugin
    //     ],
    // })
    //
    // console.log(result.metafile)
})();

export {}