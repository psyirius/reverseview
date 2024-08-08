define(["require", "exports", "./util", "./options"], function (require, exports, util_1, options_1) {
    "use strict";
    exports.__esModule = true;
    exports.isValidElement = exports.Fragment = exports.createRef = exports.createVNode = exports.createElement = void 0;
    var vnodeId = 0;
    /**
     * Create an virtual node (used for JSX)
     * @param {import('./internal').VNode["type"]} type The node name or Component
     * constructor for this virtual node
     * @param {object | null | undefined} [props] The properties of the virtual node
     * @param {Array<import('.').ComponentChildren>} [children] The children of the virtual node
     * @returns {import('./internal').VNode}
     */
    function createElement(type, props, children) {
        var normalizedProps = {}, key, ref, i;
        for (i in props) {
            if (i == 'key')
                key = props[i];
            else if (i == 'ref')
                ref = props[i];
            else
                normalizedProps[i] = props[i];
        }
        if (arguments.length > 2) {
            normalizedProps.children =
                arguments.length > 3 ? util_1.slice.call(arguments, 2) : children;
        }
        // If a Component VNode, check for and apply defaultProps
        // Note: type may be undefined in development, must never error here.
        if (typeof type == 'function' && type.defaultProps != null) {
            for (i in type.defaultProps) {
                if (normalizedProps[i] === undefined) {
                    normalizedProps[i] = type.defaultProps[i];
                }
            }
        }
        return createVNode(type, normalizedProps, key, ref, null);
    }
    exports.createElement = createElement;
    /**
     * Create a VNode (used internally by Preact)
     * @param {import('./internal').VNode["type"]} type The node name or Component
     * Constructor for this virtual node
     * @param {object | string | number | null} props The properties of this virtual node.
     * If this virtual node represents a text node, this is the text of the node (string or number).
     * @param {string | number | null} key The key for this virtual node, used when
     * diffing it against its children
     * @param {import('./internal').VNode["ref"]} ref The ref property that will
     * receive a reference to its created child
     * @returns {import('./internal').VNode}
     */
    function createVNode(type, props, key, ref, original) {
        // V8 seems to be better at detecting type shapes if the object is allocated from the same call site
        // Do not inline into createElement and coerceToVNode!
        var vnode = {
            type: type,
            props: props,
            key: key,
            ref: ref,
            _children: null,
            _parent: null,
            _depth: 0,
            _dom: null,
            // _nextDom must be initialized to undefined b/c it will eventually
            // be set to dom.nextSibling which can return `null` and it is important
            // to be able to distinguish between an uninitialized _nextDom and
            // a _nextDom that has been set to `null`
            _nextDom: undefined,
            _component: null,
            _hydrating: null,
            constructor: undefined,
            _original: original == null ? ++vnodeId : original
        };
        // Only invoke the vnode hook if this was *not* a direct copy:
        if (original == null && options_1["default"].vnode != null)
            options_1["default"].vnode(vnode);
        return vnode;
    }
    exports.createVNode = createVNode;
    function createRef() {
        return { current: null };
    }
    exports.createRef = createRef;
    function Fragment(props) {
        return props.children;
    }
    exports.Fragment = Fragment;
    /**
     * Check if a the argument is a valid Preact VNode.
     * @param {*} vnode
     * @returns {vnode is import('./internal').VNode}
     */
    var isValidElement = function (vnode) {
        return vnode != null && vnode.constructor === undefined;
    };
    exports.isValidElement = isValidElement;
});
