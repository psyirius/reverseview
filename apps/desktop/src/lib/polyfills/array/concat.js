if (typeof Array.prototype.concat !== 'function') {
    Array.prototype.concat = function concat(...items) {
        const result = [...this];

        for (const item of items) {
            if (Array.isArray(item)) {
                for (let i = 0, l = item.length; i < l; i++) {
                    result.push(item[i]);
                }
            } else {
                result.push(item);
            }
        }

        return result;
    }
}