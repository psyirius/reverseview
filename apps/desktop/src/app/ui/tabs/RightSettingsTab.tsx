import {useEffect, useRef, useState} from "preact/hooks";
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
    presentationStageScreen,
    restoreRemoteStandby,
} from "@stores/global";
import {useStoreState} from "@/utils/hooks";
import {console} from "@/platform/adapters/air";
import {savePresentationMargin} from "@app/presentation";

function Switch({ label = 'Toggle Me', onChange = null }) {
    const [checked, setChecked] = useState(true);

    function _onChange(e: Event) {
        const { checked } = (e.target as HTMLInputElement);

        setChecked(checked);
        onChange?.(checked);
    }

    return (
        <>
            <div class="relative inline-block">
                <label for="toggle" class="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" id="toggle" class="peer sr-only" />
                    <div class="peer h-6 w-11 rounded-full bg-gray-200 outline-none transition-all duration-300 peer-checked:bg-blue-600"></div>
                    <span class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 peer-checked:translate-x-5"></span>
                </label>
            </div>

            <div class="swx">
                <div class="flex items-center">
                    <label for="toggle" class="flex cursor-pointer items-center">
                        <div class="relative">
                            <input id="toggle" type="checkbox" class="sr-only" onChange={_onChange}/>
                            <div
                                class={`block h-8 w-14 rounded-full transition-colors  ${checked ? 'bg-blue-400' : 'bg-gray-200'}`}></div>
                            <div class={`absolute left-1 top-1 h-6 w-6 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : ''}`}></div>
                        </div>
                        <span class="ml-3 font-medium text-gray-700">{label}</span>
                    </label>
                </div>
            </div>
        </>
    )
}

function MainPresentationSetup() {
    const fontSelectOverridePrimary = useRef<HTMLDivElement>(null);
    const fontSelectOverrideSecondary = useRef<HTMLDivElement>(null);

    const availableFonts = useStoreState(availableFontsStore);

    const fontOverridePrimary = useStoreState(presentationPrimaryFontOverride);
    const fontOverrideSecondary = useStoreState(presentationSecondaryFontOverride);

    useEffect(() => {
        console.trace('[INIT]');

        availableFontsStore.set(getAvailableFonts());

        presentationPrimaryFontOverride.set($RvW.rvwPreferences.get("app.settings.font.primary.override", null));
        presentationSecondaryFontOverride.set($RvW.rvwPreferences.get("app.settings.font.secondary.override", null));
    }, []);

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        console.trace('Fonts.Update:', ({length: availableFonts.length}));

        // @ts-ignore
        $(fontSelectOverridePrimary.current).dropdown('refresh'); refreshPrimaryFontOverride();
        // @ts-ignore
        $(fontSelectOverrideSecondary.current).dropdown('refresh'); refreshSecondaryFontOverride();
    }, [availableFonts]);

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

    function onRefreshFonts() {
        const _fonts = getAvailableFonts();
        availableFontsStore.set(_fonts);
        // next step is invoked by hook
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

    return (
        <>
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
                                    <input
                                        type="checkbox"
                                        name="example"
                                        id="presentConfigEnableTransition"
                                    />
                                    <label>Transition</label>
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui checkbox">
                                    <input
                                        type="checkbox"
                                        name="example"
                                        id="presentConfigEnableOutline"
                                    />
                                    <label>Outline</label>
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui checkbox">
                                    <input
                                        type="checkbox"
                                        name="example"
                                        id="presentConfigEnableShadow"
                                    />
                                    <label>Shadow</label>
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui checkbox">
                                    <input
                                        type="checkbox"
                                        name="example"
                                        id="presentConfigEnableFooter"
                                    />
                                    <label>Footer</label>
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
                                <label>ReVerseVIEW Branding</label>
                            </div>
                        </div>

                        <div class="field">
                            <div class="ui checkbox">
                                <input
                                    type="checkbox"
                                    name="example"
                                    id="presentConfigShowCustomLogo"
                                />
                                <label>Custom Branding</label>
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
                                <label>Hide verse number</label>
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

                {/* Save/Discard */}
                <div class="ui basic buttons">
                    <button
                        id="presentConfigSaveButton"
                        onClick={savePresentationMargin}
                        class="ui blue button">Save</button>
                    <button
                        id="presentConfigDiscardButton"
                        class="ui red button">Discard</button>
                </div>
            </div>
        </>
    );
}

export enum StageViewStyle {
    Horizontal  = 0,
    Vertical    = 1,
    LowerThird  = 2,
}

function StagePresentationSetup() {
    const svStyles = [
        { value: StageViewStyle.Horizontal, label: 'Horizontal'  },
        { value: StageViewStyle.Vertical,   label: 'Vertical'    },
        { value: StageViewStyle.LowerThird, label: 'Lower Third' },
    ];

    const opacitySliderRef = useRef<HTMLDivElement>(null);
    const heightSliderRef = useRef<HTMLDivElement>(null);
    const vertPosSliderRef = useRef<HTMLDivElement>(null);
    const maxFontSizeSliderRef = useRef<HTMLDivElement>(null);

    const colorInputFGRef = useRef<HTMLInputElement>(null);
    const colorInputBGRef = useRef<HTMLInputElement>(null);

    const [layout, setLayout] = useState(
        $RvW.rvwPreferences.get("app.settings.stage.layout", StageViewStyle.Horizontal)
    );
    const [svWindowView, setSvWindowView] = useState(
        $RvW.rvwPreferences.get("app.settings.stage.window_view", false)
    );
    const [svMiniWindow, setSvMiniWindow] = useState(
        $RvW.rvwPreferences.get("app.settings.stage.mini_window", false)
    );
    const [svGreenWindow, setSvGreenWindow] = useState(
        $RvW.rvwPreferences.get("app.settings.stage.green_screen", false)
    );

    const [opacity, setOpacity] = useState(
        $RvW.rvwPreferences.get("app.settings.stage.opacity", 1)
    );
    const [height, setHeight] = useState(
        $RvW.rvwPreferences.get("app.settings.stage.height", 30)
    );
    const [vertPos, setVertPos] = useState(
        $RvW.rvwPreferences.get("app.settings.stage.position", 0)
    );
    const [maxFontSize, setMaxFontSize] = useState(
        $RvW.rvwPreferences.get("app.settings.stage.max_font_size", 50)
    );
    const [fgColor, setFgColor] = useState(
        $RvW.rvwPreferences.get("app.settings.stage.fg_color", '#ffffff')
    );
    const [bgColor, setBgColor] = useState(
        $RvW.rvwPreferences.get("app.settings.stage.bg_color", '#000000')
    );
    
    const [primaryOnly, setPrimaryOnly] = useState(
        $RvW.rvwPreferences.get("app.settings.stage.primary_only", false)
    );
    const [secondaryOnly, setSecondaryOnly] = useState(
        $RvW.rvwPreferences.get("app.settings.stage.secondary_only", false)
    );
    const [alignLeft, setAlignLeft] = useState(
        $RvW.rvwPreferences.get("app.settings.stage.align_left", false)
    );
    const [alignCenter, setAlignCenter] = useState(
        $RvW.rvwPreferences.get("app.settings.stage.align_center", false)
    );
    const [alignHorizontal, setAlignHorizontal] = useState(
        $RvW.rvwPreferences.get("app.settings.stage.align_horizontal", false)
    );
    const [textOutline, setTextOutline] = useState(
        $RvW.rvwPreferences.get("app.settings.stage.text_outline", false)
    );
    const [textShadow, setTextShadow] = useState(
        $RvW.rvwPreferences.get("app.settings.stage.text_shadow", false)
    );
    const [showTexture, setShowTexture] = useState(
        $RvW.rvwPreferences.get("app.settings.stage.show_texture", false)
    );
    const [showDatetime, setShowDatetime] = useState(
        $RvW.rvwPreferences.get("app.settings.stage.show_datetime", false)
    );

    useEffect(() => {
        // @ts-ignore
        $(opacitySliderRef.current).range({
            min: 0,
            max: 100,
            start: Math.round(opacity * 100),
            onChange: function (value: number) {
                value /= 100;
                setOpacity(value);
                $RvW.rvwPreferences.set("app.settings.stage.opacity", value);
                $RvW.rvwPreferences.commit();
            },
        });
        // @ts-ignore
        $(heightSliderRef.current).range({
            min: 0,
            max: 100,
            start: height,
            onChange: function (value: number) {
                setHeight(value);
                $RvW.rvwPreferences.set("app.settings.stage.height", value);
                $RvW.rvwPreferences.commit();
            },
        });
        // @ts-ignore
        $(vertPosSliderRef.current).range({
            min: 0,
            max: 100,
            start: vertPos,
            onChange: function (value: number) {
                setVertPos(value);
                $RvW.rvwPreferences.set("app.settings.stage.position", value);
                $RvW.rvwPreferences.commit();
            },
        });
        // @ts-ignore
        $(maxFontSizeSliderRef.current).range({
            min: 10,
            max: 100,
            start: maxFontSize,
            onChange: function (value: number) {
                setMaxFontSize(value);
                $RvW.rvwPreferences.set("app.settings.stage.max_font_size", value);
                $RvW.rvwPreferences.commit();
            },
        });

        // @ts-ignore
        $(colorInputFGRef.current).spectrum({
            color: fgColor,
            showAlpha: false,
            showInitial: true,
            showInput: true,
            showButtons: false,
            preferredFormat: "hex",
            change: function(color: any) {
                const value = color.toHexString();
                setFgColor(value);
                $RvW.rvwPreferences.set("app.settings.stage.fg_color", value);
                $RvW.rvwPreferences.commit();
            }
        });
        // @ts-ignore
        $(colorInputBGRef.current).spectrum({
            color: bgColor,
            showAlpha: false,
            showInitial: true,
            showInput: true,
            showButtons: false,
            preferredFormat: "hex",
            change: function(color: any) {
                const value = color.toHexString();
                setBgColor(value);
                $RvW.rvwPreferences.set("app.settings.stage.bg_color", value);
                $RvW.rvwPreferences.commit();
            }
        });
    }, []);

    useEffect(() => {
        $RvW.rvwPreferences.set("app.settings.stage.layout", layout);
        $RvW.rvwPreferences.commit();
    }, [layout]);

    useEffect(() => {
        $RvW.rvwPreferences.set("app.settings.stage.window_view", svWindowView);
        $RvW.rvwPreferences.commit();
    }, [svWindowView]);

    useEffect(() => {
        $RvW.rvwPreferences.set("app.settings.stage.mini_window", svMiniWindow);
        $RvW.rvwPreferences.commit();
    }, [svMiniWindow]);

    useEffect(() => {
        $RvW.rvwPreferences.set("app.settings.stage.green_screen", svGreenWindow);
        $RvW.rvwPreferences.commit();
    }, [svGreenWindow]);

    useEffect(() => {
        $RvW.rvwPreferences.set("app.settings.stage.primary_only", primaryOnly);
        $RvW.rvwPreferences.commit();
    }, [primaryOnly]);

    useEffect(() => {
        $RvW.rvwPreferences.set("app.settings.stage.secondary_only", secondaryOnly);
        $RvW.rvwPreferences.commit();
    }, [secondaryOnly]);

    useEffect(() => {
        $RvW.rvwPreferences.set("app.settings.stage.align_left", alignLeft);
        $RvW.rvwPreferences.commit();
    }, [alignLeft]);

    useEffect(() => {
        $RvW.rvwPreferences.set("app.settings.stage.align_center", alignCenter);
        $RvW.rvwPreferences.commit();
    }, [alignCenter]);

    useEffect(() => {
        $RvW.rvwPreferences.set("app.settings.stage.align_horizontal", alignHorizontal);
        $RvW.rvwPreferences.commit();
    }, [alignHorizontal]);

    useEffect(() => {
        $RvW.rvwPreferences.set("app.settings.stage.text_outline", textOutline);
        $RvW.rvwPreferences.commit();
    }, [textOutline]);

    useEffect(() => {
        $RvW.rvwPreferences.set("app.settings.stage.text_shadow", textShadow);
        $RvW.rvwPreferences.commit();
    }, [textShadow]);

    useEffect(() => {
        $RvW.rvwPreferences.set("app.settings.stage.show_texture", showTexture);
        $RvW.rvwPreferences.commit();
    }, [showTexture]);

    useEffect(() => {
        $RvW.rvwPreferences.set("app.settings.stage.show_datetime", showDatetime);
        $RvW.rvwPreferences.commit();
    }, [showDatetime]);

    function isLowerThird() {
        return layout === StageViewStyle.LowerThird;
    }

    function isVerticalOrHorizontal() {
        return layout === StageViewStyle.Vertical || layout === StageViewStyle.Horizontal;
    }

    return (
        <>
            <div class="ui basic segment">
                <h4 class="ui dividing header">Presentation: Stage</h4>

                {/* Layout */}
                {/* TODO: make it radio btn and tab view */}
                <div class="field">
                    <label>Layout</label>

                    <select
                        id="selectStageStyle"
                        value={layout}
                        onChange={event => {
                            setLayout(parseInt((event.target as HTMLSelectElement).value))
                        }}
                    >
                        {svStyles.map(({value, label}, i) => (
                            <option key={i} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                {/* View Options */}
                <div class="field">
                    <label>View Options</label>

                    <div class="fields">
                        <div class="field">
                            <div class="ui checkbox">
                                <input
                                    type="checkbox"
                                    checked={svWindowView}
                                    onChange={(e) => setSvWindowView((e.target as HTMLInputElement).checked)}
                                />
                                <label>Window View</label>
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui checkbox">
                                <input
                                    type="checkbox"
                                    checked={svMiniWindow}
                                    onChange={(e) => setSvMiniWindow((e.target as HTMLInputElement).checked)}
                                />
                                <label>Small Window</label>
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui checkbox">
                                <input
                                    type="checkbox"
                                    checked={svGreenWindow}
                                    onChange={(e) => setSvGreenWindow((e.target as HTMLInputElement).checked)}
                                />
                                <label>Green Screen</label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sliders */}
                <div class="field">
                    <label>Style Options</label>

                    <div class="fields">
                        <div class="eight wide field">
                            {/* Opacity of the 1/3rd view strip */}
                            <label>Strip Background Opacity</label>

                            <input type="text" disabled value={opacity} />
                            <div class="h-1"></div>
                            <div class="ui range" ref={opacitySliderRef}></div>
                        </div>
                        <div class="eight wide field">
                            {/* Height of 1/3rd View */}
                            <label>Strip Height</label>

                            <input type="text" disabled value={height} />
                            <div class="h-1"></div>
                            <div class="ui range" ref={heightSliderRef}></div>
                        </div>
                    </div>

                    <div class="fields">
                        <div class="eight wide field">
                            {/* Vertical Position of 1/3rd View */}
                            <label>Vertical Position</label>

                            <input type="text" disabled value={vertPos} />
                            <div class="h-1"></div>
                            <div class="ui range" ref={vertPosSliderRef}></div>
                        </div>
                        <div class="eight wide field">
                            {/* Maximum font size 1/3rd View */}
                            <label>Maximum Font Size</label>

                            <input type="text" disabled value={maxFontSize} />
                            <div class="h-1"></div>
                            <div class="ui range" ref={maxFontSizeSliderRef}></div>
                        </div>
                    </div>

                    <div class="fields">
                        <div class="eight wide field">
                            {/* Color of Text */}
                            <label>Text Color</label>

                            <input type="text" ref={colorInputFGRef} />
                        </div>
                        <div class="eight wide field">
                            {/* Background color of strip */}
                            <label>Strip Background Color</label>

                            <input type="text" ref={colorInputBGRef} />
                        </div>
                    </div>
                </div>

                {/* View Options */}
                <div class="field">
                    {/*<label>View Options</label>*/}

                    <div class="fields">
                        <div class="field">
                            <div class="ui checkbox">
                                <input type="checkbox" checked={primaryOnly} onChange={(e) => {
                                    setPrimaryOnly((e.target as HTMLInputElement).checked);
                                    setSecondaryOnly(false);
                                }}/>
                                <label>Show primary only</label>
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui checkbox">
                                <input type="checkbox" checked={secondaryOnly} onChange={(e) => {
                                    setSecondaryOnly((e.target as HTMLInputElement).checked);
                                    setPrimaryOnly(false);
                                }}/>
                                <label>Show secondary only</label>
                            </div>
                        </div>
                    </div>

                    <div class="fields">
                        <div class="field">
                            <div class="ui checkbox">
                                <input type="checkbox" checked={alignLeft} onChange={(e) => setAlignLeft((e.target as HTMLInputElement).checked)}/>
                                <label>Align Left</label>
                            </div>
                        </div>

                        <div class="field">
                            <div class="ui checkbox">
                                <input type="checkbox" checked={alignCenter} onChange={(e) => setAlignCenter((e.target as HTMLInputElement).checked)}/>
                                <label>Align Center</label>
                            </div>
                        </div>

                        <div class="field">
                            <div class="ui checkbox">
                                <input type="checkbox" checked={alignHorizontal} onChange={(e) => setAlignHorizontal((e.target as HTMLInputElement).checked)}/>
                                <label>Align Horizontal</label>
                            </div>
                        </div>
                    </div>

                    <div class="fields">
                        <div class="field">
                            <div class="ui checkbox">
                                <input type="checkbox" checked={textOutline} onChange={(e) => setTextOutline((e.target as HTMLInputElement).checked)}/>
                                <label>Text Outline</label>
                            </div>
                        </div>

                        <div class="field">
                            <div class="ui checkbox">
                                <input type="checkbox" checked={textShadow} onChange={(e) => setTextShadow((e.target as HTMLInputElement).checked)}/>
                                <label>Text Shadow</label>
                            </div>
                        </div>
                    </div>

                    <div class="fields">
                        <div class="field">
                            <div class="ui checkbox">
                                <input type="checkbox" checked={showTexture} onChange={(e) => setShowTexture((e.target as HTMLInputElement).checked)}/>
                                <label>Add Texture</label>
                            </div>
                        </div>

                        <div class="field">
                            <div class="ui checkbox">
                                <input type="checkbox" checked={showDatetime} onChange={(e) => setShowDatetime((e.target as HTMLInputElement).checked)}/>
                                <label>Show date and time</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="h-2"></div>

                <div class="field">
                    <label>Message</label>

                    <textarea rows={4} id="stageConfigMessage"></textarea>

                    <div class="h-2"></div>

                    <div class="ui basic buttons">
                        <button id="stageMessageShow" class="ui button">Show</button>
                        <button id="stageMessageHide" class="ui button">Clear</button>
                    </div>
                </div>
            </div>
        </>
    )

}

export default function RightSettingsTab() {
    const screenSelectMain = useRef<HTMLDivElement>(null);
    const screenSelectStage = useRef<HTMLDivElement>(null);

    const availableScreens = useStoreState(availableScreensStore);

    const mainScreen = useStoreState(presentationMainScreen);
    const stageScreen = useStoreState(presentationStageScreen);

    const mainEnabled = useStoreState(presentationMainEnabled);
    const stageEnabled = useStoreState(presentationStageEnabled);

    useEffect(() => {
        console.trace('[INIT]');

        availableScreensStore.set(getAvailableScreens());

        presentationMainEnabled.set(!!$RvW.vvConfigObj.get_mainConfigEnable());
        presentationStageEnabled.set(!!$RvW.vvConfigObj.get_stageConfigEnable());

        presentationMainScreen.set($RvW.rvwPreferences.get("app.settings.screen.main.index", 1));
        presentationStageScreen.set($RvW.rvwPreferences.get("app.settings.screen.stage.index", 0));
    }, []);

    useEffect(() => {
        // always add this after the select list is populated
        // console.trace('[Main EFFECT]', ([mainScreen, stageScreen, [fontOverridePrimary, fontOverrideSecondary], availableScreens, {length: availableFonts.length}]));

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
        // console.trace('Screens.Update:', (availableScreens));

        // @ts-ignore
        $(screenSelectMain.current).dropdown('refresh'); refreshMainScreen();
        // @ts-ignore
        $(screenSelectStage.current).dropdown('refresh'); refreshStageScreen();
    }, [availableScreens]);

    useEffect(() => {
        // console.trace('Screen.Main:', (mainScreen));

        // @ts-ignore
        $(screenSelectMain.current).dropdown('set selected', mainScreen + 1);
    }, [mainScreen]);

    useEffect(() => {
        // console.trace('Screen.Stage:', (stageScreen));

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

    function onRefreshScreens() {
        const _screens = getAvailableScreens();
        availableScreensStore.set(_screens);
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
        <div class="h-full overflow-y-auto">
            <div class="ui form small">
                {/* Presentation Setup */}
                <div class="ui basic segment">
                    <h4 class="ui dividing header">Presentation Setup</h4>

                    {/* Toggle */}
                    <div class="two fields">
                        {/* Main */}
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
                        {/* Stage */}
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
                        {/* Main */}
                        <div class="field">
                            <label>Screen</label>

                            {/*<div class="ui action fluid input">*/}
                            {/*    <input class="w-0" type="text" placeholder="Search..."/>*/}
                            {/*    <div class="ui basic floating dropdown button">*/}
                            {/*        <div class="text">This Page</div>*/}
                            {/*        <i class="dropdown icon"></i>*/}
                            {/*        <div class="menu">*/}
                            {/*            <div class="item">This Organization</div>*/}
                            {/*            <div class="item">Entire Site</div>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*    <div class="ui button">Search</div>*/}
                            {/*</div>*/}

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

                        {/* Stage */}
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
                <MainPresentationSetup />

                {/* Presentation: Stage */}
                <StagePresentationSetup />
            </div>
        </div>
    )
}