(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@lib/zrx/jsx-runtime", "jquery", "@lib/zrx/hooks"], factory);
    }
})(function (require, exports) {
    "use strict";
    var __syncRequire = typeof module === "object" && typeof module.exports === "object";
    exports.__esModule = true;
    var jsx_runtime_1 = require("@lib/zrx/jsx-runtime");
    var $ = require("jquery");
    $(function () {
        // alert('jQuery ready');
        air.trace('jQuery ready');
    });
    var hooks_1 = require("@lib/zrx/hooks");
    var Counter = function () {
        var _a = (0, hooks_1.useState)(0), count = _a[0], setCount = _a[1];
        (0, hooks_1.useEffect)(function () {
            var interval = setInterval(function () {
                setCount(function (c) { return c + 1; });
            }, 1000);
            return function () {
                clearInterval(interval);
            };
        }, []);
        return (0, jsx_runtime_1.jsx)("div", { children: count });
    };
    var App = function (_a) {
        var dev = _a.dev;
        var _b = (0, hooks_1.useState)(true), show = _b[0], setShow = _b[1];
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [dev && ((0, jsx_runtime_1.jsx)("div", { className: "dev-toolbar", children: (0, jsx_runtime_1.jsx)("button", { id: "dev-refresh", onClick: function () { return window.location.reload(); }, children: "Refresh" }) })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                setShow(!show);
                            }, children: show ? "Hide" : "Show" }), show ? (0, jsx_runtime_1.jsx)(Counter, {}) : (0, jsx_runtime_1.jsx)("div", { children: "No counter" })] })] }));
    };
    if (typeof window !== "undefined") {
        // FIXME: clashing with semantic-ui
        // render(<App dev />, document.getElementById("root"));
    }
    /* ------------------------------------------------------------------------------------------------------------------ */
    // Dynamic import works with a polyfill of Promise
    window.__defineGetter__("Promise", function () { return $Y.Promise; });
    (__syncRequire ? Promise.resolve().then(function () { return require('./cfg'); }) : new Promise(function (resolve_1, reject_1) { require(['./cfg'], resolve_1, reject_1); })).then(function (mod) {
        air.trace('cfg', mod["default"]);
    });
    air.trace('test/index.tsx');
    exports["default"] = App;
});
