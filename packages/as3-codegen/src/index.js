import { u } from 'unist-builder'
import { inspect } from 'unist-util-inspect'
import { is } from 'unist-util-is'
import { zwitch } from 'zwitch'
import * as util from 'node:util'

import stringifiers from './stringifiers/index.js'

const id = (name) => ({ type: 'Identifier', name })
const ns = (name) => ({ type: 'Namespace', name })
const ty = (name) => ({ type: 'TypeReference', name })
const kw = (name) => ({ type: 'Keyword', name })
const lit = (value) => ({ type: 'Literal', value })

const tree = u('Program', {
    kind: 'package',
    // namespace: ns('com.example'),
}, [
    u('ImportDeclaration', { package: ns('com.example.other'), specifier: id('Other') }),

    // class: Example
    u('ClassDeclaration', {
        name: id('Example'),
        extends: ty('a.b.c.XoXo'),
        implements: [
            ty('a.b.c.XoXo')
        ],
    }, [
        // constructor
        u('MethodDeclaration', {
            name: id('Example'),
            modifiers: [kw('public')],
            constructor: true,
            signature: u('FunctionSignature', {
                returns: null,
                parameters: [
                    u('Parameter', { name: id('args'), typeName: ty('String[]') })
                ]
            })
        }, [
            u('ImportDeclaration', {
                package: ns('com.example.other'),
                wildcard: true,
            }),

            u('ExpressionStatement', {
                expr: u('CallExpression', {
                    expr: id('trace'),
                    arguments: [
                        lit('Hello, world!'),
                        id('args')
                    ]
                })
            }),
        ]),

        // method: main
        u('MethodDeclaration', {
            name: id('main'),
            modifiers: [kw('public'), kw('static')],
            constructor: false,
            signature: u('FunctionSignature', {
                returns: kw('void'),
                parameters: [
                    u('Parameter', { name: id('args'), typeName: ty('String[]') })
                ]
            })
        }, [
            u('ImportDeclaration', { package: ns('com.example.other'), specifier: id('Other') }),

            u('ExpressionStatement', {
                expr: u('CallExpression', {
                    expr: id('trace'),
                    arguments: [
                        lit('Hello, world!'),
                        lit(100),
                        id('window')
                    ]
                })
            }),
        ])
    ])
])

console.log(inspect(tree, {
    color: true,
    showPositions: true,
}))

class Context {
    options = {
        indent: '    ',
        newline: '\n',
        compress: false,
    }
    state = {
        depth: 0,
        newline: true,
    }
    handle;

    constructor(handle, options = {}) {
        this.handle = handle
        Object.assign(this.options, options)
    }

    stringify(tree) {
        return this.$(
            tree,
            undefined,
            undefined,
        )
    }

    $(node, parent, index = undefined) {
        const ctx = /** @type {any} */ this

        return this.handle(node, parent, ctx, index)
    }

    $$(parent) {
        const results = []
        const children = (parent && parent.children) || []

        for (let i = 0; i < children.length; i++) {
            results.push(this.$(children[i], parent, i))
        }

        return results
    }

    make(...lines) {
        return lines
    }

    block(...lines) {
        return lines
    }

    is() {
        return is.apply(null, arguments)
    }
}

// Codegen
const handle = zwitch('type', {
    invalid() {
        throw new Error('Expected node, not `' + node + '`')
    },
    unknown(node) {
        throw new Error('Cannot compile unknown node `' + node.type + '`')
    },
    handlers: stringifiers,
})

const context = new Context(handle, {})

const code = context.stringify(tree)

console.log(
    util.inspect(code, {
        depth: Infinity,
        colors: true,
        compact: false,
    })
)

