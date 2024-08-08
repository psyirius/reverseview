define(["require", "exports", "./index.js"], function (require, exports, preact) {
    "use strict";
    exports.__esModule = true;
    if (typeof module < 'u')
        module.exports = preact;
    else
        self.preact = preact;
});
