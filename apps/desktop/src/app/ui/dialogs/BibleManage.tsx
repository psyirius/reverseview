import {useEffect, useRef, useState} from "@lib/zrx/hooks";
import {useStoreState} from "@/utils/hooks";
import {showBibleManagePanel} from "@stores/global";
import {deleteVersionConfirm, saveVersion, showBrowse} from "@/bible/version";

export default function BibleManageDialog() {
    const container = useRef(null);

    const open = useStoreState(showBibleManagePanel);

    const [panel, setPanel] = useState(null);

    useEffect(() => {
        const panel = new $Y.Panel({
            headerContent   : 'Bible Version Manager',
            srcNode         : container.current!,
            width           : "700px",
            height          : 'auto',
            zIndex          : 10,
            centered        : true,
            modal           : true,
            render          : true,
            visible         : false, // make visible explicitly with .show()
            buttons         : {
                header: ['close'],
                footer: [
                    {
                        name  : 'import',
                        label : 'Import',
                        action: (e: any) => {
                            e.preventDefault();
                            showBrowse();
                        },
                    },
                    {
                        name  : 'delete',
                        label : 'Delete',
                        action:(e: any) => {
                            e.preventDefault();
                            deleteVersionConfirm();
                        },
                    },
                    {
                        name  : 'save',
                        label : 'Save',
                        action:(e: any) => {
                            e.preventDefault();
                            saveVersion();
                        },
                    },
                    {
                        name  : 'close',
                        label : 'Close',
                        action:(e: any) => {
                            e.preventDefault();
                            showBibleManagePanel.set(false);
                        },
                    }
                ]
            }
        });

        panel.on('visibleChange', function (e: any) {
            showBibleManagePanel.set(e.newVal);
        });

        setPanel(panel);
    }, []);

    // panel visibility
    useEffect(() => {
        if (open) {
            panel?.show();
        } else {
            panel?.hide();
        }
    }, [open]);

    return (
        <div ref={container}>
            <div class="yui3-widget-bd">
                <div class="ui form">
                    <div id="versionDivID" class="ui grid">
                        <div class="six wide column">
                            <select size={10} class="form-control" id="selectVersionList">
                                <option value="0">English KJV</option>
                            </select>
                        </div>

                        <div class="ten wide column">
                            <div class="form-group row">
                                <label for="versionVersionTextbox" class="col-sm col-form-label">Version</label>
                                <div class="col-sm">
                                    <input type="text" class="form-control form-control-sm" id="versionVersionTextbox"/>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label for="fontVersionList" class="col-sm col-form-label">Font</label>
                                <div class="col-sm">
                                    <div class="ui grid">
                                        <div class="six wide column">
                                            <select name="select" class="form-control" id="fontVersionList">
                                                <option value="0">Times New Roman</option>
                                            </select>
                                        </div>
                                        <div class="six wide column">
                                            <button class="ui  button" id="addFontVersionButton">+</button>
                                            <input type="text" class="form-control form-control-sm"
                                                   id="addFontVersionTextbox" placeholder="New font name"/>
                                        </div>
                                        {/*
                                        <div class="four wide column">
                                            <input type="text" class="form-control form-control-sm" id="addFontVersionTextbox"    placeholder="New font name">
                                        </div>
                                        */}
                                        <div class="two wide column">
                                            <button class="ui  button" id="okFontVersionButton">ADD</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label for="copyrightVersionTextarea" class="col-sm col-form-label">Copyright</label>
                                <div class="col-sm">
                                    <input type="text" class="form-control form-control-sm"
                                           id="copyrightVersionTextarea"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}