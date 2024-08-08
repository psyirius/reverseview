define(["require", "exports", "./component"], function (require, exports, component_1) {
    "use strict";
    exports.__esModule = true;
    exports.createContext = exports.i = void 0;
    exports.i = 0;
    function createContext(defaultValue, contextId) {
        contextId = '__cC' + exports.i++;
        var context = {
            _id: contextId,
            _defaultValue: defaultValue,
            /** @type {import('./internal').FunctionComponent} */
            Consumer: function (props, contextValue) {
                // return props.children(
                // 	context[contextId] ? context[contextId].props.value : defaultValue
                // );
                return props.children(contextValue);
            },
            /** @type {import('./internal').FunctionComponent} */
            Provider: function (props) {
                if (!this.getChildContext) {
                    /** @type {import('./internal').Component[]} */
                    var subs_1 = [];
                    var ctx_1 = {};
                    ctx_1[contextId] = this;
                    this.getChildContext = function () { return ctx_1; };
                    this.shouldComponentUpdate = function (_props) {
                        if (this.props.value !== _props.value) {
                            // I think the forced value propagation here was only needed when `options.debounceRendering` was being bypassed:
                            // https://github.com/preactjs/preact/commit/4d339fb803bea09e9f198abf38ca1bf8ea4b7771#diff-54682ce380935a717e41b8bfc54737f6R358
                            // In those cases though, even with the value corrected, we're double-rendering all nodes.
                            // It might be better to just tell folks not to use force-sync mode.
                            // Currently, using `useContext()` in a class component will overwrite its `this.context` value.
                            // subs.some(c => {
                            // 	c.context = _props.value;
                            // 	enqueueRender(c);
                            // });
                            // subs.some(c => {
                            // 	c.context[contextId] = _props.value;
                            // 	enqueueRender(c);
                            // });
                            subs_1.some(function (c) {
                                c._force = true;
                                (0, component_1.enqueueRender)(c);
                            });
                        }
                    };
                    this.sub = function (c) {
                        subs_1.push(c);
                        var old = c.componentWillUnmount;
                        c.componentWillUnmount = function () {
                            subs_1.splice(subs_1.indexOf(c), 1);
                            if (old)
                                old.call(c);
                        };
                    };
                }
                return props.children;
            }
        };
        // Devtools needs access to the context object when it
        // encounters a Provider. This is necessary to support
        // setting `displayName` on the context object instead
        // of on the component itself. See:
        // https://reactjs.org/docs/context.html#contextdisplayname
        return (context.Provider._contextRef = context.Consumer.contextType =
            context);
    }
    exports.createContext = createContext;
});
