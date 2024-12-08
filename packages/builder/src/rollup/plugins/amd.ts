import { Plugin, ProgramNode, ResolveIdResult } from 'rollup'
import { createFilter } from '@rollup/pluginutils'
import amd2es6 from '@buxlabs/amd-to-es6'
// import es62amd from '@buxlabs/es6-to-amd'
import micromatch from 'micromatch'
import { is } from 'estree-toolkit'

interface Options {
}

const DEFAULT_OPTIONS: Options = {
}

const PLUGIN_NAME = 'rollup-plugin-amd';

const enum ImportKind {
    STATIC,
    DYNAMIC,
}

// special(imports):
// - require -> import
// - exports -> exports object
// - module -> ???
// - meta -> import.meta
interface Module {
    imports: {
        [specifier: string]: {
            name: string,
            kind: ImportKind,
        };
    };
}

export default function amd(options?: Options): Plugin {
    options ??= DEFAULT_OPTIONS;

    const modules: Module[] = [];

    return {
        name: PLUGIN_NAME,
        async transform(code, id) {
            const ast = this.parse(code);

            const t = amd2es6(code);

            // console.log('AMD', {id, code, ast});
            // console.log(t);

            for (const node of ast.body) {
                // console.log(node);
                if (node.type === 'ExpressionStatement') {
                    const { expression } = node;
                    if (expression.type === 'CallExpression') {
                        const { callee, arguments: args } = expression;
                        if (callee.type === 'Identifier' && callee.name === 'define') {
                            switch (args.length) {
                                case 3: { // name, deps, object | callback
                                    const [name, deps, objectOrCallback] = args;

                                    switch (name.type) {
                                        case 'Literal': {
                                            if (typeof name.value !== 'string') {
                                                throw new TypeError('module name must of type string')
                                            }

                                            // TODO:

                                            break;
                                        }
                                        default: {
                                            throw new TypeError('module name must be string literal')
                                        }
                                    }

                                    switch (deps.type) {
                                        case 'ArrayExpression': {
                                            // if (Array.isArray(deps.elements) && deps.elements.every((e) => e.type === 'Literal' && typeof e.value === 'string')) {
                                            //     throw new TypeError('dependencies must be an array of string literals')
                                            // }

                                            // TODO:

                                            break;
                                        }
                                        default: {
                                            throw new TypeError('dependencies must be an array')
                                        }
                                    }

                                    switch (objectOrCallback.type) {}

                                    break;
                                }
                                case 2: { // name | deps, object | callback
                                    const [nameOrDeps, objectOrCallback] = args;

                                    switch (nameOrDeps.type) {}

                                    switch (objectOrCallback.type) {}

                                    break;
                                }
                                case 1: { // object | callback
                                    const [node] = args;

                                    switch (node.type) {
                                        /**
                                         * Simple Name/Value Pairs
                                         * https://requirejs.org/docs/api.html#defsimple
                                         * -------------------
                                         * define({
                                         *     color: "black",
                                         *     size: "micro"
                                         * });
                                         * -------------------
                                         * export default {
                                         *     color: "black",
                                         *     size: "micro"
                                         * }
                                         * -------------------
                                         **/
                                        case 'ObjectExpression': {
                                            // TODO
                                            break;
                                        }

                                        // callback
                                        /**
                                         * Definition Functions
                                         * https://requirejs.org/docs/api.html#deffunc
                                         * ----------------------
                                         * define(function() {
                                         *     return {
                                         *         color: "black",
                                         *         size: "micro"
                                         *     }
                                         * })
                                         * ----------------------
                                         * export default {
                                         *     color: "black",
                                         *     size: "micro"
                                         * }
                                         * ----------------------
                                         **/

                                        /**
                                         * callback (require deps)
                                         *
                                         * -----------------------------
                                         * define(function(require, exports, module) {
                                         *    var dep = require('dep')
                                         * })
                                         * -----------------------------
                                         * import dep from 'module'
                                         * -----------------------------
                                         **/
                                        case 'FunctionExpression': {
                                            // TODO
                                            break;
                                        }
                                        default: {
                                            throw new Error('unknown');
                                        }
                                    }

                                    break;
                                }
                                default: {
                                    throw new Error('unknown');
                                }
                            }

                            const [config, deps, callback] = args;
                            // console.log('AMD Module', {config, deps, callback});
                        }
                    }
                }
            }
        }
    }
}