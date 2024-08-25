// /*
//  * Taken from:
//  * |> https://github.com/sveltejs/svelte/blob/svelte%405.0.0-next.238/packages/svelte/src/store/shared/index.js
//  */
//
// /** Callback to inform of a value updates. */
// type Subscriber<T> = (value: T) => void;
//
// /** Unsubscribes from value updates. */
// type Unsubscriber = () => void;
//
// /** Callback to update a value. */
// type Updater<T> = (value: T) => T;
//
// /**
//  * Start and stop notification callbacks.
//  * This function is called when the first subscriber subscribes.
//  *
//  * @param set Function that sets the value of the store.
//  * @param update Function that sets the value of the store after passing the current value to the update function.
//  * @returns Optionally, a cleanup function that is called when the last remaining
//  * subscriber unsubscribes.
//  */
// type StartStopNotifier<T> = (
//     set: (value: T) => void,
//     update: (fn: Updater<T>) => void
// ) => void | (() => void);
//
// /** Readable interface for subscribing. */
// interface Readable<T> {
//     /**
//      * Subscribe on value changes.
//      * @param run subscription callback
//      * @param invalidate cleanup callback
//      */
//     subscribe(this: void, run: Subscriber<T>, invalidate?: () => void): Unsubscriber;
// }
//
// /** Writable interface for both updating and subscribing. */
// interface Writable<T> extends Readable<T> {
//     /**
//      * Set value and inform subscribers.
//      * @param value to set
//      */
//     set(this: void, value: T): void;
//
//     /**
//      * Update value using callback and inform subscribers.
//      * @param updater callback
//      */
//     update(this: void, updater: Updater<T>): void;
// }
//
// export { Readable, StartStopNotifier, Subscriber, Unsubscriber, Updater, Writable };
//
// // ---------------------------------------------------------------------------------------------------------------------
//
// /** Pair of subscriber and invalidator. */
// type SubscribeInvalidateTuple<T> = [Subscriber<T>, () => void];
//
// /** One or more `Readable`s. */
// type Stores = Readable<any> | [Readable<any>, ...Array<Readable<any>>] | Array<Readable<any>>;
//
// /** One or more values from `Readable` stores. */
// type StoresValues<T> =
//     T extends Readable<infer U> ? U : { [K in keyof T]: T[K] extends Readable<infer U> ? U : never };
//
// // ---------------------------------------------------------------------------------------------------------------------
//
// const noop = () => {};
//
// function run_all(arr: Array<() => void>) {
//     for (let i = 0; i < arr.length; i++) {
//         arr[i]();
//     }
// }
//
// // ---------------------------------------------------------------------------------------------------------------------
//
// import Set from './shims/collections/set';
//
// // ---------------------------------------------------------------------------------------------------------------------
//
// export function safe_not_equal(
//     a: unknown,
//     b: unknown
// ): boolean {
//     return a != a
//         ? b == b
//         : a !== b || (a !== null && typeof a === 'object') || typeof a === 'function';
// }
//
// // ---------------------------------------------------------------------------------------------------------------------
//
// function subscribe_to_store<T>(
//     store: Readable<T> | null | undefined,
//     run: (value: T) => void,
//     invalidate?: (value: T) => void | undefined
// ): () => void {
//     if (store == null) {
//         run(undefined);
//
//         if (invalidate) invalidate(undefined);
//
//         return noop;
//     }
//
//     // Svelte store takes a private second argument
//     const unsub = store.subscribe(
//         run,
//         // @ts-expect-error
//         invalidate
//     );
//
//     // Also support RxJS
//     // @ts-expect-error
//     return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
// }
//
// // ---------------------------------------------------------------------------------------------------------------------
//
// const subscriber_queue: Array<SubscribeInvalidateTuple<any> | any> = [];
//
// /**
//  * Creates a `Readable` store that allows reading by subscription.
//  *
//  * https://svelte.dev/docs/svelte-store#readable
//  */
// export function readable<T>(value: T, start: StartStopNotifier<T>): Readable<T> {
//     return {
//         subscribe: writable(value, start).subscribe
//     };
// }
//
// /**
//  * Create a `Writable` store that allows both updating and reading by subscription.
//  *
//  * https://svelte.dev/docs/svelte-store#writable
//  */
// export function writable<T>(
//     value: T,
//     start: StartStopNotifier<T> = noop
// ): Writable<T> {
//     let stop: Unsubscriber | null = null;
//
//     const subscribers: Set<SubscribeInvalidateTuple<T>> = new Set();
//
//     function set(new_value: T): void {
//         if (safe_not_equal(value, new_value)) {
//             value = new_value;
//             if (stop) {
//                 // store is ready
//                 const run_queue = !subscriber_queue.length;
//                 for (const subscriber of subscribers) {
//                     subscriber[1]();
//                     subscriber_queue.push(subscriber, value);
//                 }
//                 if (run_queue) {
//                     for (let i = 0; i < subscriber_queue.length; i += 2) {
//                         subscriber_queue[i][0](subscriber_queue[i + 1]);
//                     }
//                     subscriber_queue.length = 0;
//                 }
//             }
//         }
//     }
//
//     function update(fn: Updater<T>): void {
//         set(fn(value));
//     }
//
//     function subscribe(run: Subscriber<T>, invalidate: () => void = noop): Unsubscriber {
//         const subscriber: SubscribeInvalidateTuple<T> = [run, invalidate];
//         subscribers.add(subscriber);
//         if (subscribers.size === 1) {
//             stop = start(set, update) || noop;
//         }
//         run(value);
//         return () => {
//             subscribers.delete(subscriber);
//             if (subscribers.size === 0 && stop) {
//                 stop();
//                 stop = null;
//             }
//         };
//     }
//     return { set, update, subscribe };
// }
//
// /**
//  * Derived value store by synchronizing one or more readable stores and
//  * applying an aggregation function over its input values.
//  *
//  * https://svelte.dev/docs/svelte-store#derived
//  */
// export function derived<S extends Stores, T>(
//     stores: S,
//     fn: (
//         values: StoresValues<S>,
//         set: (value: T) => void,
//         update: (fn: Updater<T>) => void
//     ) => Unsubscriber | void,
//     initial_value?: T | undefined
// ): Readable<T>;
//
// /**
//  * Derived value store by synchronizing one or more readable stores and
//  * applying an aggregation function over its input values.
//  *
//  * https://svelte.dev/docs/svelte-store#derived
//  */
// export function derived<S extends Stores, T>(
//     stores: S,
//     fn: (values: StoresValues<S>) => T,
//     initial_value?: T | undefined
// ): Readable<T>;
//
// export function derived<S extends Stores, T>(
//     stores: S,
//     fn: Function,
//     initial_value?: T | undefined
// ): Readable<T> {
//     const single = !Array.isArray(stores);
//     const stores_array: Array<Readable<any>> = single ? [stores] : stores;
//     if (!stores_array.every(Boolean)) {
//         throw new Error('derived() expects stores as input, got a falsy value');
//     }
//     const auto = fn.length < 2;
//     return readable(initial_value, (set, update) => {
//         let started = false;
//         const values: T[] = [];
//         let pending = 0;
//         let cleanup = noop;
//         const sync = () => {
//             if (pending) {
//                 return;
//             }
//             cleanup();
//             const result = fn(single ? values[0] : values, set, update);
//             if (auto) {
//                 set(result);
//             } else {
//                 cleanup = typeof result === 'function' ? result : noop;
//             }
//         };
//         const unsubscribers = stores_array.map((store, i) =>
//             subscribe_to_store(
//                 store,
//                 (value) => {
//                     values[i] = value;
//                     pending &= ~(1 << i);
//                     if (started) {
//                         sync();
//                     }
//                 },
//                 () => {
//                     pending |= 1 << i;
//                 }
//             )
//         );
//         started = true;
//         sync();
//         return function stop() {
//             run_all(unsubscribers);
//             cleanup();
//             // We need to set this to false because callbacks can still happen despite having unsubscribed:
//             // Callbacks might already be placed in the queue which doesn't know it should no longer
//             // invoke this derived store.
//             started = false;
//         };
//     });
// }
//
// /**
//  * Takes a store and returns a new one derived from the old one that is readable.
//  *
//  * https://svelte.dev/docs/svelte-store#readonly
//  */
// export function readonly<T>(store: Readable<T>): Readable<T> {
//     return {
//         subscribe: store.subscribe.bind(store)
//     };
// }
//
// /**
//  * Get the current value from a store by subscribing and immediately unsubscribing.
//  *
//  * https://svelte.dev/docs/svelte-store#get
//  */
// export function get<T>(store: Readable<T>): T {
//     let value: T;
//     subscribe_to_store(store, (_) => (value = _))();
//     return value;
// }