import {useEffect, useState} from "preact/hooks";
import {$RvW} from "@/rvw";

enum BgType {
    SOLID = 1,
    GRADIENT = 2,
    STILL = 3,
    MOTION = 4,
}

export default function RightGraphicsTab() {
    const [selectedTab, setSelectedTab] = useState(parseInt($RvW.vvConfigObj.get_p_bkgnd_type()) || BgType.STILL);

    useEffect(() => {
        $RvW.vvConfigObj.set_p_bkgnd_type(selectedTab);
        $RvW.vvConfigObj.save();
    }, [selectedTab]);

    return (
        <div id="graphicsTab">
            <div class="ui grid">
                <div class="column">
                    <div class="ui compact segment">
                        <div class="generalheading2">Text Color</div>

                        <div id="graphics_text_color_id" class="graphics_selColor"></div>

                        <div class="ui icon buttons" style={{marginTop: '8px'}}>
                            <button
                                class="ui button"
                                id="changeTextColorButton"
                                data-tooltip="Change"
                                data-position="bottom center"
                                data-inverted=""
                            >
                                <i class="eye dropper icon"></i>
                            </button>
                            <button
                                class="ui button"
                                id="resetTextColorButton"
                                data-tooltip="Reset"
                                data-position="bottom center"
                                data-inverted=""
                            >
                                <i class="undo icon"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="fluid column">
                    <div class="">
                        <div class="ui form">
                            <div class="inline fields">
                                <label>Background</label>
                                <div class="field">
                                    <div class="ui radio checkbox">
                                        <input
                                            type="radio"
                                            name="background-type"
                                            id="bkgnd_solid"
                                            checked={selectedTab === BgType.SOLID}
                                            onChange={e => (e.target as HTMLInputElement).checked && setSelectedTab(BgType.SOLID)}
                                        ></input>
                                        <label htmlFor="bkgnd_solid">Solid</label>
                                    </div>
                                </div>
                                <div class="field">
                                    <div class="ui radio checkbox">
                                        <input
                                            type="radio"
                                            name="background-type"
                                            id="bkgnd_gradient"
                                            checked={selectedTab === BgType.GRADIENT}
                                            onChange={e => (e.target as HTMLInputElement).checked && setSelectedTab(BgType.GRADIENT)}
                                        />
                                        <label htmlFor="bkgnd_gradient">Gradient</label>
                                    </div>
                                </div>
                                <div class="field">
                                    <div class="ui radio checkbox">
                                        <input
                                            type="radio"
                                            name="background-type"
                                            id="bkgnd_still"
                                            checked={selectedTab === BgType.STILL}
                                            onChange={e => (e.target as HTMLInputElement).checked && setSelectedTab(BgType.STILL)}
                                        />
                                        <label htmlFor="bkgnd_still">Image</label>
                                    </div>
                                </div>
                                <div class="field">
                                    <div class="ui radio checkbox">
                                        <input
                                            type="radio"
                                            name="background-type"
                                            id="bkgnd_motion"
                                            checked={selectedTab === BgType.MOTION}
                                            onChange={e => (e.target as HTMLInputElement).checked && setSelectedTab(BgType.MOTION)}
                                            disabled={true}
                                        /> {/* NOT IMPLEMENTED */}
                                        <label htmlFor="bkgnd_motion">Video</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            id="solid_bkgnddiv"
                            class="segment"
                            style={{display: (selectedTab === BgType.SOLID) ? undefined : 'none'}}
                        >
                            <div id="graphics_solid_color_id" class="graphics_selColor"></div>

                            <div class="ui icon buttons" style={{marginTop: '8px'}}>
                                <button
                                    class="ui button"
                                    id="changeBkgndColorButton"
                                    data-tooltip="Change"
                                    data-position="bottom center"
                                    data-inverted=""
                                >
                                    <i class="eye dropper icon"></i>
                                </button>
                                <button
                                    class="ui button"
                                    id="resetBkgndColorButton"
                                    data-tooltip="Reset"
                                    data-position="bottom center"
                                    data-inverted=""
                                >
                                    <i class="undo icon"></i>
                                </button>
                            </div>
                        </div>

                        <div
                            id="graident_bkgnddiv"
                            style={{display: (selectedTab === BgType.GRADIENT) ? undefined : 'none'}}
                        >
                            <div id="graphics_grad_color_id" class="graphics_selColor"></div>

                            <div class="ui icon buttons" style={{marginTop: '8px'}}>
                                <button
                                    class="ui button"
                                    id="changeGradColor1Button"
                                    data-tooltip="Change Color (start)"
                                    data-position="bottom center"
                                    data-inverted=""
                                >
                                    <i class="eye dropper icon"></i>
                                </button>
                                <button
                                    class="ui button"
                                    id="changeGradColor2Button"
                                    data-tooltip="Change Color (end)"
                                    data-position="bottom center"
                                    data-inverted=""
                                >
                                    <i class="eye dropper icon"></i>
                                </button>
                                <button
                                    class="ui button"
                                    id="resetGradColorButton"
                                    data-tooltip="Reset"
                                    data-position="bottom center"
                                    data-inverted=""
                                >
                                    <i class="undo icon"></i>
                                </button>

                                <select id="orientGradListID" class="selectboxStyle">
                                    <option value="0">Left</option>
                                    <option value="1">Right</option>
                                    <option value="2">Top</option>
                                    <option value="3">Bottom</option>
                                </select>
                            </div>
                        </div>

                        <div
                            id="still_bkgnddiv"
                            class="ui grid"
                            style={{display: (selectedTab === BgType.STILL) ? undefined : 'none'}}
                        >
                            <div class="ui compact segment">
                                <div class="ui vertical form">
                                    <div class="field">
                                        <img id="selectedx_still_id" width={150} height={100} alt=""/>
                                        <div class="ui left pointing label">Preview</div>
                                    </div>
                                    <div class="ui divider"></div>
                                    <div class="field vertical">
                                        <img id="selected_still_id" width={150} height={100} alt=""/>
                                        <div class="ui left pointing label">Background</div>
                                    </div>
                                    <div class="field">
                                        <img id="selected_logostill_id" width={150} height={100} alt=""/>
                                        <div class="ui left pointing label">Logo</div>
                                    </div>
                                </div>
                            </div>

                            <div class="ui vertical">
                                <div class="ui clearing segment">
                                    <div class="ui icon left floated buttons">
                                        <button
                                            class="ui button"
                                            id="addStillBkgndButtonID"
                                            data-tooltip="Add New Background"
                                            data-position="bottom center"
                                            data-inverted=""
                                        >
                                            <i class="add icon"></i>
                                        </button>
                                        <button
                                            class="ui red button"
                                            id="delStillBkgndButton"
                                            data-tooltip="Delete Selected Background"
                                            data-position="bottom center"
                                            data-inverted=""
                                        >
                                            <i class="trash icon"></i>
                                        </button>
                                    </div>

                                    <div class="ui icon right floated buttons">
                                        <button
                                            class="ui button"
                                            id="setAsBackgroundButtonID"
                                            data-tooltip="Set as Background"
                                            data-position="bottom center"
                                            data-inverted=""
                                        >
                                            <i class="icon his his-photo"></i>
                                        </button>
                                        <button
                                            class="ui button"
                                            id="setAsLogoButtonID"
                                            data-tooltip="Set as Logo"
                                            data-position="bottom center"
                                            data-inverted=""
                                        >
                                            <i class="icon his his-sparkles"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="ui segment">
                                    <div class="ui form">
                                        <div class="grouped fields">
                                            <div class="field">
                                                <div class="ui checkbox">
                                                    <input type="checkbox" name="bg-still-options"
                                                           id="still_animate"/>
                                                    <label htmlFor="still_animate">Motion Background</label>
                                                </div>
                                            </div>
                                            <div class="field">
                                                <div class="ui checkbox">
                                                    <input type="checkbox" name="bg-still-options"
                                                           id="randomBackgroundID"/>
                                                    <label htmlFor="randomBackgroundID">Random Background</label>
                                                </div>
                                            </div>
                                            <div class="field">
                                                <div class="ui checkbox">
                                                    <input type="checkbox" name="bg-still-options"
                                                           id="shadedBackgroundID"/>
                                                    <label htmlFor="shadedBackgroundID">Shaded Background</label>
                                                </div>
                                            </div>
                                            <div class="field">
                                                <div class="ui checkbox">
                                                    <input type="checkbox" name="bg-still-options"
                                                           id="transparentBackgroundID"/>
                                                    <label htmlFor="transparentBackgroundID">Transparent
                                                        Background</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="ui compact segment" style={{overflow: 'auto'}}>
                                <div id="still_bkgnd_grid"></div>
                            </div>
                        </div>

                        <div
                            id="motion_bkgnddiv"
                            style={{display: (selectedTab === BgType.MOTION) ? undefined : 'none'}}
                        >
                            <b>Select Motion Graphics</b>
                            <br/>
                            <select size={10} id="motionbkgnd_selectID" class="wideselectboxStyle"
                                    style="align:top">
                            </select>
                            <div class="style2">
                                <input type="button" id="addMotionBkgndButtonID" value=" ADD "/> |
                                <input type="button" id="delMotionBkgndButton" value=" DELETE "/>
                            </div>
                            {/*<input type="checkbox" id="shadedBackgroundID"/>Shaded Background<br/>*/}
                        </div>
                    </div>
                </div>
            </div>

            {/* ColorPicker Panel */}
            <div id="cp_panelx" class="cp_container"></div>
        </div>
    )
}