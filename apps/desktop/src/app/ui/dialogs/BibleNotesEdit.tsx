import {useEffect, useRef, useState} from "preact/hooks";
import {useStoreState} from "@/utils/hooks";
import {showBibleNotesEditPanel} from "@stores/global";
import {$RvW} from "@/rvw";

export interface Props {

}

export default function BibleNotesEditDialog({}: Props) {
    const container = useRef(null);

    const open = useStoreState(showBibleNotesEditPanel);

    const [panel, setPanel] = useState(null);

    // Init Dialog Panel
    useEffect(() => {
        const panel = new $Y.Panel({
            headerContent   : 'Notes',
            srcNode         : container.current!,
            width           : '40%',
            height          : 'auto',
            zIndex          : 100,
            centered        : true,
            modal           : true,
            render          : true,
            visible         : false, // make visible explicitly with .show()
            buttons         : {
                header: ['close'],
                footer: [
                    {
                        name  : 'save',
                        label : 'Save',
                        action: (e: any) => {
                            e.preventDefault();
                            $RvW.notesObj.onSave()
                        },
                    },
                    {
                        name  : 'close',
                        label : 'Close',
                        action:(e: any) => {
                            e.preventDefault();
                            $RvW.notesObj.onCancel()
                        },
                    }
                ]
            }
        });

        panel.on('visibleChange', function (e: any) {
            showBibleNotesEditPanel.set(e.newVal);
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
                <div class="rbroundbox">
                    <div class="rbtop">
                        <div></div>
                    </div>
                    <div class="rbcontent">
                        <p class="tempList" id="notesVerse"></p>
                    </div>
                    <div class="rbbot">
                        <div></div>
                    </div>
                </div>

                <textarea id="notes_rte" rows={8} style="width: 100%"></textarea>
            </div>
        </div>
    );
}