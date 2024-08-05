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

        for (let i = 0; i < nsl.length; ++i) {
            const nsk = nsl[i];

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