define(["require", "exports", "./constants"], function (require, exports, constants_1) {
    "use strict";
    exports.__esModule = true;
    exports.slice = exports.removeNode = exports.assign = exports.isArray = void 0;
    exports.isArray = Array.isArray;
    /**
     * Assign properties from `props` to `obj`
     * @template O, P The obj and props types
     * @param {O} obj The object to copy properties to
     * @param {P} props The object to copy properties from
     * @returns {O & P}
     */
    function assign(obj, props) {
        // @ts-ignore We change the type of `obj` to be `O & P`
        for (var i in props)
            obj[i] = props[i];
        return /** @type {O & P} */ (obj);
    }
    exports.assign = assign;
    /**
     * Remove a child node from its parent if attached. This is a workaround for
     * IE11 which doesn't support `Element.prototype.remove()`. Using this function
     * is smaller than including a dedicated polyfill.
     * @param {Node} node The node to remove
     */
    function removeNode(node) {
        var parentNode = node.parentNode;
        if (parentNode)
            parentNode.removeChild(node);
    }
    exports.removeNode = removeNode;
    exports.slice = constants_1.EMPTY_ARR.slice;
});
