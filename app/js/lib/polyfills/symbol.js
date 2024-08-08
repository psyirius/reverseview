if (typeof window.Symbol === 'undefined') {
    window.Symbol = /** @class */ (function () {
        function Symbol(name) {
            this.name = name;
        }
        Symbol.prototype.valueOf = function () {
            return this.name;
        };
        Symbol.prototype.toString = function () {
            return Symbol(this.name);
        };
        return Symbol;
    }());
}
