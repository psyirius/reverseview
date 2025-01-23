// @ts-nocheck

import {BibleDB} from '@/bible/db';
import {BibleSearch} from "@/bible/search";
import {loadSQLBible} from "@/bible/manager";
import {Toast} from "@app/toast";
import {$RvW} from "@/rvw";
import {console} from "@/platform/adapters/air";
import {extractFileName, saveFileInAppStorage} from "@app/common";
import {currentBibleVersions, selectedBibleVersion1, selectedBibleVersion2} from "@stores/global";

export type BibleVersion = {
    name: string, // Name
    lang: string, // Lang/Locale (ex: en-US)[ISO 639-1]
    file: string, // File
    fonts: string, // Font (list of fonts separated by comma)
    selectedFont: string, // Selected Font (from the above font list)
    copyright: string, // Copyright
    fontSizeFactor: string, // Font Size Factor
    searchFile: string, // Search File
    rtl: boolean, // Right to Left
    bookNames: string, // Book Names
}

type BibleVersions = BibleVersion[];

export const BIBLE_VERSIONS: BibleVersions = [];

export function getPrimaryBibleVersion() {
    return BIBLE_VERSIONS[$RvW.vvConfigObj.get_version1()];
}

export function getSecondaryBibleVersion() {
    return BIBLE_VERSIONS[$RvW.vvConfigObj.get_version2()];
}

let new_fname,
    new_title,
    new_font,
    new_font_list,
    new_copyright,
    new_sizefactor,
    new_booknames,
    new_sel_font;
let bibleDB;
let dbFilename_hold = "";

export function loadBibleVersions() {
    const { FileStream, FileMode, File } = air;

    const file = File.applicationStorageDirectory.resolvePath("./bible/versions.json");
    const bvFS = new FileStream();
    bvFS.open(file, FileMode.READ);
    const data = bvFS.readMultiByte(bvFS.bytesAvailable, 'utf-8');
    bvFS.close();

    BIBLE_VERSIONS.push(...JSON.parse(data));
}

export function versionFill() {
    currentBibleVersions.set([...BIBLE_VERSIONS]);

    selectedBibleVersion1.set($RvW.vvConfigObj.get_version1());
    selectedBibleVersion2.set($RvW.vvConfigObj.get_version2());
}

export function saveVersionSelection(version1MenuSI, version2MenuSI, bookNameStyle) {
    const v1 = $RvW.vvConfigObj.get_version1();
    const v2 = $RvW.vvConfigObj.get_version2();

    if (version1MenuSI !== v1) {
        $RvW.bibledbObj[0].closeDB();
        $RvW.bibledbObj[0] = null;
        loadSQLBible(version1MenuSI, 0);
    }

    if (version2MenuSI !== v2) {
        $RvW.bibledbObj[1].closeDB();
        $RvW.bibledbObj[1] = null;
        loadSQLBible(version2MenuSI, 1);
    }

    if (version1MenuSI !== v1) {
        const dbFile = `./bible/${BIBLE_VERSIONS[version1MenuSI].file}`;

        if ($RvW.searchObj != null) {
            $RvW.searchObj.close();
            $RvW.searchObj = null;
        }

        $RvW.searchObj = new BibleSearch(dbFile);
        document.getElementById("searchID").disabled = false;
        document.getElementById("adSearch").disabled = false;
        document.getElementById("adSearchButton").disabled = false;
    }

    $RvW.vvConfigObj.set_version1(version1MenuSI);
    $RvW.vvConfigObj.set_version2(version2MenuSI);
    $RvW.vvConfigObj.set_booknamestyle(bookNameStyle);

    $RvW.loadBookNames();
    $RvW.putbook();
    $RvW.putch();

    $RvW.vvConfigObj.save();

    $RvW.updateVerseContainer();
}

export function fillVersionPanel() {
    loadVersionList();
}

function loadVersionList() {
    // TODO: update versions in manage dialog
}

export function deleteBibleVersion(bvi: number): boolean {
    const version = BIBLE_VERSIONS[bvi];

    if (version) {
        const appStorageDir = air.File.applicationStorageDirectory;
        const dbPath = appStorageDir.resolvePath(`./bible/${version.file}`);
        try {
            dbPath.deleteFile();
        } catch (e) {
            Toast.error(
                "Bible Version Manager",
                "Database in use. Please restart VerseVIEW and try deleting again."
            );
            return false;
        }

        BIBLE_VERSIONS.splice(bvi, 1);

        const v1 = $RvW.vvConfigObj.get_version1();
        const v2 = $RvW.vvConfigObj.get_version2();

        // adjust the indexes
        if (bvi < v1 && bvi > v2) {
            $RvW.vvConfigObj.set_version1($RvW.vvConfigObj.get_version1() - 1);
        }
        if (bvi > v1 && bvi < v2) {
            $RvW.vvConfigObj.set_version2($RvW.vvConfigObj.get_version2() - 1);
        }

        updateBibleVersionsJSON();
        versionFill();

        return true;
    }

    return false;
}

function loadBibleDBEvent(e) {
    const b = e.currentTarget.nativePath;
    console.trace("Load Bible Event Processed: " + b);
    loadVersion(b);
}

// TODO: do a checkup
export function loadVersion(d) {
    console.trace("Loading Version ....");
    dbFilename_hold = d;
    console.trace("filename: " + d);
    var g = d.split("\\");
    var h = g.length;
    var e = g[h - 1];
    var b = new air.File(d);
    var c = b.extension.toLowerCase();
    if (c !== "db") {
        Toast.error("Bible Database", "Invalid VerseVIEW file.");
        return false;
    }
    var k = b.exists;
    if (!k) {
        Toast.error("Bible Database", "File does not exists.");
        return false;
    }
    var a = getPrimaryBibleVersion().file;
    var f = getSecondaryBibleVersion().file;
    if (e == a || e == f) {
        Toast.error(
            "Manage Bible Database",
            "Bible database in use. Can not UPDATE the primary and seconday version. <br> Go to Bible > Select Version and select another Bible database and then update " +
            e +
            " Bible database"
        );
    } else {
        if (c == "db") {
            var m = new BibleDB();
            var j = copyDB();
            m.init(j, true);
            var l = null;
            l = setInterval(function () {
                if (m.isConfigDataReady()) {
                    clearTimeout(l);
                    new_fname = j.split("/")[2];
                    new_title = m.getConfigTitle();
                    new_copyright = m.getConfigCopyrights();
                    new_font_list = m.getConfigFonts();
                    new_sel_font = new_font_list.split(",")[0];
                    new_booknames = m.getConfigBooknames();
                    continueLoadingDB();
                }
            }, 200);
        } else {
            Toast.error("Bible Database", "File not VerseVIEW database");
        }
    }
}

function continueLoadingZephania() {
    generateZephania2VVBibleXML();

    BIBLE_VERSIONS.push({
        name: new_title,
        lang: '',
        file: new_fname,
        fonts: new_font_list,
        copyright: new_copyright,
        fontSizeFactor: new_sizefactor,
        searchFile: "",
        selectedFont: new_font,
        rtl: false,
        bookNames: new_booknames,
    });

    updateBibleVersionsJSON();
    loadVersionList();
    versionFill();
}

function extractInfo(a) {
    var b = null;
    bibleDB = null;
    b = new XMLHttpRequest();
    b.onreadystatechange = function () {
        if (b.readyState == 1) {
        }
        if (b.readyState == 4) {
            bibleDB = b.responseXML.documentElement;
            var c = bibleDB.getElementsByTagName("fname")[0];
            if (c == null) {
                extractDataFromZephania(a);
            } else {
                new_fname = bibleDB.getElementsByTagName("fname")[0].textContent;
                new_title = bibleDB.getElementsByTagName("title")[0].textContent;
                new_font_list = bibleDB.getElementsByTagName("font")[0].textContent;
                new_copyright = bibleDB.getElementsByTagName("copyright")[0].textContent;
                new_sizefactor = bibleDB.getElementsByTagName("sizefactor")[0].textContent;
                var d = new_font_list.split(",");
                new_font = d[0];
            }
        }
    };
    b.open("GET", a, false);
    b.send(null);
}

function extractDataFromZephania(d) {
    const b = d.split("/");
    new_fname = b[b.length - 1];
    new_font_list = ["Arial","Helvetica","sans-serif","Calibri"];
    new_sizefactor = 1;

    const a = bibleDB.getElementsByTagName("INFORMATION")[0];
    if (a != null) {
        const e = bibleDB
            .getElementsByTagName("INFORMATION")[0]
            .getElementsByTagName("title")[0];
        if (e != null) {
            new_title = e.textContent;
        } else {
            new_title = "";
        }
        const c = bibleDB
            .getElementsByTagName("INFORMATION")[0]
            .getElementsByTagName("publisher")[0];
        if (c != null) {
            new_copyright = c.textContent;
        } else {
            new_copyright = "";
        }
    } else {
        new_title = "";
        new_copyright = "";
    }
}

function copyDB() {
    const c = new air.File(dbFilename_hold);
    let a = air.File.applicationStorageDirectory;
    const b = extractFileName(dbFilename_hold);
    a = a.resolvePath("bible/" + b);
    console.trace("Source: " + c.nativePath);
    console.trace("Destination: " + a.nativePath);
    c.copyTo(a, true);
    console.trace("Destination: " + a);
    return `./bible/${b}`;
}

function continueLoadingDB() {
    BIBLE_VERSIONS.push({
        name: new_title,
        lang: '',
        file: new_fname,
        fonts: new_font_list,
        copyright: new_copyright,
        fontSizeFactor: '1',
        searchFile: '',
        selectedFont: new_sel_font,
        rtl: false,
        bookNames: new_booknames,
    })

    updateBibleVersionsJSON();
    loadVersionList();
    versionFill();
}

function generateVersionJSON() {
    return JSON.stringify(BIBLE_VERSIONS);
}

export function importBible() {
    const fileFilters = [
        new air.FileFilter("VerseVIEW Bible Database", "*.db")
    ];

    const verFile = new air.File();
    verFile.browseForOpen("Select VerseVIEW Bible Database", fileFilters);
    verFile.addEventListener(air.Event.SELECT, loadBibleDBEvent);
}

export function updateBibleVersionsJSON() {
    saveFileInAppStorage(generateVersionJSON(), "./bible/versions.json");
}