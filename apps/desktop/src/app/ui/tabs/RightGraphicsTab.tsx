export default function RightGraphicsTab() {
    return (
        <div id="graphicsTab">
            <div id="graphicsDiv">
                <div id="leftcolumn">
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

                <div id="rightcolumn">
                    <div class="ui form">
                        <div class="inline fields">
                            <label>Background</label>
                            <div class="field">
                                <div class="ui radio checkbox">
                                    <input type="radio" name="background-type" id="bkgnd_solid"></input>
                                    <label htmlFor="bkgnd_solid">Solid</label>
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui radio checkbox">
                                    <input type="radio" name="background-type" id="bkgnd_gradient"/>
                                    <label htmlFor="bkgnd_gradient">Gradient</label>
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui radio checkbox">
                                    <input type="radio" name="background-type" id="bkgnd_still"/>
                                    <label htmlFor="bkgnd_still">Image</label>
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui radio checkbox">
                                    <input type="radio" name="background-type" id="bkgnd_motion" disabled={true}/> {/* NOT IMPLEMENTED */}
                                    <label htmlFor="bkgnd_motion">Video</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="solid_bkgnddiv" class="segment">
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

                    <div id="graident_bkgnddiv">
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

                    <div id="still_bkgnddiv" class="ui grid">
                        <div class="id horizontal segments">
                            <div class="ui segment">
                                <div class="generalheading2">Background</div>
                                <img id="selected_still_id" width={150} height={100} alt=""/>

                                <label class="generalheading2">Logo</label>
                                <img id="selected_logostill_id" width={150} height={100} alt=""/>
                            </div>

                            <div class="ui segment">
                                <label class="generalheading2">Preview</label>
                                <img id="selectedx_still_id" width="150" height="100" alt=""/>
                            </div>

                            <div class="ui segment">
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

                                <div class="ui divider"></div>

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

                                <div class="ui divider"></div>

                                <div class="ui form">
                                    <div class="grouped fields">
                                        <div class="field">
                                            <div class="ui checkbox">
                                                <input type="checkbox" name="bg-still-options" id="still_animate"/>
                                                <label htmlFor="still_animate">Motion Background</label>
                                            </div>
                                        </div>
                                        <div class="field">
                                            <div class="ui checkbox">
                                                <input type="checkbox" name="bg-still-options" id="randomBackgroundID"/>
                                                <label htmlFor="randomBackgroundID">Random Background</label>
                                            </div>
                                        </div>
                                        <div class="field">
                                            <div class="ui checkbox">
                                                <input type="checkbox" name="bg-still-options" id="shadedBackgroundID"/>
                                                <label htmlFor="shadedBackgroundID">Shaded Background</label>
                                            </div>
                                        </div>
                                        <div class="field">
                                            <div class="ui checkbox">
                                                <input type="checkbox" name="bg-still-options" id="transparentBackgroundID"/>
                                                <label htmlFor="transparentBackgroundID">Transparent Background</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="still_bkgnd_grid"></div>
                    </div>

                    <div id="motion_bkgnddiv">
                        <b>Select Motion Graphics</b>
                        <br/>
                        <select size={10} id="motionbkgnd_selectID" class="wideselectboxStyle" style="align:top">
                        </select>
                        <div class="style2">
                            <input type="button" id="addMotionBkgndButtonID" value=" ADD "/> |
                            <input type="button" id="delMotionBkgndButton" value=" DELETE "/>
                        </div>
                        {/*<input type="checkbox" id="shadedBackgroundID"/>Shaded Background<br/>*/}
                    </div>
                </div>

                {/* ColorPicker Panel */}
                <div id="cp_panelx" class="cp_container"></div>
            </div>
        </div>
    )
}