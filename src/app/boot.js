/*
* Note: Never make it a module.
* This script setups the AMD loader and execs the OEP
* */
(function () {
    const dojoConfig = {
        has: {
            // "dojo-firebug": true,
        },
        isDebug: true,
        debugAtAllCosts: true,
        parseOnLoad: true,
        async: true,
        locale: "en-us",
        baseUrl: "/js/",
        packages: [
            // dojo (use tools/dojo-downloader.js to cache)
            { name: "dojo", location: "../lib/dojo" },
            { name: "dijit", location: "../lib/dijit" },
            { name: "dojox", location: "../lib/dojox" },
            // internal libs
            { name: "@lib", location: "lib" },
            // jsx
            { name: "jsx", location: "lib/jsx" },
            // entry point
            { name: "app", location: "app", main: "main" },
        ],
        paths: {
            // jquery: "../node_modules/jquery/dist/jquery.slim.min",
            jquery: "lib/jquery/jquery-3.7.1.min",
        },
        aliases: {},
        map: {}
    };

    air.trace('BOOTING!');

    // execute main
    require(dojoConfig, ["app", 'dojo/Deferred', "dojo/domReady!"], (app, Deferred) => {
        air.trace('BOOTED!');

        const yui3Loaded = (() => {
            const deferred = new Deferred();

            if (typeof global.__yui3_loaded === 'undefined') {
                global.__yui3_loaded = deferred;
            } else {
                deferred.resolve(global.__yui3_loaded);
            }

            return deferred;
        })();

        // air.trace('dom: ' + dom.byId("root"));
        // air.trace('query: ' + query("#root"));

        yui3Loaded.then((Y) => {
            delete global.__yui3_loaded;

            air.trace('STARTING!');

            app.start(Y);
        });
    });
})();
