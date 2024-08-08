var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
define(["require", "exports", "@lib/polyfills/object/entries", "@lib/polyfills/object/assign", "@lib/polyfills/array/reduce", "@lib/polyfills/array/concat", "@lib/polyfills/dom/all"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.Fragment = exports.jsxs = exports.jsx = exports.transformElement = void 0;
    var flatten = function (arr) {
        return arr.reduce(function (flat, toFlatten) {
            return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
        }, []);
    };
    function transformElement(element) {
        if (!element)
            return;
        switch (typeof element) {
            case 'string':
            case 'number':
                return document.createTextNode(element.toString());
            case 'function':
                return element();
            default:
                return element;
        }
    }
    exports.transformElement = transformElement;
    var appendChildren = function (element, children) {
        var flattenChildren = Array.isArray(children)
            ? flatten(children)
            : [children];
        flattenChildren.forEach(function (child) {
            if (child) {
                var transformedChild = transformElement(child);
                element.append(transformedChild);
            }
        });
        return element;
    };
    var setProps = function (element, props) {
        Object.entries(props).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (key in element) {
                if (element[key] instanceof Object && value instanceof Object) {
                    Object.assign(element[key], value);
                }
                else {
                    element[key] = value;
                }
            }
            else {
                element.setAttribute(key, value);
            }
        });
    };
    var jsx = function (tag, _a) {
        if (_a === void 0) { _a = {}; }
        var ref = _a.ref, children = _a.children, props = __rest(_a, ["ref", "children"]);
        if (typeof tag === 'string') {
            var element = document.createElement(tag);
            setProps(element, props);
            if (children) {
                element = appendChildren(element, children);
            }
            if (ref) {
                if (typeof ref === 'function') {
                    ref(element);
                }
                else {
                    element.setAttribute('ref', ref);
                }
            }
            return element;
        }
        if (typeof tag === 'function') {
            return tag(__assign({ ref: ref, children: children }, props));
        }
        if (tag instanceof HTMLElement) {
            var element = tag;
            setProps(element, props);
            if (children) {
                element = appendChildren(element, children);
            }
            if (ref) {
                if (typeof ref === 'function') {
                    ref(element);
                }
                else {
                    element.setAttribute('ref', ref);
                }
            }
            return element;
        }
        if (tag instanceof DocumentFragment) {
            var element = tag;
            if (children) {
                element = appendChildren(element, children);
            }
            return element;
        }
        throw new Error("Invalid tag type: ".concat(tag));
        // const node = document.createElement(tag);
        //
        // const appendChildren = (child) => {
        //     if (Array.isArray(child)) {
        //         child.forEach(appendChildren);
        //     } else if (child != null && child !== true && child !== false) {
        //         node.append(child);
        //     } else if (typeof child !== 'undefined') {
        //         throw new Error(`Not injecting child: ${String(child)}`);
        //     }
        // }
        //
        // Object.entries(props).forEach(([key, value]) => {
        //     if (key in node) {
        //         if (node[key] instanceof Object && value instanceof Object) {
        //             Object.assign(node[key], value)
        //         } else {
        //             node[key] = value;
        //         }
        //     } else {
        //         node.setAttribute(key, value)
        //     }
        // })
        //
        // appendChildren(children);
        //
        // ref?.(node);
        //
        // return node;
    };
    exports.jsx = jsx;
    exports.jsxs = exports.jsx;
    var Fragment = function (_a) {
        var _b = _a === void 0 ? {} : _a, children = _b.children;
        var element = document.createDocumentFragment();
        return appendChildren(element, children);
    };
    exports.Fragment = Fragment;
});
