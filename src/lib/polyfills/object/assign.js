if (typeof Object.assign !== 'function') {
    Object.assign = function assign(target) {
        for (let i = 1, n = arguments.length; i < n; i++) {
            const source = arguments[i];
            for (const prop in source) {
                if (Object.prototype.hasOwnProperty.call(source, prop)) {
                    target[prop] = source[prop];
                }
            }
        }

        return target;
    };
}