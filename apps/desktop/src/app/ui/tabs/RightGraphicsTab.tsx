import {useEffect, useRef, useState} from "preact/hooks";
import {$RvW} from "@/rvw";
import Tabs from "@app/ui/Tabz";
import {console} from "@/platform/adapters/air";
import ScrollableSelect from "@app/ui/widgets/ScrollableSelect";
import {
    browseAndAddVideoClip,
    browseAndSelectFFmpeg,
    getNoClipPlaceholder,
    removeBgClipAtIndex
} from "@/graphics/videobg";
import {getFFmpegVersion} from "@/graphics/ffmpeg";

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

function BgVideoTab() {
    // $RvW.rvwPreferences.get("app.settings.addons.ffmpeg.path")
    // $RvW.rvwPreferences.get("app.settings.addons.ffmpeg.options")

    // $RvW.rvwPreferences.get("app.settings.background.video.type")
    // $RvW.rvwPreferences.get("app.settings.background.video.options")

    const [noClipPlaceholderImage] = useState(getNoClipPlaceholder());

    // TODO: move it to a store
    const [videoClips, setVideoClips] = useState(
        $RvW.rvwPreferences.get("app.settings.background.video.clips", [])
    );
    const clipItems = videoClips.map((clip) => {
        return {
            value: clip.name,
            label: clip.name,
        }
    });

    useEffect(() => {
        console.log('videoClips', videoClips);
    }, [videoClips]);

    const [selectedClip, setSelectedClip] = useState(0);

    const opacitySliderRef = useRef<HTMLInputElement>(null);

    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        // @ts-ignore
        $(opacitySliderRef.current).range({
            min: 0,
            max: 100,
            start: Math.round(opacity * 100),
            onChange: function (value, meta) {
                meta.triggeredByUser && setOpacity(value / 100);
            }
        });
    }, [])
    const [ffmpegPath, setFFmpegPath] = useState(
        $RvW.rvwPreferences.get("app.settings.addons.ffmpeg.path")
    );
    const [ffmpegVersion, setFFmpegVersion] = useState(null);
    // (() => {
    //     if (ffmpeg) {
    //         // check if the file exists
    //         return (new air.File()).resolvePath(ffmpeg).exists;
    //     }
    //
    //     return false;
    // })();

    useEffect(() => {
        updateFFmpegPath(ffmpegPath);
    }, []);

    useEffect(() => {
        let val = null;

        if (ffmpegPath && ffmpegVersion) {
            val = ffmpegPath;
        }

        console.log('ffmpegPath', val);

        $RvW.rvwPreferences.set("app.settings.addons.ffmpeg.path", val);
        $RvW.rvwPreferences.commit();
    }, [ffmpegPath, ffmpegVersion]);

    const [bgvOptions, setBgvOptions] = useState(
        $RvW.rvwPreferences.get("app.settings.background.video.options", {})
    );
    const selectedBg = isNaN(parseInt(bgvOptions.inputIndex)) ? -1 : bgvOptions.inputIndex;
    const selectedLogo = isNaN(parseInt(bgvOptions.logoInputIndex)) ? -1 : bgvOptions.logoInputIndex;

    function updateBgVideoOptions(options: Record<string, any>) {
        const nw = { ...bgvOptions, ...options };
        $RvW.rvwPreferences.set("app.settings.background.video.options", nw);
        $RvW.rvwPreferences.commit();

        setBgvOptions(nw);
    }

    function onClickPreview() {
        console.log('Preview');

        // TODO: open the video clip in a new window
    }

    function onClickAdd() {
        console.log('Add');

        browseAndAddVideoClip((index, err) => {
            if (err) {
                console.log(err);
                return;
            }

            setSelectedClip(index);
            setVideoClips(
                $RvW.rvwPreferences.get("app.settings.background.video.clips", [])
            );
        });
    }

    function onClickDelete() {
        console.log('Delete');

        removeBgClipAtIndex(selectedClip);

        if (selectedBg === selectedClip) {
            updateBgVideoOptions({
                input: null,
                inputIndex: null,
            });
        }

        if (selectedLogo === selectedClip) {
            updateBgVideoOptions({
                logoInput: null,
                logoInputIndex: null,
            });
        }

        const _clips = $RvW.rvwPreferences.get("app.settings.background.video.clips", []);
        setVideoClips(_clips);

        setSelectedClip(Math.min(selectedClip, _clips.length - 1));
    }

    function onClickSetAsBg() {
        console.log('SetAsBg');

        const item = videoClips[selectedClip];

        if (!item) {
            return;
        }

        console.log('SelectedClip', item);

        updateBgVideoOptions({
            input: item.clip,
            inputIndex: selectedClip,
        });
    }

    function onClickSetAsLogo() {
        console.log('SetAsLogo');

        const item = videoClips[selectedClip];

        if (!item) {
            return;
        }

        console.log('SelectedClip', item);

        updateBgVideoOptions({
            logoInput: item.clip,
            logoInputIndex: selectedClip,
        });
    }
    
    function setSelectedClipActive(index: number) {
        console.log('SelectedClipActive', index);
        
        setSelectedClip(index);
    }

    function updateFFmpegPath(path: string) {
        if (path) {
            setFFmpegPath(path);

            getFFmpegVersion(path, (vi, err) => {
                if (vi) {
                    console.log('FFmpeg version:', vi);

                    setFFmpegVersion(vi.join('-'));
                }

                if (err) {
                    console.error(err);
                    setFFmpegVersion(null);
                    return;
                }
            });
        } else {
            setFFmpegPath(null);
            setFFmpegVersion(null);
        }
    }

    function onSelectFFmpeg() {
        browseAndSelectFFmpeg((path, err) => {
            if (err) {
                console.error(err);
            } else {
                updateFFmpegPath(path);
            }
        });
    }

    function gotoFFmpegDownload() {
        // @ts-ignore
        air.navigateToURL(new air.URLRequest('https://ffmpeg.org/download.html'));
    }

    return (
        <>
            <div class="relative h-full">
                <div class="absolute h-full w-full overflow-hidden">
                    <div class="ui form">
                        <div class="fields h-full">
                            <div class="four wide field">
                                <div class="field flex flex-col h-full w-full">
                                    <div class="flex-[1] relative h-full w-full">
                                        <div class="absolute h-full w-full">
                                            <ScrollableSelect
                                                items={clipItems}
                                                selectedItem={selectedClip}
                                                onSelectItem={(idx) => setSelectedClipActive(idx)}
                                            />
                                        </div>
                                    </div>

                                    <div class="h-4"></div>

                                    <div className="flex-[0]">
                                        <div class="ui form">
                                            <div class="fields">
                                                <div class="field">
                                                    <div class="ui icon buttons">
                                                        <button
                                                            class="ui button"
                                                            data-tooltip="Set as Background"
                                                            data-position="top center"
                                                            data-inverted=""
                                                            onClick={onClickSetAsBg}
                                                        >
                                                            <i class="icon his his-photo"></i>
                                                        </button>
                                                        <button
                                                            class="ui button"
                                                            data-tooltip="Set as Logo"
                                                            data-position="top center"
                                                            data-inverted=""
                                                            onClick={onClickSetAsLogo}
                                                        >
                                                            <i class="icon his his-sparkles"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="field">
                                                    <div class="ui icon buttons">
                                                        <button
                                                            class="ui button"
                                                            data-tooltip="Preview"
                                                            data-position="top center"
                                                            data-inverted=""
                                                            onClick={onClickPreview}
                                                        >
                                                            <i class="play icon"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="field">
                                                    <div class="ui icon buttons">
                                                        <button
                                                            class="ui button"
                                                            data-tooltip="Add"
                                                            data-position="top center"
                                                            data-inverted=""
                                                            onClick={onClickAdd}
                                                        >
                                                            <i class="add icon"></i>
                                                        </button>
                                                        <button
                                                            class="ui red button"
                                                            data-tooltip="Delete"
                                                            data-position="top center"
                                                            data-inverted=""
                                                            onClick={onClickDelete}
                                                        >
                                                            <i class="trash icon"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="twelve wide field">
                                <div class="field flex flex-col h-full w-full">
                                    <div className="flex-[0] m-0 p-[14px]" style={{
                                        border: '1px solid rgba(34, 36, 38, .15)',
                                        borderRadius: '0.28571429rem',
                                        borderBottomRightRadius: 0,
                                        borderBottomLeftRadius: 0,
                                    }}>
                                        {/* Previews */}
                                        <div class="ui form">
                                            <div class="fields">
                                                <div class="field">
                                                    <label>Preview</label>
                                                    <img
                                                        class="ui bordered image"
                                                        style={{ borderRadius: '0.28571429rem' }}
                                                        width={240} height={135} // 16:9
                                                        alt=""
                                                        src={videoClips[selectedClip]?.preview || noClipPlaceholderImage}
                                                    />
                                                </div>
                                                <div class="field">
                                                    <label>Background</label>
                                                    <img
                                                        class="ui bordered image"
                                                        style={{ borderRadius: '0.28571429rem' }}
                                                        width={240} height={135} // 16:9
                                                        alt=""
                                                        src={videoClips[selectedBg]?.preview || noClipPlaceholderImage}
                                                    />
                                                </div>
                                                <div class="field">
                                                    <label>Logo</label>
                                                    <img
                                                        class="ui bordered image"
                                                        style={{ borderRadius: '0.28571429rem' }}
                                                        width={240} height={135} // 16:9
                                                        alt=""
                                                        src={videoClips[selectedLogo]?.preview || noClipPlaceholderImage}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex-[1] relative h-full w-full m-0" style={{
                                        border: '1px solid rgba(34, 36, 38, .15)',
                                        borderRadius: '0.28571429rem',
                                        borderTopRightRadius: 0,
                                        borderTopLeftRadius: 0,
                                        borderTop: 'none',
                                    }}>
                                        <div class="absolute h-full w-full overflow-hidden overflow-y-auto m-0 p-[14px]">
                                            <div class="ui form">
                                                <div className={`field ${!ffmpegVersion ? 'error' : ''}`}>
                                                    <label>FFmpeg</label>

                                                    <div className="ui fluid action input">
                                                        <input
                                                            type="text"
                                                            placeholder="path/to/ffmpeg/executable"
                                                            value={ffmpegPath}
                                                            onBlur={(e) => {
                                                                updateFFmpegPath(e.currentTarget.value);
                                                            }}
                                                            onKeyUp={(e) => {
                                                                if (e.keyCode === 13 /* Enter */) {
                                                                    updateFFmpegPath(e.currentTarget.value);
                                                                }
                                                            }}
                                                        />
                                                        <div className="ui button" onClick={onSelectFFmpeg}>Select</div>
                                                    </div>
                                                    {!ffmpegVersion ? (
                                                        <div class="ui pointing label">
                                                            Don't have FFmpeg?&nbsp;
                                                            <a class="text-blue hover:underline-blue" onClick={gotoFFmpegDownload}>Get it from here!</a>
                                                        </div>
                                                    ) : (
                                                        <div class="ui pointing label">
                                                            Found: {ffmpegVersion}
                                                        </div>
                                                    )}
                                                </div>

                                                <div class="h-4"></div>

                                                <div className="field">
                                                    <label>Options</label>

                                                    <div className="inline fields">
                                                        {/*<label>Mute Audio</label>*/}

                                                        <div className="field">
                                                            <div className="ui checkbox">
                                                                <input type="checkbox"/>
                                                                <label>Loop</label>
                                                            </div>
                                                        </div>
                                                        <div className="field">
                                                            <div className="ui checkbox">
                                                                <input type="checkbox"/>
                                                                <label>Mute</label>
                                                            </div>
                                                        </div>
                                                        <div className="field">
                                                            <div className="ui checkbox">
                                                                <input type="checkbox"/>
                                                                <label>Deinterlace</label>
                                                            </div>
                                                        </div>
                                                        <div className="field">
                                                            <div className="ui checkbox">
                                                                <input type="checkbox"/>
                                                                <label>Smoothing</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="field">
                                                        <label>Opacity</label>

                                                        <input type="text" disabled value={opacity} />
                                                        <div class="h-1"></div>
                                                        <div class="ui blue range" ref={opacitySliderRef}></div>
                                                    </div>

                                                    <div className="inline fields">
                                                        <label>Bitrate</label>
                                                        <div className="field">
                                                            {/* 1M */}
                                                            <div className="ui radio checkbox">
                                                                <input type="radio" name="bitrate"/>
                                                                <label>Very Low</label>
                                                            </div>
                                                        </div>
                                                        <div className="field">
                                                            {/* 10M */}
                                                            <div className="ui radio checkbox">
                                                                <input type="radio" name="bitrate" />
                                                                <label>Low</label>
                                                            </div>
                                                        </div>
                                                        <div className="field">
                                                            {/* 50M */}
                                                            <div className="ui radio checkbox">
                                                                <input type="radio" name="bitrate"/>
                                                                <label>Medium</label>
                                                            </div>
                                                        </div>
                                                        <div className="field">
                                                            {/* 100M */}
                                                            <div className="ui radio checkbox">
                                                                <input type="radio" name="bitrate"/>
                                                                <label>High</label>
                                                            </div>
                                                        </div>
                                                        <div className="field">
                                                            {/* 200M */}
                                                            <div className="ui radio checkbox">
                                                                <input type="radio" name="bitrate"/>
                                                                <label>Very High</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="inline fields">
                                                        <label>Framerate</label>
                                                        <div className="field">
                                                            {/* 24 */}
                                                            <div className="ui radio checkbox">
                                                                <input type="radio" name="framerate" />
                                                                <label>24</label>
                                                            </div>
                                                        </div>
                                                        <div className="field">
                                                            {/* 30 */}
                                                            <div className="ui radio checkbox">
                                                                <input type="radio" name="framerate" />
                                                                <label>30</label>
                                                            </div>
                                                        </div>
                                                        <div className="field">
                                                            {/* 60 */}
                                                            <div className="ui radio checkbox">
                                                                <input type="radio" name="framerate"/>
                                                                <label>60</label>
                                                            </div>
                                                        </div>
                                                        <div className="field">
                                                            {/* 120 */}
                                                            <div className="ui radio checkbox">
                                                                <input type="radio" name="framerate"/>
                                                                <label>120</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="hidden">
                <b>Select Background Video Clip</b>
                <br/>
                <select size={10} id="motionbkgnd_selectID" class="wideselectboxStyle" style="align: top">
                </select>
                <div class="style2">
                    <input type="button" id="addMotionBkgndButtonID" value=" ADD "/> |
                    <input type="button" id="delMotionBkgndButton" value=" DELETE "/>
                </div>
                <input type="checkbox" id="shadedBackgroundID"/>Shaded Background<br/>
            </div>
        </>
    );
}

const BackgroundColorTab = () => {
    const solidColorPickerRef = useRef<HTMLButtonElement>(null);

    const gradientColor1PickerRef = useRef<HTMLButtonElement>(null);
    const gradientColor2PickerRef = useRef<HTMLButtonElement>(null);
    const gradientAngleInputRef = useRef<HTMLInputElement>(null);

    const gradientPreviewRef = useRef<HTMLDivElement>(null);

    enum BackgroundType {
        SOLID = 1,
        GRADIENT = 2,
        STILL = 3,
        VIDEO = 4,
    }

    enum ColorControl {
        SOLID = 1,
        GRADIENT_1 = 2,
        GRADIENT_2 = 3,
    }

    const [selectedTab, setSelectedTab] = useState(
        $RvW.rvwPreferences.get('app.settings.background.type', BackgroundType.STILL)
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
        <div class="ui content overflow-hidden overflow-y-auto h-full flex flex-col">
            <div class="ui form flex-[0]">
                <div class="fields">
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input
                                type="radio"
                                name="background-type"
                                id="bkgnd_solid"
                                checked={selectedTab === BackgroundType.SOLID}
                                onChange={e => (e.target as HTMLInputElement).checked && setSelectedTab(BackgroundType.SOLID)}
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
                                checked={selectedTab === BackgroundType.GRADIENT}
                                onChange={e => (e.target as HTMLInputElement).checked && setSelectedTab(BackgroundType.GRADIENT)}
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
                                checked={selectedTab === BackgroundType.STILL}
                                onChange={e => (e.target as HTMLInputElement).checked && setSelectedTab(BackgroundType.STILL)}
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
                                checked={selectedTab === BackgroundType.VIDEO}
                                onChange={e => (e.target as HTMLInputElement).checked && setSelectedTab(BackgroundType.VIDEO)}
                            />
                            <label htmlFor="bkgnd_motion">Video</label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="h-4"></div>

            <div class="flex-1 overflow-y-auto h-full w-full relative">
                <div class="absolute h-full w-full m-0 p-0 overflow-hidden overflow-y-auto">
                    {/* Solid */}
                    <div
                        id="solid_bkgnddiv"
                        class={"ui tab" + (selectedTab === BackgroundType.SOLID ? ' active' : '')}
                        style={{display: (selectedTab === BackgroundType.SOLID) ? undefined : 'none'}}
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

                    {/* Gradient */}
                    <div
                        id="graident_bkgnddiv"
                        class={"ui tab" + (selectedTab === BackgroundType.GRADIENT ? ' active' : '')}
                        style={{display: (selectedTab === BackgroundType.GRADIENT) ? undefined : 'none'}}
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

                    {/* Image */}
                    <div
                        id="still_bkgnddiv"
                        class={"ui tab" + (selectedTab === BackgroundType.STILL ? ' active' : '')}
                        style={{display: (selectedTab === BackgroundType.STILL) ? undefined : 'none'}}
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

                    {/* Video BG */}
                    <div
                        id="motion_bkgnddiv"
                        class={"ui tab" + (selectedTab === BackgroundType.VIDEO ? ' active' : '')}
                        style={{display: (selectedTab === BackgroundType.VIDEO) ? undefined : 'none'}}
                    >
                        <BgVideoTab />
                    </div>
                </div>
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