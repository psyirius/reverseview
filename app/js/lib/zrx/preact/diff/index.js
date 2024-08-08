define(["require", "exports", "../constants", "../component", "../create-element", "./children", "./props", "../util", "../options"], function (require, exports, constants_1, component_1, create_element_1, children_1, props_1, util_1, options_1) {
    "use strict";
    exports.__esModule = true;
    exports.unmount = exports.applyRef = exports.commitRoot = exports.diff = void 0;
    /**
     * Diff two virtual nodes and apply proper changes to the DOM
     * @param {import('../internal').PreactElement} parentDom The parent of the DOM element
     * @param {import('../internal').VNode} newVNode The new virtual node
     * @param {import('../internal').VNode} oldVNode The old virtual node
     * @param {object} globalContext The current context object. Modified by getChildContext
     * @param {boolean} isSvg Whether or not this element is an SVG node
     * @param {Array<import('../internal').PreactElement>} excessDomChildren
     * @param {Array<import('../internal').Component>} commitQueue List of components
     * which have callbacks to invoke in commitRoot
     * @param {import('../internal').PreactElement} oldDom The current attached DOM
     * element any new dom elements should be placed around. Likely `null` on first
     * render (except when hydrating). Can be a sibling DOM element when diffing
     * Fragments that have siblings. In most cases, it starts out as `oldChildren[0]._dom`.
     * @param {boolean} isHydrating Whether or not we are in hydration
     * @param {Array<any>} refQueue an array of elements needed to invoke refs
     */
    function diff(parentDom, newVNode, oldVNode, globalContext, isSvg, excessDomChildren, commitQueue, oldDom, isHydrating, refQueue) {
        var tmp, newType = newVNode.type;
        // When passing through createElement it assigns the object
        // constructor as undefined. This to prevent JSON-injection.
        if (newVNode.constructor !== undefined)
            return null;
        // If the previous diff bailed out, resume creating/hydrating.
        if (oldVNode._hydrating != null) {
            isHydrating = oldVNode._hydrating;
            oldDom = newVNode._dom = oldVNode._dom;
            // if we resume, we want the tree to be "unlocked"
            newVNode._hydrating = null;
            excessDomChildren = [oldDom];
        }
        if ((tmp = options_1["default"]._diff))
            tmp(newVNode);
        outer: if (typeof newType == 'function') {
            try {
                var c_1, isNew = void 0, oldProps_1, oldState_1, snapshot_1, clearProcessingException = void 0;
                var newProps = newVNode.props;
                // Necessary for createContext api. Setting this property will pass
                // the context value as `this.context` just for this component.
                tmp = newType.contextType;
                var provider = tmp && globalContext[tmp._id];
                var componentContext = tmp
                    ? provider
                        ? provider.props.value
                        : tmp._defaultValue
                    : globalContext;
                // Get component and set it to `c`
                if (oldVNode._component) {
                    c_1 = newVNode._component = oldVNode._component;
                    clearProcessingException = c_1._processingException = c_1._pendingError;
                }
                else {
                    // Instantiate the new component
                    if ('prototype' in newType && newType.prototype.render) {
                        // @ts-ignore The check above verifies that newType is suppose to be constructed
                        newVNode._component = c_1 = new newType(newProps, componentContext); // eslint-disable-line new-cap
                    }
                    else {
                        // @ts-ignore Trust me, Component implements the interface we want
                        newVNode._component = c_1 = new component_1.Component(newProps, componentContext);
                        c_1.constructor = newType;
                        c_1.render = doRender;
                    }
                    if (provider)
                        provider.sub(c_1);
                    c_1.props = newProps;
                    if (!c_1.state)
                        c_1.state = {};
                    c_1.context = componentContext;
                    c_1._globalContext = globalContext;
                    isNew = c_1._dirty = true;
                    c_1._renderCallbacks = [];
                    c_1._stateCallbacks = [];
                }
                // Invoke getDerivedStateFromProps
                if (c_1._nextState == null) {
                    c_1._nextState = c_1.state;
                }
                if (newType.getDerivedStateFromProps != null) {
                    if (c_1._nextState == c_1.state) {
                        c_1._nextState = (0, util_1.assign)({}, c_1._nextState);
                    }
                    (0, util_1.assign)(c_1._nextState, newType.getDerivedStateFromProps(newProps, c_1._nextState));
                }
                oldProps_1 = c_1.props;
                oldState_1 = c_1.state;
                c_1._vnode = newVNode;
                // Invoke pre-render lifecycle methods
                if (isNew) {
                    if (newType.getDerivedStateFromProps == null &&
                        c_1.componentWillMount != null) {
                        c_1.componentWillMount();
                    }
                    if (c_1.componentDidMount != null) {
                        c_1._renderCallbacks.push(c_1.componentDidMount);
                    }
                }
                else {
                    if (newType.getDerivedStateFromProps == null &&
                        newProps !== oldProps_1 &&
                        c_1.componentWillReceiveProps != null) {
                        c_1.componentWillReceiveProps(newProps, componentContext);
                    }
                    if (!c_1._force &&
                        ((c_1.shouldComponentUpdate != null &&
                            c_1.shouldComponentUpdate(newProps, c_1._nextState, componentContext) === false) ||
                            newVNode._original === oldVNode._original)) {
                        // More info about this here: https://gist.github.com/JoviDeCroock/bec5f2ce93544d2e6070ef8e0036e4e8
                        if (newVNode._original !== oldVNode._original) {
                            // When we are dealing with a bail because of sCU we have to update
                            // the props, state and dirty-state.
                            // when we are dealing with strict-equality we don't as the child could still
                            // be dirtied see #3883
                            c_1.props = newProps;
                            c_1.state = c_1._nextState;
                            c_1._dirty = false;
                        }
                        newVNode._dom = oldVNode._dom;
                        newVNode._children = oldVNode._children;
                        newVNode._children.forEach(function (vnode) {
                            if (vnode)
                                vnode._parent = newVNode;
                        });
                        for (var i = 0; i < c_1._stateCallbacks.length; i++) {
                            c_1._renderCallbacks.push(c_1._stateCallbacks[i]);
                        }
                        c_1._stateCallbacks = [];
                        if (c_1._renderCallbacks.length) {
                            commitQueue.push(c_1);
                        }
                        break outer;
                    }
                    if (c_1.componentWillUpdate != null) {
                        c_1.componentWillUpdate(newProps, c_1._nextState, componentContext);
                    }
                    if (c_1.componentDidUpdate != null) {
                        c_1._renderCallbacks.push(function () {
                            c_1.componentDidUpdate(oldProps_1, oldState_1, snapshot_1);
                        });
                    }
                }
                c_1.context = componentContext;
                c_1.props = newProps;
                c_1._parentDom = parentDom;
                c_1._force = false;
                var renderHook = options_1["default"]._render, count = 0;
                if ('prototype' in newType && newType.prototype.render) {
                    c_1.state = c_1._nextState;
                    c_1._dirty = false;
                    if (renderHook)
                        renderHook(newVNode);
                    tmp = c_1.render(c_1.props, c_1.state, c_1.context);
                    for (var i = 0; i < c_1._stateCallbacks.length; i++) {
                        c_1._renderCallbacks.push(c_1._stateCallbacks[i]);
                    }
                    c_1._stateCallbacks = [];
                }
                else {
                    do {
                        c_1._dirty = false;
                        if (renderHook)
                            renderHook(newVNode);
                        tmp = c_1.render(c_1.props, c_1.state, c_1.context);
                        // Handle setState called in render, see #2553
                        c_1.state = c_1._nextState;
                    } while (c_1._dirty && ++count < 25);
                }
                // Handle setState called in render, see #2553
                c_1.state = c_1._nextState;
                if (c_1.getChildContext != null) {
                    globalContext = (0, util_1.assign)((0, util_1.assign)({}, globalContext), c_1.getChildContext());
                }
                if (!isNew && c_1.getSnapshotBeforeUpdate != null) {
                    snapshot_1 = c_1.getSnapshotBeforeUpdate(oldProps_1, oldState_1);
                }
                var isTopLevelFragment = tmp != null && tmp.type === create_element_1.Fragment && tmp.key == null;
                var renderResult = isTopLevelFragment ? tmp.props.children : tmp;
                (0, children_1.diffChildren)(parentDom, (0, util_1.isArray)(renderResult) ? renderResult : [renderResult], newVNode, oldVNode, globalContext, isSvg, excessDomChildren, commitQueue, oldDom, isHydrating, refQueue);
                c_1.base = newVNode._dom;
                // We successfully rendered this VNode, unset any stored hydration/bailout state:
                newVNode._hydrating = null;
                if (c_1._renderCallbacks.length) {
                    commitQueue.push(c_1);
                }
                if (clearProcessingException) {
                    c_1._pendingError = c_1._processingException = null;
                }
            }
            catch (e) {
                newVNode._original = null;
                // if hydrating or creating initial tree, bailout preserves DOM:
                if (isHydrating || excessDomChildren != null) {
                    newVNode._dom = oldDom;
                    newVNode._hydrating = !!isHydrating;
                    excessDomChildren[excessDomChildren.indexOf(oldDom)] = null;
                    // ^ could possibly be simplified to:
                    // excessDomChildren.length = 0;
                }
                options_1["default"]._catchError(e, newVNode, oldVNode);
            }
        }
        else if (excessDomChildren == null &&
            newVNode._original === oldVNode._original) {
            newVNode._children = oldVNode._children;
            newVNode._dom = oldVNode._dom;
        }
        else {
            newVNode._dom = diffElementNodes(oldVNode._dom, newVNode, oldVNode, globalContext, isSvg, excessDomChildren, commitQueue, isHydrating, refQueue);
        }
        if ((tmp = options_1["default"].diffed))
            tmp(newVNode);
    }
    exports.diff = diff;
    /**
     * @param {Array<import('../internal').Component>} commitQueue List of components
     * which have callbacks to invoke in commitRoot
     * @param {import('../internal').VNode} root
     */
    function commitRoot(commitQueue, root, refQueue) {
        for (var i = 0; i < refQueue.length; i++) {
            applyRef(refQueue[i], refQueue[++i], refQueue[++i]);
        }
        if (options_1["default"]._commit)
            options_1["default"]._commit(root, commitQueue);
        commitQueue.some(function (c) {
            try {
                // @ts-ignore Reuse the commitQueue variable here so the type changes
                commitQueue = c._renderCallbacks;
                c._renderCallbacks = [];
                commitQueue.some(function (cb) {
                    // @ts-ignore See above ts-ignore on commitQueue
                    cb.call(c);
                });
            }
            catch (e) {
                options_1["default"]._catchError(e, c._vnode);
            }
        });
    }
    exports.commitRoot = commitRoot;
    /**
     * Diff two virtual nodes representing DOM element
     * @param {import('../internal').PreactElement} dom The DOM element representing
     * the virtual nodes being diffed
     * @param {import('../internal').VNode} newVNode The new virtual node
     * @param {import('../internal').VNode} oldVNode The old virtual node
     * @param {object} globalContext The current context object
     * @param {boolean} isSvg Whether or not this DOM node is an SVG node
     * @param {*} excessDomChildren
     * @param {Array<import('../internal').Component>} commitQueue List of components
     * which have callbacks to invoke in commitRoot
     * @param {boolean} isHydrating Whether or not we are in hydration
     * @param {Array<any>} refQueue an array of elements needed to invoke refs
     * @returns {import('../internal').PreactElement}
     */
    function diffElementNodes(dom, newVNode, oldVNode, globalContext, isSvg, excessDomChildren, commitQueue, isHydrating, refQueue) {
        var oldProps = oldVNode.props;
        var newProps = newVNode.props;
        var nodeType = newVNode.type;
        var i = 0;
        // Tracks entering and exiting SVG namespace when descending through the tree.
        if (nodeType === 'svg')
            isSvg = true;
        if (excessDomChildren != null) {
            for (; i < excessDomChildren.length; i++) {
                var child = excessDomChildren[i];
                // if newVNode matches an element in excessDomChildren or the `dom`
                // argument matches an element in excessDomChildren, remove it from
                // excessDomChildren so it isn't later removed in diffChildren
                if (child &&
                    'setAttribute' in child === !!nodeType &&
                    (nodeType ? child.localName === nodeType : child.nodeType === 3)) {
                    dom = child;
                    excessDomChildren[i] = null;
                    break;
                }
            }
        }
        if (dom == null) {
            if (nodeType === null) {
                // @ts-ignore createTextNode returns Text, we expect PreactElement
                return document.createTextNode(newProps);
            }
            if (isSvg) {
                dom = document.createElementNS('http://www.w3.org/2000/svg', 
                // @ts-ignore We know `newVNode.type` is a string
                nodeType);
            }
            else {
                dom = document.createElement(
                // @ts-ignore We know `newVNode.type` is a string
                nodeType, newProps.is && newProps);
            }
            // we created a new parent, so none of the previously attached children can be reused:
            excessDomChildren = null;
            // we are creating a new node, so we can assume this is a new subtree (in case we are hydrating), this deopts the hydrate
            isHydrating = false;
        }
        if (nodeType === null) {
            // During hydration, we still have to split merged text from SSR'd HTML.
            if (oldProps !== newProps && (!isHydrating || dom.data !== newProps)) {
                dom.data = newProps;
            }
        }
        else {
            // If excessDomChildren was not null, repopulate it with the current element's children:
            excessDomChildren = excessDomChildren && util_1.slice.call(dom.childNodes);
            oldProps = oldVNode.props || constants_1.EMPTY_OBJ;
            var oldHtml = oldProps.dangerouslySetInnerHTML;
            var newHtml = newProps.dangerouslySetInnerHTML;
            // During hydration, props are not diffed at all (including dangerouslySetInnerHTML)
            // @TODO we should warn in debug mode when props don't match here.
            if (!isHydrating) {
                // But, if we are in a situation where we are using existing DOM (e.g. replaceNode)
                // we should read the existing DOM attributes to diff them
                if (excessDomChildren != null) {
                    oldProps = {};
                    for (i = 0; i < dom.attributes.length; i++) {
                        oldProps[dom.attributes[i].name] = dom.attributes[i].value;
                    }
                }
                if (newHtml || oldHtml) {
                    // Avoid re-applying the same '__html' if it did not changed between re-render
                    if (!newHtml ||
                        ((!oldHtml || newHtml.__html != oldHtml.__html) &&
                            newHtml.__html !== dom.innerHTML)) {
                        dom.innerHTML = (newHtml && newHtml.__html) || '';
                    }
                }
            }
            (0, props_1.diffProps)(dom, newProps, oldProps, isSvg, isHydrating);
            // If the new vnode didn't have dangerouslySetInnerHTML, diff its children
            if (newHtml) {
                newVNode._children = [];
            }
            else {
                i = newVNode.props.children;
                (0, children_1.diffChildren)(dom, (0, util_1.isArray)(i) ? i : [i], newVNode, oldVNode, globalContext, isSvg && nodeType !== 'foreignObject', excessDomChildren, commitQueue, excessDomChildren
                    ? excessDomChildren[0]
                    : oldVNode._children && (0, component_1.getDomSibling)(oldVNode, 0), isHydrating, refQueue);
                // Remove children that are not part of any vnode.
                if (excessDomChildren != null) {
                    for (i = excessDomChildren.length; i--;) {
                        if (excessDomChildren[i] != null)
                            (0, util_1.removeNode)(excessDomChildren[i]);
                    }
                }
            }
            // (as above, don't diff props during hydration)
            if (!isHydrating) {
                if ('value' in newProps &&
                    (i = newProps.value) !== undefined &&
                    // #2756 For the <progress>-element the initial value is 0,
                    // despite the attribute not being present. When the attribute
                    // is missing the progress bar is treated as indeterminate.
                    // To fix that we'll always update it when it is 0 for progress elements
                    (i !== dom.value ||
                        (nodeType === 'progress' && !i) ||
                        // This is only for IE 11 to fix <select> value not being updated.
                        // To avoid a stale select value we need to set the option.value
                        // again, which triggers IE11 to re-evaluate the select value
                        (nodeType === 'option' && i !== oldProps.value))) {
                    (0, props_1.setProperty)(dom, 'value', i, oldProps.value, false);
                }
                if ('checked' in newProps &&
                    (i = newProps.checked) !== undefined &&
                    i !== dom.checked) {
                    (0, props_1.setProperty)(dom, 'checked', i, oldProps.checked, false);
                }
            }
        }
        return dom;
    }
    /**
     * Invoke or update a ref, depending on whether it is a function or object ref.
     * @param {object|function} ref
     * @param {any} value
     * @param {import('../internal').VNode} vnode
     */
    function applyRef(ref, value, vnode) {
        try {
            if (typeof ref == 'function')
                ref(value);
            else
                ref.current = value;
        }
        catch (e) {
            options_1["default"]._catchError(e, vnode);
        }
    }
    exports.applyRef = applyRef;
    /**
     * Unmount a virtual node from the tree and apply DOM changes
     * @param {import('../internal').VNode} vnode The virtual node to unmount
     * @param {import('../internal').VNode} parentVNode The parent of the VNode that
     * initiated the unmount
     * @param {boolean} [skipRemove] Flag that indicates that a parent node of the
     * current element is already detached from the DOM.
     */
    function unmount(vnode, parentVNode, skipRemove) {
        var r;
        if (options_1["default"].unmount)
            options_1["default"].unmount(vnode);
        if ((r = vnode.ref)) {
            if (!r.current || r.current === vnode._dom) {
                applyRef(r, null, parentVNode);
            }
        }
        if ((r = vnode._component) != null) {
            if (r.componentWillUnmount) {
                try {
                    r.componentWillUnmount();
                }
                catch (e) {
                    options_1["default"]._catchError(e, parentVNode);
                }
            }
            r.base = r._parentDom = null;
            vnode._component = undefined;
        }
        if ((r = vnode._children)) {
            for (var i = 0; i < r.length; i++) {
                if (r[i]) {
                    unmount(r[i], parentVNode, skipRemove || typeof vnode.type !== 'function');
                }
            }
        }
        if (!skipRemove && vnode._dom != null) {
            (0, util_1.removeNode)(vnode._dom);
        }
        // Must be set to `undefined` to properly clean up `_nextDom`
        // for which `null` is a valid value. See comment in `create-element.js`
        vnode._parent = vnode._dom = vnode._nextDom = undefined;
    }
    exports.unmount = unmount;
    /** The `.render()` method for a PFC backing instance. */
    function doRender(props, state, context) {
        return this.constructor(props, context);
    }
});