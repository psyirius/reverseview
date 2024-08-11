import '@lib/polyfills/object/entries';
import '@lib/polyfills/object/assign';

import '@lib/polyfills/array/reduce';
import '@lib/polyfills/array/concat';

import '@lib/polyfills/dom/all';


const flatten = (arr) =>
    arr.reduce(
        (flat, toFlatten) =>
            flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten),
        []
    );

export function transformElement(element) {
    if (!element) return;

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

const appendChildren = (element, children) => {
    const flattenChildren = Array.isArray(children)
        ? flatten(children)
        : [children];

    flattenChildren.forEach((child) => {
        if (child) {
            const transformedChild = transformElement(child);
            element.append(transformedChild);
        }
    });

    return element;
};

const setProps = (element, props) => {
    Object.entries(props).forEach(([key, value]) => {
        if (key in element) {
            if (element[key] instanceof Object && value instanceof Object) {
                Object.assign(element[key], value)
            } else {
                element[key] = value;
            }
        } else {
            element.setAttribute(key, value)
        }
    })
}

export const jsx = (tag, { ref, children, ...props } = {}) => {
    if (typeof tag === 'string') {
        let element = document.createElement(tag);

        setProps(element, props);

        if (children) {
            element = appendChildren(element, children);
        }

        if (ref) {
            if (typeof ref === 'function') {
                ref(element);
            } else {
                element.setAttribute('ref', ref);
            }
        }

        return element;
    }

    if (typeof tag === 'function') {
        return tag({ ref, children, ...props });
    }

    if (tag instanceof HTMLElement) {
        let element = tag;

        setProps(element, props);

        if (children) {
            element = appendChildren(element, children);
        }

        if (ref) {
            if (typeof ref === 'function') {
                ref(element);
            } else {
                element.setAttribute('ref', ref);
            }
        }

        return element;
    }

    if (tag instanceof DocumentFragment) {
        let element = tag;

        if (children) {
            element = appendChildren(element, children);
        }

        return element;
    }

    throw new Error(`Invalid tag type: ${tag}`);

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
}

export const jsxs = jsx;

export const Fragment = ({ children } = {}) => {
    const element = document.createDocumentFragment();

    return appendChildren(element, children);
};