import {render} from "preact";
import {useState} from "preact/hooks";
import * as jQuery from "jquery";
import mix from './mx';

document.getElementById('app').innerHTML = `
    <h1>Hello World!</h1>
    <p>This is a simple example of a TypeScript app.</p>
`;
console.log('TEST' + mix);

TEST: {
    console.log('TEST' + mix);
}

var str;
DEV: for (let i = 0; i < 5; i++) {
    if (i === 1) {
        continue DEV;
    }
    str += i;
}

const fx = {
    catch: (e: Error) => {
        console.error(e);
    },
    $: jQuery,
}

const F = () => <div>hello</div>;

const App = () => {
    const [count, setCount] = useState(0);

    return (
        <>
            <F/>

            <div>
                <button onClick={() => setCount(count + 1)}>{count}</button>
            </div>
        </>
    );
};

const axc = [1, 2];

for (const number of axc) {
    console.log(number);
}

for (const axcKey in axc) {
    console.log(axcKey);
}

(async () => {
    const {default: VLib} = await import('vlib');
    console.log(VLib());
    air.trace(typeof VLib);
})();

render(<App/>, document.getElementById('app')!);