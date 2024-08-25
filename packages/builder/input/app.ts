export class Deferred {
    resolve = null;
    reject = null;

    __promise = null;

    constructor() {
        this.__promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    then() {
        this.__promise.then.apply(this.__promise, arguments);
    }

    catch() {
        this.__promise.catch.apply(this.__promise, arguments);
    }

    *generator() {
        yield 1;
        yield 2;
        yield 3;
    }
}

const arr2 = [2, 3, ,36,26]
const arr = [1, ...arr2];

function Nex(): void {
    if (new.target === undefined) {
        return new Nex();
    }
}

(async function () {
    const promz = [
        Promise.resolve(100),
        Promise.resolve(100),
        Promise.resolve(100),
        Promise.resolve(100),
    ]

    for await (const arg of promz) {
        console.log(arg);
    }
}());

const getAPI = async (url: string) => {
    // Get API
    return {};
};

const str = "Hello!";
for (const s of str) {
    // @ts-ignore
    console.log(import.meta.env.mode + s);
    // @ts-ignore
    console.log(import.meta.url + s);

    DEV: {
        console.log('DEBUG');

        break DEV;
    }
}

const f = Symbol(1);
const g = Symbol(1);

// if (f instanceof Symbol) {
//     console.log(typeof g);
// }
