if (typeof Array.prototype.includes !== 'function') {
    Array.prototype.includes = function (searchElement, fromIndex) {
        if (fromIndex === undefined) { fromIndex = 0; }
        return this.indexOf(searchElement, fromIndex) !== -1;
    };
}