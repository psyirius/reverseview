import {useEffect, useRef, useState} from "preact/hooks";
import {useStoreState} from "@/utils/hooks";
import {showLyricEditPanel} from "@stores/global";
import {$RvW} from "@/rvw";

const INNER_HTML = `
<div class="style2">
    <label for="se_quickSlideID"></label><textarea id="se_quickSlideID" style="width: 400px" class="textareaStyle4songslide"></textarea><label for="se_quickSlideID_2"></label><textarea id="se_quickSlideID_2" style="width: 400px" class="textareaStyle4songslide"></textarea>

    <br>

    <i>Separate the slides with the delimiter</i>

    <br>

    <i><code>\\r</code> for CR (carriage return)</i>,&nbsp;
    <i><code>\\n</code> for LF (newline)</i>,&nbsp;
    <i><code>\\t</code> for TAB</i>,&nbsp;
    <i><code>\\s</code> for WHITESPACE</i>

    <br>

    <label for="se-slide-delimiter">Delimiter</label>
    <input type="text" id="se-slide-delimiter" value="\\n\\n\\n">
    <label for="se-trim-slides">Trim Slides</label>
    <input type="checkbox" id="se-trim-slides">
    <label for="se-trim-empty">Remove Empty</label>
    <input type="checkbox" id="se-trim-empty">

    <br>
</div>
`;

export default function LyricEditDialog() {
    const container = useRef<HTMLDivElement>(null);

    const open = useStoreState(showLyricEditPanel);

    const [panel, setPanel] = useState(null);

    useEffect(() => {
        const panel = new $Y.Panel({
            headerContent   : 'Generate Slides',
            srcNode         : container.current!,
            width           : "822px",
            height          : 'auto',
            zIndex          : 750,
            centered        : true,
            modal           : true,
            render          : true,
            visible         : false, // make visible explicitly with .show()
            buttons         : {
                header      : ['close'],
                footer      : [
                    {
                        name  : 'generate',
                        label : 'Generate',
                        isDefault: true,
                        action: (e: any) => {
                            e.preventDefault();
                            $RvW.songEditObj.onLyricEditOnGenerate();
                        },
                    },
                    {
                        name  : 'cancel',
                        label : 'Cancel',
                        action: (e: any) => {
                            e.preventDefault();
                            showLyricEditPanel.set(false);
                        },
                    }
                ],
            }
        });

        panel.on('visibleChange', function (e: any) {
            showLyricEditPanel.set(e.newVal);
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
            <div class="yui3-widget-bd" dangerouslySetInnerHTML={{__html: INNER_HTML}}>
            </div>
        </div>
    );
}