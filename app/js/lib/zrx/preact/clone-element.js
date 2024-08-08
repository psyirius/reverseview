define(["require", "exports", "./util", "./create-element"], function (require, exports, util_1, create_element_1) {
    "use strict";
    exports.__esModule = true;
    exports.cloneElement = void 0;
    /**
     * Clones the given VNode, optionally adding attributes/props and replacing its children.
     * @param {import('./internal').VNode} vnode The virtual DOM element to clone
     * @param {object} props Attributes/props to add when cloning
     * @param {Array<import('./internal').ComponentChildren>} rest Any additional arguments will be used as replacement children.
     * @returns {import('./internal').VNode}
     */
    function cloneElement(vnode, props, children) {
        var normalizedProps = (0, util_1.assign)({}, vnode.props), key, ref, i;
        var defaultProps;
        if (vnode.type && vnode.type.defaultProps) {
            defaultProps = vnode.type.defaultProps;
        }
        for (i in props) {
            if (i == 'key')
                key = props[i];
            else if (i == 'ref')
                ref = props[i];
            else if (props[i] === undefined && defaultProps !== undefined) {
                normalizedProps[i] = defaultProps[i];
            }
            else {
                normalizedProps[i] = props[i];
            }
        }
        if (arguments.length > 2) {
            normalizedProps.children =
                arguments.length > 3 ? util_1.slice.call(arguments, 2) : children;
        }
        return (0, create_element_1.createVNode)(vnode.type, normalizedProps, key || vnode.key, ref || vnode.ref, null);
    }
    exports.cloneElement = cloneElement;
});
