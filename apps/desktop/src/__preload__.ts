"use strict";

(window as any).global ??= new Function("return this;").apply(null);
(window as any).self ??= (window as any).global;
(window as any).globalThis ??= (window as any).global;

(() => {
    "use strict";

    const provide = (namespace: string): any => {
        // docs: create a namespace
        const nsl = namespace.split(".");

        if ((nsl.length > 1) && nsl[0] === "rvw" && nsl[1] === "provide") {
            throw new Error("Namespace 'rvw.provide' cannot be used which is only reserved for the namespace provider.");
        }

        let parent = (window as any).global;

        for (const nsk of nsl) {
            switch (typeof parent[nsk]) {
                case "object":
                case "function": {
                    break;
                }
                default: {
                    parent[nsk] = {};
                }
            }

            parent = parent[nsk];
        }

        return parent;
    }

    // create the root namespace with the provider function
    provide("rvw").provide = provide;
})();

// console shim
(() => {
    "use strict";

    const air = ((window as any).global as any).air ??= {};
    const criticalTypes = ["error", "warn"];

    const print = (type) => function () {
        if (criticalTypes.indexOf(type) !== -1) {
            if (typeof air.Introspector.Console !== "undefined") {
                air.Introspector.Console[type].apply(air.Introspector.Console, arguments);
                return;
            }
        }

        const args = Array.prototype.slice.call(arguments);
        air.trace(`[${type}]: ${args.join(" ")}`);
    };

    const console = {
        log: print("log"),
        warn: print("warn"),
        info: print("info"),
        debug: print("debug"),
        error: print("error"),
    };

    ((window as any).global as any).console ??= console;
})();

// init YUI 3
if (typeof (window as any).YUI !== "undefined") {
    ((YUI, config: object, modules: string[]) => {
        "use strict";

        function checkModules(Y, modules: string[]) {
            const loader = new Y.Loader({
                base: Y.config.base,
                require: [...modules],
            });

            // Tell loader to calculate dependencies
            loader.calculate();

            const out = loader.resolve();
            // out: js, jsMods, css, cssMods

            const { File } = air;

            for (const filepath of [...out.js, ...out.css]) {
                const file = new File(filepath);
                if (!file.exists) {
                    air.trace(`YUI3 Dep missing: ${filepath}`);
                }
            }
        }

        const Y = YUI(config);

        checkModules(Y, modules);

        Y.use(...modules, function(Y) {
            ((window as any).global as any).$Y = Y;

            air.trace("YUI3 loaded");

            if (typeof (window as any).global.__yui3_loaded !== "undefined") {
                ((window as any).global as any).__yui3_loaded.resolve(Y);
            } else {
                ((window as any).global as any).__yui3_loaded = Y;
            }
        });
    })(
        ((window as any).global as any).YUI,
        ((window as any).global as any)['$YUI3_CONFIG'] || {},
        ((window as any).global as any)['$YUI3_MODULES'] || [],
    );
}

// TODO: remove it when the global denoising is over
// the global object to host the global variables
((window as any).global as any).rvw.provide("$RvW").global = (window as any).global;