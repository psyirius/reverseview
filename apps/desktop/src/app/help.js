export class HelpUiPanel {
    constructor() {
        this.m_panel = null;

        const { NativeApplication } = air;

        const runtimeVersion = NativeApplication.nativeApplication.runtimeVersion;

        const userAgent = window.navigator.userAgent;

        this.m_body = `
<div id="helpID" class="generalDIV">
  <div class="generaltext">
    <p><b>ReVerseView 8.5.0 (dev)</b></p>
    <br>
    <p>Runtime: Adobe AIR ${runtimeVersion}</p>
    <p>User Agent: ${userAgent}</p>
  </div>
</div>
`
        this._setup();
    }

    _setup() {
        this.m_panel = new $Y.Panel({
            headerContent   : 'About',
            bodyContent     : this.m_body,
            width           : '40%',
            height          : 'auto',
            zIndex          : 60,
            centered        : true,
            modal           : true,
            visible         : false, // make visible explicitly with .show()
            buttons         : {
                header: ['close'],
                footer: [
                    {
                        name  : 'site',
                        label : 'Website',
                        action: (e) => {
                            e.preventDefault();

                            // TODO: implement
                        }
                    },
                    {
                        name  : 'close',
                        label : 'Close',
                        isDefault: true,
                        action: (e) => {
                            e.preventDefault();

                            this.hide();
                        }
                    },
                ]
            },
        });

        // // make it draggable
        // this.m_panel.plug($Y.Plugin.Drag, {
        //     handles: [
        //         '.yui3-widget-hd'
        //     ]
        // });
        // // make it resizable
        // this.m_panel.plug($Y.Plugin.Resize);

        this.m_panel.render(document.body);
    }

    show() {
        this.m_panel.show();
    }

    hide() {
        this.m_panel.hide();
    }
}
