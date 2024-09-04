import { render } from '@lib/zrx/preact';

import App from "./App";

export function setup(dev: boolean = false) {
    render(<App dev={dev} />, document.getElementById("root")!);
}