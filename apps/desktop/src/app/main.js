import $ from 'jquery';

import { WebEngine } from "@/remote/webengine";
import { WebServer } from "@/remote/webserver";
import { WordBrain } from "@/words/wordbrain";
import { WordLearner } from "@/words/wordlearner";
import { SongManager } from "@/song/manager";
import { SongNumber } from "@/song/number";
import { SongNav } from "@/song/nav";
import { setupMenu } from "@app/menu";
import { SongEdit } from "@/song/edit";
import { NotesManager } from "@/notes/manage";
import { Notes, PostIt } from "@/notes/notes";
import { BibleSearch } from "@/bible/search";
import { GraphicsMgr } from "@/graphics/graphics";
import {setPrimaryBooknames} from "@/bible/booknames";
import {VerseEditUI} from "@/bible/edit";
import {BibleRecentRefManager} from "@/bible/recent";
import {Scheduler} from "@app/schedule";
import {getdata, getdataONLY, getVerseFromArray, loadSQLBible, verseClass} from "@/bible/manager";
import {AppUpdater, AppUpdateUi} from "./update";
import { HelpUiPanel } from "./help";
import {getVersion1Filename, loadBibleVersion, versionFill} from "@/bible/version";
import { Config, configInit, svParameterSaveEvent } from "./config";
import Preferences from './preferences';
import SplashScreen from './splash';
import {Prompt} from "@app/prompt";
import {Toast} from "@app/toast";
import { setup as setupUI } from './ui/main';
import {
    bibleRefBlur,
    bibleRefFocus,
    processNavBibleRef,
} from "@/bible/navigation";
import {checkVerUpdateFlags, isUpToDate, task2Complete, task2Status} from "@/versionupdate";
import {
    call_nextSlide,
    call_prevSlide,
    call_showTheme,
    closePresentWindowMain,
    presentation,
    presentWindowClosed
} from "@/p_window";
import {
    apple,
    backupWebroot,
    BibleReference,
    clearSelectList,
    copyFile2AppStorage,
    createFolder,
    fileExist,
    pluckapple,
} from "@app/common";
import {presentationCtx} from "@app/presentation";
import {selectedBookRef, selectedTab} from "@stores/global";
import {loadBibleBookNames, loadBibleInfo} from "@/bible/db";
import {$RvW} from "@/rvw";
import fetch from "@/utils/http/fetch";

// import * as dojoDom from 'dojo/dom';
// console.log("dojo/dom", dojoDom);

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

        air.trace('[[[.....As3.....]]]: ' + String(asx));

        // const obj = new as3Val();
    } catch (e) {
        alert(">>>Error in As3 Object Resolver<<<: " + e);
    }

    // Make sure the remote is up-to-date
    copyFile2AppStorage("webroot", "webroot");

    {
        fetch('https://rvw.psyirius.workers.dev/query/songs')
            .then(response => response.json())
            .then(data => {
                air.trace("Response:", data);
            })
            .catch(error => {
                air.trace("Error:", error);
            });
    }
}

const { HTMLUncaughtScriptExceptionEvent } = runtime.flash.events;

window.htmlLoader.addEventListener(HTMLUncaughtScriptExceptionEvent.UNCAUGHT_SCRIPT_EXCEPTION, function(event) {
    event.preventDefault();

    air.trace(`>>>Uncaught Script Exception<<<: ${event.exceptionValue}`);
    for (const trace of event.stackTrace) {
        air.trace(`${trace.sourceURL}:${trace.line} - ${trace.functionName}`);
    }
});

$RvW.bookIndex = 0;
$RvW.chapterIndex = 0;
$RvW.verseIndex = 0;

$RvW.bible = [];
$RvW.content1 = [];
$RvW.content2 = [];

/* Bible chapter count mapping */
$RvW.numofch = [
    /* BookNum: [NumChapters, ...VersesForEachChapter] */
    // filled by loading from a bible version
];
$RvW.colorChart = [
    "FFFFFF",
    "800000",
    "A52A2A",
    "DC143C",
    "FF0000",
    "FF6347",
    "FF7F50",
    "CD5C5C",
    "FA8072",
    "FFA07A",
    "FF4500",
    "FF8C00",
    "FFD700",
    "B8860B",
    "DAA520",
    "BDB76B",
    "F0E68C",
    "808000",
    "FFFF00",
    "9ACD32",
    "7CFC00",
    "ADFF2F",
    "006400",
    "228B22",
    "00FF00",
    "32CD32",
    "98FB98",
    "8FBC8F",
    "00FA9A",
    "00FF7F",
    "2E8B57",
    "3CB371",
    "20B2AA",
    "2F4F4F",
    "008080",
    "00FFFF",
    "E0FFFF",
    "AFEEEE",
    "B0E0E6",
    "5F9EA0",
    "6495ED",
    "00BFFF",
    "1E90FF",
    "000080",
    "0000FF",
    "4169E1",
    "8A2BE2",
    "4B0082",
    "483D8B",
    "7B68EE",
    "8B008B",
    "9400D3",
    "BA55D3",
    "D8BFD8",
    "DDA0DD",
    "EE82EE",
    "FF00FF",
    "C71585",
    "DB7093",
    "FF1493",
    "FFC0CB",
    "FAEBD7",
    "FFE4C4",
    "F5DEB3",
    "8B4513",
    "A0522D",
    "D2691E",
    "CD853F",
    "F4A460",
    "DEB887",
    "FFE4B5",
    "FFF0F5",
    "F5FFFA",
    "778899",
    "B0C4DE",
    "F0F8FF",
    "000000",
    "696969",
    "A9A9A9",
    "D3D3D3",
    "FFFFFF",
    "26FF2A",
];

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
$RvW.scheduleObj = null;
$RvW.webServerObj = null;
$RvW.webEngineObj = null;
$RvW.bibleRefObj = null;
$RvW.songEditObj = null;
$RvW.songManagerObj = null;
$RvW.songNumberObj = null;
$RvW.chordsManagerObj = null;
$RvW.chordsDatabaseObj = null;
$RvW.chordsImportExportObj = null;
$RvW.songNavObj = null;
$RvW.helpObj = null;
$RvW.updateVV_UI_Obj = null;
$RvW.editVerse_UI_Obj = null;
$RvW.newUpdateObj = null;
$RvW.enterForSearchActive = true;
$RvW.enterForBibleRef = false;
$RvW.vvConfigObj = null;
$RvW.highlightColor = "#BAD0EF";
$RvW.scroll_to_view = false;
$RvW.learner = null;
$RvW.wordbrain = null;
$RvW.rvwPreferences = null;

let firstTimeFlag = false;
let navWindowHeight = 1000;
let navWindowWidth = 1000;
let previousSelVerse = 0;
let themeState = false;

$RvW.getBookValue = function() {
    return document.getElementById("bookList").selectedIndex;
}
$RvW.getChapterValue = function() {
    return document.getElementById("chapterList").selectedIndex;
}
$RvW.getVerseValue = function() {
    return document.getElementById("verseList").selectedIndex;
}
$RvW.launch = function(g) {
    var j;
    var c = document.getElementById("multipleVerseID").checked;
    var e = 1;
    if (c) {
        e = 2;
    }
    var b;
    var a;
    presentationCtx.p_last_index = $RvW.content1.length - 1;
    var h = 0;
    h = presentationCtx.p_last_index + 1;
    j = presentationCtx.p_last_index;
    b = $RvW.content1;
    a = $RvW.content2;
    if (e == 2) {
        var l = h % 2;
        if (l == 0) {
            j = parseInt(h / 2) - 1;
            for (var f = 0; f <= j; f++) {
                b[f] = $RvW.content1[f * 2] + "<BR>" + $RvW.content1[f * 2 + 1];
                a[f] = $RvW.content2[f * 2] + "<BR>" + $RvW.content2[f * 2 + 1];
            }
        } else {
            j = parseInt(h / 2);
            for (var f = 0; f < j; f++) {
                b[f] = $RvW.content1[f * 2] + "<BR>" + $RvW.content1[f * 2 + 1];
                a[f] = $RvW.content2[f * 2] + "<BR>" + $RvW.content2[f * 2 + 1];
            }
            b[f] = $RvW.content1[f * 2];
            a[f] = $RvW.content2[f * 2];
        }
    }
    var k = parseInt(g / e);
    if ($RvW.vvConfigObj.get_singleVersion()) {
        var d = a.length;
        for (f = 0; f < d; f++) {
            a[f] = "";
        }
    }
    presentationCtx.p_text1_arr = b;
    presentationCtx.p_text2_arr = a;
    presentationCtx.p_text1_font = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][6];
    presentationCtx.p_text2_font = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version2()][6];
    presentationCtx.p_current_index = k;
    presentationCtx.p_last_index = j;
    presentationCtx.p_bkgnd_filename = $RvW.graphicsObj.getBkgndFilename();
    presentationCtx.p_bkgnd_motion = $RvW.graphicsObj.getMotionFlag();
    presentationCtx.p_bkgnd_color = "blue";
    presentationCtx.p_font_color = $RvW.vvConfigObj.get_p_textColor();
    presentationCtx.p_font_color2 = $RvW.vvConfigObj.get_p_textColor2();
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
    var l;
    var g = j * 1 + 1;
    var a = f * 1 + 1;
    var h = k * 1 + 1;
    var d = getVerseFromArray(g, a, h);
    if (e == 1) {
        l = $RvW.bibledbObj[1].getSingleVerseFromBuffer(d - 1);
    } else {
        l = $RvW.bibledbObj[2].getSingleVerseFromBuffer(d - 1);
    }
    return l;
}
$RvW.present = function() {
    $RvW.bookIndex = document.getElementById("bookList").selectedIndex;
    $RvW.chapterIndex = document.getElementById("chapterList").selectedIndex;
    $RvW.verseIndex = document.getElementById("verseList").selectedIndex;
    $RvW.recentBibleRefs.addSelection($RvW.bookIndex, $RvW.chapterIndex, $RvW.verseIndex);
    air.trace("Called in $RvW.present()");
    getdata();
    presentationCtx.p_footer = $RvW.getFooter();
    presentationCtx.p_title = $RvW.booknames[$RvW.bookIndex] + " " + ($RvW.chapterIndex + 1);
    $RvW.launch($RvW.verseIndex);
    themeState = false;
}
$RvW.present_external = function(a, h, e) {
    var g = $RvW.bookIndex;
    var f = $RvW.chapterIndex;
    var d = $RvW.verseIndex;
    $RvW.bookIndex = a;
    $RvW.chapterIndex = h;
    $RvW.verseIndex = e;
    getdataONLY();
    presentationCtx.p_footer = $RvW.getFooter();
    presentationCtx.p_title = $RvW.booknames[$RvW.bookIndex] + " " + ($RvW.chapterIndex * 1 + 1);
    $RvW.launch($RvW.verseIndex);
    themeState = false;
    $RvW.bookIndex = g;
    $RvW.chapterIndex = f;
    $RvW.verseIndex = d;
    getdataONLY();
}
$RvW.getFooter = function() {
    var b;
    var a = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][3];
    var c = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version2()][3];
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
function presentTheme() {
    if (themeState) {
        $RvW.present();
    } else {
        themeState = true;
        presentationCtx.p_title = "";
        presentationCtx.p_footer = "";
        presentationCtx.p_last_index = 0;
        $RvW.content1[0] = "";
        $RvW.content2[0] = "";
        presentationCtx.p_current_index = 0;
        presentationCtx.p_bkgnd_filename = $RvW.graphicsObj.getBkgndFilename();
        presentationCtx.p_bkgnd_motion = $RvW.graphicsObj.getMotionFlag();
        presentationCtx.p_bkgnd_color = "black";
        presentationCtx.p_font_color = "white";
        presentationCtx.p_font_color2 = "white";
        presentation();
    }
}
$RvW.setFontForList = function() {
    const a = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][6];
    $("#bookList").css("font-family", a);
    $("#chapterList").css("font-family", a);
    $("#verseList").css("font-family", a);
    $("#recentSel").css("font-family", a);
}
$RvW.putbook = function() {
    clearSelectList("bookList");
    var a = $RvW.vvConfigObj.get_listinenglish();
    var b = $RvW.booknames.length;
    for (let i = 0; i < b; i++) {
        if (a) {
            document.getElementById("bookList").options[i] = new Option(
                $RvW.default_booknames[i],
                i
            );
        } else {
            document.getElementById("bookList").options[i] = new Option(
                $RvW.booknames[i],
                i
            );
        }
    }
    document.getElementById("bookList").selectedIndex = 0;
    $RvW.setFontForList();
}
$RvW.putch = function(b, a) {
    clearSelectList("chapterList");
    const val = document.getElementById("bookList").selectedIndex + 1;
    for (let i = 0; i < $RvW.numofch[val][0]; i++) {
        document.getElementById("chapterList").options[i] = new Option(i + 1, i);
    }
    if (b == null) {
        document.getElementById("chapterList").selectedIndex = 0;
    } else {
        document.getElementById("chapterList").selectedIndex = b;
    }
    if (!a) {
        $RvW.putver();
    }
}

let bookval, chval;

$RvW.putver = function(a) {
    bookval = document.getElementById("bookList").selectedIndex + 1;
    chval = document.getElementById("chapterList").selectedIndex + 1;
    clearSelectList("verseList");
    for (let i = 0; i < $RvW.numofch[bookval][chval]; i++) {
        document.getElementById("verseList").options[i] = new Option(i + 1, i + 1);
    }
    if (a == null) {
        document.getElementById("verseList").selectedIndex = 0;
    } else {
        document.getElementById("verseList").selectedIndex = a;
    }
    $RvW.scroll_to_view = true;
    $RvW.updateVerseContainer();
}
function verseChange() {
    selectedTab.set(0); // switch to verses page if not already
    const a = $RvW.getVerseValue();
    $RvW.scroll_to_view = true;
    $RvW.highlightVerse(a);
    updateRefMenu();
}
function updateRefMenu() {
    const bi = document.getElementById("bookList").selectedIndex;
    const ci = document.getElementById("chapterList").selectedIndex;
    const vi = document.getElementById("verseList").selectedIndex;
    const e = $RvW.booknames[bi] + " " + (ci + 1) + ":" + (vi + 1);
    selectedBookRef.set(e);
}
$RvW.highlightVerse = function(a) {
    let b = "TC_" + previousSelVerse;
    document.getElementById(b).style.backgroundColor = "edf5ff";
    b = "TC_" + a;
    document.getElementById(b).style.backgroundColor = $RvW.highlightColor;
    previousSelVerse = a;
    const c = "TC_" + a;
    if ($RvW.scroll_to_view) {
        document.getElementById(c).scrollIntoView();
        $RvW.scroll_to_view = false;
    }
    window.scroll(0, 0);
}
$RvW.updateVerseContainer = function() {
    previousSelVerse = 0;
    $RvW.priFontName = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][6];
    $RvW.secFontName = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version2()][6];
    $RvW.vvConfigObj.set_navDualLanguage(document.getElementById("navDualLanguageID").checked);
    $RvW.bookIndex = document.getElementById("bookList").selectedIndex;
    $RvW.chapterIndex = document.getElementById("chapterList").selectedIndex;
    $RvW.verseIndex = document.getElementById("verseList").selectedIndex;
    getdata();
}

$RvW.updateVerseContainer_continue = function() {
    let htm = "<table border=1>";

    if ($RvW.vvConfigObj.get_navDualLanguage()) {
        htm += '<tr><td width="4%"></td><td width="48%"></td><td width="48%"></td></tr>';
    } else {
        htm += '<tr><td width="4%"></td><td width="96%"></td></tr>';
    }

    for (let i = 0; i < $RvW.content1.length; i++) {
        const a = `TC_${i}`;
        htm += `<tr class="vcClass" id="${a}"><td width="4%">`;
        const h1 = `NC_${i}`;
        htm += `<div class="vcClassIcon" id="${h1}"><i class="file alternate icon"></i></div>`;

        if ($RvW.vvConfigObj.get_navDualLanguage()) {
            htm += '</td><td class="navtd" width="48%">';
            const h2 = `VC1_${i}`;
            htm += `<div class="vcClass" id="${h2}">a</div>`;
            htm += '</td><td class="navtd" width="48%">';
            const h3 = `VC2_${i}`;
            htm += `<div class="vcClass" id="${h3}">b</div>`;
        } else {
            htm += '</td><td class="navtd" width="96%">';
            const h2 = `VC1_${i}`;
            htm += `<div class="vcClass" id="${h2}">x</div>`;
        }

        htm += "</td></tr>";
    }
    htm += "</table>";

    document.getElementById("verseTab").innerHTML = htm;

    const o = [];
    const c = [];
    const b = [];

    for (let i = 0; i < $RvW.content1.length; i++) {
        const m = `VC1_${i}`;
        const g = `VC2_${i}`;
        const e = `NC_${i}`;

        o[i] = new PostIt(e, $RvW.bookIndex + 1, $RvW.chapterIndex + 1, i + 1);

        c[i] = new verseClass();
        const l = $RvW.content1[i];
        const k = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][6];
        c[i].init(m, l, $RvW.bookIndex + 1, $RvW.chapterIndex + 1, i + 1, k);

        if ($RvW.vvConfigObj.get_navDualLanguage()) {
            b[i] = new verseClass();
            const l = $RvW.content2[i];
            const k = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version2()][6];
            b[i].init(g, l, $RvW.bookIndex + 1, $RvW.chapterIndex + 1, i + 1, k);
        }
    }

    if ($RvW.notesObj != null) {
        if (document.getElementById("nm_note_type1").checked) {
            $RvW.notesObj.getNotes(bookval, chval, 0);
        }
    }

    $RvW.highlightVerse($RvW.getVerseValue());
}

function loadPreferences(callback) {
    const appStorageDir = air.File.applicationStorageDirectory;
    const prefsFile = appStorageDir.resolvePath("settings/prefs.json");

    const _cb = (e, store) => {
        if (e) {
            alert("[!] LoadPreferences: " + e);
            air.trace(e);
            return;
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
        const { NativeWindowDisplayState, Screen, Rectangle } = air;
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

function loadInstalledFonts() {
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
    //     air.trace(font.fontName);
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
    setupUI();
    setupMenu();
    setupConsole();

    Toast.setup();
    Prompt.setup();

    setTimeout(function () {
        const a = $RvW.vvConfigObj.get_bibleDBVersion() * 1;

        if (a === 1 && !firstTimeFlag) {
            let c = copyFile2AppStorage("xml/version.xml", "xml/version.xml");
            if (c) {
                c = copyFile2AppStorage("bible", "bible");
                if (c) {
                    $RvW.vvConfigObj.set_version1(1);
                    $RvW.vvConfigObj.set_version2(2);
                    $RvW.vvConfigObj.set_bibleDBVersion(2);
                    Toast.show("VerseVIEW", "Bible Database update process completed.");
                } else {
                    Toast.show(
                        "VerseVIEW",
                        "Bible Database update failed. Please contact verseview@yahoo.com"
                    );
                }
            } else {
                Toast.show(
                    "VerseVIEW",
                    "Bible Database update failed. Please contact verseview@yahoo.com"
                );
            }
        }
        loadBibleVersion();
        loadSQLBible($RvW.vvConfigObj.get_version1(), 1);
        loadSQLBible($RvW.vvConfigObj.get_version2(), 2);
        setupTabContent();

        SplashScreen.close();

        activateMainWindow();
        setupNavWindow();

        $RvW.loadBookNames($RvW.vvConfigObj.get_version1());
        $RvW.putbook();
        window.nativeWindow.addEventListener("resize", setupNavWindow);
        window.nativeWindow.addEventListener("close", () => $RvW.processExit());
        window.nativeWindow.addEventListener("closing", beforeExit);
        $RvW.newUpdateObj = new AppUpdater();
    }, 500);

    setTimeout(function () {
        window.scroll(0, 0);
    }, 3000);
}

function setupNavWindow() {
    var c = 280;
    var d = window.nativeWindow.bounds.height;
    var k = window.nativeWindow.bounds.width;
    if (navWindowHeight != d || navWindowWidth != k) {
        document.body.style.overflow = "hidden";
        var j = window.nativeWindow.bounds.width - 16;
        var f = window.innerHeight;
        var b = parseInt((j * 3) / 100);
        var a = parseInt((f * 4) / 100);
        $RvW.tabHeight = f - 120;
        var g = 250;
        var e = 200;
        document.getElementById("wrapper").style.height = $RvW.tabHeight;
        $("#container").height($RvW.tabHeight);
        $("#navTab").height($RvW.tabHeight);
        $("#songNavTab").height($RvW.tabHeight);
        $("#bookList").height($RvW.tabHeight - c);
        $("#chapterList").height($RvW.tabHeight - c);
        $("#verseList").height($RvW.tabHeight - c);
        var l = j - g - e - 3 * b;
        document.getElementById("container2").style.height = $RvW.tabHeight;
        document.getElementById("bibleverseTab").style.height = $RvW.tabHeight;
        document.getElementById("lyricsTab").style.height = $RvW.tabHeight;
        document.getElementById("notesTab").style.height = $RvW.tabHeight;
        document.getElementById("scheduleTab").style.height = $RvW.tabHeight;
        document.getElementById("searchTab").style.height = $RvW.tabHeight;
        document.getElementById("graphicsTab").style.height = $RvW.tabHeight;
        document.getElementById("screenTab").style.height = $RvW.tabHeight;
        document.getElementById("still_bkgnd_grid").style.height = f - 450;
        $RvW.graphicsObj.setNumOfPicsInRow(l);
        $RvW.songNavObj.setFormats();
        navWindowHeight = d;
        navWindowWidth = k;
    }
}

function setupTheme() {
    const a = document.getElementById("themeList").value;
    switch (a) {
        case "1":
            document.body.style.backgroundImage = "url(graphics/background2.png)";
            break;
        case "2":
            document.body.style.backgroundImage = "url(graphics/background3.png)";
            break;
        default:
    }
}

function setupTabContent() {
    $RvW.updateVV_UI_Obj = new AppUpdateUi();

    // Right Tab
    /* setupTabView("bible_verses", "bibleverseTab"); */
    /* setupTabView("song_lyrics", "lyricsTab"); */
    /* setupTabView("notes", "notesTab"); */
    /* setupTabView("search", "searchTab"); */
    /* setupTabView("schedule", "scheduleTab"); */
    /* setupTabView("graphics", "graphicsTab"); */
    /* setupTabView("settings", "screenTab"); */ setupSettingsTab();

    // Left Tab
    /* setupTabView("nav", "navTab"); */ fillNav();
    /* setupTabView("song_nav", "songNavTab"); */

    $RvW.scheduleObj = new Scheduler();
    $RvW.notesManageObj = new NotesManager(firstTimeFlag);
    $RvW.notesObj = new Notes();
    $RvW.searchObj = new BibleSearch(`./bible/${getVersion1Filename()}`);
    $RvW.webServerObj = new WebServer('webroot');
    $RvW.webEngineObj = new WebEngine();
    $RvW.bibleRefObj = new BibleReference();
    $RvW.editVerse_UI_Obj = new VerseEditUI();
    $RvW.songNumberObj = new SongNumber();
    $RvW.songManagerObj = new SongManager(true, true);
    $RvW.songEditObj = new SongEdit();
    $RvW.songNavObj = new SongNav();
    $RvW.helpObj = new HelpUiPanel();
    $RvW.graphicsObj = new GraphicsMgr();

    versionFill(true); configInit();

    if (!isUpToDate() && !task2Status()) {
        air.trace("About to copy webroot files...");

        if (backupWebroot()) {
            copyFile2AppStorage("webroot", "webroot");
            task2Complete();
        }
        checkVerUpdateFlags();
    }
}

// const loadViewTemplate = function (name) {
//     const filepath = `./views/${name}.html`;
//
//     const { File, FileStream, FileMode } = air;
//     const { applicationDirectory: appDir } = File;
//
//     const file = appDir.resolvePath(filepath);
//
//     const prefsFS = new FileStream();
//     prefsFS.open(file, FileMode.READ);
//     const data = prefsFS.readMultiByte(prefsFS.bytesAvailable, 'utf-8');
//     prefsFS.close();
//
//     return data;
// }

// function setupTabView(name, mountPoint) {
//     const html = VIEWS[name];
//     if (!html) {
//         air.trace(`[!] View template not found: ${name}`);
//     }
//     document.getElementById(mountPoint).innerHTML = html;
//     fillTabs(mountPoint);
// }

function setupSettingsTab() {
    document.getElementById("thirdview_opacity").value =
        $RvW.vvConfigObj.get_svOpacity();
    document.getElementById("thirdview_height").value =
        $RvW.vvConfigObj.get_svHeight();
    document.getElementById("thirdview_fcolor").value =
        $RvW.vvConfigObj.get_svFcolor();
    document.getElementById("thirdview_position").value =
        $RvW.vvConfigObj.get_svPosition();
    document.getElementById("thirdview_maxFontSize").value =
        $RvW.vvConfigObj.get_svMaxFontSize();
    document.getElementById("thirdview_bcolor").value =
        $RvW.vvConfigObj.get_svBcolor();
    $("#thirdview_primary").prop(
        "checked",
        $RvW.vvConfigObj.get_svShowPrimary() == "true" ? true : false
    );
    $("#thirdview_secondary").prop(
        "checked",
        $RvW.vvConfigObj.get_svShowSecondary() == "true" ? true : false
    );
    $("#stageviewWindow").prop(
        "checked",
        $RvW.vvConfigObj.get_svWindow() == "true" ? true : false
    );
    $("#stageviewGreenWindow").prop(
        "checked",
        $RvW.vvConfigObj.get_svGreenWindow() == "true" ? true : false
    );
    $("#thirdview_outline").prop(
        "checked",
        $RvW.vvConfigObj.get_svTextOutline() == "true" ? true : false
    );
    $("#thirdview_shadow").prop(
        "checked",
        $RvW.vvConfigObj.get_svTextShadow() == "true" ? true : false
    );
    $("#stageSettingShowTime").prop(
        "checked",
        $RvW.vvConfigObj.get_svShowDate() == "true" ? true : false
    );
    $("#thirdview_opacity_range").range({
        min: 0,
        max: 10,
        start: $RvW.vvConfigObj.get_svOpacity() * 10,
        onChange: function (b) {
            $("#thirdview_opacity").val(b / 10);
            svParameterSaveEvent();
        },
    });
    $("#thirdview_opacity").prop("disabled", true);
    $("#thirdview_height_range").range({
        min: 0,
        max: 100,
        start: $RvW.vvConfigObj.get_svHeight(),
        onChange: function (b) {
            $("#thirdview_height").val(b);
            svParameterSaveEvent();
        },
    });
    $("#thirdview_height").prop("disabled", true);
    $("#thirdview_position_range").range({
        min: 0,
        max: 100,
        start: $RvW.vvConfigObj.get_svPosition(),
        onChange: function (b) {
            $("#thirdview_position").val(b);
            svParameterSaveEvent();
        },
    });
    $("#thirdview_position").prop("disabled", true);
    $("#thirdview_maxFontSize_range").range({
        min: 10,
        max: 100,
        start: $RvW.vvConfigObj.get_svMaxFontSize(),
        onChange: function (b) {
            $("#thirdview_maxFontSize").val(b);
            svParameterSaveEvent();
        },
    });
    $("#thirdview_maxFontSize").prop("disabled", true);
    $("#thirdview_fcolor_range").range({
        min: 0,
        max: 80,
        start: $RvW.vvConfigObj.get_svFcolor(),
        onChange: function (b) {
            $("#thirdview_fcolor").val(b);
            svParameterSaveEvent();
            var c = "#" + $RvW.colorChart[$("#thirdview_fcolor").val()];
            $("#thirdview_fcolor").css({ "background-color": c });
        },
    });
    $("#thirdview_fcolor").prop("disabled", true);
    $("#thirdview_bcolor_range").range({
        min: 0,
        max: 81,
        start: $RvW.vvConfigObj.get_svBcolor(),
        onChange: function (b) {
            $("#thirdview_bcolor").val(b);
            svParameterSaveEvent();
            var c = "#" + $RvW.colorChart[$("#thirdview_bcolor").val()];
            $("#thirdview_bcolor").css({ "background-color": c });
        },
    });
    $("#thirdview_bcolor").prop("disabled", true);
}

function updateBookNameVar() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState < 4) {
            air.trace("BOOK NAME: Loading...");
        }

        if (xhr.readyState === 4) {
            const e = xhr.responseXML.documentElement;
            air.trace("********Processing bookname");
            const d = e.getElementsByTagName("b").length;
            for (let c = 0; c < d; c++) {
                $RvW.booknames[c] = e.getElementsByTagName("b")[c].textContent;
            }
        }
    };
    xhr.open("GET", "./xml/booknames.xml", false);
    xhr.send(null);
}

function fillNav() {
    $RvW.putbook();
    $RvW.putch();
    document.getElementById("bookList").addEventListener("change", $RvW.putch, false);
    document.getElementById("chapterList").addEventListener("change", $RvW.putver, false);
    document.getElementById("verseList").addEventListener("change", verseChange, false);
    document.getElementById("nav_bibleRefID").addEventListener("blur", bibleRefBlur, false);
    document.getElementById("nav_bibleRefID").addEventListener("focus", bibleRefFocus, false);

    $RvW.enterForSearchActive = true;

    updateRefMenu();

    $RvW.recentBibleRefs = new BibleRecentRefManager();
}

function beforeExit() {
    // save app state
    {
        const lti = $RvW.leftTabView.get('selection').get('index');
        $RvW.rvwPreferences.set('app.state.leftTabActiveIndex', lti);

        const rti = $RvW.rightTabView.get('selection').get('index');
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
    air.trace('Exit process');

    if ($RvW.presentWindowOpen) {
        $RvW.presentationWindow.window.nativeWindow.removeEventListener(
            air.Event.CLOSE,
            presentWindowClosed
        );
        $RvW.presentationWindow.window.nativeWindow.close();
        if ($RvW.stageView && $RvW.stageWindow != null) {
            $RvW.stageWindow.window.nativeWindow.removeEventListener(
                air.Event.CLOSE,
                presentWindowClosed
            );
            $RvW.stageWindow.window.nativeWindow.close();
        }
    }
}
function firstTimeCheck() {
    var b = true;
    var a = fileExist("xml/version.xml", 1);
    if (!a) {
        b = setupVVersion();
    }
    var d = fileExist("xml/backgroundlist.xml", 1);
    if (!d) {
        b = setupVBkgnd();
    }
    var c = fileExist("xml/config.xml", 1);
    if (!c) {
        b = setupVConfig();
    }
    if (!a && !d && !c) {
        firstTimeFlag = true;
    }
    air.trace("First time check: " + b);
    return b;
}
function setupVVersion() {
    createFolder("xml");
    createFolder("bible");
    createFolder("notes");
    createFolder("song");
    createFolder("webroot");
    let a = copyFile2AppStorage("xml/version.xml", "xml/version.xml");
    if (!a) {
        return a;
    }
    a = copyFile2AppStorage("bible", "bible");
    if (!a) {
        return a;
    }
    a = copyFile2AppStorage("webroot", "webroot");
    if (!a) {
        return a;
    }
    a = copyFile2AppStorage("song/default.db", "song/default.db");
    if (!a) {
        return a;
    }
    a = copyFile2AppStorage("song/words.db", "song/words.db");
    if (!a) {
        return a;
    }
    return a;
}
function setupVBkgnd() {
    let a = copyFile2AppStorage("xml/backgroundlist.xml", "xml/backgroundlist.xml");
    if (!a) {
        return a;
    }
    a = copyFile2AppStorage("background", "background");
    if (!a) {
        return a;
    }
    return a;
}

function onMainWindowKeyUp(evt) {
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
            closePresentWindowMain();
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
        case 84: /* T */
            if (b == null) {
                call_showTheme();
            }
            break;
        case 119: /* F8 */
            if (!apple) {
                pluckapple();
            }
    }
}

function setupVConfig() {
    const a = copyFile2AppStorage("xml/config.xml", "xml/config.xml");
    if (!a) {
        return a;
    }
    return a;
}

$RvW.booknames = [];
$RvW.english_booknames = [];

// FIXME: fix the callback hell
/**
 * @param {YUI} Y
 */
export function start(Y) {
    document.body.addEventListener("keyup", onMainWindowKeyUp);

    SplashScreen.show();

    if (!firstTimeCheck()) {
        Toast.show(
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
            air.trace(e);
        }

        break TEST;
    }

    function proceed() {
        $RvW.booknames = $RvW.english_booknames;
        $RvW.default_booknames = $RvW.english_booknames;

        $RvW.vvConfigObj = new Config();
        $RvW.vvConfigObj.load(vvinit_continue);

        $RvW.learner = new WordLearner();
        $RvW.wordbrain = new WordBrain();
    }

    loadPreferences(() => {
        $RvW.systemFontList = $RvW.systemFontList.concat([
            ...loadInstalledFonts().map((font) => font.fontName),
        ]);

        loadBibleInfo('en-US', function (e, data) {
            if (e) {
                alert("[!] LoadBibleInfo: " + e);
                return;
            }

            const [numChMap] = data;
            $RvW.numofch = numChMap;

            const bookNamesMap = {
                'en-US': 'english_booknames',
            };

            const done = [];

            for (const bibleId of Object.keys(bookNamesMap)) {
                const bookNamesKey = bookNamesMap[bibleId];

                loadBibleBookNames(bibleId, function (e, data) {
                    if (e) {
                        alert("[!] LoadBibleBookNames: " + e);
                        return;
                    }

                    const { booknames } = data;
                    $RvW[bookNamesKey] = booknames;

                    done.push(data);

                    if (done.length === Object.keys(bookNamesMap).length) {
                        proceed();
                    }
                });
            }
        });
    });
}
