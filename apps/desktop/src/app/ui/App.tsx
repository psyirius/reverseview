import MenuBar from "./MenuBar";
import Dialogs from "./dialogs/index";
import ContentPane from "./ContentPane";

import SandboxFrame from "./SandboxFrame";
import RenderCanvas from "./RenderCanvas";
import RemoteCanvas from "./RemoteCanvas";
import _Test from "@app/ui/widgets/_Test";
import {statusMessage} from "@stores/global";
import StatusBar from "@app/ui/StatusBar";

interface Props {
    dev?: boolean;
}

const App = ({dev}: Props) => {
    return (
        <>
            {/* ------------------------------------------------ */}

            {dev && (
                <div
                    className=""
                    style={{
                        position: 'absolute',
                        right: '2px',
                        top: '4px'
                    }}
                >
                    <div class="ui button" tabIndex={0} onClick={() => window.location.reload()}>
                        Reload<i class="right arrow icon"></i>
                    </div>
                </div>
            )}

            {/* ------------------------------------------------ */}

            {/*<_Test />*/}

            {/*<RenderCanvas />*/}
            {/*<RemoteCanvas url="http://localhost:8088" />*/}

            {/*<SandboxFrame*/}
            {/*    id="UI"*/}
            {/*    src="uix.html"*/}
            {/*    sandboxRoot="http://ui.reverseview.air/"*/}
            {/*    allowcrossDomainxhr="true"*/}
            {/*    documentRoot="app:/"*/}
            {/*></SandboxFrame>*/}

            {/* ------------------------------------------------ */}

            {/* App Shell */}
            <div class="x-u-i app">
                <div class="app-content">
                    <header>
                        <MenuBar/>
                    </header>

                    <main>
                        <ContentPane/>
                    </main>

                    <footer>
                        <StatusBar />
                    </footer>
                </div>

                <div class="overlays">
                    <Dialogs/>
                </div>
            </div>

            {/* ------------------------------------------------ */}
        </>
    );
};

export default App;