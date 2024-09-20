import fb from 'function-bind'

// shims
Function.prototype.bind = fb;

import 'es6-shim'

import App from './App.svelte'

const app = new App({
    target: document.getElementById('app'),
})

export default app