import * as fs from 'node:fs'
import * as path from 'node:path'
import * as process from 'node:process'

import * as ts from 'typescript'
import * as swc from '@swc/core'
import * as esbuild from 'esbuild'

import { Command, Option } from 'commander'

const prog = new Command()
    .name('build.src')
    .version('0.0.0')
    .description('Air JS/TS Builder')
    .addOption(
        new Option('-p, --project <tsconfig>', 'choose a tsconfig')
    )

prog.parse(process.argv);

const WORKING_DIR = process.cwd();

const options = prog.opts();

const configPath = path.join(
    WORKING_DIR,
    options.project ?? "tsconfig.json",
);

/**
 * @param {{[p: string]: any}} env
 *
 * @return {{[p: string]: string}}
 */
const prepareDefine = (env) => Object.fromEntries(
    Object.entries(env).map(([key, value]) => [
        key,
        (typeof value === 'symbol') ? value.description : JSON.stringify(value)
    ])
);

/**
 * @param {string} relativePath
 *
 * @return {string}
 */
const getModuleName = (relativePath) => path.join(
    path.dirname(relativePath),
    path.basename(relativePath, path.extname(relativePath)),
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
        env: {
            mode: 'production',
        },
        define: {
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
            const srcDir = path.resolve(config.srcDir);

            const absPath = path.resolve(srcDir, filename);
            const relPath = path.relative(srcDir, absPath);

            return [
                relPath.split(path.sep).join('/'),
                absPath
            ];
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
                moduleName: getModuleName(name),
                reportDiagnostics: true,
            });

            files[name] = {
                ...files[name],
                source: result.outputText,
            }
        }
    }

    // pass: esbuild:transform
    {
        for (const [name, { filename, source }] of Object.entries(files)) {
            const result = await esbuild.transform(source, {
                target: 'ES2015',
                format: 'esm',
                platform: 'browser',
                sourcefile: filename,
                sourcemap: false,
                drop: config.drop,
                dropLabels: config.dropLabels,
                define: prepareDefine({
                    ...(config.define || {}),
                    'import.meta': {
                        url: name,
                        env: (config.env || {}),
                    },
                }),
                banner: config.banner?.js,
                pure: config.pure,
                supported: {
                    'bigint': false,
                    'for-await': false,
                    'top-level-await': false,
                    'import-attributes': false,
                    'import-assertions': false,
                    ...(config.supported || {}),
                },
            })

            files[name] = {
                ...files[name],
                // source: result.code,
            }
        }
    }

    // pass: swc:transform
    // - make it a module
    // - make it es3 compliant
    {
        for (const [name, { filename, source }] of Object.entries(files)) {
            const result = await swc.transform(source, {
                jsc: {
                    parser: {
                        syntax: 'ecmascript',
                    },
                    target: 'es3',
                    loose: true,
                    externalHelpers: true,
                    preserveAllComments: true,
                    experimental: {
                        plugins: [
                            // [
                            //     '@swc/plugin-transform-imports',
                            //     {
                            //         "tslib": {
                            //             "transform": "phew/_/{{member}}"
                            //         }
                            //     }
                            // ]
                        ]
                    }
                },
                // env: {},
                filename: filename,
                plugin(module) {
                    // console.log(module);

                    return module;
                },
                module: {
                    type: 'amd',
                    moduleId: getModuleName(name),
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

    // pass: esbuild:build

    // TODO: remap imports to our own implementation
    // TODO: inject / import shims
    // TODO: bundle

    // pass: dump
    {
        for (const [name, { filename, source }] of Object.entries(files)) {
            const outFilename = path.resolve(config.outDir, `${getModuleName(name)}.js`)

            // console.log(`// ${outFilename}`)
            // console.log(source)

            fs.mkdirSync(path.dirname(outFilename), { recursive: true })

            fs.writeFileSync(outFilename, source)
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