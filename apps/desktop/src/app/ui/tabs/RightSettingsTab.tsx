import {useEffect, useRef} from "preact/hooks";
import {getAvailableScreens} from "@/p_window";
import {$RvW} from "@/rvw";
import {
    availableScreens as availableScreensStore,
    presentationMainEnabled,
    presentationMainScreen,
    presentationStageEnabled,
    presentationStageScreen
} from "@stores/global";
import {useStoreState} from "@/utils/hooks";


export default function RightSettingsTab() {
    const screenSelectMain = useRef<HTMLDivElement>(null);
    const screenSelectStage = useRef<HTMLDivElement>(null);

    const availableScreens = useStoreState(availableScreensStore);

    const mainScreen = useStoreState(presentationMainScreen);
    const stageScreen = useStoreState(presentationStageScreen);

    const mainEnabled = useStoreState(presentationMainEnabled);
    const stageEnabled = useStoreState(presentationStageEnabled);

    useEffect(() => {
        air.trace('[INIT]');

        presentationMainEnabled.set(!!$RvW.vvConfigObj.get_mainConfigEnable());
        presentationStageEnabled.set(!!$RvW.vvConfigObj.get_stageConfigEnable());

        presentationMainScreen.set($RvW.rvwPreferences.get("app.settings.screen.main.index", 1));
        presentationStageScreen.set($RvW.rvwPreferences.get("app.settings.screen.stage.index", 0));

        availableScreensStore.set(getAvailableScreens());
    }, []);

    useEffect(() => {
        // always add this after the select list is populated
        air.trace('[Main EFFECT]', JSON.stringify([mainScreen, stageScreen, availableScreens]));

        // @ts-ignore
        $(screenSelectMain.current).dropdown({
            onChange: function(value: number, text: string, $selected: any) {
                // Is triggered by user interaction
                // @ts-ignore
                if (!$selected || !$(screenSelectMain.current).dropdown('is visible')) return;
                
                air.trace('Changed Main Screen:', value, text, $selected);
                updateMainScreenSelection(value - 1);
            }
        });

        // @ts-ignore
        $(screenSelectStage.current).dropdown({
            onChange: function(value: number, text: string, $selected: any) {
                // Is triggered by user interaction
                // @ts-ignore
                if (!$selected || !$(screenSelectStage.current).dropdown('is visible')) return;

                air.trace('Changed Stage Screen:', value, text, $selected);
                updateStageScreenSelection(value - 1);
            }
        });

        // setTimeout(() => {
        //     air.trace('TRIG....')
        //
        //     // @ts-ignore
        //     // $(screenSelectMain.current).dropdown('set value', '1');
        //     // @ts-ignore
        //     // $(screenSelectMain.current).dropdown('set selected', 1);
        //     // @ts-ignore
        //     // $(screenSelectStage.current).dropdown('set value', '2');
        // }, 3000);
    }, []);

    useEffect(() => {
        air.trace('Screens.Update:', JSON.stringify(availableScreens));

        // @ts-ignore
        $(screenSelectMain.current).dropdown('refresh'); refreshMainScreen();
        // @ts-ignore
        $(screenSelectStage.current).dropdown('refresh'); refreshStageScreen();
    }, [availableScreens]);

    useEffect(() => {
        air.trace('Screen.Main:', JSON.stringify(mainScreen));

        // @ts-ignore
        $(screenSelectMain.current).dropdown('set selected', mainScreen + 1);
    }, [mainScreen]);

    useEffect(() => {
        air.trace('Screen.Stage:', JSON.stringify(stageScreen));

        // @ts-ignore
        $(screenSelectStage.current).dropdown('set selected', stageScreen + 1);
    }, [stageScreen]);

    function getSelectedScreenIndex(current: number, size: number) {
        return current < size ? current : 0;
    }

    function updateMainScreenSelection(value: number) {
        presentationMainScreen.set(value);
        $RvW.rvwPreferences.set("app.settings.screen.main.index", value);
        $RvW.vvConfigObj.save();
    }

    function updateStageScreenSelection(value: number) {
        presentationStageScreen.set(value);
        $RvW.rvwPreferences.set("app.settings.screen.stage.index", value);
        $RvW.vvConfigObj.save();
    }

    function onRefreshScreensMain() {
        const _screens = getAvailableScreens();
        availableScreensStore.set(_screens);
        // next step is invoked by hook
    }

    function onRefreshScreensStage() {
        const _screens = getAvailableScreens();
        availableScreensStore.set(_screens);
        // next step is invoked by hook
    }

    function refreshMainScreen() {
        const savedIndex = $RvW.rvwPreferences.set("app.settings.screen.main.index", mainScreen);
        presentationMainScreen.set(getSelectedScreenIndex(savedIndex, availableScreens.length));
    }

    function refreshStageScreen() {
        const savedIndex = $RvW.rvwPreferences.set("app.settings.screen.stage.index", stageScreen);
        presentationStageScreen.set(getSelectedScreenIndex(savedIndex, availableScreens.length));
    }

    function onChangeMainEnable(e: Event) {
        const { checked } = (e.target as HTMLInputElement);
        presentationMainEnabled.set(checked);
        $RvW.vvConfigObj.set_mainConfigEnable(checked);
        $RvW.vvConfigObj.save();
    }

    function onChangeStageEnable(e: Event) {
        const { checked } = (e.target as HTMLInputElement);
        presentationStageEnabled.set(checked);
        $RvW.vvConfigObj.set_stageConfigEnable(checked);
        $RvW.vvConfigObj.save();
    }

    return (
        <div id="screenTab">
            <div class="generalPanelDIV">
                <div class="ui form">
                    <h4 class="ui dividing header">Presentation Setup</h4>

                    <div class="two fields">
                        <div class="field">
                            <label>Main</label>
                            <div class="inline field">
                                <div class="ui toggle checkbox">
                                    <input type="checkbox" name="main"
                                       checked={mainEnabled}
                                       onChange={onChangeMainEnable}
                                    />
                                    <label>Enable</label>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <label>Stage</label>
                            <div class="inline field">
                                <div class="ui toggle checkbox">
                                    <input type="checkbox" name="stage"
                                       checked={stageEnabled}
                                       onChange={onChangeStageEnable}
                                    />
                                    <label>Enable</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="two fields">
                        <div class="field">
                            <label>Screen</label>
                            <div class="ui action input mini" style={{width: '100%'}}>
                                <div class="ui selection dropdown" ref={screenSelectMain} style={{width: '100%'}}>
                                    <input type="hidden" name="main-screen" />
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Screen</div>
                                    <div class="menu" style={{width: '100%'}}>
                                        {availableScreens.map(({name, value}, i) => (
                                            <div key={i} class="item" data-value={value} data-text={name}>
                                                <i class="af flag"></i>
                                                {name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div class="ui button mini" onClick={() => onRefreshScreensMain()}>
                                    <i class="sync icon"></i>
                                    Refresh
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <label>Screen</label>
                            <div class="ui action input mini">
                                <div class="ui selection dropdown" ref={screenSelectStage} style={{width: '100%'}}>
                                    <input type="hidden" name="main-screen"/>
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Screen</div>
                                    <div class="menu" style={{width: '100%'}}>
                                        {availableScreens.map(({name, value}, i) => (
                                            <div key={i} class="item" data-value={value} data-text={name}>
                                                <i class="af flag"></i>
                                                {name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div class="ui button mini" onClick={() => onRefreshScreensStage()}>
                                    <i class="sync icon"></i>
                                    Refresh
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="style2">
                    <div class="generalheading2">Presentation Screen Setup</div>
                    <div id="presentationScreenSetupID" class="padded">
                        <b>Margins</b>
                        <div class="row">
                            <div class="column" style="background-color:#bbb; width: 15%;">
                                TOP <input name="presentConfigMarginTop" type="text" id="presentConfigMarginTop"
                                           value="50" size={4}/>
                            </div>
                            <div class="column" style="background-color:#bbb; width: 15%;">
                                LEFT <input name="presentConfigMarginLeft" type="text" id="presentConfigMarginLeft"
                                            value="50" size={4}/>
                            </div>
                            <div class="column" style="background-color:#bbb; width: 15%;">
                                BOTTOM <input name="presentConfigMarginBottom" type="text"
                                              id="presentConfigMarginBottom" value="50" size={4}/>
                            </div>
                            <div class="column" style="background-color:#bbb; width: 15%;">
                                RIGHT <input name="presentConfigMarginRight" type="text" id="presentConfigMarginRight"
                                             value="50" size={4}/>
                            </div>
                        </div>

                        <br/>

                        <div class="ui grid">
                            <div class="six wide column">
                                <b>Maximum Font Size</b> <input type="text" id="presentConfigMaxFontSize" value="150"
                                                                size={6}/> px (30px to 200px)<br/>
                                <br/>
                                <b>Justification </b>
                                <input type="radio" name="justify" id="justify_left" value="Left"/> Left
                                <input type="radio" name="justify" id="justify_center" value="Center" checked/> Center
                                <input type="radio" name="justify" id="justify_right" value="Right"/> Right
                                <br/><br/>


                                <input type="checkbox" id="presentConfigOntop"/> Keep Presentation Window on Top<br/>
                                <input type="checkbox" id="presentConfigEnableTransition"/> Enable Transition<br/>
                                <input type="checkbox" id="presentConfigEnableShadow"/> Enable Outline<br/><br/><br/>

                                <input type="checkbox" id="presentConfigShowDateTime"/> Show Date and Time<br/>
                                <input type="checkbox" id="presentConfigShowVVLogo"/> Show ReVerseVIEW Logo<br/>
                                <input type="checkbox" id="presentConfigShowCustomLogo"/> Show Custom Logo<br/>
                                <input name="customLogoText1" type="text" id="customLogoText1" size={40}/><br/>
                                <input name="customLogoText2" type="text" id="customLogoText2" size={40}/><br/><br/>
                            </div>

                            <div class="six wide column">
                                <b>VERSE</b><br/>
                                <b>Verse Presentation Style </b>
                                <input type="radio" name="p_orient" id="porient_hori" value="Horizontal"/> Horizontal
                                <input type="radio" name="p_orient" id="porient_vert" value="Vertical"
                                       checked/> Vertical
                                <br/><br/>

                                <b>SONG LYRICS</b> <br/>
                                <input type="checkbox" id="presentConfigEnableSongTitle"/> Show Song Title<br/>
                                <input type="checkbox" id="showPrimaryFont"/> Show lyrics in primary language<br/>
                                <input type="checkbox" id="show2LinesSlides"/> Two (2) lines per slide<br/>
                                <input type="checkbox" id="hideStanzaNumber"/> Hide stanza number<br/>
                                <input type="checkbox" id="fitLineSetup" checked/> Enable Line Wrap<br/>
                                <b>Lyrics Presentation Style </b>
                                <input type="radio" name="p_orient_song" id="porient_song_hori"
                                       value="Horizontal"/> Horizontal
                                <input type="radio" name="p_orient_song" id="porient_song_vert" value="Vertical"
                                       checked/> Vertical
                                <br/>
                            </div>

                        </div>
                    </div>


                    <div class="ui grid">
                        <div class="six wide column">
                            <button type="button" class="btn btn-secondary btn-sm" id="presentConfigSaveButton">SAVE
                            </button>
                        </div>
                    </div>

                    <hr/>

                    <div class="generalheading2">Stage Screen Setup</div>
                    <div id="stageScreenSetupID" class="padded">
                        <b>Stage Screen Style </b>

                        {/* StageVIEW style */}
                        <div class="ui grid">
                            <div class="two wide column">
                                <select id="selectStageStyle" class="selectboxStyle">
                                    <option value="0">Horizontal</option>
                                    <option value="1">Vertical</option>
                                    <option value="3">1/3rd View</option>
                                </select>
                            </div>
                        </div>

                        {/* Window View */}
                        <div id="stageviewAsWindowDiv">
                            <div class="ui grid">
                                <div class="two wide column">
                                    <input type="checkbox" id="stageviewWindow"/> Window View
                                </div>
                                <div class="two wide column">
                                    <input type="checkbox" id="stageviewMiniWindow"/> Small Window
                                </div>
                                <div class="two wide column">
                                    <input type="checkbox" id="stageviewGreenWindow"/> Green Screen
                                </div>
                            </div>
                        </div>

                        <div class="ui grid">
                            <div class="six wide column">
                                {/* Opacity of the 1/3rd view strip */}
                                <div id="stageviewOpacityDiv">Opacity<input type="text" id="thirdview_opacity"
                                                                            value="0.6" size={6}/>
                                    <div class="ui range" id="thirdview_opacity_range"></div>
                                </div>

                                {/* Height of 1/3rd View */}
                                <div id="stageviewHeightDiv">Height<input type="text" id="thirdview_height" value="33"
                                                                          size={6}/>
                                    <div class="ui range" id="thirdview_height_range"></div>
                                </div>

                                {/* Vertical Position of 1/3rd View */}
                                <div id="stageviewPositionDiv">Vertical Position<input type="text"
                                                                                       id="thirdview_position"
                                                                                       value="33" size={6}/>
                                    <div class="ui range" id="thirdview_position_range"></div>
                                </div>
                            </div>
                            <div class="six wide column">
                                {/* Maximum font size 1/3rd View */}
                                <div id="stageviewMaxFontsizeDiv">Maximum Font Size<input type="text"
                                                                                          id="thirdview_maxFontSize"
                                                                                          value="33" size={6}/>
                                    <div class="ui range" id="thirdview_maxFontSize_range"></div>
                                </div>

                                {/* Color of Text in StageVIEW */}
                                <div id="stageviewForegroundColorDiv">Text Color<input type="text" id="thirdview_fcolor"
                                                                                       value="" size={6}/>
                                    <div class="ui range" id="thirdview_fcolor_range"></div>
                                </div>

                                {/* Background color of strip */}
                                <div id="stageviewBackgroundColorDiv">Background Color<input type="text"
                                                                                             id="thirdview_bcolor"
                                                                                             value="" size={6}/>
                                    <div class="ui range" id="thirdview_bcolor_range"></div>
                                </div>
                            </div>
                        </div>

                        <br/>

                        <div class="ui grid">
                            <div class="three wide column">
                                <div id="stageviewPrimaryDiv"><input type="checkbox" id="thirdview_primary"/> Show
                                    primary only
                                </div>
                            </div>
                            <div class="three wide column">
                                <div id="stageviewSecondaryDiv"><input type="checkbox" id="thirdview_secondary"/> Show
                                    secondary only
                                </div>
                            </div>
                        </div>

                        <br/>

                        <div id="stageviewAlignLeftDiv"><input type="checkbox" id="thirdview_alignLeft"/> Align Left
                        </div>
                        <div id="stageviewAlignCenterDiv"><input type="checkbox" id="thirdview_alignCenter"/> Align
                            Center
                        </div>
                        <div id="stageviewAlignHorizontalDiv"><input type="checkbox"
                                                                     id="thirdview_alignHorizontal"/> Horizontal
                        </div>

                        <div id="stageviewOutlineDiv"><input type="checkbox" id="thirdview_outline"/> Auto Text Outline
                        </div>
                        <div id="stageviewShadowDiv"><input type="checkbox" id="thirdview_shadow"/> Text Shadow</div>
                        <div id="stageviewShowTextureDiv"><input type="checkbox" id="thirdview_showTexture"/> Add
                            Texture
                        </div>

                        <div id="stageviewTimeDiv"><input type="checkbox" id="stageSettingShowTime"/> Show date and time
                        </div>

                        <div id="stageMessageDivID" class="padded">
                            <b>Message Setup</b><br/>
                            <textarea rows={4} cols={50} id="stageConfigMessage"></textarea>
                            <input name="stageMessageShow" type="button" id="stageMessageShow" value=" SHOW "/> |
                            <input name="stageMessageHide" type="button" id="stageMessageHide" value=" CLEAR "/>
                        </div>
                    </div>

                    <hr/>
                    <br/>
                </div>
            </div>
        </div>
    )
}