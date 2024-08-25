type Subscriber<T> = (value: T) => void;
type Unsubscriber = () => void;
type Updater<T> = (value: T) => T;

export interface Writable<T> {
    subscribe: (run: Subscriber<T>) => Unsubscriber;
    set: (value: T) => void;
    update: (updater: Updater<T>) => void;
}

export function writable<T>(value: T): Writable<T> {
    const subscribers: Subscriber<T>[] = [];

    function subscribe(run: Subscriber<T>): Unsubscriber {
        subscribers.push(run);
        run(value);
        return function () {
            const index = subscribers.indexOf(run);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
        };
    }

    function set(newValue: T) {
        value = newValue;
        for (let i = 0; i < subscribers.length; i++) {
            subscribers[i](value);
        }
    }

    function update(updater: Updater<T>) {
        set(updater(value));
    }

    return {
        subscribe: subscribe,
        set: set,
        update: update
    };
}

export interface Readable<T> {
    subscribe: (run: Subscriber<T>) => Unsubscriber;
}

export function readable<T>(initialValue: T, start: (set: (value: T) => void) => void): Readable<T> {
    let value = initialValue;
    const subscribers: Subscriber<T>[] = [];

    function subscribe(run: Subscriber<T>): Unsubscriber {
        subscribers.push(run);
        run(value);

        if (subscribers.length === 1) {
            start(function (newValue) {
                value = newValue;
                for (let i = 0; i < subscribers.length; i++) {
                    subscribers[i](value);
                }
            });
        }

        return function () {
            const index = subscribers.indexOf(run);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
        };
    }

    return {
        subscribe: subscribe
    };
}

export function derived<S, T>(stores: Writable<S> | Writable<S>[], fn: (values: S | S[], set: (value: T) => void) => void): Readable<T> {
    let value: T;
    const subscribers: Subscriber<T>[] = [];

    function subscribe(run: Subscriber<T>): Unsubscriber {
        subscribers.push(run);
        run(value);

        function set(newValue: T) {
            value = newValue;
            for (let i = 0; i < subscribers.length; i++) {
                subscribers[i](value);
            }
        }

        if (Array.isArray(stores)) {
            const unsubscribers: Unsubscriber[] = [];
            for (let i = 0; i < stores.length; i++) {
                unsubscribers.push(stores[i].subscribe(function () {
                    // @ts-expect-error
                    fn(stores.map(function (store) { return store; }), set);
                }));
            }
            // @ts-expect-error
            fn(stores.map(function (store) { return store; }), set);

            return function () {
                for (let i = 0; i < unsubscribers.length; i++) {
                    unsubscribers[i]();
                }
                const index = subscribers.indexOf(run);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
            };
        } else {
            const unsubscribe = stores.subscribe(function () {
                // @ts-expect-error
                fn(stores, set);
            });
            // @ts-expect-error
            fn(stores, set);

            return function () {
                unsubscribe();
                const index = subscribers.indexOf(run);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
            };
        }
    }

    return {
        subscribe: subscribe
    };
}

export function get<T>(store: Readable<T>): T {
    let value: T;
    store.subscribe(function (newValue) {
        value = newValue;
    })();
    return value;
}
