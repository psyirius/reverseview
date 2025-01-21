import {useEffect, useRef, useState} from "preact/hooks";
import {$RvW} from "@/rvw";
import Tabs from "@app/ui/Tabz";
import {console} from "@/platform/adapters/air";

const TextColorTab = () => {
    enum ColorControl {
        TEXT_1 = 1,
        TEXT_2 = 2,
    }

    const colorPicker1Ref = useRef<HTMLButtonElement>(null);
    const colorPicker2Ref = useRef<HTMLButtonElement>(null);

    const [color1, setColor1] = useState(
        $RvW.rvwPreferences.get('app.settings.text.color1', '#FFFFFF')
    );
    const [color2, setColor2] = useState(
        $RvW.rvwPreferences.get('app.settings.text.color2', '#FFFFFF')
    );

    useEffect(() => {
        // @ts-ignore
        $(colorPicker1Ref.current).spectrum('set', color1);

        $RvW.rvwPreferences.set('app.settings.text.color1', color1)
        $RvW.rvwPreferences.commit()
    }, [color1]);

    useEffect(() => {
        // @ts-ignore
        $(colorPicker2Ref.current).spectrum('set', color2);

        $RvW.rvwPreferences.set('app.settings.text.color2', color2)
        $RvW.rvwPreferences.commit()
    }, [color2]);

    useEffect(() => {
        // @ts-ignore
        $(colorPicker1Ref.current).spectrum({
            color: color1,
            showAlpha: false,
            showInitial: true,
            showInput: true,
            showButtons: false,
            preferredFormat: "hex",
            change: function(color: any) {
                const v = color.toHexString();
                _setColor(v, ColorControl.TEXT_1, true);
            }
        });
        // @ts-ignore
        $(colorPicker2Ref.current).spectrum({
            color: color2,
            showAlpha: false,
            showInitial: true,
            showInput: true,
            showButtons: false,
            preferredFormat: "hex",
            change: function(color: any) {
                const v = color.toHexString();
                _setColor(v, ColorControl.TEXT_2, true);
            }
        });
    }, []);

    function _setColor(color: string, control: ColorControl, update = false) {
        color = color.toUpperCase();

        switch (control) {
            case ColorControl.TEXT_1:
                // @ts-ignore
                $(colorPicker1Ref.current).spectrum('set', color);
                update && setColor1(color);
                break;
            case ColorControl.TEXT_2:
                // @ts-ignore
                $(colorPicker2Ref.current).spectrum('set', color);
                update && setColor2(color);
                break;
        }
    }

    function onColorInput(e: Event, control: ColorControl, update = false) {
        const v = (e.target as HTMLInputElement).value;
        const color = $Y.Color.toRGB(v);
        const hex = $Y.Color.toHex(color);

        _setColor(hex, control, update);
    }

    function onColorInputBlur(e: Event, control: ColorControl) {
        onColorInput(e, control, true);
    }

    function onColorInputKeyUp(e: KeyboardEvent, control: ColorControl) {
        if (e.keyCode === 13 /* Enter */) {
            onColorInput(e, control, true);
        }
    }

    function onColorReset(control: ColorControl) {
        let color = "#000000";
        switch (control) {
            case ColorControl.TEXT_1:
                color = "#ffffff";
                break;
            case ColorControl.TEXT_2:
                color = "#ffffff";
                break;
        }

        _setColor(color, control, true);
    }

    return (
        <div class="ui form">
            <h4 class="ui dividing header">Text Colors</h4>

            <div class="field">
                <label>Primary</label>

                <div class="ui action input">
                    <input
                        type="text"
                        value={color1}
                        onInput={e => onColorInput(e, ColorControl.TEXT_1)}
                        onBlur={e => onColorInputBlur(e, ColorControl.TEXT_1)}
                        onKeyUp={e => onColorInputKeyUp(e, ColorControl.TEXT_1)}
                    />
                    <button
                        class="ui right icon button"
                        style={{
                            borderStyle: 'solid',
                            borderWidth: '1px',
                            borderColor: 'rgba(34, 36, 38, 0.148438)',
                            backgroundColor: color1,
                        }}
                        ref={colorPicker1Ref}
                    >
                        <i class="icon"></i>
                    </button>
                    <button
                        class="ui icon button"
                        onClick={() => onColorReset(ColorControl.TEXT_1)}
                        data-tooltip="Reset">
                        <i class="undo icon"></i>
                    </button>
                </div>
            </div>

            <div class="field">
                <label>Secondary</label>

                <div class="ui action input">
                    <input
                        type="text"
                        value={color2}
                        onInput={e => onColorInput(e, ColorControl.TEXT_2)}
                        onBlur={e => onColorInputBlur(e, ColorControl.TEXT_2)}
                        onKeyUp={e => onColorInputKeyUp(e, ColorControl.TEXT_2)}
                    />
                    <button
                        class="ui right icon button"
                        style={{
                            borderStyle: 'solid',
                            borderWidth: '1px',
                            borderColor: 'rgba(34, 36, 38, 0.148438)',
                            backgroundColor: color2,
                        }}
                        ref={colorPicker2Ref}
                    >
                        <i class="icon"></i>
                    </button>
                    <button
                        class="ui icon button"
                        onClick={() => onColorReset(ColorControl.TEXT_2)}
                        data-tooltip="Reset">
                        <i class="undo icon"></i>
                    </button>
                </div>
            </div>
        </div>
    )
};

const randomColor = () => {
    let v = Math.floor(Math.random() * 0xff_ff_ff).toString(16);
    while (v.length < 6) {
        v = '0' + v;
    }
    return '#' + v;
}

const randomOrientation = () => {
    return Math.floor(Math.random() * 360);
}

const angleToCartesianCoords = (angle: number) => {
    // Normalize angle to be between 0 and 360
    angle = angle % 360;
    if (angle < 0) {
        angle += 360;
    }

    // Convert angle to a coordinate space where
    // 0,0 is top-left and 100,100 is bottom-right
    const radian = (angle * Math.PI) / 180;
    const x = Math.cos(radian);
    const y = Math.sin(radian);

    // Calculate start and end points
    const startX = (50 * (1 - x)).toFixed(2) + '%';
    const startY = (50 * (1 + y)).toFixed(2) + '%';
    const endX = (50 * (1 + x)).toFixed(2) + '%';
    const endY = (50 * (1 - y)).toFixed(2) + '%';

    // Return formatted gradient string
    return `${startX} ${startY}, ${endX} ${endY}`;
}

const BackgroundColorTab = () => {
    const solidColorPickerRef = useRef<HTMLButtonElement>(null);

    const gradientColor1PickerRef = useRef<HTMLButtonElement>(null);
    const gradientColor2PickerRef = useRef<HTMLButtonElement>(null);
    const gradientAngleInputRef = useRef<HTMLInputElement>(null);

    const gradientPreviewRef = useRef<HTMLDivElement>(null);

    enum BgType {
        SOLID = 1,
        GRADIENT = 2,
        STILL = 3,
        MOTION = 4,
    }

    enum ColorControl {
        SOLID = 1,
        GRADIENT_1 = 2,
        GRADIENT_2 = 3,
    }

    const [selectedTab, setSelectedTab] = useState(
        $RvW.rvwPreferences.get('app.settings.background.type', BgType.STILL)
    );

    const [solidColor, setSolidColor] = useState(
        $RvW.vvConfigObj.get_p_solidBkgndColor()
    );

    const [gradientColor1, setGradientColor1] = useState(
        $RvW.vvConfigObj.get_p_bkgnd_color1()
    );
    const [gradientColor2, setGradientColor2] = useState(
        $RvW.vvConfigObj.get_p_bkgnd_color2()
    );
    const [gradientAngle, setGradientAngle] = useState(
        $RvW.vvConfigObj.get_p_bkgnd_grad_orient()
    );

    useEffect(() => {
        $RvW.rvwPreferences.set('app.settings.background.type', selectedTab)
        $RvW.rvwPreferences.commit();
    }, [selectedTab]);

    useEffect(() => {
        // @ts-ignore
        $(solidColorPickerRef.current).spectrum({
            color: solidColor,
            showAlpha: false,
            showInitial: true,
            showInput: true,
            showButtons: false,
            preferredFormat: "hex",
            change: function(color: any) {
                const v = color.toHexString();
                _setColor(v, ColorControl.SOLID, true);
            },
        });

        /* ------------------------------------------------ */

        // @ts-ignore
        $(gradientColor1PickerRef.current).spectrum({
            color: gradientColor1,
            showAlpha: false,
            showInitial: true,
            showInput: true,
            showButtons: false,
            preferredFormat: "hex",
            change: function(color: any) {
                const v = color.toHexString();
                _setColor(v, ColorControl.GRADIENT_1, true);
            },
        });

        // @ts-ignore
        $(gradientColor2PickerRef.current).spectrum({
            color: gradientColor2,
            showAlpha: false,
            showInitial: true,
            showInput: true,
            showButtons: false,
            preferredFormat: "hex",
            change: function(color: any) {
                const v = color.toHexString();
                _setColor(v, ColorControl.GRADIENT_2, true);
            },
        });

        // @ts-ignore
        $(gradientAngleInputRef.current).range({
            min: 0,
            max: 360,
            start: gradientAngle,
            onChange: function (value, meta) {
                meta.triggeredByUser && setGradientAngle(value);
            }
        });
    }, []);

    useEffect(() => {
        $RvW.vvConfigObj.set_p_solidBkgndColor(solidColor);
        $RvW.vvConfigObj.save();
    }, [solidColor]);

    useEffect(() => {
        $RvW.vvConfigObj.set_p_bkgnd_color1(gradientColor1);
        $RvW.vvConfigObj.save();
    }, [gradientColor1]);

    useEffect(() => {
        $RvW.vvConfigObj.set_p_bkgnd_color2(gradientColor2);
        $RvW.vvConfigObj.save();
    }, [gradientColor2]);

    useEffect(() => {
        // @ts-ignore
        $(gradientAngleInputRef.current).range('set value', gradientAngle);
        $RvW.vvConfigObj.set_p_bkgnd_grad_orient(gradientAngle);
        $RvW.vvConfigObj.save();
    }, [gradientAngle]);

    useEffect(() => {
        renderGradientPreview();
    }, [
        gradientColor1,
        gradientColor2,
        gradientAngle,
    ]);

    function renderGradientPreview() {
        const el = gradientPreviewRef.current;

        const color_start = gradientColor1;
        const color_end = gradientColor2;
        const angle = gradientAngle;

        // -webkit-gradient(linear, 0% 0%, 0% 100%, from(#265071), to(#439AC1))

        // TODO: multi color stops
        const type = 'linear'; // linear

        let gradient = `-webkit-gradient(${type}, `;

        gradient += angleToCartesianCoords(angle);

        gradient += `, from(${color_start}), to(${color_end}))`;

        // supports
        // gradient = '-webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(249,252,246,1)), color-stop(100%,rgba(187,230,191,1)))';

        el.style.backgroundImage = 'url()'; // reset first (hack for the air webkit bug)
        el.style.backgroundImage = gradient;
    }

    function _setColor(color: string, control: ColorControl, update = false) {
        color = color.toUpperCase();

        switch (control) {
            case ColorControl.SOLID:
                // @ts-ignore
                $(solidColorPickerRef.current).spectrum('set', color);
                update && setSolidColor(color);
                break;
            case ColorControl.GRADIENT_1:
                // @ts-ignore
                $(gradientColor1PickerRef.current).spectrum('set', color);
                update && setGradientColor1(color);
                break;
            case ColorControl.GRADIENT_2:
                // @ts-ignore
                $(gradientColor2PickerRef.current).spectrum('set', color);
                update && setGradientColor2(color);
                break;
        }
    }

    function onColorInput(e: Event, control: ColorControl, update = false) {
        const v = (e.target as HTMLInputElement).value;
        const color = $Y.Color.toRGB(v);
        const hex = $Y.Color.toHex(color);

        _setColor(hex, control, update);
    }

    function onColorInputBlur(e: Event, control: ColorControl) {
        onColorInput(e, control, true);
    }

    function onColorInputKeyUp(e: KeyboardEvent, control: ColorControl) {
        if (e.keyCode === 13 /* Enter */) {
            onColorInput(e, control, true);
        }
    }

    function onColorReset(control: ColorControl) {
        let color = "#ffffff";
        switch (control) {
            case ColorControl.SOLID:
                color = "#ffffff";
                break;
            case ColorControl.GRADIENT_1:
                color = "#000000";
                break;
            case ColorControl.GRADIENT_2:
                color = "#ffffff";
                break;
        }

        _setColor(color, control, true);
    }

    function onGradientRandomize() {
        _setColor(randomColor(), ColorControl.GRADIENT_1, true);
        _setColor(randomColor(), ColorControl.GRADIENT_2, true);
        setGradientAngle(randomOrientation());
    }

    function onGradientReset() {
        _setColor("#000000", ColorControl.GRADIENT_1, true);
        _setColor("#ffffff", ColorControl.GRADIENT_2, true);
        setGradientAngle(0);
    }

    return (
        <div class="ui content overflow-hidden overflow-y-auto h-full">
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

                            <div class="ui action input">
                                <input
                                    type="text"
                                    value={solidColor}
                                    onInput={e => onColorInput(e, ColorControl.SOLID)}
                                    onBlur={e => onColorInputBlur(e, ColorControl.SOLID)}
                                    onKeyUp={e => onColorInputKeyUp(e, ColorControl.SOLID)}
                                />
                                <button
                                    class="ui right icon button"
                                    style={{
                                        borderStyle: 'solid',
                                        borderWidth: '1px',
                                        borderColor: 'rgba(34, 36, 38, 0.148438)',
                                        backgroundColor: solidColor,
                                    }}
                                    ref={solidColorPickerRef}
                                >
                                    <i class="icon"></i>
                                </button>
                                <button
                                    class="ui icon button"
                                    onClick={() => onColorReset(ColorControl.SOLID)}
                                    data-tooltip="Reset">
                                    <i class="undo icon"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                id="graident_bkgnddiv"
                class={"ui tab" + (selectedTab === BgType.GRADIENT ? ' active' : '')}
                style={{display: (selectedTab === BgType.GRADIENT) ? undefined : 'none'}}
            >
                <div class="ui form">
                    <div class="field">
                        <label>Gradient</label>

                        <div class="ui card">
                            <div class="image" ref={gradientPreviewRef} style={{height: '160px'}}></div>

                            <div class="content">
                                <div class="ui form">
                                    <div class="field">
                                        <label>Start</label>

                                        <div class="ui action input">
                                            <input
                                                type="text"
                                                value={gradientColor1}
                                                onInput={e => onColorInput(e, ColorControl.GRADIENT_1)}
                                                onBlur={e => onColorInputBlur(e, ColorControl.GRADIENT_1)}
                                                onKeyUp={e => onColorInputKeyUp(e, ColorControl.GRADIENT_1)}
                                            />
                                            <button
                                                class="ui right icon button"
                                                style={{
                                                    borderStyle: 'solid',
                                                    borderWidth: '1px',
                                                    borderColor: 'rgba(34, 36, 38, 0.148438)',
                                                    backgroundColor: gradientColor1,
                                                }}
                                                ref={gradientColor1PickerRef}
                                            >
                                                <i class="icon"></i>
                                            </button>
                                            <button
                                                class="ui icon button"
                                                onClick={() => onColorReset(ColorControl.GRADIENT_1)}
                                                data-tooltip="Reset"
                                            >
                                                <i class="undo icon"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="field">
                                        <label>End</label>

                                        <div class="ui action input">
                                            <input
                                                type="text"
                                                value={gradientColor2}
                                                onInput={e => onColorInput(e, ColorControl.GRADIENT_2)}
                                                onBlur={e => onColorInputBlur(e, ColorControl.GRADIENT_2)}
                                                onKeyUp={e => onColorInputKeyUp(e, ColorControl.GRADIENT_2)}
                                            />
                                            <button
                                                class="ui right icon button"
                                                style={{
                                                    borderStyle: 'solid',
                                                    borderWidth: '1px',
                                                    borderColor: 'rgba(34, 36, 38, 0.148438)',
                                                    backgroundColor: gradientColor2,
                                                }}
                                                ref={gradientColor2PickerRef}
                                            >
                                                <i class="icon"></i>
                                            </button>
                                            <button
                                                class="ui icon button"
                                                onClick={() => onColorReset(ColorControl.GRADIENT_2)}
                                                data-tooltip="Reset"
                                            >
                                                <i class="undo icon"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="extra content">
                                <div class="field">
                                    <label>Angle</label>

                                    <div class="ui input fluid">
                                        <div class="ui blue range" ref={gradientAngleInputRef}></div>
                                    </div>
                                </div>
                            </div>
                            <div class="ui bottom attached buttons">
                                <button class="ui button fluid" onClick={onGradientRandomize}>
                                    <i class="sync icon"></i>
                                    Randomize
                                </button>
                                <button class="ui button fluid" onClick={onGradientReset}>
                                    <i class="undo icon"></i>
                                    Reset
                                </button>
                            </div>
                        </div>
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
                        <div class="ui segment top attached">
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

                        {/* Gallery */}
                        <div class="ui segment bottom attached">
                            <div id="still_bkgnd_grid" style={{overflowY: 'auto'}}>
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
    )
};

export default function RightGraphicsTab() {
    const tabs = [
        {title: 'Text', content: TextColorTab},
        {title: 'Background', content: BackgroundColorTab},
    ]

    return (
        <div class="h-full">
            <div class="ui content">
                <Tabs tabs={tabs} initialSelected={1}/>
            </div>
        </div>
    )
}