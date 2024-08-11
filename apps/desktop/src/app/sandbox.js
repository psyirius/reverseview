function sandboxLoaded() {
    air.trace("sandboxLoaded");

    let childDom = document.getElementById("ui-sandbox");

    // if it's an iframe
    if (childDom.tagName === "IFRAME") {
        childDom = childDom.contentWindow;
    }

    // expose the parent sandbox bridge to the child
    childDom.parentSandboxBridge = {
        sayHello: function(message) {
            air.trace(message);
        }
    };

    // expose the child sandbox bridge to the parent
    const { childSandboxBridge } = childDom;

    air.trace('UA: ' + window.htmlLoader.userAgent);

    childSandboxBridge.sayHello("Hello from parent");
}