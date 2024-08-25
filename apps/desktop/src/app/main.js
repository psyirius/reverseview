import * as $ from 'jquery';

import { WebEngine } from "@/remote/webengine";
import { WebServer } from "@/remote/webserver";
import { RemoteSetupUIPanel } from "@/remote/setup";
import { WordBrain } from "@/words/wordbrain";
import { WordLearner } from "@/words/wordlearner";
import { SongManager } from "@/song/manager";
import { SongNumber } from "@/song/number";
import { SongNav } from "@/song/nav";
import { setupMenu } from "@/menu";
import { SongEdit } from "@/song/edit";
import { NotesManager } from "@/notes/manage";
import { Notes, PostIt } from "@/notes/notes";
import { BibleSearch } from "@/bible/search";
import { GraphicsMgr } from "@/graphics/graphics";
import {setPrimaryBooknames} from "@/bible/booknames";
import {VerseEditUI} from "@/bible/edit";
import {BibleRecentRefManager} from "@/bible/recent";
import {BibleVersionSelector} from "@/setup";
import {Scheduler} from "@/schedule";
import {AppUpdater, AppUpdateUi} from "./update";
import { HelpUiPanel } from "./help";
import { Config, configInit, svParameterSaveEvent } from "./config";
import Preferences from './preferences';
import SplashScreen from './splash';
import Overlay from "./overlay";

import { setup as setupUI } from './ui/main';

// import * as dojoDom from 'dojo/dom';
// console.log("dojo/dom", dojoDom);

DEV: {
    // break DEV;

    console.log("Main.js", $RvW);
    console.log("NativeProcess support:", air.NativeProcess.isSupported);

    try {
        // const classPath = 'flash.utils.ByteArray';
        const classPath = 'air.net.websockets.WebSocketServer';

        let as3Val = window.runtime;

        const splits = classPath.split('.');
        while (splits.length > 0) {
            as3Val = as3Val[splits.shift()];
        }

        air.trace('[[[.....As3.....]]]: ' + String(as3Val));

        // const obj = new as3Val();
    } catch (e) {
        alert(">>>Error in As3 Object Resolver<<<: " + e);
    }

    // Make sure the remote is up-to-date
    rvw.common.copyFile2AppStorage("webroot", "webroot");
}

window.htmlLoader.addEventListener(runtime.flash.events.HTMLUncaughtScriptExceptionEvent.UNCAUGHT_SCRIPT_EXCEPTION, function(event) {
    event.preventDefault();

    air.trace(`>>>Uncaught Script Exception<<<: ${event.exceptionValue}`);
    for (const trace of event.stackTrace) {
        air.trace(`${trace.sourceURL}:${trace.line} - ${trace.functionName}`);
    }
});

// TODO:
// - Export global functions to be used in other files

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
$RvW.bibleVersionSelObj = null;
$RvW.remoteVV_UI_Obj = null;
$RvW.updateVV_UI_Obj = null;
$RvW.editVerse_UI_Obj = null;
$RvW.version_UI_Content = null;
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
    rvw.presentation.p_last_index = $RvW.content1.length - 1;
    var h = 0;
    h = rvw.presentation.p_last_index + 1;
    j = rvw.presentation.p_last_index;
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
    rvw.presentation.p_text1_arr = b;
    rvw.presentation.p_text2_arr = a;
    rvw.presentation.p_text1_font = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][6];
    rvw.presentation.p_text2_font = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version2()][6];
    rvw.presentation.p_current_index = k;
    rvw.presentation.p_last_index = j;
    rvw.presentation.p_bkgnd_filename = $RvW.graphicsObj.getBkgndFilename();
    rvw.presentation.p_bkgnd_motion = $RvW.graphicsObj.getMotionFlag();
    rvw.presentation.p_bkgnd_color = "blue";
    rvw.presentation.p_font_color = $RvW.vvConfigObj.get_p_textColor();
    rvw.presentation.p_font_color2 = $RvW.vvConfigObj.get_p_textColor2();
    rvw.presentation.p_ver1ScaleFactor = 1;
    rvw.presentation.p_ver2ScaleFactor = 1;
    if ($RvW.vvConfigObj.get_singleVersion()) {
        rvw.presentation.p_text_orientation = 2;
    } else {
        rvw.presentation.p_text_orientation = $RvW.vvConfigObj.get_p_text_orientation();
    }
    rvw.present.presentation();
}
$RvW.loadBookNames = function(a) {
    setPrimaryBooknames();
}
$RvW.getSingleVerse = function(j, f, k, e) {
    var l;
    var g = j * 1 + 1;
    var a = f * 1 + 1;
    var h = k * 1 + 1;
    var d = rvw.bible.getVerseFromArray(g, a, h);
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
    rvw.bible.getdata();
    rvw.presentation.p_footer = $RvW.getFooter();
    rvw.presentation.p_title = $RvW.booknames[$RvW.bookIndex] + " " + ($RvW.chapterIndex + 1);
    $RvW.launch($RvW.verseIndex);
    themeState = false;
    rvw.navigation.disableNavButtons(false);
}
$RvW.present_external = function(a, h, e) {
    var g = $RvW.bookIndex;
    var f = $RvW.chapterIndex;
    var d = $RvW.verseIndex;
    $RvW.bookIndex = a;
    $RvW.chapterIndex = h;
    $RvW.verseIndex = e;
    rvw.bible.getdataONLY();
    rvw.presentation.p_footer = $RvW.getFooter();
    rvw.presentation.p_title = $RvW.booknames[$RvW.bookIndex] + " " + ($RvW.chapterIndex * 1 + 1);
    $RvW.launch($RvW.verseIndex);
    themeState = false;
    $RvW.bookIndex = g;
    $RvW.chapterIndex = f;
    $RvW.verseIndex = d;
    rvw.bible.getdataONLY();
    rvw.navigation.disableNavButtons(false);
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
    if (parseInt(rvw.presentation.p_text_orientation) == 2) {
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
        rvw.presentation.p_title = "";
        rvw.presentation.p_footer = "";
        rvw.presentation.p_last_index = 0;
        $RvW.content1[0] = "";
        $RvW.content2[0] = "";
        rvw.presentation.p_current_index = 0;
        rvw.presentation.p_bkgnd_filename = $RvW.graphicsObj.getBkgndFilename();
        rvw.presentation.p_bkgnd_motion = $RvW.graphicsObj.getMotionFlag();
        rvw.presentation.p_bkgnd_color = "black";
        rvw.presentation.p_font_color = "white";
        rvw.presentation.p_font_color2 = "white";
        rvw.present.presentation();
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
    rvw.common.clearSelectList("bookList");
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
    rvw.common.clearSelectList("chapterList");
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
    rvw.common.clearSelectList("verseList");
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
    $("#book_name").text(e);
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
    var a = document.getElementById("navDualLanguageID").checked;
    $RvW.vvConfigObj.set_navDualLanguage(a);
    $RvW.bookIndex = document.getElementById("bookList").selectedIndex;
    $RvW.chapterIndex = document.getElementById("chapterList").selectedIndex;
    $RvW.verseIndex = document.getElementById("verseList").selectedIndex;
    rvw.bible.getdata();
}
$RvW.updateVerseContainer_continue = function() {
    var p = $RvW.content1.length;
    var n = "";
    n = n + "<table border=1>";
    if ($RvW.vvConfigObj.get_navDualLanguage()) {
        n =
            n +
            '<tr><td width="4%"></td><td width="48%"></td><td width="48%"></td></tr>';
    } else {
        n = n + '<tr><td width="4%"></td><td width="96%"></td></tr>';
    }
    for (let i = 0; i < p; i++) {
        var a = "TC_" + i;
        if ($RvW.vvConfigObj.get_navDualLanguage()) {
            n = n + '<tr class="vcClass" id="' + a + '"><td width="4%">';
            var h = "NC_" + i;
            n =
                n +
                '<div class="vcClassIcon" id="' +
                h +
                '"><img class="vcClassIcon" src="../graphics/icon/notes_s.png"></div>';
            n = n + '</td><td class="navtd" width="48%">';
            var h = "VC1_" + i;
            n = n + '<div class="vcClass" id="' + h + '">a</div>';
            n = n + '</td><td class="navtd" width="48%">';
            var h = "VC2_" + i;
            n = n + '<div class="vcClass" id="' + h + '">b</div>';
            n = n + "</td></tr>";
        } else {
            n = n + '<tr class="vcClass" id="' + a + '"><td width="4%">';
            var h = "NC_" + i;
            n =
                n +
                '<div class="vcClassIcon" id="' +
                h +
                '"><img class="vcClassIcon" src="../graphics/icon/notes_s.png"></div>';
            n = n + '</td><td class="navtd" width="96%">';
            var h = "VC1_" + i;
            n = n + '<div class="vcClass" id="' + h + '">x</div>';
            n = n + "</td></tr>";
        }
    }
    n = n + "</table>";
    document.getElementById("verseTab").innerHTML = n;
    var o = [];
    var c = [];
    var b = [];
    for (let i = 0; i < p; i++) {
        var m = "VC1_" + i;
        var g = "VC2_" + i;
        var e = "NC_" + i;
        o[i] = new PostIt();
        o[i].init(e, $RvW.bookIndex + 1, $RvW.chapterIndex + 1, i + 1);
        c[i] = new rvw.bible.verseClass();
        var l = $RvW.content1[i];
        var k = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][6];
        c[i].init(m, l, $RvW.bookIndex + 1, $RvW.chapterIndex + 1, i + 1, k);
        if ($RvW.vvConfigObj.get_navDualLanguage()) {
            b[i] = new rvw.bible.verseClass();
            var l = $RvW.content2[i];
            var k = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version2()][6];
            b[i].init(g, l, $RvW.bookIndex + 1, $RvW.chapterIndex + 1, i + 1, k);
        }
    }
    if ($RvW.notesObj != null) {
        var j = document.getElementById("nm_note_type1");
        if (j.checked) {
            $RvW.notesObj.getNotes(bookval, chval, 0);
        }
    }
    var d = $RvW.getVerseValue();
    $RvW.highlightVerse(d);
}

function loadPreferences(callback) {
    const appStorageDir = air.File.applicationStorageDirectory;
    const prefsFile = appStorageDir.resolvePath("settings/prefs.json");

    const _cb = (e, store) => {
        if (e) {
            alert("[!] LoadPreferences: " + e);
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

        nativeWindow.x = bounds.x;
        nativeWindow.y = bounds.y;
        nativeWindow.width = bounds.width;
        nativeWindow.height = bounds.height;

        if ((maximized === true) && (nativeWindow.displayState !== NativeWindowDisplayState.MAXIMIZED)) {
            nativeWindow.maximize();
        } else {
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
    setupConsole();

    rvw.ui.Toast.setup();
    rvw.ui.Prompt.setup();

    Overlay.setup();

    setTimeout(function () {
        var a = $RvW.vvConfigObj.get_bibleDBVersion() * 1;
        if (a == 1 && !firstTimeFlag) {
            var c = rvw.common.copyFile2AppStorage("xml/version.xml", "xml/version.xml");
            if (c) {
                c = rvw.common.copyFile2AppStorage("bible", "bible");
                if (c) {
                    $RvW.vvConfigObj.set_version1(1);
                    $RvW.vvConfigObj.set_version2(2);
                    $RvW.vvConfigObj.set_bibleDBVersion(2);
                    rvw.ui.Toast.show("VerseVIEW", "Bible Database update process completed.");
                } else {
                    rvw.ui.Toast.show(
                        "VerseVIEW",
                        "Bible Database update failed. Please contact verseview@yahoo.com"
                    );
                }
            } else {
                rvw.ui.Toast.show(
                    "VerseVIEW",
                    "Bible Database update failed. Please contact verseview@yahoo.com"
                );
            }
        }
        rvw.bible.loadBibleVersion();
        rvw.bible.loadSQLBible($RvW.vvConfigObj.get_version1(), 1);
        rvw.bible.loadSQLBible($RvW.vvConfigObj.get_version2(), 2);
        setupTabContent();

        SplashScreen.close();

        activateMainWindow();

        setupNavWindow();
        $RvW.loadBookNames($RvW.vvConfigObj.get_version1());
        $RvW.putbook();
        setupMenu();
        nativeWindow.addEventListener("resize", setupNavWindow);
        nativeWindow.addEventListener("close", $RvW.processExit);
        nativeWindow.addEventListener("closing", beforeExit);
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
    var a = document.getElementById("themeList").value;
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
    $RvW.bibleVersionSelObj = new BibleVersionSelector(loadViewTemplate("setup_biblesel"));

    $RvW.remoteVV_UI_Obj = new RemoteSetupUIPanel(loadViewTemplate("setup_remote"));
    $RvW.version_UI_Content = loadViewTemplate('version');

    setupTabViewTemplate("bible_verses", "bibleverseTab");
    setupTabViewTemplate("screens", "screenTab");

    $RvW.updateVV_UI_Obj = new AppUpdateUi(loadViewTemplate("setup_update"));

    fillTabs('configTab');

    setupTabViewTemplate("nav", "navTab");
    setupTabViewTemplate("search", "searchTab");
    setupTabViewTemplate("html", "notesTab");
    setupTabViewTemplate("schedule", "scheduleTab");
    setupTabViewTemplate("song_nav", "songNavTab");
    setupTabViewTemplate("song_lyrics", "lyricsTab");

    $RvW.notesManageObj = new NotesManager(firstTimeFlag);
    $RvW.notesObj = new Notes(loadViewTemplate("notesui"), 'notesPanelID');
    $RvW.searchObj = new BibleSearch("./bible/" + rvw.bible.getVersion1Filename());
    $RvW.webServerObj = new WebServer('webroot');
    $RvW.webEngineObj = new WebEngine();
    $RvW.bibleRefObj = new rvw.common.BibleReference();
    $RvW.editVerse_UI_Obj = new VerseEditUI(loadViewTemplate("bible_verse_edit"));
    $RvW.songNumberObj = new SongNumber();
    $RvW.songManagerObj = new SongManager(true, true);
    $RvW.songEditObj = new SongEdit(loadViewTemplate("song_edit"), loadViewTemplate('lyrics_create'));
    $RvW.songNavObj = new SongNav();
    $RvW.helpObj = new HelpUiPanel();
    $RvW.graphicsObj = new GraphicsMgr(loadViewTemplate("graphics"));

    if (!rvw.vu.isUpToDate() && !rvw.vu.task2Status()) {
        air.trace("About to copy webroot files...");
        const b = rvw.common.backupWebroot();
        if (b) {
            rvw.common.copyFile2AppStorage("webroot", "webroot");
            rvw.vu.task2Complete();
        }
        rvw.vu.checkVerUpdateFlags();
    }
}

const loadViewTemplate = function (name) {
    const filepath = `./views/${name}.html`;

    const { File, FileStream, FileMode } = air;
    const { applicationDirectory: appDir } = File;

    const file = appDir.resolvePath(filepath);

    const prefsFS = new FileStream();
    prefsFS.open(file, FileMode.READ);
    const data = prefsFS.readMultiByte(prefsFS.bytesAvailable, 'utf-8');
    prefsFS.close();

    return data;
}

function setupTabViewTemplate(name, mountPoint) {
    document.getElementById(mountPoint).innerHTML = loadViewTemplate(name);
    fillTabs(mountPoint);
}
function fillTabs(a) {
    switch (a) {
        case "navTab": {
            fillNav();
            break;
        }
        case "configTab": {
            rvw.bible.versionFill(true);
            configInit();
            break;
        }
        case 'scheduleTab': {
            $RvW.scheduleObj = new Scheduler();
            break;
        }
        case 'graphicsTab': {
            break;
        }
        case 'monitorTab': {
            break;
        }
        case 'searchField': {
            rvw.common.roundSearchBox(document.getElementById("adSearch"));
            break;
        }
        case 'screenTab': {
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
            break;
        }
    }
}

function updateBookNameVar() {
    const a = new XMLHttpRequest();
    a.onreadystatechange = function () {
        if (a.readyState < 4) {
            air.trace("BOOK NAME: Loading...");
        }
        if (a.readyState === 4) {
            const c = a.responseXML.documentElement;
            b(c);
        }
    };
    a.open("GET", "./xml/booknames.xml", false);
    a.send(null);
    function b(e) {
        air.trace("********Processing bookname");
        const d = e.getElementsByTagName("b").length;
        for (let c = 0; c < d; c++) {
            $RvW.booknames[c] = e.getElementsByTagName("b")[c].textContent;
        }
    }
}
function fillNav() {
    $RvW.putbook();
    $RvW.putch();
    document.getElementById("bookList").addEventListener("change", $RvW.putch, false);
    document
        .getElementById("chapterList")
        .addEventListener("change", $RvW.putver, false);
    document
        .getElementById("verseList")
        .addEventListener("change", verseChange, false);
    new rvw.common.ImageIcon(
        "searchButtonID",
        " SEARCH ",
        "graphics/icon/search_32.png",
        "graphics/icon/search_32.png",
        ""
    );
    document
        .getElementById("nav_bibleRef_presentID")
        .addEventListener("click", rvw.navigation.processNavBibleRef, false);
    document
        .getElementById("nav_bibleRef_findID")
        .addEventListener("click", rvw.navigation.processNavBibleRefFind, false);
    new rvw.common.ImageIcon(
        "nav_bibleRef_presentID",
        " QUICK PRESENT ",
        "graphics/icon/qpresent_24.png",
        "graphics/icon/qpresent_24.png",
        ""
    );
    new rvw.common.ImageIcon(
        "nav_bibleRef_findID",
        " FIND ",
        "graphics/icon/search_s.png",
        "graphics/icon/search_s.png",
        ""
    );
    document
        .getElementById("nav_bibleRefID")
        .addEventListener("blur", rvw.navigation.bibleRefBlur, false);
    document
        .getElementById("nav_bibleRefID")
        .addEventListener("focus", rvw.navigation.bibleRefFocus, false);

    // menubar buttons
    $("#icon_present").click(function () {
        const d = getActiveTabLabel();
        if (d === "Songs") {
            $RvW.songNavObj.sn_presentSong();
        } else {
            $RvW.present();
        }
    });
    $("#icon_blank").click(function () {
        rvw.common.blankSlide();
    });
    $("#icon_theme").click(function () {
        if ($RvW.presentationWindow != null) {
            $RvW.presentationWindow.window.showThemeProcess();
        }
    });
    $("#icon_logo").click(function () {
        rvw.common.showLogoSlide();
    });
    $("#icon_close").click(function () {
        rvw.present.closePresentWindowMain();
    });
    $("#icon_prev").click(function () {
        rvw.present.call_prevSlide();
    });
    $("#icon_next").click(function () {
        rvw.present.call_nextSlide();
    });

    // conditionally disable nav buttons
    $("#bibleAddScheduleButton").click(function () {
        rvw.navigation.nav_addVerse2Schedule();
    });

    rvw.navigation.disableNavButtons(true);
    $RvW.enterForSearchActive = true;
    updateRefMenu();

    $RvW.recentBibleRefs = new BibleRecentRefManager();
}

function setupLeftTabFrame() {
    const tabs = [
        {
            label: "Bible",
            content: '<div id="navTab">Bible</div>',
        },
        {
            label: "Songs",
            content: '<div id="songNavTab">Songs</div>',
        },
    ];

    const { TabView, Tab } = $Y;

    const tabview = new TabView();

    tabs.forEach((tabMeta, index) => {
        const tab = new Tab(tabMeta);
        tabview.add(tab, index);
    });

    tabview.render('#container');

    const lti = $RvW.rvwPreferences.get('app.state.leftTabActiveIndex', 0);
    tabview.selectChild(lti);

    tabview.after('selectionChange', (e) => {
        const currentTab = e.newVal;

        switch (currentTab.get('index')) {
            case 0: {
                $RvW.rightTabView.selectChild(0);
                break;
            }
            case 1: {
                $RvW.rightTabView.selectChild(1);
                break;
            }
        }
    });

    $RvW.leftTabView = tabview;
}
function setupRightTabFrame() {
    const tabs = [
        {
            label: "Verses",
            content: '<div id="bibleverseTab" class="tabSubContainer" >Loading Bible Database ... </div>',
        },
        {
            label: "Lyrics",
            content: '<div id="lyricsTab" class="tabSubContainer">Lyrics</div>',
        },
        {
            label: "Notes",
            content: '<div id="notesTab" class="notesTabSubContainer">Notes</div>',
        },
        {
            label: "Search",
            content: '<div id="searchTab">Search</div>',
        },
        {
            label: "Schedule",
            content: '<div id="scheduleTab">Schedule</div>',
        },
        {
            label: "Graphics",
            content: '<div id="graphicsTab">Graphics</div>',
        },
        {
            label: "Screens",
            content: '<div id="screenTab">Screens</div>',
        },
    ];

    const { TabView, Tab } = $Y;

    const tabview = new TabView();

    tabs.forEach((tabMeta, index) => {
        const tab = new Tab(tabMeta);
        tabview.add(tab, index);
    });

    tabview.render('#container2');

    const rti = $RvW.rvwPreferences.get('app.state.rightTabActiveIndex', 0);
    tabview.selectChild(rti);

    function menuBarSync(currentTab) {
        // air.trace('menuBarSync', currentTab.get('index'));

        switch (currentTab.get('index')) {
            case 0: {
                $("#lyrics_menu").hide();
                $("#verses_menu").show();
                break;
            }
            case 1: {
                $("#verses_menu").hide();
                $("#lyrics_menu").show();
                break;
            }
            default: {
                $("#verses_menu").hide();
                $("#lyrics_menu").hide();
                break;
            }
        }
    }

    menuBarSync(tabview.get('selection'));

    tabview.after('selectionChange', (e) => {
        const currentTab = e.newVal;

        menuBarSync(currentTab);

        // TODO: figure out store base tab sync
        switch (currentTab.get('index')) {
            case 0: {
                $RvW.leftTabView.selectChild(0);
                break;
            }
            case 1: {
                $RvW.leftTabView.selectChild(1);
                break;
            }
        }
    });

    $RvW.rightTabView = tabview;
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

        const windowState = {
            bounds: {
                x: nativeWindow.x,
                y: nativeWindow.y,
                width: nativeWindow.width,
                height: nativeWindow.height,
            },
            maximized: nativeWindow.displayState === NativeWindowDisplayState.MAXIMIZED,
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
            rvw.present.presentWindowClosed
        );
        $RvW.presentationWindow.window.nativeWindow.close();
        if ($RvW.stageView && $RvW.stageWindow != null) {
            $RvW.stageWindow.window.nativeWindow.removeEventListener(
                air.Event.CLOSE,
                rvw.present.presentWindowClosed
            );
            $RvW.stageWindow.window.nativeWindow.close();
        }
    }
}
function firstTimeCheck() {
    var b = true;
    var a = rvw.common.fileExist("xml/version.xml", 1);
    if (!a) {
        b = setupVVersion();
    }
    var d = rvw.common.fileExist("xml/backgroundlist.xml", 1);
    if (!d) {
        b = setupVBkgnd();
    }
    var c = rvw.common.fileExist("xml/config.xml", 1);
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
    rvw.common.createFolder("xml");
    rvw.common.createFolder("bible");
    rvw.common.createFolder("notes");
    rvw.common.createFolder("song");
    rvw.common.createFolder("webroot");
    let a = rvw.common.copyFile2AppStorage("xml/version.xml", "xml/version.xml");
    if (!a) {
        return a;
    }
    a = rvw.common.copyFile2AppStorage("bible", "bible");
    if (!a) {
        return a;
    }
    a = rvw.common.copyFile2AppStorage("webroot", "webroot");
    if (!a) {
        return a;
    }
    a = rvw.common.copyFile2AppStorage("song/default.db", "song/default.db");
    if (!a) {
        return a;
    }
    a = rvw.common.copyFile2AppStorage("song/words.db", "song/words.db");
    if (!a) {
        return a;
    }
    return a;
}
function setupVBkgnd() {
    let a = rvw.common.copyFile2AppStorage("xml/backgroundlist.xml", "xml/backgroundlist.xml");
    if (!a) {
        return a;
    }
    a = rvw.common.copyFile2AppStorage("background", "background");
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
                rvw.navigation.processNavBibleRef();
            }
            if ($RvW.songNavObj.isSongSearchEditActive()) {
                $RvW.songNavObj.sn_searchSong();
            }
            break;
        case 27: /* Escape */
            rvw.present.closePresentWindowMain();
            break;
        case 33: /* PageUp */
            rvw.present.call_prevSlide();
            break;
        case 34: /* PageDown */
            rvw.present.call_nextSlide();
            break;
        case 39: /* ArrowRight */
        case 40: /* ArrowDown */
            if (b == null) {
                rvw.present.call_nextSlide();
            }
            break;
        case 37: /* ArrowLeft */
        case 38: /* ArrowUp */
            if (b == null) {
                rvw.present.call_prevSlide();
            }
            break;
        case 84: /* T */
            if (b == null) {
                rvw.present.call_showTheme();
            }
            break;
        case 119: /* F8 */
            if (!rvw.common.apple) {
                rvw.common.pluckapple();
            }
    }
}

function setupVConfig() {
    const a = rvw.common.copyFile2AppStorage("xml/config.xml", "xml/config.xml");
    if (!a) {
        return a;
    }
    return a;
}
function getActiveTabLabel() {
    return $RvW.leftTabView.get('selection').get('label')
}

function newSQLConnection(db, callback, mode = air.SQLMode.READ) {
    const conn = new air.SQLConnection();

    conn.addEventListener(air.SQLEvent.OPEN, function (event) {
        if (!callback(null, conn, () => conn.close())) {
            conn.close();
        }
    });
    conn.addEventListener(air.SQLErrorEvent.ERROR, function (event) {
        callback(event.error, null);
        conn.close();
    });

    const dbFile = air.File.applicationStorageDirectory.resolvePath(db);
    conn.openAsync(dbFile, mode);
}

function executeSQL(conn, query, params, callback) {
    const stmt = new air.SQLStatement();
    stmt.sqlConnection = conn;
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            stmt.parameters[key] = String(value);
        });
    }
    stmt.text = query;

    stmt.addEventListener(air.SQLEvent.RESULT, function (event) {
        callback(null, event.target.getResult());
    });
    stmt.addEventListener(air.SQLErrorEvent.ERROR, function (event) {
        callback(event.error, null);
    });

    stmt.execute();
}

const bibleDbMap = {
    'en-US': 'kjv.db',
};

function loadBibleBookNames(bibleVersionId, callback) {
    newSQLConnection(`./bible/${bibleDbMap[bibleVersionId]}`, function (e, conn, closeConn) {
        if (e) {
            return callback(e);
        }

        // Get bible metadata
        executeSQL(conn, `
SELECT
    *
FROM
    configuration
;
`.trim(), null, function (e, result) {
            if (e) {
                return callback(e);
            }

            const rows = result.data;

            // will have only one row
            const {title, description, booknames, fonts} = rows[0];

            callback(null, {
                title,
                description,
                booknames: JSON.parse('[' + booknames + ']'),
                fonts: fonts.split(',').map((font) => font.trim()),
            });

            closeConn();
        });

        return true;
    }, air.SQLMode.READ);
}

function loadBibleInfo(bibleId, callback) {
    const numChMap = {};

    newSQLConnection(`./bible/${bibleDbMap[bibleId]}`, function (e, conn, closeConn) {
        if (e) {
            return callback(e);
        }

        // Get Num of chapters per book
        executeSQL(conn, `
SELECT
    bookNum,
    COUNT(DISTINCT chNum) AS numChapters
FROM
    words
GROUP BY
    bookNum
;
`.trim(), null, function (e, result) {
            if (e) {
                return callback(e);
            }

            const rows = result.data;

            rows.forEach(({ bookNum, numChapters }) => {
                // air.trace(bookNum, numChapters);
                numChMap[bookNum] = [numChapters];
            });

            // Get Num of verses per chapter
            executeSQL(conn, `
SELECT
    bookNum,
    chNum,
    COUNT(*) AS numVerses
FROM
    words
GROUP BY
    bookNum,
    chNum
;
`.trim(), null, function (e, result) {
                if (e) {
                    return callback(e);
                }

                const rows = result.data;

                rows.forEach(({ bookNum, chNum, numVerses }) => {
                    // air.trace(bookNum, chNum, numVerses);
                    numChMap[bookNum].push(numVerses);
                });

                // TODO: Verify

                callback(null, [numChMap]);

                closeConn();
            });
        });

        return true;
    }, air.SQLMode.READ);
}

$RvW.booknames = [];
$RvW.english_booknames = [];

// FIXME: fix the callback hell
/**
 * @param {YUI} Y
 */
export function start(Y) {
    setupUI();

    document.body.addEventListener("keyup", onMainWindowKeyUp);

    SplashScreen.show();

    if (!firstTimeCheck()) {
        rvw.ui.Toast.show(
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
        $RvW.wordbrain.init();
    }

    loadPreferences(() => {
        $RvW.systemFontList = $RvW.systemFontList.concat([
            ...loadInstalledFonts().map((font) => font.fontName),
        ]);

        setupLeftTabFrame();
        setupRightTabFrame();

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
