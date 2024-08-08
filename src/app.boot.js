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
        packages: [{
            name: "app", location: "app", main: "index",
        }, {
            name: "@lib", location: "lib",
        }, {
            name: "jsx", location: "lib/jsx"
        }],
        paths: {
            jquery: "../node_modules/jquery/dist/jquery.slim.min",
            // jquery: "lib/jquery/jquery-3.7.1.min",
        },
        aliases: {},
        map: {}
    };

    // execute main
    require(dojoConfig, ["app"], function (app) {
        air.trace('BOOTED!');
    });
})();
