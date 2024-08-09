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
            { name: "app", location: "test", main: "index" },
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
    require(dojoConfig, ["app", 'dojo/dom', 'dojo/query', "dojo/Deferred"], (app, dom, query, Deferred) => {
        air.trace('BOOTED!');
        air.trace('app: ' + app);
        air.trace('dom: ' + dom);
        air.trace('query: ' + query("body"));
        air.trace('Deferred: ' + Deferred);
    });
})();
