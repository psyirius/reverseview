// @ts-nocheck

window.childSandboxBridge.sayHello = function (message) {
    // This is the function that the child will call to send messages to the parent
    window.parentSandboxBridge.sayHello("through the looking glass: " + message);
    window.parentSandboxBridge.sayHello("runtime: " + typeof window.runtime);
    window.parentSandboxBridge.sayHello("htmlLoader: " + typeof window.htmlLoader);
    window.parentSandboxBridge.sayHello("navigator: " + typeof window.navigator);

    window.parentSandboxBridge.trace("Hello from child");
    window.parentSandboxBridge.callMeBack((m) => {
        window.parentSandboxBridge.trace("Callback from child:", m);
    });
}

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
        // @root
        { name: "@", location: "./" },
        { name: "@lib", location: "lib" },
        // jsx
        { name: "jsx", location: "lib/jsx" },
        // entry point
        { name: "app", location: "sandbox", main: "main" },
    ],
    paths: {
        // jquery: "../node_modules/jquery/dist/jquery.slim.min",
        jquery: "lib/jquery/jquery-3.7.1.min",
    },
    aliases: {},
    map: {},
};

require(dojoConfig, [
    "app",
    "dojo/domReady!"
], function(app) {
    app.startup();
});