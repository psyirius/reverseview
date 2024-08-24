/*
* Note: Never make it a module.
* This script setups the AMD loader and execs the OEP
* */
!(function () {
    const dojoConfig = {
        has: {
            "dojo-firebug": true,
            'csp-restrictions': true,
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
            // @root
            { name: "@", location: "./" },
            { name: "@app", location: "app" },
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

    const imports = {
        'dojo/has': 'has',

        'dojo/dom': 'dom',
        'dojo/query': 'query',
        'dojo/dom-construct': 'domConstruct',

        'dojo/on': 'on',
        'dojo/fx': 'fx',
        'dojo/_base/fx': 'baseFx',
        'dojo/fx/easing': 'easing',
        'dojo/window': 'window',
        'dojo/dom-style': 'domStyle',
        'dojo/aspect': 'aspect',
        'dojo/dom-form': 'domForm',
        'dojo/json': 'json',

        'dojo/_base/array': 'array',
        'dojo/_base/declare': 'declare',
        'dojo/_base/lang': 'lang',

        'dojo/request': 'request',
        'dojo/request/script': 'requestScript',
        'dojo/request/notify': 'requestNotify',
        'dojo/request/registry': 'requestRegistry',

        'dojo/promise/Promise': 'promisePromise',
        'dojo/promise/first': 'promiseFirst',
        'dojo/promise/all': 'promiseAll',
        'dojo/Deferred': 'Deferred',
        'dojo/when': 'when',

        // 'dojo/store/JsonRest': 'JsonRest',
        // 'dojo/store/Memory': 'Memory',
        // 'dojo/store/Cache': 'Cache',
        // 'dojo/store/Observable': 'Observable',
        //
        // // dojox
        // 'dojox/socket': 'socket',
    };

    // execute main
    require(dojoConfig, [
        "app",
        ...Object.keys(imports),
        "dojo/domReady!",
    ], (app, ...imp) => {
        air.trace('BOOTED!');

        window.$dtk = window.$dtk || {};

        Object.keys(imports).forEach((key, i) => {
            $dtk[imports[key]] = imp[i];
        });

        const yui3Loaded = (() => {
            const { Deferred } = $dtk;

            const deferred = new Deferred();

            if (typeof global.__yui3_loaded === 'undefined') {
                global.__yui3_loaded = deferred;
            } else {
                deferred.resolve(global.__yui3_loaded);
            }

            return deferred;
        })();

        TEST: {
            const { dom, query } = $dtk;

            air.trace('dom: ' + dom.byId("root"));
            air.trace('query: ' + query("#root"));

            break TEST;
        }

        yui3Loaded.then((Y) => {
            delete global.__yui3_loaded;

            air.trace('STARTING!');

            app.start(Y, $dtk);
        });
    });
}());
