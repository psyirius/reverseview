var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
if (typeof Array.prototype.concat !== 'function') {
    Array.prototype.concat = function concat() {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var result = __spreadArray([], this, true);
        for (var _a = 0, items_1 = items; _a < items_1.length; _a++) {
            var item = items_1[_a];
            if (Array.isArray(item)) {
                for (var i = 0, l = item.length; i < l; i++) {
                    result.push(item[i]);
                }
            }
            else {
                result.push(item);
            }
        }
        return result;
    };
}
