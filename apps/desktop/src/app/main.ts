// @ts-nocheck

// define('ddd', [], () => {
//
// });

import $ from 'jquery';

import { WebEngine } from "@/remote/webengine";
import { WebServer } from "@/remote/webserver";
import { setupMenu } from "@app/menu";
import { NotesManager } from "@/notes/manage";
import { Notes } from "@/notes/notes";
import { BibleSearch } from "@/bible/search";
import { GraphicsMgr } from "@/graphics/graphics";
import {setPrimaryBooknames} from "@/bible/booknames";
import {BibleRecentRefManager} from "@/bible/recent";
import {getdata, getdataONLY, getVerseFromArray, loadSQLBible} from "@/bible/manager";
import {
    loadBibleVersions,
    versionFill,
    getPrimaryBibleVersion, getSecondaryBibleVersion
} from "@/bible/version";
import { Config, configInit } from "./config";
import { setup as setupUI } from './ui/main';
import Preferences from './preferences';
import SplashScreen from './splash';
import {Toast} from "@app/toast";
import {
    processNavBibleRef,
} from "@/bible/navigation";
import {updateCfgVersion, isSameCfgVersion} from "@app/version-update";
import {
    call_nextSlide,
    call_prevSlide,
    call_closePresentation,
    presentation,
    presentWindowClosed
} from "@/p_window";
import {
    backupWebroot,
    BibleReference,
    copyFile2AppStorage,
    createFolder,
    fileExist,
} from "@app/common";
import {presentationCtx} from "@app/presentation";
import {
    bookList,
    bibleFont1,
    chapterList, selectedBible,
    selectedBookRef,
    selectedTab,
    verseList, selectedVerseList, type BibleVerse, twoVersesPerSlide, bibleFont2
} from "@stores/global";
import {$RvW} from "@/rvw";
import fetch from '@/utils/http/fetch';
import {console} from "@/platform/adapters/air";
import {ngInit, songNavigator} from "@app/glc";
import {BIBLE_BOOK_NAMES, BIBLE_CHAPTER_MAP} from "@app/const";

// import * as dojoDom from 'dojo/dom';
// console.trace("dojo/dom", dojoDom);

const { HTMLUncaughtScriptExceptionEvent } = runtime.flash.events;

window.htmlLoader.addEventListener(HTMLUncaughtScriptExceptionEvent.UNCAUGHT_SCRIPT_EXCEPTION, function(event) {
    event.preventDefault();

    console.trace(`>>>Uncaught Script Exception<<<: ${event.exceptionValue}`);

    for (const trace of event.stackTrace) {
        console.trace(`${trace.sourceURL}:${trace.line} - ${trace.functionName}`);
    }
});

DEV: {
    // break DEV;

    // const font = new FontFace('MyFont', 'url(path/to/your/font.ttf)');
    // console.log("FONT:", font);

    console.log("Main.js", $RvW);
    console.log("NativeProcess support:", air.NativeProcess.isSupported);

    try {
        // const classPath = 'flash.utils.ByteArray';
        const classPath = 'air.net.websockets.WebSocketServer';

        let asx = window.runtime;

        const splits = classPath.split('.');
        while (splits.length > 0) {
            asx = asx[splits.shift()];
        }

        console.trace('[[[.....As3.....]]]: ' + String(asx));

        // const obj = new as3Val();
    } catch (e) {
        throw new Error(">>>Error in As3 Object Resolver<<<: " + e);
    }

    // Make sure the remote is up-to-date
    copyFile2AppStorage("webroot", "webroot");

    {
        // global.Promise = $Y.Promise;
        fetch('https://rvw.psyirius.workers.dev/query/songs')
            .then(response => response.json())
            .then(data => {
                console.trace("Response:", data);
            })
            .catch(error => {
                console.trace("Error:", error);
            });
    }
}

$RvW.bookIndex = 0;
$RvW.chapterIndex = 0;
$RvW.verseIndex = 0;

$RvW.bible = [];
$RvW.content1 = [];
$RvW.content2 = [];

/* Bible chapter count mapping */
$RvW.numofch = [
    /* BookNum: [NumChapters, ...VersesForEachChapter] */
];

// TODO: build it dynamically
$RvW.systemFontList = [
    "Impact",
    "Tahoma",
    "Helvetica",
    "Garamond",
    "Montserrat",
    "Futura",
    "Gill Sans",
    "Rockwell",
    "Palatino",
    "Verdana",
    "Cabin",
    "Patua One",
    "Rancho",
    "Roboto Slab",
    "Alegreya Sans",
    "Bitter",
    "Calibri",
    "Myriad Pro",
    "Optima",
    "Baloo Tammudu",
    "Baloo Thambi",
    "Baloo Chettan",
    "Chilanka Malayalam",
    "Gayathri Malayalam",
    "Manjari Malayalam",
    "MeeraInimai Tamil",
    "NotoSans Hindi",
    "Ramabhadra Telugu",
    "Suranna Telugu",
    "AnjaliOldLipi",
    "Aruna",
    "Jomhuria Arabic",
    "Lalezra Arabic",
    "Kambar",
    "Lohit Malayalam",
    "Meera Malayalam",
    "Tenali Telugu"
];

// TODO: build it dynamically
$RvW.specialFontList = [
    "JC_Malayalam",
    "JC_Hindi",
    "Malayalam",
    "ML-TTKarthika",
    "Thiruvachanam",
    "Kerala",
    "ML-TTRevathi",
    "Tamil Bible",
    "ML-Keraleeyam1",
    "",
    "Shusha",
    "kambar",
    "tamil",
    "Kerala"
];

$RvW.leftTabView = null;
$RvW.rightTabView = null;

$RvW.searchObj = null;
$RvW.notesObj = null;
$RvW.notesManageObj = null;
$RvW.webServerObj = null;
$RvW.webEngineObj = null;
$RvW.bibleRefObj = null;
$RvW.chordsManagerObj = null;
$RvW.chordsDatabaseObj = null;
$RvW.chordsImportExportObj = null;
$RvW.enterForSearchActive = true;
$RvW.enterForBibleRef = false;
$RvW.vvConfigObj = null;
$RvW.highlightColor = "#BAD0EF";
$RvW.scroll_to_view = false;
$RvW.rvwPreferences = null;

let firstTimeFlag = false;

$RvW.getBookValue = function() {
    return selectedBible.get()[0];
}
$RvW.getChapterValue = function() {
    return selectedBible.get()[1];
}
$RvW.getVerseValue = function() {
    return selectedBible.get()[2];
}
$RvW.launch = function(g) {
    $RvW.webServerObj.broadcastWS({event: 'cc:present', type: 'verse'});

    const twoVerses = twoVersesPerSlide.get();

    let e = 1;
    if (twoVerses) {
        e = 2;
    }

    presentationCtx.p_last_index = $RvW.content1.length - 1;

    let j = presentationCtx.p_last_index;
    let h = j + 1;

    let b = $RvW.content1;
    let a = $RvW.content2;

    if (e == 2) {
        const l = h % 2;

        if (l == 0) {
            j = parseInt(h / 2) - 1;

            for (let f = 0; f <= j; f++) {
                b[f] = $RvW.content1[f * 2] + "<BR>" + $RvW.content1[f * 2 + 1];
                a[f] = $RvW.content2[f * 2] + "<BR>" + $RvW.content2[f * 2 + 1];
            }
        } else {
            j = parseInt(h / 2);

            for (let f = 0; f < j; f++) {
                b[f] = $RvW.content1[f * 2] + "<BR>" + $RvW.content1[f * 2 + 1];
                a[f] = $RvW.content2[f * 2] + "<BR>" + $RvW.content2[f * 2 + 1];
            }

            b[f] = $RvW.content1[f * 2];
            a[f] = $RvW.content2[f * 2];
        }
    }

    const k = parseInt(g / e);
    if ($RvW.vvConfigObj.get_singleVersion()) {
        for (let f = 0; f < a.length; f++) {
            a[f] = "";
        }
    }

    presentationCtx.p_type = 'verse';
    presentationCtx.p_ref = [$RvW.bookIndex, $RvW.chapterIndex, $RvW.verseIndex];
    presentationCtx.p_text1_arr = b;
    presentationCtx.p_text2_arr = a;
    presentationCtx.p_text1_font = getPrimaryBibleVersion().selectedFont;
    presentationCtx.p_text2_font = getSecondaryBibleVersion().selectedFont;
    presentationCtx.p_current_index = k;
    presentationCtx.p_last_index = j;
    presentationCtx.p_bkgnd_filename = $RvW.graphicsObj.getBkgndFilename();
    presentationCtx.p_bkgnd_motion = $RvW.rvwPreferences.get("app.settings.background.still.motion", false);
    presentationCtx.p_logo_mode = false;
    presentationCtx.p_bkgnd_color = "blue";
    presentationCtx.p_font_color = $RvW.rvwPreferences.get('app.settings.text.color1');
    presentationCtx.p_font_color2 = $RvW.rvwPreferences.get('app.settings.text.color2');
    presentationCtx.p_ver1ScaleFactor = 1;
    presentationCtx.p_ver2ScaleFactor = 1;

    if ($RvW.vvConfigObj.get_singleVersion()) {
        presentationCtx.p_text_orientation = 2;
    } else {
        presentationCtx.p_text_orientation = $RvW.vvConfigObj.get_p_text_orientation();
    }

    presentation();
}

$RvW.loadBookNames = function(a) {
    setPrimaryBooknames();
}

$RvW.getSingleVerse = function(j, f, k, e) {
    let l;
    const g = j * 1 + 1;
    const a = f * 1 + 1;
    const h = k * 1 + 1;
    const d = getVerseFromArray(g, a, h);
    if (e == 1) {
        l = $RvW.bibledbObj[0].getSingleVerseFromBuffer(d - 1);
    } else {
        l = $RvW.bibledbObj[1].getSingleVerseFromBuffer(d - 1);
    }
    return l;
}

$RvW.present = function() {
    $RvW.bookIndex = $RvW.getBookValue();
    $RvW.chapterIndex = $RvW.getChapterValue();
    $RvW.verseIndex = $RvW.getVerseValue();
    $RvW.recentBibleRefs.addSelection($RvW.bookIndex, $RvW.chapterIndex, $RvW.verseIndex);
    console.trace("Called in $RvW.present()");
    getdata();
    presentationCtx.p_footer = $RvW.getFooter();
    presentationCtx.p_title = $RvW.booknames[$RvW.bookIndex] + " " + ($RvW.chapterIndex + 1);
    $RvW.launch($RvW.verseIndex);
}

$RvW.present_external = function(a, h, e) {
    const bi = $RvW.bookIndex;
    const ci = $RvW.chapterIndex;
    const vi = $RvW.verseIndex;
    $RvW.bookIndex = a;
    $RvW.chapterIndex = h;
    $RvW.verseIndex = e;
    getdataONLY();
    presentationCtx.p_footer = $RvW.getFooter();
    presentationCtx.p_title = $RvW.booknames[$RvW.bookIndex] + " " + (parseInt($RvW.chapterIndex) + 1);
    $RvW.launch($RvW.verseIndex);
    $RvW.bookIndex = bi;
    $RvW.chapterIndex = ci;
    $RvW.verseIndex = vi;
    getdataONLY();
}
$RvW.getFooter = function() {
    var b;
    var a = getPrimaryBibleVersion().copyright;
    var c = getSecondaryBibleVersion().copyright;
    b = a + " / " + c;
    if (a == "public") {
        a = "Public Domain";
    }
    if (c == "public") {
        c = "Public Domain";
    }
    if (a == "Public Domain" && c == "Public Domain") {
        b = "";
    }
    if ((a == "Public Domain" || a == "") && c != "Public Domain") {
        b = c;
    }
    if (a != "Public Domain" && (c == "Public Domain" || c == "")) {
        b = a;
    }
    if (a == c) {
        b = a;
    }
    if (parseInt(presentationCtx.p_text_orientation) == 2) {
        if (a == "Public Domain") {
            b = "";
        } else {
            b = a;
        }
    }
    return b;
}
$RvW.setFontForList = function() {
    const a = getPrimaryBibleVersion().selectedFont;
    bibleFont1.set(a);
    const b = getSecondaryBibleVersion().selectedFont;
    bibleFont2.set(b);
}

/**
 * Add the Bible book names to the select list
 * */
$RvW.putbook = function() {
    bookList.update((_) => {
        const list = [];

        for (let i = 0; i < $RvW.booknames.length; i++) {
            const x = $RvW.booknames[i];

            const dualLangPattern = /^(.+)\s\((.+)\)$/;

            if (dualLangPattern.test(x)) {
                // console.log("DUAL LANG BN:", (x));
                const match = x.match(dualLangPattern);
                list.push([match[1], match[2]]);
            } else {
                // console.log("SINGLE LANG BN:", (x));
                list.push(x);
            }
        }

        return list;
    });

    selectedBible.update((_l) => {
        const l = [
            ..._l,
        ]

        l[0] = 0;

        console.trace("Selected Bible|putbook:", _l, l);

        return l;
    });

    $RvW.setFontForList();
}

$RvW.putch = function(b = null, dontUpdateVerse) {
    const selBook = $RvW.getBookValue();

    console.trace("selBook|putch:", selBook, b);

    chapterList.update((_) => {
        const list = [];

        for (let i = 0; i < $RvW.numofch[selBook + 1][0]; i++) {
            list.push(String(i + 1));
        }

        return list;
    });

    selectedBible.update((_l) => {
        const l = [
            ..._l,
        ]

        l[0] = selBook;
        l[1] = b == null ? 0 : b;

        console.trace("Selected Bible|putch:", _l, l);

        return l;
    });

    if (!dontUpdateVerse) {
        $RvW.putver();
    }
}

$RvW.putver = function(a = null) {
    const selBook = $RvW.getBookValue();
    const selCh = $RvW.getChapterValue();

    console.trace("selBook|putver:", selBook);
    console.trace("selCh|putver:", selCh, a);

    verseList.update((_) => {
        const list = [];

        for (let i = 0; i < $RvW.numofch[selBook + 1][selCh + 1]; i++) {
            list.push(String(i + 1));
        }

        return list;
    });

    selectedBible.update((_l) => {
        const l = [
            ..._l,
        ]

        l[0] = selBook;
        l[1] = selCh;
        l[2] = a == null ? 0 : a;

        console.trace("Selected Bible|putVer:", _l, l);

        return l;
    });

    $RvW.scroll_to_view = true;
    $RvW.updateVerseContainer();
}
export function verseChange() {
    selectedTab.set(0); // switch to verses page if not already

    const a = $RvW.getVerseValue();

    selectedBible.update((_l) => {
        const l = [
            ..._l,
        ]

        l[2] = a;

        console.trace("Selected Bible|VerseChange:", _l, l);

        return l;
    });

    $RvW.scroll_to_view = true;
    $RvW.highlightVerse(a);
    updateRefMenu();
}
function updateRefMenu() {
    const bi = $RvW.getBookValue();
    const ci = $RvW.getChapterValue();
    const vi = $RvW.getVerseValue();
    const e = $RvW.booknames[bi] + " " + (ci + 1) + ":" + (vi + 1);
    selectedBookRef.set(e);
}
let previousSelVerse;
$RvW.highlightVerse = function(a) {
    console.trace("Highlight Verse:", a);
    // TODO: Highlight the selected verse in the list
    // let b = "TC_" + previousSelVerse;
    // document.getElementById(b).style.backgroundColor = "edf5ff";
    // b = "TC_" + a;
    // document.getElementById(b).style.backgroundColor = $RvW.highlightColor;
    // previousSelVerse = a;
    // const c = "TC_" + a;
    // if ($RvW.scroll_to_view) {
    //     document.getElementById(c).scrollIntoView();
    //     $RvW.scroll_to_view = false;
    // }
    // window.scroll(0, 0);
}
$RvW.updateVerseContainer = function() {
    previousSelVerse = 0;

    $RvW.priFontName = getPrimaryBibleVersion().selectedFont;
    $RvW.secFontName = getSecondaryBibleVersion().selectedFont;

    $RvW.bookIndex = $RvW.getBookValue();
    $RvW.chapterIndex = $RvW.getChapterValue();
    $RvW.verseIndex = $RvW.getVerseValue();

    getdata();
}

$RvW.updateVerseContainer_continue = function() {
    selectedVerseList.update((_) => {
        const vl : BibleVerse[][] = [];

        for (let i = 0; i < $RvW.content1.length; i++) {
            const vmx : BibleVerse[] = [];

            const verseText1 = $RvW.content1[i];
            const verseFont1 = getPrimaryBibleVersion().selectedFont;

            vmx.push({
                ref: [
                    $RvW.bookIndex + 1,
                    $RvW.chapterIndex + 1,
                    i + 1,
                ],
                font: verseFont1,
                text: verseText1,
            });

            if ($RvW.vvConfigObj.get_navDualLanguage()) {
                const verseText2 = $RvW.content2[i];
                const verseFont2 = getSecondaryBibleVersion().selectedFont;

                vmx.push({
                    ref: [
                        $RvW.bookIndex + 1,
                        $RvW.chapterIndex + 1,
                        i + 1,
                    ],
                    font: verseFont2,
                    text: verseText2,
                });
            }

            vl.push(vmx);
        }

        return vl;
    });

    // Setup Notes
    if ($RvW.notesObj != null) {
        if (document.getElementById("nm_note_type1").checked) {
            const bkv = $RvW.getBookValue() + 1;
            const chv = $RvW.getChapterValue() + 1;
            $RvW.notesObj.getNotes(bkv, chv, 0);
        }
    }

    // Highlight Selected Verse
    $RvW.highlightVerse($RvW.getVerseValue());
}

function loadPreferences(callback) {
    const appStorageDir = air.File.applicationStorageDirectory;
    const prefsFile = appStorageDir.resolvePath("settings/prefs.json");

    const _cb = (err, store) => {
        if (err) {
            throw new Error("[!] LoadPreferences: " + err);
        }

        $RvW.rvwPreferences = store;

        callback(store);
    }

    if (!prefsFile.exists || prefsFile.isDirectory) {
        Preferences.init(prefsFile, _cb);
    } else {
        Preferences.load(prefsFile, _cb);
    }
}

function activateMainWindow() {
    // load saved window state
    const { nativeWindow } = window;

    const windowState = $RvW.rvwPreferences.get("app.state.window");
    if (windowState) {
        const { Screen, NativeWindowDisplayState } = air;
        const { bounds, maximized } = windowState;

        // check if the stored window bounds are within the screen bounds
        // if not, reset the window to the primary screen
        const { screens } = Screen;

        for (const screen of screens) {
            if (bounds.x >= screen.visibleBounds.x &&
                bounds.x <= screen.visibleBounds.right &&
                bounds.y >= screen.visibleBounds.y &&
                bounds.y <= screen.visibleBounds.bottom) {
                break;
            } else {
                // center the window on the primary screen
                const primaryBounds = Screen.mainScreen.visibleBounds;

                bounds.x = primaryBounds.x + (primaryBounds.width - bounds.width) / 2;
                bounds.y = primaryBounds.y + (primaryBounds.height - bounds.height) / 2;
            }
        }

        if ((maximized === true) && (nativeWindow.displayState !== NativeWindowDisplayState.MAXIMIZED)) {
            nativeWindow.maximize();
        } else {
            nativeWindow.x = bounds.x;
            nativeWindow.y = bounds.y;
            nativeWindow.width = bounds.width;
            nativeWindow.height = bounds.height;

            nativeWindow.restore();
        }
    }

    nativeWindow.visible = true;
    nativeWindow.activate();
}

export function loadInstalledFonts() {
    const { Array } = window.runtime;
    const { Font } = window.runtime.flash.text;

    const allFonts = Font.enumerateFonts(
        /* enumerateDeviceFonts: boolean */ true
    );
    allFonts.sortOn("fontName", Array.CASEINSENSITIVE);

    // const embeddedFonts = Font.enumerateFonts(
    //     /* enumerateDeviceFonts: boolean */ false
    // );
    // embeddedFonts.sortOn("fontName", Array.CASEINSENSITIVE);

    // allFonts.forEach((font) => {
    //     console.trace(font.fontName);
    // });

    return allFonts;
}

function setupConsole() {
    // new $Y.Console({
    //   logSource: $Y.Global,
    //   style: 'block',
    //   newestOnTop: false,
    //   width: "250px"
    // }).render("#yconsole");
}

function vvinit_continue() {
    let dev = false;

    DEV: { dev = true; }

    setupUI(dev);
    setupMenu();
    setupConsole();

    const a = $RvW.vvConfigObj.get_bibleDBVersion();

    if (a === 1 && !firstTimeFlag) {
        const ok = copyFile2AppStorage("bible", "bible");
        if (ok) {
            $RvW.vvConfigObj.set_version1(0);
            $RvW.vvConfigObj.set_version2(1);

            $RvW.vvConfigObj.set_bibleDBVersion(2);

            Toast.info("ReVerseVIEW", "Bible Database update process completed.");
        } else {
            Toast.error(
                "ReVerseVIEW",
                "Bible Database update failed. Please create an issue on GitHub."
            );
        }
    }
    loadBibleVersions();
    loadSQLBible($RvW.vvConfigObj.get_version1(), 0);
    loadSQLBible($RvW.vvConfigObj.get_version2(), 1);
    setupTabContent();

    $RvW.loadBookNames($RvW.vvConfigObj.get_version1());
    $RvW.putbook();

    // window.nativeWindow.addEventListener("resize", () => {});
    window.nativeWindow.addEventListener("close", () => $RvW.processExit());
    window.nativeWindow.addEventListener("closing", beforeExit);

    setTimeout(function () {
        SplashScreen.close();

        activateMainWindow();
    }, 100);
    // }, 2500);
}

function setupTabContent() {
    // Left Tab
    fillNav();

    // $RvW.scheduleObj = new Scheduler();
    $RvW.notesManageObj = new NotesManager(firstTimeFlag);
    $RvW.notesObj = new Notes();
    $RvW.searchObj = new BibleSearch(`./bible/${getPrimaryBibleVersion().file}`);
    $RvW.webServerObj = new WebServer('webroot');
    $RvW.webEngineObj = new WebEngine();
    $RvW.bibleRefObj = new BibleReference();
    $RvW.graphicsObj = new GraphicsMgr();

    ngInit();

    versionFill();
    configInit();

    if (!isSameCfgVersion()) {
        console.trace("About to copy webroot files...");

        if (backupWebroot()) {
            copyFile2AppStorage("webroot", "webroot");
        }

        updateCfgVersion();
    }
}

function fillNav() {
    $RvW.putbook();
    $RvW.putch();

    $RvW.enterForSearchActive = true;

    updateRefMenu();

    $RvW.recentBibleRefs = new BibleRecentRefManager();
}

function beforeExit() {
    // save app state
    {
        const lti = $RvW.leftTabView.getSelectedTab();
        $RvW.rvwPreferences.set('app.state.leftTabActiveIndex', lti);

        const rti = $RvW.rightTabView.getSelectedTab();
        $RvW.rvwPreferences.set('app.state.rightTabActiveIndex', rti);
    }

    // main window state
    {
        const { NativeWindowDisplayState, Screen } = air;
        const { nativeWindow } = window;

        const windowState = {
            bounds: {
                x: nativeWindow.x,
                y: nativeWindow.y,
                width: nativeWindow.width,
                height: nativeWindow.height,
            },
            maximized: (nativeWindow.displayState === NativeWindowDisplayState.MAXIMIZED),
        }

        $RvW.rvwPreferences.set('app.state.window', windowState);
    }

    $RvW.rvwPreferences.commit();
}

$RvW.processExit = function processExit() {
    console.trace('Exit process');

    if ($RvW.presentWindowOpen) {
        $RvW.presentationWindow.window.nativeWindow.removeEventListener(
            air.Event.CLOSE,
            presentWindowClosed
        );
        $RvW.presentationWindow.window.nativeWindow.close();
    }

    if ($RvW.stageView && $RvW.stageWindow) {
        $RvW.stageWindow.window.nativeWindow.removeEventListener(
            air.Event.CLOSE,
            presentWindowClosed
        );
        $RvW.stageWindow.window.nativeWindow.close();
    }
}
function firstTimeCheck() {
    let res = true;

    const a = fileExist("bible/versions.json", 1);
    if (!a) {
        res = setupVVersion();
    }

    const d = fileExist("background/list.json", 1);
    if (!d) {
        res = setupVBkgnd();
    }

    if (!a && !d) {
        firstTimeFlag = true;
    }

    console.trace("First time check: " + res);

    return res;
}

function setupVVersion() {
    createFolder("bible");
    createFolder("notes");
    createFolder("song");
    createFolder("webroot");
    createFolder("dbx"); // to store db files

    let a;

    a = copyFile2AppStorage("bible", "bible");
    if (!a) {
        return a;
    }
    a = copyFile2AppStorage("webroot", "webroot");
    if (!a) {
        return a;
    }
    a = copyFile2AppStorage("song", "song");
    if (!a) {
        return a;
    }
    return a;
}

function setupVBkgnd() {
    let a= copyFile2AppStorage("background", "background");
    if (!a) {
        return a;
    }
    a = copyFile2AppStorage("assets", "assets");
    if (!a) {
        return a;
    }
    return a;
}

function onMainWindowKeyUp(evt) {
    // TODO: make it proper and enable it
    return;

    if ($RvW.disableHotkeys) return;

    const b = $(":focus").attr("id");

    switch (evt.keyCode) {
        case 13: /* Enter */
            if ($RvW.enterForSearchActive) {
                $RvW.searchObj.searchKeywordInit();
            }
            if ($RvW.enterForBibleRef) {
                processNavBibleRef();
            }
            break;
        case 27: /* Escape */
            call_closePresentation();
            break;
        case 33: /* PageUp */
            call_prevSlide();
            break;
        case 34: /* PageDown */
            call_nextSlide();
            break;
        case 39: /* ArrowRight */
        case 40: /* ArrowDown */
            if (b == null) {
                call_nextSlide();
            }
            break;
        case 37: /* ArrowLeft */
        case 38: /* ArrowUp */
            if (b == null) {
                call_prevSlide();
            }
            break;
        case 119: /* F8 */
            console.trace("F8 pressed");
            break;
    }
}

function onExiting() {
    console.trace("Exiting...");
}

function onClosing() {
    console.trace("Closing...");
}

$RvW.booknames = [];
$RvW.english_booknames = [];

// FIXME: fix the callback hell
export function start(Y: YUI) {
    const { NativeApplication } = air;
    const { nativeApplication } = NativeApplication;

    nativeApplication.addEventListener(air.Event.CLOSING, onClosing);
    nativeApplication.addEventListener(air.Event.EXITING, onExiting);

    document.body.addEventListener("keyup", onMainWindowKeyUp);

    SplashScreen.show();

    if (!firstTimeCheck()) {
        Toast.error(
            "ReVerseVIEW",
            "Error first init!"
        );
    }

    TEST: {
        // load swf
        try {
            // const { Loader, URLRequest } = air;

            // const loader = new Loader();
            // loader.load(new URLRequest("./bin/AppEntry.swf"));
            // loader.load(new URLRequest("./bin/library.swf"));

            const { nativeWindow } = window;
            const { stage } = nativeWindow;

            // stage.addChild(loader);

            console.log('Stage:', stage);
        } catch (e) {
            console.trace(e);
        }

        break TEST;
    }

    loadPreferences(() => {
        $RvW.vvConfigObj = new Config();

        $RvW.systemFontList = $RvW.systemFontList.concat([
            ...loadInstalledFonts().map((font) => font.fontName),
        ]);

        $RvW.numofch = BIBLE_CHAPTER_MAP;
        $RvW.english_booknames = BIBLE_BOOK_NAMES;

        $RvW.booknames = $RvW.english_booknames;
        $RvW.default_booknames = $RvW.english_booknames;

        vvinit_continue();

        // loadBibleInfo('en-US', function (err, data) {
        //     if (err) {
        //         throw new Error("[!] LoadBibleInfo: " + err);
        //     }
        //
        //     // TODO: remove it and use a static nameSet for english
        //     const [numChMap] = data;
        //     console.trace("NumChMap:", numChMap);
        // });
    });
}

// keep it from tree-shaking
// window.start = start;
