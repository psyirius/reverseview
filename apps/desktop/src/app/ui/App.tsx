import MenuBar from "./MenuBar";
import Toaster from "./Toaster";
import Dialogs from "./dialogs/index";
import ContentPane from "./ContentPane";

import SandboxFrame from "./SandboxFrame";
import RenderCanvas from "@app/ui/RenderCanvas";

interface Props {
    dev?: boolean;
}

const App = ({dev}: Props) => {
    return (
        <>
            {dev && (
                <div className="" style={{position: 'absolute', right: '2px', top: '4px'}}>
                    <div class="ui button" tabIndex={0} onClick={() => window.location.reload()}>
                        Reload<i class="right arrow icon"></i>
                    </div>
                </div>
            )}

            {/*<RenderCanvas />*/}

            {/*<SandboxFrame*/}
            {/*    id="UI"*/}
            {/*    src="uix.html"*/}
            {/*    sandboxRoot="http://ui.reverseview.air/"*/}
            {/*    allowcrossDomainxhr="true"*/}
            {/*    documentRoot="app:/"*/}
            {/*></SandboxFrame>*/}

            <MenuBar />

            {/*<div class="column">*/}
            {/*    <div class="ui console segment">*/}
            {/*        <div class="ui top right attached label">*/}
            {/*            Console*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <ContentPane />

            {/* ------------------------------------------------ */}

            <div id="popovers"></div>
            <div id="tooltips"></div>
            <div id="overlays"></div>
            <div id="modals"></div>

            <Dialogs />
            <Toaster />

            {/* ------------------------------------------------ */}
        </>
    );
};

export default App;