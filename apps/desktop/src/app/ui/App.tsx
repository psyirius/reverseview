import { useState } from "@lib/zrx/hooks";

import Counter from "./Counter";
import MenuBar from "./MenuBar";

const App = ({ dev }: { dev?: boolean }) => {
    const [show, setShow] = useState(true);

    return (
        <>
            {dev && (
                <div className="dev-toolbar">
                    <button id="dev-refresh" onClick={() => window.location.reload()}>Refresh</button>
                </div>
            )}

            {/*<div>*/}
            {/*    <button*/}
            {/*        onClick={() => {*/}
            {/*            setShow(!show);*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        {show ? "Hide" : "Show"}*/}
            {/*    </button>*/}

            {/*    {show ? <Counter /> : <div>No counter</div>}*/}
            {/*</div>*/}

            <MenuBar />
        </>
    );
};

export default App;