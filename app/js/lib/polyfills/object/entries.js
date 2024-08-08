if (typeof Object.entries !== 'function') {
    Object.entries = function entries(obj) {
        var keys = Object.keys(obj);
        var i = keys.length;
        var entries = new Array(i);
        while (i--) {
            var prop = keys[i];
            entries[i] = [
                prop,
                obj[prop],
            ];
        }
        return entries;
    };
}
