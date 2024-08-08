if (typeof Function.prototype.bind === 'undefined') {
    Function.prototype.bind = function (context) {
        if (typeof this !== 'function') {
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }
        var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, FNOP = function () {
        }, fBound = function () {
            return fToBind.apply(this instanceof FNOP && context
                ? this
                : context, aArgs.concat(Array.prototype.slice.call(arguments)));
        };
        FNOP.prototype = this.prototype;
        fBound.prototype = new FNOP();
        return fBound;
    };
}
