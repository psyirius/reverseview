import { transformElement } from '@lib/jsx/jsx-runtime';

export const render = (element, selector) => {
    if (!element) return;

    const transformedElement = transformElement(element);

    if (!selector) {
        document.body.appendChild(transformedElement);
        return;
    }

    selector.appendChild(transformedElement);
};

export default {
    render,
}