if (typeof Object.assign !== 'function') {
    Object.assign = function assign(target) {
        for (var i = 1, n = arguments.length; i < n; i++) {
            var source = arguments[i];
            for (var prop in source) {
                if (Object.prototype.hasOwnProperty.call(source, prop)) {
                    target[prop] = source[prop];
                }
            }
        }
        return target;
    };
}
