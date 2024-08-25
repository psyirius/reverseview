class Set<T = any> {
    _v: T[] = [];

    constructor(values?: readonly T[] | null) {
        if (values) {
            values.forEach(this.add, this);
        }
    }

    /**
     * @returns the number of (unique) elements in Set.
     */
    // get size(): number {
    //     return this._v.length;
    // }

    /**
     * Appends a new element with a specified value to the end of the Set.
     */
    add(value: T): this {
        if (!this.has(value)) {
            this._v.push(value);
        }
        return this;
    }

    /**
     * Removes a specified value from the Set.
     * @returns Returns true if an element in the Set existed and has been removed, or false if the element does not exist.
     */
    delete(value: T): boolean {
        return this.has(value) && !!this._v.splice(this._v.indexOf(value), 1);
    }

    /**
     * @returns a boolean indicating whether an element with the specified value exists in the Set or not.
     */
    has(value: T): boolean {
        return -1 < this._v.indexOf(value);
    }

    clear(): void {
        this._v.splice(0, this._v.length);
    }

    /**
     * Executes a provided function once per each value in the Set object, in insertion order.
     */
    forEach(callback: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void {
        this._v.forEach(
            function (value: T, index: number)  {
                callback.call(thisArg, value, value, this);
            },
            this
        );
    }
}


Object.defineProperties(Set.prototype, {
    size: {
        configurable: true,
        get: function () {
            return this._v.length;
        }
    }
});

export default Set;