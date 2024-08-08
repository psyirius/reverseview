if (typeof Array.prototype.map !== 'function') {
    Array.prototype.map = function map(callbackfn, thisArg) {
        "use strict";
        if (this === void 0 || this === null) {
            throw new TypeError();
        }
        const t = Object(this);
        const len = t.length >>> 0;
        if (typeof callbackfn !== "function") {
            throw new TypeError();
        }
        const res = [];
        for (let i = 0; i < len; i++) {
            if (i in t) {
                const val = t[i]; // in case fun mutates this
                res[i] = thisArg ? callbackfn.call(thisArg, val, i, t) : callbackfn(val, i, t);
            }
        }
        return res;
    }
}