import {useEffect, useRef} from "preact/hooks";
import {getAvailableScreens, getAvailableFonts} from "@/p_window";
import {$RvW} from "@/rvw";
import {
    availableFonts as availableFontsStore,
    availableScreens as availableScreensStore,
    presentationPrimaryFontOverride,
    presentationSecondaryFontOverride,
    presentationMainEnabled,
    presentationMainScreen,
    presentationStageEnabled,
    presentationStageScreen, restoreRemoteStandby,
} from "@stores/global";
import {useStoreState} from "@/utils/hooks";
import {console} from "@/platform/adapters/air";
import Spacer from "@app/ui/widgets/Spacer";

export default function RightSettingsTab() {
    const screenSelectMain = useRef<HTMLDivElement>(null);
    const screenSelectStage = useRef<HTMLDivElement>(null);
    const fontSelectOverridePrimary = useRef<HTMLDivElement>(null);
    const fontSelectOverrideSecondary = useRef<HTMLDivElement>(null);

    const availableScreens = useStoreState(availableScreensStore);
    const availableFonts = useStoreState(availableFontsStore);

    const mainScreen = useStoreState(presentationMainScreen);
    const stageScreen = useStoreState(presentationStageScreen);

    const mainEnabled = useStoreState(presentationMainEnabled);
    const stageEnabled = useStoreState(presentationStageEnabled);

    const fontOverridePrimary = useStoreState(presentationPrimaryFontOverride);
    const fontOverrideSecondary = useStoreState(presentationSecondaryFontOverride);

    useEffect(() => {
        console.trace('[INIT]');

        availableScreensStore.set(getAvailableScreens());
        availableFontsStore.set(getAvailableFonts());

        presentationMainEnabled.set(!!$RvW.vvConfigObj.get_mainConfigEnable());
        presentationStageEnabled.set(!!$RvW.vvConfigObj.get_stageConfigEnable());

        presentationMainScreen.set($RvW.rvwPreferences.get("app.settings.screen.main.index", 1));
        presentationStageScreen.set($RvW.rvwPreferences.get("app.settings.screen.stage.index", 0));

        presentationPrimaryFontOverride.set($RvW.rvwPreferences.get("app.settings.font.primary.override", null));
        presentationSecondaryFontOverride.set($RvW.rvwPreferences.get("app.settings.font.secondary.override", null));
    }, []);

    useEffect(() => {
        // always add this after the select list is populated
        // console.trace('[Main EFFECT]', JSON.stringify([mainScreen, stageScreen, [fontOverridePrimary, fontOverrideSecondary], availableScreens, {length: availableFonts.length}]));

        // @ts-ignore
        $(screenSelectMain.current).dropdown({
            onChange: function(value: number, text: string, $selected: any) {
                // Is triggered by user interaction
                // @ts-ignore
                if (!$selected || !$(screenSelectMain.current).dropdown('is visible')) return;
                
                // console.trace('Changed Main Screen:', value, text, $selected);
                updateMainScreenSelection(value - 1);
            }
        });

        // @ts-ignore
        $(screenSelectStage.current).dropdown({
            onChange: function(value: number, text: string, $selected: any) {
                // Is triggered by user interaction
                // @ts-ignore
                if (!$selected || !$(screenSelectStage.current).dropdown('is visible')) return;

                // console.trace('Changed Stage Screen:', value, text, $selected);
                updateStageScreenSelection(value - 1);
            }
        });

        // @ts-ignore
        $(fontSelectOverridePrimary.current).dropdown({
            on: 'click',
            onChange: function(value: string, text: string, $selected: any) {
                // Is triggered by user interaction
                // @ts-ignore
                if (!$selected || !$(fontSelectOverridePrimary.current).dropdown('is visible')) return;

                console.trace('Changed Primary Font Override:', value, text, $selected);
                updatePrimaryFontOverride(value || null);
            },
        });

        // @ts-ignore
        $(fontSelectOverrideSecondary.current).dropdown({
            on: 'click',
            onChange: function(value: string, text: string, $selected: any) {
                // Is triggered by user interaction
                // @ts-ignore
                if (!$selected || !$(fontSelectOverrideSecondary.current).dropdown('is visible')) return;

                console.trace('Changed Font Override:', value, text, $selected);
                updateSecondaryFontOverride(value || null);
            },
        });

        // setTimeout(() => {
        //     console.trace('TRIG....')
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
        // console.trace('Screens.Update:', JSON.stringify(availableScreens));

        // @ts-ignore
        $(screenSelectMain.current).dropdown('refresh'); refreshMainScreen();
        // @ts-ignore
        $(screenSelectStage.current).dropdown('refresh'); refreshStageScreen();
    }, [availableScreens]);

    useEffect(() => {
        console.trace('Fonts.Update:', JSON.stringify({length: availableFonts.length}));

        // @ts-ignore
        $(fontSelectOverridePrimary.current).dropdown('refresh'); refreshPrimaryFontOverride();
        // @ts-ignore
        $(fontSelectOverrideSecondary.current).dropdown('refresh'); refreshSecondaryFontOverride();
    }, [availableFonts]);

    useEffect(() => {
        // console.trace('Screen.Main:', JSON.stringify(mainScreen));

        // @ts-ignore
        $(screenSelectMain.current).dropdown('set selected', mainScreen + 1);
    }, [mainScreen]);

    useEffect(() => {
        // console.trace('Screen.Stage:', JSON.stringify(stageScreen));

        // @ts-ignore
        $(screenSelectStage.current).dropdown('set selected', stageScreen + 1);
    }, [stageScreen]);

    useEffect(() => {
        // console.trace('Font.Override.Primary:', fontOverridePrimary);

        // @ts-ignore
        $(fontSelectOverridePrimary.current).dropdown('set selected', fontOverridePrimary || '');
    }, [fontOverridePrimary]);

    useEffect(() => {
        // console.trace('Font.Override.Secondary:', fontOverrideSecondary);

        // @ts-ignore
        $(fontSelectOverrideSecondary.current).dropdown('set selected', fontOverrideSecondary || '');
    }, [fontOverrideSecondary]);

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

    function updatePrimaryFontOverride(value: string | null) {
        presentationPrimaryFontOverride.set(value);
        $RvW.rvwPreferences.set("app.settings.font.primary.override", value || null);
        $RvW.vvConfigObj.save();
    }

    function updateSecondaryFontOverride(value: string | null) {
        presentationSecondaryFontOverride.set(value);
        $RvW.rvwPreferences.set("app.settings.font.secondary.override", value || null);
        $RvW.vvConfigObj.save();
    }

    function onRefreshScreens() {
        const _screens = getAvailableScreens();
        availableScreensStore.set(_screens);
        // next step is invoked by hook
    }

    function onRefreshFonts() {
        const _fonts = getAvailableFonts();
        availableFontsStore.set(_fonts);
        // next step is invoked by hook
    }

    function refreshMainScreen() {
        const savedIndex = $RvW.rvwPreferences.get("app.settings.screen.main.index", mainScreen);
        // console.trace('SAVED:', savedIndex)
        presentationMainScreen.set(getSelectedScreenIndex(savedIndex, availableScreens.length));
    }

    function refreshStageScreen() {
        const savedIndex = $RvW.rvwPreferences.get("app.settings.screen.stage.index", stageScreen);
        // console.trace('SAVED:', savedIndex)
        presentationStageScreen.set(getSelectedScreenIndex(savedIndex, availableScreens.length));
    }

    function refreshPrimaryFontOverride() {
        const savedValue = $RvW.rvwPreferences.get("app.settings.font.primary.override", fontOverridePrimary);
        console.trace('SAVED:', savedValue)
        let value = null;
        for (const f of availableFonts) {
            if (f.value === savedValue) {
                value = savedValue;
                break
            }
        }
        presentationPrimaryFontOverride.set(value);
    }

    function refreshSecondaryFontOverride() {
        const savedValue = $RvW.rvwPreferences.get("app.settings.font.secondary.override", fontOverrideSecondary);
        console.trace('SAVED:', savedValue)
        let value = null;
        for (const f of availableFonts) {
            if (f.value === savedValue) {
                value = savedValue;
                break
            }
        }
        presentationSecondaryFontOverride.set(value);
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
                <div class="ui form small">
                    {/* Presentation Setup */}
                    <div class="ui basic segment">
                        <h4 class="ui dividing header">Presentation Setup</h4>

                        {/* Toggle */}
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

                        {/* Screens */}
                        <div class="two fields">
                            <div class="field">
                                <label>Screen</label>
                                <div class="ui action input" style={{width: '100%'}}>
                                    <div
                                        class="ui selection dropdown"
                                        role="listbox"
                                        tabindex={0}
                                        ref={screenSelectMain}
                                    >
                                        <div role="alert" class="divider default text">
                                            Select Screen
                                        </div>
                                        <i aria-hidden="true" class="dropdown icon"></i>
                                        <div class="menu transition">
                                            {availableScreens.map(({name, value}, i) => (
                                                <div
                                                    key={i}
                                                    class="item"
                                                    role="option"
                                                    data-value={value}
                                                    data-text={name}
                                                >
                                                    <i class="icon desktop"></i>
                                                    <span class="text">{name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div class="ui button small" onClick={() => onRefreshScreens()}>
                                        <i class="sync icon"></i>
                                        Refresh
                                    </div>

                                    {/*<div class="ui equal width grid" style={{width: '100%'}}>*/}
                                    {/*    <div class="column" style={{padding: 0}}>*/}
                                    {/*        <div class="ui selection dropdown fluid" ref={screenSelectMain}>*/}
                                    {/*            <input type="hidden" name="main-screen"/>*/}
                                    {/*            <i class="dropdown icon"></i>*/}
                                    {/*            <div class="default text">Screen</div>*/}
                                    {/*            <div class="menu" style={{width: '100%'}}>*/}
                                    {/*                {availableScreens.map(({name, value}, i) => (*/}
                                    {/*                    <div key={i} class="item" data-value={value} data-text={name}>*/}
                                    {/*                        <i class="icon desktop"></i>*/}
                                    {/*                        {name}*/}
                                    {/*                    </div>*/}
                                    {/*                ))}*/}
                                    {/*            </div>*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*    <div class="five wide column" style={{padding: 0}}>*/}
                                    {/*        <div class="ui button mini" onClick={() => onRefreshScreensMain()}>*/}
                                    {/*            <i class="sync icon"></i>*/}
                                    {/*            Refresh*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                            <div class="field">
                                <label>Screen</label>
                                <div class="ui action input" style={{width: '100%'}}>
                                    <div
                                        class="ui selection dropdown"
                                        role="listbox"
                                        tabindex={0}
                                        ref={screenSelectStage}
                                    >
                                        <div role="alert" class="divider default text">
                                            Select Screen
                                        </div>
                                        <i aria-hidden="true" class="dropdown icon"></i>
                                        <div class="menu transition">
                                            {availableScreens.map(({name, value}, i) => (
                                                <div
                                                    key={i}
                                                    class="item"
                                                    role="option"
                                                    data-value={value}
                                                    data-text={name}
                                                >
                                                    <i class="icon desktop"></i>
                                                    <span class="text">{name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div class="ui button small" onClick={() => onRefreshScreens()}>
                                        <i class="sync icon"></i>
                                        Refresh
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Presentation: Main */}
                    <div class="ui basic segment">
                        <h4 class="ui dividing header">Presentation: Main</h4>

                        {/* Margins */}
                        <div class="field">
                            <label>Margins</label>

                            <div class="fields">
                                <div class="four wide field">
                                    <label>Top</label>
                                    <input
                                        name="presentConfigMarginTop"
                                        type="text"
                                        id="presentConfigMarginTop"
                                    />
                                </div>
                                <div class="four wide field">
                                    <label>Left</label>
                                    <input
                                        name="presentConfigMarginLeft"
                                        type="text"
                                        id="presentConfigMarginLeft"
                                    />
                                </div>
                                <div class="four wide field">
                                    <label>Bottom</label>
                                    <input
                                        name="presentConfigMarginBottom"
                                        type="text"
                                        id="presentConfigMarginBottom"
                                    />
                                </div>
                                <div class="four wide field">
                                    <label>Right</label>
                                    <input
                                        name="presentConfigMarginRight"
                                        type="text"
                                        id="presentConfigMarginRight"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="two fields">
                            <div class="field">
                                <label>Font</label>
                                <div class="inline fields">
                                    <div class="field">
                                        <label>Max Font Size</label>
                                        <input
                                            type="text"
                                            id="presentConfigMaxFontSize"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="field">
                                <label>Text</label>

                                <div class="inline fields">
                                    <label>Justification</label>

                                    <div class="field">
                                        <div class="ui radio checkbox">
                                            <input id="justify_left" type="radio" name="text-justification"/>
                                            <label>Left</label>
                                        </div>
                                    </div>
                                    <div class="field">
                                        <div class="ui radio checkbox">
                                            <input id="justify_center" type="radio" name="text-justification"/>
                                            <label>Center</label>
                                        </div>
                                    </div>
                                    <div class="field">
                                        <div class="ui radio checkbox">
                                            <input id="justify_right" type="radio" name="text-justification"/>
                                            <label>Right</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Font Override */}
                        <div class="two fields">
                            <div class="field">
                                <div class="inline fields">
                                    <div class="field">
                                        {/* TODO: fix: dropdown not visible until window is resized horizontally  */}
                                        <label>Font Override: Primary</label>
                                        <div class="ui action input" style={{width: '100%'}}>
                                            <div
                                                class="ui selection dropdown"
                                                role="listbox"
                                                tabindex={0}
                                                ref={fontSelectOverridePrimary}
                                            >
                                                <div role="alert" class="divider default text">
                                                    Select Font
                                                </div>
                                                <i aria-hidden="true" class="dropdown icon"></i>
                                                <div class="menu transition">
                                                    <div class="item" role="option" data-value={''}
                                                         data-text={'Disabled'}>
                                                        {'Disabled'}
                                                    </div>
                                                    {availableFonts.map(({name, value}, i) => (
                                                        <div
                                                            key={i}
                                                            class="item"
                                                            role="option"
                                                            data-value={value}
                                                            data-text={name}
                                                            style={{fontFamily: value}}
                                                        >
                                                            <span class="text">{name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div class="ui button small" onClick={() => onRefreshFonts()}>
                                                <i class="sync icon"></i>
                                                Refresh
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="field">
                                <div class="inline fields">
                                    <div class="field">
                                        {/* TODO: fix: dropdown not visible until window is resized horizontally  */}
                                        <label>Font Override: Secondary</label>
                                        <div class="ui action input" style={{width: '100%'}}>
                                            <div
                                                class="ui selection dropdown"
                                                role="listbox"
                                                tabindex={0}
                                                ref={fontSelectOverrideSecondary}
                                            >
                                                <div role="alert" class="divider default text">
                                                    Select Font
                                                </div>
                                                <i aria-hidden="true" class="dropdown icon"></i>
                                                <div class="menu transition">
                                                    <div class="item" role="option" data-value={''}
                                                         data-text={'Disabled'}>
                                                        {'Disabled'}
                                                    </div>
                                                    {availableFonts.map(({name, value}, i) => (
                                                        <div
                                                            key={i}
                                                            class="item"
                                                            role="option"
                                                            data-value={value}
                                                            data-text={name}
                                                            style={{fontFamily: value}}
                                                        >
                                                            <span class="text">{name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div class="ui button small" onClick={() => onRefreshFonts()}>
                                                <i class="sync icon"></i>
                                                Refresh
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Styling & Window */}
                        <div class="two fields">
                            <div class="field">
                                <label>Styling</label>

                                <div class="fields">
                                    <div class="field">
                                        <div class="ui checkbox">
                                            <input type="checkbox" name="example" id="presentConfigEnableTransition"/>
                                            <label>Transitions</label>
                                        </div>
                                    </div>
                                    <div class="field">
                                        <div class="ui checkbox disabled">
                                            <input type="checkbox" name="example" id="presentConfigEnableOutline"
                                                   disabled/>
                                            <label>Outline</label>
                                        </div>
                                    </div>
                                    <div class="field">
                                        <div class="ui checkbox">
                                            <input type="checkbox" name="example" id="presentConfigEnableShadow"/>
                                            <label>Shadow</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="field">
                                <label>Window</label>

                                <div class="inline fields">
                                    <div class="field">
                                        <div class="ui checkbox">
                                            <input type="checkbox" name="example" id="presentConfigOntop"/>
                                            <label>Stay on Top</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Remote & Misc */}
                        <div class="two fields">
                            <div class="field">
                                <label>Remote</label>

                                <div class="fields">
                                    <div class="field">
                                        <div class="ui checkbox">
                                            <input type="checkbox" name="example" id="remoteRestoreToggle"/>
                                            <label>Restore Standby on Startup</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/*<div class="field">*/}
                            {/*    <label>Misc</label>*/}

                            {/*    <div class="inline fields">*/}
                            {/*        <div class="field">*/}
                            {/*            <div class="ui checkbox">*/}
                            {/*                <input type="checkbox" name="example" id="presentConfigOntop"/>*/}
                            {/*                <label>Stay on Top</label>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>

                        {/* Orientation */}
                        <div class="two fields">
                            <div class="field">
                                <label>Orientation</label>

                                <div class="inline fields">
                                    <label>Verse</label>

                                    <div class="field">
                                        <div class="ui radio checkbox">
                                            <input id="porient_hori" type="radio" name="verse-orientation"/>
                                            <label>Horizontal</label>
                                        </div>
                                    </div>
                                    <div class="field">
                                        <div class="ui radio checkbox">
                                            <input id="porient_vert" type="radio" name="verse-orientation"/>
                                            <label>Vertical</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="field">
                                <label>Orientation</label>

                                <div class="inline fields">
                                    <label>Lyric</label>

                                    <div class="field">
                                        <div class="ui radio checkbox">
                                            <input id="porient_song_hori" type="radio" name="lyric-orientation"/>
                                            <label>Horizontal</label>
                                        </div>
                                    </div>
                                    <div class="field">
                                        <div class="ui radio checkbox">
                                            <input id="porient_song_vert" type="radio" name="lyric-orientation"/>
                                            <label>Vertical</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Widgets & Lyric Config */}
                        <div class="two fields">
                            <div class="field">
                                <label>Widgets</label>

                                <div class="field">
                                    <div class="ui checkbox">
                                        <input type="checkbox" name="example" id="presentConfigShowDateTime"/>
                                        <label>Digital Clock</label>
                                    </div>
                                </div>

                                <div class="field">
                                    <div class="ui checkbox">
                                        <input type="checkbox" name="example" id="presentConfigShowVVLogo"/>
                                        <label>ReVerseVIEW Logo</label>
                                    </div>
                                </div>

                                <div class="field">
                                    <div class="ui checkbox">
                                        <input
                                            type="checkbox"
                                            name="example"
                                            id="presentConfigShowCustomLogo"
                                        />
                                        <label>Custom Logo</label>
                                    </div>
                                </div>

                                <div class="field">
                                    <input
                                        name="customLogoText1"
                                        class="ui input fluid"
                                        type="text"
                                        id="customLogoText1"
                                    />
                                </div>

                                <div class="field">
                                    <input
                                        name="customLogoText2"
                                        class="ui input fluid"
                                        type="text"
                                        id="customLogoText2"
                                    />
                                </div>
                            </div>

                            <div class="field">
                                <label>Lyric Config</label>

                                <div class="field">
                                    <div class="ui checkbox">
                                        <input type="checkbox" name="example" id="presentConfigEnableSongTitle"/>
                                        <label>Show Song Title</label>
                                    </div>
                                </div>

                                <div class="field">
                                    <div class="ui checkbox">
                                        <input type="checkbox" name="example" id="showPrimaryFont"/>
                                        <label>Show lyrics in primary language</label>
                                    </div>
                                </div>

                                <div class="field">
                                    <div class="ui checkbox">
                                        <input type="checkbox" name="example" id="show2LinesSlides"/>
                                        <label>Two (2) lines per slide</label>
                                    </div>
                                </div>

                                <div class="field">
                                    <div class="ui checkbox">
                                        <input type="checkbox" name="example" id="hideStanzaNumber"/>
                                        <label>Hide stanza number</label>
                                    </div>
                                </div>

                                <div class="field">
                                    <div class="ui checkbox">
                                        <input type="checkbox" name="example" id="fitLineSetup"/>
                                        <label>Enable Line Wrap</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save */}
                        <button
                            id="presentConfigSaveButton"
                            class="ui button"
                            type="button"
                        >
                            Save
                        </button>
                    </div>

                    <div class="ui basic segment">
                        <h4 class="ui dividing header">Presentation: Stage</h4>

                        {/* TODO: style proper */}
                        <div>
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
                                    <div id="stageviewHeightDiv">Height<input type="text" id="thirdview_height"
                                                                              value="33"
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
                                    <div id="stageviewForegroundColorDiv">Text Color<input type="text"
                                                                                           id="thirdview_fcolor"
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

                            <div class="ui grid">
                                <div class="three wide column">
                                    <div id="stageviewPrimaryDiv">
                                        <input type="checkbox" id="thirdview_primary"/>
                                        Show primary only
                                    </div>
                                </div>
                                <div class="three wide column">
                                    <div id="stageviewSecondaryDiv"><input type="checkbox"
                                                                           id="thirdview_secondary"/> Show
                                        secondary only
                                    </div>
                                </div>
                            </div>

                            <div id="stageviewAlignLeftDiv"><input type="checkbox" id="thirdview_alignLeft"/> Align Left
                            </div>
                            <div id="stageviewAlignCenterDiv"><input type="checkbox" id="thirdview_alignCenter"/> Align
                                Center
                            </div>
                            <div id="stageviewAlignHorizontalDiv"><input type="checkbox"
                                                                         id="thirdview_alignHorizontal"/> Horizontal
                            </div>

                            <div id="stageviewOutlineDiv"><input type="checkbox" id="thirdview_outline"/> Auto Text
                                Outline
                            </div>
                            <div id="stageviewShadowDiv"><input type="checkbox" id="thirdview_shadow"/> Text Shadow
                            </div>
                            <div id="stageviewShowTextureDiv"><input type="checkbox" id="thirdview_showTexture"/> Add
                                Texture
                            </div>

                            <div id="stageviewTimeDiv"><input type="checkbox" id="stageSettingShowTime"/> Show date and
                                time
                            </div>

                            <div id="stageMessageDivID" class="padded">
                                <b>Message Setup</b><br/>
                                <textarea rows={4} cols={50} id="stageConfigMessage"></textarea>
                                <input name="stageMessageShow" type="button" id="stageMessageShow" value=" SHOW "/> |
                                <input name="stageMessageHide" type="button" id="stageMessageHide" value=" CLEAR "/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}