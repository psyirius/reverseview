define(["require", "exports", "@lib/jsx/jsx-runtime"], function (require, exports, jsx_runtime_1) {
    "use strict";
    exports.__esModule = true;
    exports.render = void 0;
    var render = function (element, selector) {
        if (!element)
            return;
        var transformedElement = (0, jsx_runtime_1.transformElement)(element);
        if (!selector) {
            document.body.appendChild(transformedElement);
            return;
        }
        selector.appendChild(transformedElement);
    };
    exports.render = render;
    exports["default"] = {
        render: exports.render
    };
});
