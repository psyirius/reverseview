import * as $ from 'jquery';

$(() => {
    // alert('jQuery ready');
    air.trace('jQuery ready');
})

/* ------------------------------------------------------------------------------------------------------------------ */
import { Component, render } from '@lib/zrx/preact';
import { useState, useEffect } from '@lib/zrx/hooks';

const Counter = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((c) => c + 1);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return <div>{count}</div>;
};

const App = ({ dev }: { dev?: boolean }) => {
    const [show, setShow] = useState(true);

    return (
            <>
                {dev && (
                        <div className="dev-toolbar">
                            <button id="dev-refresh" onClick={() => window.location.reload()}>Refresh</button>
                        </div>
                )}

                <div>
                    <button
                            onClick={() => {
                                setShow(!show);
                            }}
                    >
                        {show ? "Hide" : "Show"}
                    </button>

                    {show ? <Counter /> : <div>No counter</div>}
                </div>
            </>
    );
};

if (typeof window !== "undefined") {
    // FIXME: clashing with semantic-ui
    // render(<App dev />, document.getElementById("root"));
}
/* ------------------------------------------------------------------------------------------------------------------ */

// Dynamic import works with a polyfill of Promise
// (window as any).__defineGetter__("Promise", () => $Y.Promise);

// ADD: ES2015.Promise to Lib
// (async function () {
//     const mod = await import('./cfg');
//
//     air.trace('cfg', mod.default.a);
// })();

air.trace('test/index.tsx');

export default App;