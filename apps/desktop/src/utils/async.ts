// @ts-ignore
!(function (exports){
    class Deferred<T> {
        resolve: (value: T) => void;
        reject: (reason?: any) => void;

        __promise: any;

        constructor() {
            const self = this;

            this.__promise = new $Y.Promise((resolve: any, reject: any) => {
                self.resolve = resolve;
                self.reject = reject;
            });
        }

        then() {
            this.__promise.then.apply(this.__promise, arguments);
        }

        catch() {
            this.__promise.catch.apply(this.__promise, arguments);
        }
    }

    // const { Deferred } = $dtk;

    // Exports
    exports.Deferred = Deferred;
}((window as any).rvw.provide("rvw.utils.async")));