import { useState } from "@lib/zrx/hooks";

import Counter from "./Counter";
import MenuBar from "./MenuBar";

interface Props {
    dev?: boolean;
}

const App = ({ dev }: Props) => {
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

            {/* Modal::Tooltip */}
            <div id="tooltip"></div>

            {/* App::Content */}
            <div id="wrapper">
                <div id="container" class="tabContainer"></div>
                <div id="container2" class="verseContainer"></div>
                <div id="cleared"></div>
            </div>

            {/* Dialog box for Version Management */}
            <div id="versionManageDialog">
                <div class="hd"></div>
                <div class="bd"></div>
            </div>

            {/* Container for Notes */}
            <div id="notesPanelID"></div>

            {/* Dialog box for YES NO Prompt */}
            <div id="promptDialog">
                <div class="hd"></div>
                <div class="bd"></div>
            </div>

            {/* Dialog box for Song Edit */}
            <div id="panelObj">
                <div class="hd"></div>
                <div class="bd"></div>
            </div>

            {/* Modal::Confirm */}
            <div id="confirm-panel"></div>

            {/* Modal::Overlay */}
            <div id="overlay"></div>

            {/* Modal::Popover */}
            <div id="popover"></div>

            {/* Modal::Toast */}
            <div id="toast-container"></div>

            {/* ------------------------------------------------ */}
            <div id="popovers"></div>
            <div id="tooltips"></div>
            <div id="modals"></div>
        </>
    );
};

export default App;