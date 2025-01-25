import {presentationCtx} from "@app/presentation";
import {$RvW} from "@/rvw";
import {console} from "@/platform/adapters/air";
import {
    presentationPrimaryFontOverride,
    presentationMainEnabled,
    presentationStageEnabled,
    presentationSecondaryFontOverride
} from "@stores/global";
import {loadInstalledFonts} from "@app/main";
import {StageViewStyle} from "@app/ui/tabs/RightSettingsTab";
import {getPrimaryBibleVersion, getSecondaryBibleVersion} from "@/bible/version";

$RvW.presentWindowOpen = false;
$RvW.presentationContent = '';
$RvW.stageView = false;

// Presentation Window
$RvW.presentationWindow = null;
// Stage View Window
$RvW.stageWindow = null;

let pWindowX = "100";
let pWindowY = "100";

let stageViewWindowX = "100";
let stageViewWindowY = "100";

const dualScreen = true;

let stageViewScreenIndex = 2;
let index_for_presentationContent = 0;

function presentationContentString(d, b, f, c, a) {
    if (c === "" && a === "") {
        return "";
    }
    return `${d}<newelement>${b}<newelement>${f}<newelement>${c}<newelement>${a}`;
}

// this sets the variables in the presentation window global context
// this is not a class
// TODO: make it unambiguous
function passVariable(isStageView, _ = undefined) {
    _ ??= this.ctx; // this => is global of the holding context

    $RvW.presentationContent = presentationContentString(
        presentationCtx.p_title,
        presentationCtx.p_text1_font,
        presentationCtx.p_text2_font,
        presentationCtx.p_text1_arr[presentationCtx.p_current_index],
        presentationCtx.p_text2_arr[presentationCtx.p_current_index]
    );
    presentationCtx.p_text_orientation = $RvW.vvConfigObj.get_p_text_orientation();
    index_for_presentationContent = presentationCtx.p_current_index;
    _.p_text1_arr = presentationCtx.p_text1_arr;
    _.p_text2_arr = presentationCtx.p_text2_arr;
    _.p_text1_font = presentationPrimaryFontOverride.get() || presentationCtx.p_text1_font;
    _.p_text2_font = presentationSecondaryFontOverride.get() || presentationCtx.p_text2_font;
    _.p_title = presentationCtx.p_title;
    _.p_footnote = presentationCtx.p_footer;
    _.p_current_index = presentationCtx.p_current_index;
    _.p_last_index = presentationCtx.p_last_index;
    _.p_ffmpeg = {
        path: $RvW.rvwPreferences.get("app.settings.addons.ffmpeg.path"),
        options: $RvW.rvwPreferences.get("app.settings.addons.ffmpeg.options"),
    };
    _.p_bg_video = {
        type: $RvW.rvwPreferences.get("app.settings.background.video.type"),
        mode: presentationCtx.p_logo_mode ? "logo" : "background",
        options: $RvW.rvwPreferences.get("app.settings.background.video.options"),
    };
    _.p_bkgnd_filename = presentationCtx.p_bkgnd_filename;
    _.p_bkgnd_motion = presentationCtx.p_bkgnd_motion;
    _.p_bkgnd_color = $RvW.vvConfigObj.get_p_solidBkgndColor();
    _.p_format_multiplelines = $RvW.vvConfigObj.get_pformat_multiplelines();
    if (isStageView === 1) {
        const textColor = $RvW.rvwPreferences.get("app.settings.stage.fg_color");
        _.p_font_color = textColor;
        _.p_font_color2 = textColor;
    } else {
        _.p_font_color = presentationCtx.p_font_color;
        _.p_font_color2 = presentationCtx.p_font_color2;
    }
    _.p_bkgnd_color1 = $RvW.vvConfigObj.get_p_bkgnd_color1();
    _.p_bkgnd_color2 = $RvW.vvConfigObj.get_p_bkgnd_color2();
    _.p_bkgnd_grad_orient = $RvW.vvConfigObj.get_p_bkgnd_grad_orient();
    _.p_motion_bkgnd_index = $RvW.vvConfigObj.get_p_motion_bkgnd_index();
    _.p_bkgnd_type = $RvW.rvwPreferences.get('app.settings.background.type');

    {
        if (isStageView === 1) {
            let layout = $RvW.rvwPreferences.get("app.settings.stage.layout");
            if (layout === StageViewStyle.LowerThird) {
                layout = "3";
            } else if (presentationCtx.p_text_orientation === "2") {
                layout = "2";
            }
            const opacity = $RvW.rvwPreferences.get("app.settings.stage.opacity");
            const height = $RvW.rvwPreferences.get("app.settings.stage.height");
            const primaryOnly = $RvW.rvwPreferences.get("app.settings.stage.primary_only");
            const secondaryOnly = $RvW.rvwPreferences.get("app.settings.stage.secondary_only");
            const bgColor = $RvW.rvwPreferences.get("app.settings.stage.bg_color");
            const position = $RvW.rvwPreferences.get("app.settings.stage.position");
            const maxFontSize = $RvW.rvwPreferences.get("app.settings.stage.max_font_size");
            const textOutline = $RvW.rvwPreferences.get("app.settings.stage.text_outline");
            const textShadow = $RvW.rvwPreferences.get("app.settings.stage.text_shadow");
            const greenScreen = $RvW.rvwPreferences.get("app.settings.stage.green_screen");
            const alignLeft = $RvW.rvwPreferences.get("app.settings.stage.align_left");
            const alignCenter = $RvW.rvwPreferences.get("app.settings.stage.align_center");
            const addTexture = $RvW.rvwPreferences.get("app.settings.stage.show_texture");
            const showHorizontal = $RvW.rvwPreferences.get("app.settings.stage.align_horizontal");

            _.p_text_orientation = [
                layout,
                opacity,
                height,
                primaryOnly,
                secondaryOnly,
                bgColor,
                position,
                maxFontSize,
                textOutline,
                textShadow,
                greenScreen,
                alignLeft,
                alignCenter,
                addTexture,
                showHorizontal,
            ];
        } else {
            _.p_text_orientation = presentationCtx.p_text_orientation;
        }
    }

    _.p_window_X = pWindowX;
    _.p_window_Y = pWindowY;
    if (isStageView === 1) {
        _.p_window_X = stageViewWindowX;
        _.p_window_Y = stageViewWindowY;
    }
    _.p_topMargin = $RvW.vvConfigObj.get_p_topMargin();
    _.p_bottomMargin = $RvW.vvConfigObj.get_p_bottomMargin();
    _.p_leftMargin = $RvW.vvConfigObj.get_p_leftMargin();
    _.p_rightMargin = $RvW.vvConfigObj.get_p_rightMargin();
    _.p_maxFontSize = $RvW.vvConfigObj.get_p_maxFontSize();
    _.p_enableTransition = $RvW.vvConfigObj.get_p_enableTransition();
    _.p_showTitle = $RvW.vvConfigObj.get_p_showTitle();
    _.p_enableStroke = $RvW.vvConfigObj.get_p_enableStroke();
    _.p_enableShadow = $RvW.vvConfigObj.get_p_enableShadow();
    _.p_enableFooter = $RvW.vvConfigObj.get_p_enableFooter();
    _.p_align = $RvW.vvConfigObj.get_p_align();
    _.p_enableGestures = $RvW.rvwPreferences.get("app.settings.main.enable_gestures");

    console.trace(`p_enableTransition: ${_.p_enableTransition}`);

    if ($RvW.vvConfigObj.get_showVVLogo()) {
        _.p_brandingText = ["ReVerseVIEW", "rvw.pages.dev"].join("<br>");
    } else {
        _.p_brandingText = `${$RvW.vvConfigObj.get_logoText1()}<br>${$RvW.vvConfigObj.get_logoText2()}`;
    }
    if (isStageView === 1) {
        _.p_showDate = $RvW.vvConfigObj.get_svShowDate();
    } else {
        _.p_showDate = $RvW.vvConfigObj.get_showDateTime();
    }
    _.p_showBranding = $RvW.vvConfigObj.get_showVVLogo() || $RvW.vvConfigObj.get_showCustomLogo();
    _.p_shadeBackground = $RvW.graphicsObj.getShadeFlag();
    _.p_transparentBackground = $RvW.graphicsObj.getTransparentFlag();
    _.p_ver1ScaleFactor = presentationCtx.p_ver1ScaleFactor;
    _.p_ver2ScaleFactor = presentationCtx.p_ver2ScaleFactor;
    _.p_isArabic1 = false;
    _.p_isArabic2 = false;
    {
        const t = getPrimaryBibleVersion().name;
        const u = t.indexOf("Arabic");
        if (u !== -1) {
            _.p_isArabic1 = true;
        }
    }
    {
        const t = getSecondaryBibleVersion().name;
        const u = t.indexOf("Arabic");
        if (u !== -1) {
            _.p_isArabic2 = true;
        }
    }

    console.log('[>>> passVariable <<<]:', {
        stageview: isStageView,
        data: _,
    });

    $RvW.webServerObj.broadcastWS({
        event: 'presentation-update',
        type: Number(isStageView),
        data: _,
    });
}

function getCurrentScreen() {
    const a = air.Screen.getScreensForRectangle(window.nativeWindow.bounds);
    return a.length > 0 ? a[0] : air.Screen.mainScreen;
}


export function getAvailableFonts() {
    return $RvW.systemFontList.concat([
        ...loadInstalledFonts().map((font) => font.fontName),
    ]).map((fontName) => ({
        name: fontName,
        value: fontName,
    }));
}

export function getAvailableScreens() {
    const result = []

    {
        function isSameRect(rect1, rect2) {
            return rect1.height === rect2.height &&
                rect1.width === rect2.width &&
                rect1.x === rect2.x &&
                rect1.y === rect2.y;
        }

        function isSameScreen(screen1, screen2) {
            return isSameRect(screen1.bounds, screen2.bounds);
        }

        const { Screen } = air;
        const { mainScreen, screens } = Screen;

        for (let i = 0; i < screens.length; i++) {
            const { bounds } = screens[i];
            const { height, width, x, y } = bounds;
            const isPrimary = isSameScreen(screens[i], mainScreen);
            const main = isPrimary ? " (main)" : "";

            const name = `Screen ${i + 1}${main}: ${width}x${height} @ ${x},${y}`;

            result.push({ name, value: i + 1, height, width, x, y, primary: isPrimary });
        }
    }

    return result;
}

/**
 * Called when the user clicks the "Presentation" button
 *
 * Creates the presentation window and the stage view window
 * If the windows are already open, updates the content
 *
 * @returns {void}
 * */
export function presentation() {
    $RvW.stageView = presentationStageEnabled.get();

    const windowInitOptions = new air.NativeWindowInitOptions();
    windowInitOptions.systemChrome = "none";
    windowInitOptions.type = "lightweight";
    windowInitOptions.transparent = true;

    getCurrentScreen();

    const screens = air.Screen.screens;
    let presentScreenBounds;
    stageViewScreenIndex = $RvW.rvwPreferences.get("app.settings.screen.stage.index", 0);
    if (screens[stageViewScreenIndex] == null) {
        stageViewScreenIndex = 0;
        $RvW.rvwPreferences.set("app.settings.screen.stage.index", stageViewScreenIndex);
    }
    $RvW.stageView = $RvW.stageView && screens[stageViewScreenIndex] != null;

    let presentScreenIndex = $RvW.rvwPreferences.get("app.settings.screen.main.index", 1);
    if (screens[presentScreenIndex] == null) {
        presentScreenIndex = 0;
    }

    if (dualScreen && screens[presentScreenIndex] != null) {
        presentScreenBounds = screens[presentScreenIndex].bounds;
        pWindowX = screens[presentScreenIndex].bounds.width;
        pWindowY = screens[presentScreenIndex].bounds.height;
    } else {
        presentScreenBounds = screens[0].bounds;
        pWindowX = screens[0].bounds.width;
        pWindowY = screens[0].bounds.height;
        console.trace(`p window single ${pWindowX}x${pWindowY}`);
    }

    if (!$RvW.presentWindowOpen) {
        $RvW.presentationWindow = air.HTMLLoader.createRootWindow(true, windowInitOptions, true, presentScreenBounds);
        $RvW.presentationWindow.visible = presentationMainEnabled.get();
        $RvW.presentationWindow.addEventListener("htmlDOMInitialize", DOMIntializeCallback);

        $RvW.presentationWindow.window.nativeWindow.addEventListener(
            air.Event.CLOSE,
            presentWindowClosed
        );

        $RvW.presentationWindow.window.nativeWindow.alwaysInFront = $RvW.vvConfigObj.get_presentationOnTop();
        $RvW.presentationWindow.window.nativeWindow.stage.frameRate = 60;
        $RvW.presentationWindow.load(new air.URLRequest("presentation.html"));

        // define the global functions in the presentation window
        $RvW.presentationWindow.window.onWindowUnload = function () {
            if ($RvW.stageView && $RvW.stageWindow != null) {
                $RvW.stageWindow.window.nativeWindow.close();
            }
        };
        $RvW.presentationWindow.window.goToNextSlide = function () {
            if ($RvW.stageView && $RvW.stageWindow != null) {
                $RvW.stageWindow.window.nextSlide();
            }
            updatePresentationContent(true);
        };
        $RvW.presentationWindow.window.goToPrevSlide = function () {
            if ($RvW.stageView && $RvW.stageWindow != null) {
                $RvW.stageWindow.window.prevSlide();
            }
            updatePresentationContent(false);
        };
        $RvW.presentationWindow.window.log = function () {
            const args = Array.prototype.slice.call(arguments);
            args.unshift("[Presentation]:");
            console.log(...args);
        };
        // end of global functions

        if ($RvW.stageView) {
            const { NativeWindowInitOptions, HTMLLoader, Event, URLRequest } = air;

            const windowInitOptions = new NativeWindowInitOptions();
            const svWindow = $RvW.rvwPreferences.get("app.settings.stage.window_view");
            const svStayOnTop = $RvW.rvwPreferences.get("app.settings.stage.stay_on_top");
            const svBounds = screens[stageViewScreenIndex].bounds;
            if (svWindow) {
                const mini = $RvW.rvwPreferences.get("app.settings.stage.mini_window");
                const framed = $RvW.rvwPreferences.get("app.settings.stage.framed_window");
                const transparent = $RvW.rvwPreferences.get("app.settings.stage.transparent_window");

                if (screens[stageViewScreenIndex].bounds.width < 1900) {
                    svBounds.width = 1280 / 2;
                    svBounds.height = 720 / 2;
                } else {
                    svBounds.width = 1280;
                    svBounds.height = 720;
                }
                if (mini) {
                    svBounds.width /= 1.5;
                    svBounds.height /= 1.5;
                }

                windowInitOptions.systemChrome = (!framed || transparent) ? "none" : "standard";
                windowInitOptions.transparent = transparent;
                windowInitOptions.resizable = false;
                windowInitOptions.maximizable = false;
                windowInitOptions.minimizable = false;
                // windowInitOptions.type = windowInitOptions.systemChrome === 'none' ? 'lightweight' : 'utility';
            } else {
                // full screen
                windowInitOptions.systemChrome = "none";
                windowInitOptions.type = "lightweight";
                windowInitOptions.transparent = true;
                windowInitOptions.renderMode = "direct";
            }

            stageViewWindowX = screens[stageViewScreenIndex].bounds.width;
            stageViewWindowY = screens[stageViewScreenIndex].bounds.height;

            const sv = $RvW.stageWindow = HTMLLoader.createRootWindow(
                true, windowInitOptions, true, svBounds,
            );
            sv.addEventListener("htmlDOMInitialize", DOMIntializeStageViewCallback);
            sv.window.nativeWindow.addEventListener(Event.CLOSING, call_closePresentation);
            sv.window.nativeWindow.alwaysInFront = svStayOnTop;
            sv.window.nativeWindow.stage.frameRate = 60;

            sv.load(new URLRequest("app:/stageview.html"));

            //             {
            //                 const loader = sv;
            //
            //                 // loader.placeLoadStringContentInApplicationSandbox = true;
            //
            //                 // loader.load(new air.URLRequest("http://localhost:80/uix.html"));
            //
            //                 const sandboxWrapperHtml = `
            // <html lang="en">
            // <head>
            //     <script type="text/javascript" charset="utf-8">
            //         alert(typeof window.runtime);
            //         throw new Error("Boool");
            //     </script>
            // </head>
            // <body></body>
            // </html>
            // `;
            //
            //                 loader.loadString(sandboxWrapperHtml.trim());
            //             }

            sv.window.onWindowUnload = function () {
                if ($RvW.presentationWindow != null) {
                    $RvW.presentationWindow.window.nativeWindow.close();
                }
            };
            sv.window.log = function () {
                const args = Array.prototype.slice.call(arguments);
                args.unshift("[StageView]:");
                console.log(...args);
            };
        } else {
            $RvW.stageWindow = null;
        }

        $RvW.presentWindowOpen = true;
    } else {
        // if the window is already open, just update the content

        // Presentation
        try {
            $RvW.presentationWindow.window.passVariable(0);
            $RvW.presentationWindow.window.updatePresentation();
            $RvW.presentationWindow.window.updateContent();
        } catch (d) {
            console.trace("Possible double click... NewWindow is still getting ready..");
        }

        // StageView
        if ($RvW.stageView && $RvW.stageWindow != null) {
            try {
                $RvW.stageWindow.window.passVariable(1);
                $RvW.stageWindow.window.updatePresentation();
                $RvW.stageWindow.window.updateContent();
            } catch (d) {
                console.trace(
                    "Possible double click... NewStageWindow is still getting ready.."
                );
            }
        }
    }
}

export function call_closePresentation() {
    $RvW.webServerObj.broadcastWS({event: 'cc:close-show'});
    if ($RvW.presentWindowOpen) {
        $RvW.presentationWindow.window.clearPresenter();
        $RvW.presentationWindow.window.nativeWindow.close();
        $RvW.presentationWindow = null;
        if (!$RvW.vvConfigObj.get_mainConfigEnable()) {
            $RvW.presentWindowOpen = false;
        }
    }
    if ($RvW.stageView && $RvW.stageWindow != null) {
        $RvW.stageWindow.window.nativeWindow.close();
        $RvW.stageWindow = null;
    }
    $RvW.presentationContent = "";
}

export function presentWindowClosed() {
    $RvW.presentWindowOpen = false;
    $RvW.presentationWindow = null;
}


function DOMIntializeCallback(a) {
    $RvW.presentationWindow.window.passVariable = passVariable;
    console.trace('>>> presentationWindow.htmlDOMInitialize')
}

function DOMIntializeStageViewCallback(a) {
    $RvW.stageWindow.window.passVariable = passVariable;
    console.trace('>>> stageWindow.htmlDOMInitialize')
}

function updatePresentationContent(b) {
    const a = presentationCtx.p_text1_arr.length;

    if (b) {
        index_for_presentationContent++;
        if (index_for_presentationContent >= a) {
            index_for_presentationContent = 0;
        }
    } else {
        index_for_presentationContent--;
        if (index_for_presentationContent < 0) {
            index_for_presentationContent = a - 1;
        }
    }

    $RvW.presentationContent = presentationContentString(
        presentationCtx.p_title,
        presentationCtx.p_text1_font,
        presentationCtx.p_text2_font,
        presentationCtx.p_text1_arr[index_for_presentationContent],
        presentationCtx.p_text2_arr[index_for_presentationContent]
    );
}

export function call_nextSlide() {
    $RvW.webServerObj.broadcastWS({event: 'cc:next-slide'});
    if ($RvW.presentWindowOpen) {
        $RvW.presentationWindow.window.nextSlide();
        if ($RvW.stageView) {
            $RvW.stageWindow.window.nextSlide();
        }
    }
    updatePresentationContent(true);
}

export function call_prevSlide() {
    $RvW.webServerObj.broadcastWS({event: 'cc:prev-slide'});
    if ($RvW.presentWindowOpen) {
        $RvW.presentationWindow.window.prevSlide();
        if ($RvW.stageView) {
            $RvW.stageWindow.window.prevSlide();
        }
    }
    updatePresentationContent(false);
}