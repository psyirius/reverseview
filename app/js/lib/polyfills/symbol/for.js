if (typeof Symbol["for"] !== 'function') {
    Symbol["for"] = function (key) {
        return { key: /** @class */ (function () {
                function key() {
                }
                return key;
            }()) }[key];
    };
}