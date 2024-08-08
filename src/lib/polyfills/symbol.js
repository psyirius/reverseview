if (typeof window.Symbol === 'undefined') {
    window.Symbol = class Symbol {
        constructor(name) {
            this.name = name;
        }

        valueOf() {
            return this.name;
        }

        toString() {
            return Symbol(this.name);
        }
    }
}