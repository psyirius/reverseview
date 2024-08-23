import { Component, render } from '@lib/zrx/preact';

import App from "./App";

export function setup() {
    render(<App dev />, document.getElementById("root")!);
}