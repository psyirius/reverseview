define(["require", "exports", "../preact"], function (require, exports, preact_1) {
    "use strict";
    exports.__esModule = true;
    exports.Fragment = exports.jsxDEV = exports.jsxs = exports.jsx = void 0;
    exports.Fragment = preact_1.Fragment;
    /** @typedef {import('preact').VNode} VNode */
    var vnodeId = 0;
    /**
     * @fileoverview
     * This file exports various methods that implement Babel's "automatic" JSX runtime API:
     * - jsx(type, props, key)
     * - jsxs(type, props, key)
     * - jsxDEV(type, props, key, __source, __self)
     *
     * The implementation of createVNode here is optimized for performance.
     * Benchmarks: https://esbench.com/bench/5f6b54a0b4632100a7dcd2b3
     */
    /**
     * JSX.Element factory used by Babel's {runtime:"automatic"} JSX transform
     * @param {VNode['type']} type
     * @param {VNode['props']} props
     * @param {VNode['key']} [key]
     * @param {unknown} [isStaticChildren]
     * @param {unknown} [__source]
     * @param {unknown} [__self]
     */
    function createVNode(type, props, key, isStaticChildren, __source, __self) {
        // We'll want to preserve `ref` in props to get rid of the need for
        // forwardRef components in the future, but that should happen via
        // a separate PR.
        var normalizedProps = {}, ref, i;
        for (i in props) {
            if (i == 'ref') {
                ref = props[i];
            }
            else {
                normalizedProps[i] = props[i];
            }
        }
        var vnode = {
            type: type,
            props: normalizedProps,
            key: key,
            ref: ref,
            _children: null,
            _parent: null,
            _depth: 0,
            _dom: null,
            _nextDom: undefined,
            _component: null,
            _hydrating: null,
            constructor: undefined,
            _original: --vnodeId,
            __source: __source,
            __self: __self
        };
        // If a Component VNode, check for and apply defaultProps.
        // Note: `type` is often a String, and can be `undefined` in development.
        if (typeof type === 'function' && (ref = type.defaultProps)) {
            for (i in ref)
                if (typeof normalizedProps[i] === 'undefined') {
                    normalizedProps[i] = ref[i];
                }
        }
        if (preact_1.options.vnode)
            preact_1.options.vnode(vnode);
        return vnode;
    }
    exports.jsx = createVNode;
    exports.jsxs = createVNode;
    exports.jsxDEV = createVNode;
});
