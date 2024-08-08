define(["require", "exports", "./constants", "./diff/index", "./create-element", "./options", "./util"], function (require, exports, constants_1, index_1, create_element_1, options_1, util_1) {
    "use strict";
    exports.__esModule = true;
    exports.hydrate = exports.render = void 0;
    /**
     * Render a Preact virtual node into a DOM element
     * @param {import('./internal').ComponentChild} vnode The virtual node to render
     * @param {import('./internal').PreactElement} parentDom The DOM element to
     * render into
     * @param {import('./internal').PreactElement | object} [replaceNode] Optional: Attempt to re-use an
     * existing DOM tree rooted at `replaceNode`
     */
    function render(vnode, parentDom, replaceNode) {
        if (options_1["default"]._root)
            options_1["default"]._root(vnode, parentDom);
        // We abuse the `replaceNode` parameter in `hydrate()` to signal if we are in
        // hydration mode or not by passing the `hydrate` function instead of a DOM
        // element..
        var isHydrating = typeof replaceNode === 'function';
        // To be able to support calling `render()` multiple times on the same
        // DOM node, we need to obtain a reference to the previous tree. We do
        // this by assigning a new `_children` property to DOM nodes which points
        // to the last rendered tree. By default this property is not present, which
        // means that we are mounting a new tree for the first time.
        var oldVNode = isHydrating
            ? null
            : (replaceNode && replaceNode._children) || parentDom._children;
        vnode = ((!isHydrating && replaceNode) || parentDom)._children =
            (0, create_element_1.createElement)(create_element_1.Fragment, null, [vnode]);
        // List of effects that need to be called after diffing.
        var commitQueue = [], refQueue = [];
        (0, index_1.diff)(parentDom, 
        // Determine the new vnode tree and store it on the DOM element on
        // our custom `_children` property.
        vnode, oldVNode || constants_1.EMPTY_OBJ, constants_1.EMPTY_OBJ, parentDom.ownerSVGElement !== undefined, !isHydrating && replaceNode
            ? [replaceNode]
            : oldVNode
                ? null
                : parentDom.firstChild
                    ? util_1.slice.call(parentDom.childNodes)
                    : null, commitQueue, !isHydrating && replaceNode
            ? replaceNode
            : oldVNode
                ? oldVNode._dom
                : parentDom.firstChild, isHydrating, refQueue);
        // Flush all queued effects
        (0, index_1.commitRoot)(commitQueue, vnode, refQueue);
    }
    exports.render = render;
    /**
     * Update an existing DOM element with data from a Preact virtual node
     * @param {import('./internal').ComponentChild} vnode The virtual node to render
     * @param {import('./internal').PreactElement} parentDom The DOM element to
     * update
     */
    function hydrate(vnode, parentDom) {
        render(vnode, parentDom, hydrate);
    }
    exports.hydrate = hydrate;
});
