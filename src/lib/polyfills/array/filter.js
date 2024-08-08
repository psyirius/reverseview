if (typeof Array.prototype.filter !== 'function') {
    Array.prototype.filter = function filter(predicate/*, thisArg*/) {
        if (typeof predicate !== 'function') {
            throw new TypeError('Array#filter: predicate must be a function');
        }

        const list = Object(this);
        const length = Math.max(0, list.length) >>> 0; // hack: ES.ToUint32;

        const resultArray = [];
        const thisArg = arguments.length > 1 ? arguments[1] : undefined;
        for (let i = 0; i < length; i++) {
            if (i in list) {
                const element = list[i];

                if (predicate.call(thisArg, element, i, list)) {
                    resultArray.push(element);
                }
            }
        }

        return resultArray;
    }
}