import MenuBar from "./MenuBar";
import LeftTab from "./LeftTab";
import RightTab from "./RightTab";
import SandboxFrame from "@app/ui/SandboxFrame";
import RemoteSetupDialog from "@app/ui/RemoteSetupDialog";

interface Props {
    dev?: boolean;
}

const App = ({dev}: Props) => {
    return (
        <>
            {/*{dev && (*/}
            {/*    <div className="" style={{position: 'absolute', right: '2px', top: '4px'}}>*/}
            {/*        <div class="ui button" tabIndex={0} onClick={() => window.location.reload()}>*/}
            {/*            Reload<i class="right arrow icon"></i>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}

            {/*<SandboxFrame*/}
            {/*    id="UI"*/}
            {/*    src="uix.html"*/}
            {/*    sandboxRoot="http://ui.reverseview.air/"*/}
            {/*    allowcrossDomainxhr="true"*/}
            {/*    documentRoot="app:/"*/}
            {/*></SandboxFrame>*/}

            <MenuBar/>

            {/*<div class="column">*/}
            {/*    <div class="ui console segment">*/}
            {/*        <div class="ui top right attached label">*/}
            {/*            Console*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* App::Content */}
            <div id="content">
                <div id="wrapper">
                    <LeftTab/>
                    <RightTab/>

                    {/*<div id="cleared"></div>*/}
                </div>
            </div>

            {/* Dialog box for Version Management */}
            <div id="versionManageDialog">
                <div class="hd"></div>
                <div class="bd"></div>
            </div>

            {/* Container for Notes */}
            <div id="notesPanelID"></div>

            {/* Dialog box for Song Edit */}
            <div id="song-edit">
                <div class="hd"></div>
                <div class="bd"></div>
            </div>

            {/* Modal::Confirm */}
            <div id="confirm-panel"></div>

            {/* Modal::Overlay */}
            <div id="overlay"></div>

            {/* Modal::Toast */}
            <div id="toast-container"></div>

            {/* ------------------------------------------------ */}

            <div id="popovers"></div>
            <div id="tooltips"></div>
            <div id="overlays"></div>
            <div id="modals"></div>
            <div id="dialogs">
                <RemoteSetupDialog />
                <div id="bible-select-dialog"></div>
            </div>

            {/* ------------------------------------------------ */}
        </>
    );
};

export default App;