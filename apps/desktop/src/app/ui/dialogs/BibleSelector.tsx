import {useStoreState} from "@/utils/hooks";
import {
    currentBibleVersions,
    selectedBibleVersion1,
    selectedBibleVersion2,
    showBibleSelectPanel
} from "@stores/global";
import {$RvW} from "@/rvw";
import {loadSQLBible} from "@/bible/manager";
import {useEffect, useRef, useState} from "preact/hooks";
import {saveVersionSelection} from "@/bible/version";

export default function BibleSelectorDialog() {
    const container = useRef(null);

    const open = useStoreState(showBibleSelectPanel);

    const bibleVersions = useStoreState(currentBibleVersions);
    const bibleVersion1 = useStoreState(selectedBibleVersion1);
    const bibleVersion2 = useStoreState(selectedBibleVersion2);

    const [panel, setPanel] = useState(null);

    useEffect(() => {
        const panel = new $Y.Panel({
            headerContent   : 'Bible Version Selection',
            srcNode         : container.current!,
            width           : "300px",
            height          : 'auto',
            zIndex          : 100,
            centered        : true,
            modal           : true,
            render          : true,
            visible         : false, // make visible explicitly with .show()
        });

        panel.on('visibleChange', function (e: any) {
            showBibleSelectPanel.set(e.newVal);
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
                <div class="generalPanelDIV">
                    <div class="generalheading2">Bible Version Selection</div>

                    <br/>

                    <div class="style2">
                        <label>Primary</label>

                        <select
                            name="version1Menu"
                            id="version1Menu"
                            class="selectboxStyle"
                            value={bibleVersion1}
                            onClick={(e) => selectedBibleVersion1.set((e.target as HTMLSelectElement).selectedIndex)}
                        >
                            {bibleVersions.map((version, i) => (
                                <option value={i} key={i}>{version}</option>
                            ))}
                        </select>

                        <div class="style2" id="version1Text"></div>

                        <br/>

                        <label>Secondary</label>

                        <select
                            name="version2Menu"
                            id="version2Menu"
                            class="selectboxStyle"
                            value={bibleVersion2}
                            onClick={(e) => selectedBibleVersion2.set((e.target as HTMLSelectElement).selectedIndex)}
                        >
                            {bibleVersions.map((version, i) => (
                                <option value={i} key={i}>{version}</option>
                            ))}
                        </select>

                        <div class="style2" id="version2Text"></div>

                        <br/>

                        <input type="checkbox" id="singleVersionBoxID" value="checkbox"/> Display Only Version 1 <br/>
                        <input type="checkbox" id="multipleVerseID" value="checkbox"/> Display 2 verse per slide <br/>

                        <br/>
                        Book Name Style
                        <br/>

                        <select name="booknameStyle" id="booknameStyle" class="selectboxStyle">
                            <option value="1" selected>English</option>
                            <option value="2">Primary Language</option>
                            <option value="3">Primary Language with English</option>
                            <option value="4">Primary Language with Secondary</option>
                        </select>

                        <br/>

                        <input type="checkbox" id="englishList" value="checkbox"/> Book selection in English

                        <br/>
                        <br/>

                        <button class="ui icon button mini" onClick={saveVersionSelection}>Save</button>
                    </div>

                    <br/>
                    <br/>

                    <div class="style2">
                        <input type="checkbox" id="navDualLanguageID" onClick={$RvW.updateVerseContainer} />Dual language display for Navigation

                        <br/>
                        <br/>

                        <div class="style2">Navigation Font Size</div>

                        <div id="nav-font-size-slider"></div>
                    </div>

                    <br/>
                </div>
            </div>
        </div>
    );
}