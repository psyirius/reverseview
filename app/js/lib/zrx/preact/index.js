var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
define(["require", "exports", "./render", "./create-element", "./component", "./clone-element", "./create-context", "./diff/children", "./options"], function (require, exports, render_1, create_element_1, component_1, clone_element_1, create_context_1, children_1, options_1) {
    "use strict";
    exports.__esModule = true;
    exports.options = exports.toChildArray = exports.createContext = exports.cloneElement = exports.Component = exports.isValidElement = exports.createRef = exports.Fragment = exports.h = exports.createElement = exports.hydrate = exports.render = void 0;
    __createBinding(exports, render_1, "render");
    __createBinding(exports, render_1, "hydrate");
    __createBinding(exports, create_element_1, "createElement");
    __createBinding(exports, create_element_1, "createElement", "h");
    __createBinding(exports, create_element_1, "Fragment");
    __createBinding(exports, create_element_1, "createRef");
    __createBinding(exports, create_element_1, "isValidElement");
    __createBinding(exports, component_1, "Component");
    __createBinding(exports, clone_element_1, "cloneElement");
    __createBinding(exports, create_context_1, "createContext");
    __createBinding(exports, children_1, "toChildArray");
    __createBinding(exports, options_1, "default", "options");
});
