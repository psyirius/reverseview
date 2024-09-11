import {useEffect, useRef, useState} from "@lib/zrx/hooks";
import {showVerseEditPanel} from "@stores/global";
import {useStoreState} from "@/utils/hooks";

export default function BibleVerseEditDialog() {
    const container = useRef(null);

    const open = useStoreState(showVerseEditPanel);

    const [panel, setPanel] = useState(null);

    useEffect(() => {
        const panel = new $Y.Panel({
            headerContent   : 'Edit Bible Verse',
            srcNode         : container.current!,
            width           : "600px",
            height          : 'auto',
            zIndex          : 100,
            centered        : true,
            modal           : true,
            render          : true,
            visible         : false, // make visible explicitly with .show()
        });

        panel.on('visibleChange', function (e: any) {
            showVerseEditPanel.set(e.newVal);
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
                <div class="ui form container segment">
                    <div id="generalPanelDIV_delete" class="ui grid bibleEditDIV">

                        <div class="column">
                            <div class="form-group row field">
                                <label>Reference</label>
                                <div id="currentVerseRefDiv"></div>
                            </div>

                            <div class="form-group row field">
                                <label>Current Verse Text</label>
                                <div rows={3} id="currentVerseTextDiv"></div>
                            </div>

                            <div class="form-group row field">
                                <label>Updated Verse Text</label>
                                <textarea rows={3} id="updatedVerseTextDiv"></textarea>
                            </div>

                            <div class="form-group row field">
                                <button class="ui primary button" id="updateVerseTextButton">UPDATE</button>
                                <button class="ui primary button" id="cancelVerseTextButton">CANCEL</button>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}