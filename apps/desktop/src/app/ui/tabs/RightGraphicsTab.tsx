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

    useEffect(() => {
        $('#bg-tabs [data-tab=background-color]').addClass('active');
        // @ts-ignore
        $('#bg-tabs .item').tab();
    }, []);

    const tabs = [
        {name: 'text-color', title: 'Text'},
        {name: 'background-color', title: 'Background'},
    ]

    return (
        <div id="graphicsTab" style={{height: '100%'}}>
            <div class="ui content" id="bg-tabs">
                <div class="ui top attached tabular menu">
                    {tabs.map(({name, title}, i) => (
                        <a key={i} class="item" data-tab={name}>{title}</a>
                    ))}
                </div>
                {/* Tab: Text */}
                <div class="ui bottom attached tab segment" data-tab="text-color">
                    <div class="ui form">
                        {/*<h4 class="ui dividing header">Text Colors</h4>*/}

                        <div class="fields">
                            <div class="field">
                                <label>Primary</label>

                                <div id="graphics_text_color_1" class="graphics_selColor"></div>
                            </div>
                            <div class="field">
                                <label>Secondary</label>

                                <div id="graphics_text_color_2" class="graphics_selColor"></div>
                            </div>
                        </div>

                        <div class="ui icon buttons">
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
                {/* Tab: Background */}
                <div class="ui bottom attached tab segment" data-tab="background-color">
                    <div class="ui content">
                        <div class="ui form">
                            <div class="fields">
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
                            class={"ui tab" + (selectedTab === BgType.SOLID ? ' active' : '')}
                            style={{display: (selectedTab === BgType.SOLID) ? undefined : 'none'}}
                        >
                            <div class="ui form">
                                <div class="fields">
                                    <div class="field">
                                        <label>Solid Color</label>

                                        <div id="graphics_solid_color_id" class="graphics_selColor"></div>
                                    </div>
                                </div>

                                <div class="ui icon buttons">
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
                        </div>

                        <div
                            id="graident_bkgnddiv"
                            class={"ui tab" + (selectedTab === BgType.GRADIENT ? ' active' : '')}
                            style={{display: (selectedTab === BgType.GRADIENT) ? undefined : 'none'}}
                        >
                            <div class="ui form">
                                <div class="fields">
                                    <div class="field">
                                        <label>Gradient Color</label>

                                        <div id="graphics_grad_color_id" class="graphics_selColor"></div>
                                    </div>
                                </div>

                                <div class="fields">
                                    <div class="field">
                                        <select id="orientGradListID" class="ui dropdown">
                                            <option value="0">Left</option>
                                            <option value="1">Right</option>
                                            <option value="2">Top</option>
                                            <option value="3">Bottom</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="ui icon buttons">
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
                                </div>
                            </div>
                        </div>

                        <div
                            id="still_bkgnddiv"
                            class={"ui tab" + (selectedTab === BgType.STILL ? ' active' : '')}
                            style={{display: (selectedTab === BgType.STILL) ? undefined : 'none'}}
                        >
                            <div class="ui grid">
                                <div class="sixteen wide column">
                                    <div class="ui vertical">
                                        <div class="ui segment">
                                            {/* Previews */}
                                            <div class="ui form">
                                                <div class="fields">
                                                    <div class="field">
                                                        <label>Preview</label>
                                                        <img
                                                            id="selectedx_still_id"
                                                            class="ui bordered image"
                                                            width={150}
                                                            height={100}
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div class="field">
                                                        <label>Background</label>
                                                        <img
                                                            id="selected_still_id"
                                                            class="ui bordered image"
                                                            width={150}
                                                            height={100}
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div class="field">
                                                        <label>Logo</label>
                                                        <img
                                                            id="selected_logostill_id"
                                                            class="ui bordered image"
                                                            width={150}
                                                            height={100}
                                                            alt=""
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="ui divider"></div>

                                            {/* Controls */}
                                            <div class="ui form">
                                                <div class="fields">
                                                    <div class="field">
                                                        <div class="ui icon buttons">
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
                                                    <div class="field">
                                                        <div class="ui icon buttons">
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
                                                    </div>
                                                </div>
                                                <div class="fields">
                                                    <div class="field">
                                                        <div class="ui checkbox">
                                                            <input type="checkbox" name="bg-still-options"
                                                                   id="still_animate"/>
                                                            <label htmlFor="still_animate">Motion</label>
                                                        </div>
                                                    </div>
                                                    <div class="field">
                                                        <div class="ui checkbox">
                                                            <input type="checkbox" name="bg-still-options"
                                                                   id="randomBackgroundID"/>
                                                            <label htmlFor="randomBackgroundID">Random</label>
                                                        </div>
                                                    </div>
                                                    <div class="field">
                                                        <div class="ui checkbox">
                                                            <input type="checkbox" name="bg-still-options"
                                                                   id="shadedBackgroundID"/>
                                                            <label htmlFor="shadedBackgroundID">Shaded</label>
                                                        </div>
                                                    </div>
                                                    <div class="field">
                                                        <div class="ui checkbox">
                                                            <input type="checkbox" name="bg-still-options"
                                                                   id="transparentBackgroundID"/>
                                                            <label htmlFor="transparentBackgroundID">Transparent</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Gallery */}
                                    <div class="ui vertical">
                                        <div class="ui segment">
                                            <div id="still_bkgnd_grid" style={{overflowY: 'auto'}}>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            id="motion_bkgnddiv"
                            class={"ui tab" + (selectedTab === BgType.MOTION ? ' active' : '')}
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