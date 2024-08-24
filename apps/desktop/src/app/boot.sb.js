/*
* Note: Never make it a module.
* This script setups the AMD loader and execs the OEP
* */
!(function () {
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
            { name: "app", location: "app", main: "main.ui" },
        ],
        paths: {
        },
        aliases: {},
        map: {}
    };

    // alert('BOOTING!');

    // execute main
    require(dojoConfig, ["app", "dojo/domReady!"], (app) => {
        // alert('BOOTED!');

        app.start();
    });
}());
