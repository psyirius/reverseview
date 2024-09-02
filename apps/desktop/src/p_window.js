import {clearSelectList, presentationContentString} from "@app/common";
import {presentationCtx} from "@app/presentation";
import {disableNavButtons} from "@/navigation";
import {$RvW} from "@/rvw";

$RvW.presentWindowOpen = false;
$RvW.presentationContent = '';
$RvW.stageView = false;

// Presentation Window
$RvW.presentationWindow = null;
// Stage View Window
$RvW.stageWindow = null;

var pWindowX = "100";
var pWindowY = "100";
var stageViewWindowX = "100";
var stageViewWindowY = "100";
var dualScreen = true;
var stageViewScreenIndex = 2;
var index_for_presentationContent = 0;

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
    index_for_presentationContent = presentationCtx.p_current_index;
    _.p_text1_arr = presentationCtx.p_text1_arr;
    _.p_text2_arr = presentationCtx.p_text2_arr;
    _.p_text1_font = presentationCtx.p_text1_font;
    _.p_text2_font = presentationCtx.p_text2_font;
    _.p_title = presentationCtx.p_title;
    _.p_footnote = presentationCtx.p_footer;
    _.p_current_index = presentationCtx.p_current_index;
    _.p_last_index = presentationCtx.p_last_index;
    _.p_bkgnd_filename = presentationCtx.p_bkgnd_filename;
    _.p_bkgnd_motion = presentationCtx.p_bkgnd_motion;
    _.p_bkgnd_color = $RvW.vvConfigObj.get_p_solidBkgndColor();
    _.p_font_color = presentationCtx.p_font_color;
    _.p_font_color2 = presentationCtx.p_font_color2;
    _.p_format_multiplelines = $RvW.vvConfigObj.get_pformat_multiplelines();
    if (isStageView === 1) {
        const f = $("#thirdview_fcolor").val();
        _.p_font_color = $RvW.colorChart[f];
        _.p_font_color2 = $RvW.colorChart[f];
    }
    _.p_bkgnd_color1 = $RvW.vvConfigObj.get_p_bkgnd_color1();
    _.p_bkgnd_color2 = $RvW.vvConfigObj.get_p_bkgnd_color2();
    _.p_bkgnd_grad_orient = $RvW.vvConfigObj.get_p_bkgnd_grad_orient();
    _.p_motion_bkgnd_index = $RvW.vvConfigObj.get_p_motion_bkgnd_index();
    _.p_bkgnd_type = $RvW.vvConfigObj.get_p_bkgnd_type();
    {
        if (isStageView === 1) {
            let v = $RvW.vvConfigObj.get_stageStyleVal();
            if (v !== "3") {
                if (presentationCtx.p_text_orientation === "2") {
                    v = "2";
                }
            }
            const j = $("#thirdview_opacity").val();
            const r = $("#thirdview_height").val();
            const s = $("#thirdview_primary").prop("checked");
            const l = $("#thirdview_secondary").prop("checked");
            const g = $RvW.vvConfigObj.get_svBcolor();
            const p = $RvW.vvConfigObj.get_svPosition();
            const i = $RvW.vvConfigObj.get_svMaxFontSize();
            const d = $RvW.vvConfigObj.get_svTextOutline();
            const e = $RvW.vvConfigObj.get_svTextShadow();
            const c = $RvW.vvConfigObj.get_svGreenWindow();
            const n = $RvW.vvConfigObj.get_svAlignLeft();
            const k = $RvW.vvConfigObj.get_svAlignCenter();
            const q = $RvW.vvConfigObj.get_svAddTexture();
            const h = $RvW.vvConfigObj.get_svShowHorizontal();
            _.p_text_orientation = `${v}|${j}|${r}|${s}|${$RvW.colorChart[g]}|${p}|${i}|${d}|${e}|${c}|${n}|${k}|${q}|${h}|${l}`;
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
    _.p_enableShadow = $RvW.vvConfigObj.get_p_enableShadow();
    _.p_align = $RvW.vvConfigObj.get_p_align();

    air.trace(`p_enableTransition: ${_.p_enableTransition}`);

    if ($RvW.vvConfigObj.get_showVVLogo()) {
        _.p_logo = ["ReVerseVIEW", "rvw.github.io"].join("<br>");
    } else {
        _.p_logo = `${$RvW.vvConfigObj.get_logoText1()}<br>${$RvW.vvConfigObj.get_logoText2()}`;
    }
    if (isStageView === 1) {
        _.p_showDate = $RvW.vvConfigObj.get_svShowDate();
    } else {
        _.p_showDate = $RvW.vvConfigObj.get_showDateTime();
    }
    _.p_showLogo = $RvW.vvConfigObj.get_showVVLogo() || $RvW.vvConfigObj.get_showCustomLogo();
    _.p_shadeBackground = $RvW.graphicsObj.getShadeFlag();
    _.p_transparentBackground = $RvW.graphicsObj.getTransparentFlag();
    _.p_ver1ScaleFactor = presentationCtx.p_ver1ScaleFactor;
    _.p_ver2ScaleFactor = presentationCtx.p_ver2ScaleFactor;
    _.p_isArabic1 = false;
    _.p_isArabic2 = false;
    {
        const t = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][0];
        const u = t.indexOf("Arabic");
        if (u !== -1) {
            _.p_isArabic1 = true;
        }
    }
    {
        const t = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version2()][0];
        const u = t.indexOf("Arabic");
        if (u !== -1) {
            _.p_isArabic2 = true;
        }
    }
}

function getCurrentScreen() {
    const a = air.Screen.getScreensForRectangle(window.nativeWindow.bounds);
    return a.length > 0 ? a[0] : air.Screen.mainScreen;
}
function getScreenList() {
    return air.Screen.screens;
}
export function fillScreenList(idSel, savedIndex) {
    const screens = getScreenList();

    /** @type {HTMLSelectElement} */
    const el = document.getElementById(idSel);
    el.innerHTML = "";

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
            const isMain = isSameScreen(screens[i], mainScreen) ? " (main)" : "";

            let c = `Screen ${i + 1}${isMain}: ${width}x${height} @ ${x},${y}`;

            el.options[i] = new Option(c, i);
        }
    }

    setScreenIndex(idSel, savedIndex, screens.length);
}

function saveSelectedScreenIndex() {
    const a = document.getElementById("selectScreenID").selectedIndex;
    $RvW.rvwPreferences.set("app.settings.screen.main.index", a);
}

function saveSelectedStageScreenIndex() {
    const a = document.getElementById("selectStageScreenID").selectedIndex;
    $RvW.rvwPreferences.set("app.settings.screen.stage.index", a);
}

function setScreenIndex(sel, a, b) {
    if (a < b) {
        document.getElementById(sel).selectedIndex = a;
    } else {
        document.getElementById(sel).selectedIndex = 0;
    }
}

export function addScreenSelectionEvent() {
    document
        .getElementById("selectScreenID")
        .addEventListener("change", function processScreenSelChange() {
            saveSelectedScreenIndex();
            $RvW.vvConfigObj.save();
        }, false);
    document
        .getElementById("selectStageScreenID")
        .addEventListener("change", function processStageScreenSelChange() {
            saveSelectedStageScreenIndex();
            $RvW.vvConfigObj.save();
        }, false);
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
    $RvW.stageView = $("#stageConfigEnable").is(":checked");

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
        air.trace(`p window single ${pWindowX}x${pWindowY}`);
    }

    if (!$RvW.presentWindowOpen) {
        $RvW.presentationWindow = air.HTMLLoader.createRootWindow(true, windowInitOptions, true, presentScreenBounds);
        $RvW.presentationWindow.visible = $("#mainConfigEnable").is(":checked");
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
        // end of global functions

        if ($RvW.stageView) {
            const { NativeWindowInitOptions, HTMLLoader, Event, URLRequest } = air;

            const windowInitOptions = new NativeWindowInitOptions();
            const svWindow = $RvW.vvConfigObj.get_svWindow();
            const svBounds = screens[stageViewScreenIndex].bounds;
            if (svWindow) {
                windowInitOptions.resizable = false;
                windowInitOptions.maximizable = false;
                windowInitOptions.minimizable = false;
                const f = $("#stageviewMiniWindow").is(":checked");
                if (screens[stageViewScreenIndex].bounds.width < 1900) {
                    svBounds.width = 1280 / 2;
                    svBounds.height = 720 / 2;
                } else {
                    svBounds.width = 1280;
                    svBounds.height = 720;
                }
                if (f) {
                    svBounds.width /= 1.5;
                    svBounds.height /= 1.5;
                }
            } else {
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
            sv.window.nativeWindow.addEventListener(Event.CLOSING, closePresentWindowMain);
            sv.window.nativeWindow.alwaysInFront = false;
            sv.window.nativeWindow.stage.frameRate = 30;

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

            sv.window.iamclosingPresentation = function () {
                if ($RvW.presentationWindow != null) {
                    $RvW.presentationWindow.window.nativeWindow.close();
                }
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
            air.trace("Possible double click... NewWindow is still getting ready..");
        }

        // StageView
        if ($RvW.stageView && $RvW.stageWindow != null) {
            try {
                $RvW.stageWindow.window.passVariable(1);
                $RvW.stageWindow.window.updatePresentation();
                $RvW.stageWindow.window.updateContent();
            } catch (d) {
                air.trace(
                    "Possible double click... NewStageWindow is still getting ready.."
                );
            }
        }
    }
}
export function closePresentWindowMain() {
    if ($RvW.presentWindowOpen) {
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
    disableNavButtons(true);
}
function DOMIntializeCallback(a) {
    $RvW.presentationWindow.window.passVariable = passVariable;
    air.trace('>>> presentationWindow.htmlDOMInitialize')
}
function DOMIntializeStageViewCallback(a) {
    $RvW.stageWindow.window.passVariable = passVariable;
    air.trace('>>> stageWindow.htmlDOMInitialize')
}
function updatePresentationContent(b) {
    var a = presentationCtx.p_text1_arr.length;
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
    if ($RvW.presentWindowOpen) {
        $RvW.presentationWindow.window.nextSlide();
        if ($RvW.stageView) {
            $RvW.stageWindow.window.nextSlide();
        }
    }
    updatePresentationContent(true);
}
export function call_prevSlide() {
    if ($RvW.presentWindowOpen) {
        $RvW.presentationWindow.window.prevSlide();
        if ($RvW.stageView) {
            $RvW.stageWindow.window.prevSlide();
        }
    }
    updatePresentationContent(false);
}
export function call_showTheme() {
    if ($RvW.presentationWindow != null) {
        $RvW.presentationWindow.window.showThemeProcess();
    }
}
export function call_closePresentation() {
    if ($RvW.presentWindowOpen) {
        $RvW.presentationWindow.window.clearPresenter();
        if ($RvW.stageView) {
            $RvW.stageWindow.window.nativeWindow.close();
        }
    }
    $RvW.presentationContent = "";
}
