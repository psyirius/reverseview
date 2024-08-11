if (typeof Object.entries !== 'function') {
    Object.entries = function entries(obj) {
        const keys = Object.keys(obj);
        let i = keys.length;
        const entries = new Array(i);

        while (i--) {
            const prop = keys[i];
            entries[i] = [
                prop,
                obj[prop],
            ];
        }

        return entries;
    };
}