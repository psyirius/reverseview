import { render } from "@lib/zrx/preact";
import {useStoreState} from "@/utils/hooks";
import {currentBibleVersions, selectedBibleVersion1, selectedBibleVersion2} from "@stores/global";
import {$RvW} from "@/rvw";
import {loadSQLBible} from "@/bible/manager";

export default function BibleSelectorDialog() {
    const bibleVersions = useStoreState(currentBibleVersions);
    const bibleVersion1 = useStoreState(selectedBibleVersion1);
    const bibleVersion2 = useStoreState(selectedBibleVersion2);

    function onClickSave() {
        // const savedV1 = $RvW.vvConfigObj.get_version1();
        // const savedV2 = $RvW.vvConfigObj.get_version2();
        //
        // if (bibleVersion1 !== savedV1) {
        //     $RvW.bibledbObj[1].closeDB();
        //     $RvW.bibledbObj[1] = null;
        //     loadSQLBible(bibleVersion1, 1);
        // }
        //
        // if (bibleVersion2 !== savedV2) {
        //     $RvW.bibledbObj[2].closeDB();
        //     $RvW.bibledbObj[2] = null;
        //     loadSQLBible(bibleVersion2, 2);
        // }

        // ...
    }

    return (
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

                    <button id="versionSave" class="ui icon button mini" onClick={onClickSave}>
                        Save
                    </button>
                </div>

                <br/>
                <br/>

                <div class="style2">
                    <input type="checkbox" id="navDualLanguageID" checked/>Dual language display for Navigation

                    <br/>
                    <br/>

                    <div class="style2">Navigation Font Size</div>

                    <div id="nav-font-size-slider"></div>
                </div>

                <br/>
            </div>
        </div>
    );
}

export function mount(at: string) {
    render(<BibleSelectorDialog />, document.getElementById(at)!);
}