"use strict";

window.global ??= new Function("return this;").apply(null);
window.globalThis ??= window.global;

(() => {
    "use strict";

    const provide = (namespace) => {
        // docs: create a namespace
        const nsl = namespace.split(".");

        if (nsl.length > 1 && nsl[0] === "rvw" && nsl[1] === "provide") {
            throw new Error("Namespace cannot be 'rvw.provide' which is reserved for the namespace provider.");
        }

        let parent = global;

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

    const criticalTypes = ["error", "warn"];

    const print = (type) => function () {
        if (criticalTypes.indexOf(type) !== -1) {
            if (typeof air.Introspector.Console !== "undefined") {
                air.Introspector.Console[type].apply(air.Introspector.Console, arguments);
                return;
            }
        }

        const args = [...arguments];
        air.trace(`[${type}]: ${args.join(" ")}`);
    };

    const console = {
        log: print("log"),
        warn: print("warn"),
        info: print("info"),
        debug: print("debug"),
        error: print("error"),
    };

    global['console'] ??= console;
})();

// init YUI 3
if (typeof YUI !== "undefined") {
    ((YUI, config, modules) => {
        "use strict";
        function checkModules(Y, modules) {
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
            global.$Y = Y;

            air.trace("YUI3 loaded");

            if (typeof global.__yui3_loaded !== "undefined") {
                global.__yui3_loaded.resolve(Y);
            } else {
                global.__yui3_loaded = Y;
            }
        });
    })(YUI, global['$YUI3_CONFIG'] || {}, global['$YUI3_MODULES'] || []);
}

// TODO: remove it when the global denoising is over
// the global object to host the global variables
rvw.provide("$RvW").global = {};