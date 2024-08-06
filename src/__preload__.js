"use strict";

window.global = new Function("return this;").apply(null);

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

// init YUI 3
((YUI, modules) => {
    YUI({
        debug: true,
        combine: false,
        // skin: 'night',
    }).use(...modules, function(Y) {
        global.$Y = Y;
    });
})(YUI, global['$YUI3_MODULES'] || []);