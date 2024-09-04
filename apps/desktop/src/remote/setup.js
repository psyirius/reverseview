import {showRemotePanel} from "@stores/global";
import {mount as mountRemoteSetupDialog} from "@app/ui/RemoteSetupDialog";

export class RemoteSetupUIPanel {
    constructor() {
        this.show = show;
        this.hide = hide;

        let _panel = null;

        mountRemoteSetupDialog('modals');

        _panel = new $Y.Panel({
            headerContent   : 'Remote',
            srcNode         : '#remote-setup-modal',
            width           : '60%',
            height          : 'auto',
            zIndex          : 100,
            centered        : true,
            modal           : true,
            render          : true,
            visible         : false, // make visible explicitly with .show()
        });

        _panel.on('visibleChange', function (e) {
            showRemotePanel.set(e.newVal);
        });

        function show() {
            _panel.show();
        }

        function hide() {
            _panel.hide();
        }
    }
}
