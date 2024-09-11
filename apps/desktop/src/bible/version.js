import {BibleDB} from '@/bible/db';
import {BibleSearch} from "@/bible/search";
import {loadSQLBible} from "@/bible/manager";
import {Prompt} from "@app/prompt";
import {Toast} from "@app/toast";
import {clearSelectList, extractFileName, save2file} from "@app/common";
import {$RvW} from "@/rvw";
import {showBibleManagePanel} from "@stores/global";

$RvW.bibleVersionArray = ["", ""];

var new_fname,
    new_title,
    new_font,
    new_font_list,
    new_copyright,
    new_sizefactor,
    new_booknames,
    new_sel_font;
var bibleDB;
var dbFilename_hold = "";
var verFile = null;
var vdebug = true;

export function loadBibleVersion() {
    const b = "xml/version.xml";
    let file = air.File.applicationStorageDirectory.resolvePath(b);
    let c = new XMLHttpRequest();
    c.onreadystatechange = function () {
        if (c.readyState === 4) {
            let a = c.responseXML.documentElement;
            var f = a.getElementsByTagName("version").length;
            $RvW.bibleVersionArray[0][0] = "None";
            for (let i = 0; i < f; i++) {
                var d = i + 1;
                var e = a.getElementsByTagName("version")[i];
                $RvW.bibleVersionArray[d] = [];
                $RvW.bibleVersionArray[d][0] = e.getElementsByTagName("name")[0].textContent;
                $RvW.bibleVersionArray[d][1] = e.getElementsByTagName("file")[0].textContent;
                $RvW.bibleVersionArray[d][2] = e.getElementsByTagName("font")[0].textContent;
                $RvW.bibleVersionArray[d][3] =
                    e.getElementsByTagName("copyright")[0].textContent;
                $RvW.bibleVersionArray[d][4] =
                    e.getElementsByTagName("fontsizefactor")[0].textContent;
                $RvW.bibleVersionArray[d][5] =
                    e.getElementsByTagName("searchfile")[0].textContent;
                $RvW.bibleVersionArray[d][6] =
                    e.getElementsByTagName("selectedfont")[0].textContent;
                $RvW.bibleVersionArray[d][7] =
                    e.getElementsByTagName("booknames")[0].textContent;
            }
        }
    };
    c.open("GET", file.url, false);
    c.send(null);
}

export function versionFill(setup) {
    clearSelectList("version1Menu");
    clearSelectList("version2Menu");

    for (let i = 1; i < $RvW.bibleVersionArray.length; i++) {
        document.getElementById("version1Menu").options[i] = new Option(
            $RvW.bibleVersionArray[i][0],
            i
        );
        document.getElementById("version2Menu").options[i] = new Option(
            $RvW.bibleVersionArray[i][0],
            i
        );
    }

    document.getElementById("version1Menu").selectedIndex = $RvW.vvConfigObj.get_version1();
    document.getElementById("version2Menu").selectedIndex = $RvW.vvConfigObj.get_version2();

    document.getElementById("version1Text").innerHTML =
        "Primary: " + $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][0];
    document.getElementById("version2Text").innerHTML =
        "Secondary: " + $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version2()][0];

    document.getElementById("booknameStyle").selectedIndex = $RvW.vvConfigObj.get_booknamestyle() - 1;
    document.getElementById("englishList").checked = $RvW.vvConfigObj.get_listinenglish();
}

export function saveVersionSelection() {
    var f = $RvW.vvConfigObj.get_version1();
    var e = $RvW.vvConfigObj.get_version2();
    var b = document.getElementById("version1Menu").selectedIndex;
    var g = document.getElementById("version2Menu").selectedIndex;
    __versionDbg("****************" + b + "  " + g);
    __versionDbg(
        "****************" +
        $RvW.vvConfigObj.get_version1() +
        "  " +
        $RvW.vvConfigObj.get_version2()
    );
    if (b != f) {
        $RvW.bibledbObj[1].closeDB();
        $RvW.bibledbObj[1] = null;
        loadSQLBible(b, 1);
    }
    if (g != e) {
        $RvW.bibledbObj[2].closeDB();
        $RvW.bibledbObj[2] = null;
        loadSQLBible(g, 2);
    }
    if (b != f) {
        var a = "./bible/" + $RvW.bibleVersionArray[b][1];
        __versionDbg("             Search file...." + a);
        if ($RvW.searchObj != null) {
            $RvW.searchObj.close();
            $RvW.searchObj = null;
        }
        $RvW.searchObj = new BibleSearch(a);
        document.getElementById("searchID").disabled = false;
        document.getElementById("adSearch").disabled = false;
        document.getElementById("adSearchButton").disabled = false;
    }
    document.getElementById("version1Text").innerHTML =
        "Primary: " + $RvW.bibleVersionArray[b][0];
    document.getElementById("version2Text").innerHTML =
        "Secondary: " + $RvW.bibleVersionArray[g][0];
    $RvW.vvConfigObj.set_version1(b);
    $RvW.vvConfigObj.set_version2(g);
    var d = $("#booknameStyle option:selected").val();
    var c = $("#englishList").is(":checked");
    __versionDbg(d + "  " + c);
    $RvW.vvConfigObj.set_booknamestyle(d);
    $RvW.vvConfigObj.set_listinenglish(c);
    $RvW.loadBookNames();
    $RvW.putbook();
    $RvW.putch();
    $RvW.vvConfigObj.save();
    $RvW.updateVerseContainer();
}

function fillVersionPanel() {
    document.getElementById("selectVersionList").width = 80;
    document.getElementById("fontVersionList").width = 200;
    document
        .getElementById("selectVersionList")
        .addEventListener("change", updateVersionDetails, false);
    document
        .getElementById("addFontVersionButton")
        .addEventListener("click", addFontVersionBible, false);
    document
        .getElementById("okFontVersionButton")
        .addEventListener("click", addFontVersionBibleOK, false);
    verFile = new air.File();
    document.getElementById("versionVersionTextbox").disabled = true;
    document.getElementById("copyrightVersionTextarea").disabled = true;
    loadVersionList();
}

function loadVersionList() {
    air.trace("Load Version List function...");
    var a = $RvW.bibleVersionArray.length;
    air.trace("Number of version: " + a);
    clearSelectList("selectVersionList");
    for (let i = 1; i < a; i++) {
        document.getElementById("selectVersionList").options[i - 1] = new Option(
            $RvW.bibleVersionArray[i][0],
            i
        );
    }
    document.getElementById("selectVersionList").selectedIndex = 0;
    __versionDbg("About to update version details....");
    updateVersionDetails();
}

function updateVersionDetails() {
    var h = document.getElementById("selectVersionList").selectedIndex;
    var b = document.getElementById("selectVersionList").options[h].value;
    document.getElementById("versionVersionTextbox").value =
        $RvW.bibleVersionArray[b][0];
    document.getElementById("copyrightVersionTextarea").value =
        $RvW.bibleVersionArray[b][3];
    var g = $RvW.bibleVersionArray[b][2];
    var d = g.split(",");
    var j = d.length;
    document.getElementById("fontVersionList").options.length = 0;
    clearSelectList("fontVersionList");
    var f = 0;
    var c = true;
    for (var e = 0; e < j; e++) {
        document.getElementById("fontVersionList").options[f] = new Option(
            d[f],
            d[f]
        );
        var k = $RvW.specialFontList.indexOf(d[f]);
        if (k != -1) {
            c = false;
        }
        f++;
    }
    if (c) {
        j = $RvW.systemFontList.length;
        for (var e = 0; e < j; e++) {
            document.getElementById("fontVersionList").options[f] = new Option(
                $RvW.systemFontList[e],
                $RvW.systemFontList[e]
            );
            f++;
        }
    }
}

function deleteVersion() {
    var e = air.File.applicationStorageDirectory;
    var d = e.resolvePath("./xml/version.xml");
    var m = e.resolvePath("./xml/version.bak");
    d.copyTo(m, true);
    var j = document.getElementById("selectVersionList").selectedIndex;
    var a = document.getElementById("selectVersionList").options[j].value;
    var h = $RvW.bibleVersionArray[a][1];
    var o = "./bible/" + h;
    var c = e.resolvePath(o);
    var g = true;
    try {
        c.deleteFile();
    } catch (f) {
        g = false;
        Toast.show(
            "Bible Version",
            "Database in use. Please restart VerseVIEW and try deleting again."
        );
    } finally {
        if (g) {
            $RvW.bibleVersionArray.splice(a, 1);
            var b = generateVersionXML();
            var o = "./xml/version.xml";
            save2file(b, o, false);
            loadVersionList();
            var n = j * 1 + 1;
            var l = $RvW.vvConfigObj.get_version1();
            var k = $RvW.vvConfigObj.get_version2();
            if (n > l && n < k) {
                $RvW.vvConfigObj.set_version2($RvW.vvConfigObj.get_version2() - 1);
            }
            if (n < l && n > k) {
                $RvW.vvConfigObj.set_version1($RvW.vvConfigObj.get_version1() - 1);
            }
            if (n < l && n < k) {
                if (l < k) {
                    $RvW.vvConfigObj.set_version1($RvW.vvConfigObj.get_version1() - 1);
                    $RvW.vvConfigObj.set_version2($RvW.vvConfigObj.get_version2() - 1);
                } else {
                    $RvW.vvConfigObj.set_version2($RvW.vvConfigObj.get_version2() - 1);
                    $RvW.vvConfigObj.set_version1($RvW.vvConfigObj.get_version1() - 1);
                }
            }
            versionFill(false);
            $RvW.vvConfigObj.save();
        }
    }
}

export function deleteVersionConfirm() {
    var a = document.getElementById("selectVersionList").selectedIndex;
    var b = document.getElementById("selectVersionList").options[a].value;
    if (b === $RvW.vvConfigObj.get_version1() || b === $RvW.vvConfigObj.get_version2()) {
        Toast.show(
            "Manage Bible Database",
            "Can not delete the primary and seconday version."
        );
    } else {
        Prompt.exec(
            "Delete Version",
            "Are you sure you want to delete version?",
            function () {
                deleteVersion();
            }
        );
    }
}

export function saveVersion() {
    var b = document.getElementById("selectVersionList").selectedIndex;
    var d = document.getElementById("selectVersionList").options[b].value;
    var a = document.getElementById("fontVersionList").selectedIndex;
    var e = document.getElementById("fontVersionList").options[a].value;
    $RvW.bibleVersionArray[d][6] = e;
    $RvW.setFontForList();
    var f = generateVersionXML();
    var c = "./xml/version.xml";
    save2file(f, c, false);
    $RvW.updateVerseContainer();
}

function loadBibleDBEvent(a) {
    var b = a.currentTarget.nativePath;
    air.trace("Load Bible Event Processed: " + b);
    loadVersion(b);
}

export function loadVersion(d) {
    air.trace("Loading Version ....");
    dbFilename_hold = d;
    air.trace("filename: " + d);
    var g = d.split("\\");
    var h = g.length;
    var e = g[h - 1];
    var b = new air.File(d);
    var c = b.extension.toLowerCase();
    if (c != "db") {
        Toast.show("Bible Database", "Invalid VerseVIEW file.");
        return false;
    }
    var k = b.exists;
    if (!k) {
        Toast.show("Bible Database", "File does not exists.");
        return false;
    }
    var a = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][1];
    var f = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version2()][1];
    if (e == a || e == f) {
        Toast.show(
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
                    new_sel_font = new_font_list.split(",");
                    new_sel_font = new_sel_font[0];
                    new_booknames = m.getConfigBooknames();
                    continueLoadingDB();
                }
            }, 200);
        } else {
            Toast.show("Bible Database", "File not VerseVIEW database");
        }
    }
}

function continueLoadingZephania() {
    generateZephania2VVBibleXML();
    var a = $RvW.bibleVersionArray.length;
    var b = a;
    $RvW.bibleVersionArray.push(["", ""]);
    $RvW.bibleVersionArray[b][0] = new_title;
    $RvW.bibleVersionArray[b][1] = new_fname;
    $RvW.bibleVersionArray[b][2] = new_font_list;
    $RvW.bibleVersionArray[b][3] = new_copyright;
    $RvW.bibleVersionArray[b][4] = new_sizefactor;
    $RvW.bibleVersionArray[b][5] = "";
    $RvW.bibleVersionArray[b][6] = new_font;
    var d = generateVersionXML();
    var c = "./xml/version.xml";
    save2file(d, c, false);
    loadVersionList();
    versionFill(false);
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
                new_copyright =
                    bibleDB.getElementsByTagName("copyright")[0].textContent;
                new_sizefactor =
                    bibleDB.getElementsByTagName("sizefactor")[0].textContent;
                var d = new_font_list.split(",");
                new_font = d[0];
            }
        }
    };
    b.open("GET", a, false);
    b.send(null);
}

function extractDataFromZephania(d) {
    var b = d.split("/");
    var g = b.length;
    new_fname = b[g - 1];
    new_font_list = "Arial,Helvetica,sans-serif,Calibri";
    new_sizefactor = "1";
    var a = bibleDB.getElementsByTagName("INFORMATION")[0];
    if (a != null) {
        var e = bibleDB
            .getElementsByTagName("INFORMATION")[0]
            .getElementsByTagName("title")[0];
        if (e != null) {
            new_title = e.textContent;
        } else {
            new_title = "";
        }
        var c = bibleDB
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
    var c = new air.File(dbFilename_hold);
    var a = air.File.applicationStorageDirectory;
    var b = extractFileName(dbFilename_hold);
    a = a.resolvePath("bible/" + b);
    air.trace("Source: " + c.nativePath);
    air.trace("Destination: " + a.nativePath);
    c.copyTo(a, true);
    air.trace("Destination: " + a);
    return "./bible/" + b;
}

function continueLoadingDB() {
    var a = $RvW.bibleVersionArray.length;
    var b = a;
    air.trace("Version Array Length: " + a);
    $RvW.bibleVersionArray.push(["", ""]);
    $RvW.bibleVersionArray[b][0] = new_title;
    $RvW.bibleVersionArray[b][1] = new_fname;
    $RvW.bibleVersionArray[b][2] = new_font_list;
    $RvW.bibleVersionArray[b][3] = new_copyright;
    $RvW.bibleVersionArray[b][4] = "";
    $RvW.bibleVersionArray[b][5] = "";
    $RvW.bibleVersionArray[b][6] = new_sel_font;
    $RvW.bibleVersionArray[b][7] = new_booknames;
    save2file(generateVersionXML(), "./xml/version.xml", false);
    loadVersionList();
    versionFill(false);
}

function generateVersionXML() {
    let a = '<?xml version="1.0" encoding="UTF-8"?>\n';
    a += "<bibleversion>\n";
    for (let i = 1; i < $RvW.bibleVersionArray.length; i++) {
        a += "  <version>\n";
        a += "    <name>" + $RvW.bibleVersionArray[i][0] + "</name>\n";
        a += "    <file>" + $RvW.bibleVersionArray[i][1] + "</file>\n";
        a += "    <font>" + $RvW.bibleVersionArray[i][2] + "</font>\n";
        a += "    <copyright>" + $RvW.bibleVersionArray[i][3] + "</copyright>\n";
        a += "    <fontsizefactor>" + $RvW.bibleVersionArray[i][4] + "</fontsizefactor>\n";
        a += "    <searchfile>" + $RvW.bibleVersionArray[i][5] + "</searchfile>\n";
        a += "    <selectedfont>" + $RvW.bibleVersionArray[i][6] + "</selectedfont>\n";
        a += "    <booknames>" + $RvW.bibleVersionArray[i][7] + "</booknames>\n";
        a += "  </version>\n";
    }
    a += "</bibleversion>\n";
    return a;
}

export function showBrowse() {
    const a = new runtime.Array();
    a.push(new air.FileFilter("VerseVIEW Bible Database", "*.db"));
    verFile.browseForOpen("Select VerseVIEW Bible Database", a);
    verFile.addEventListener(air.Event.SELECT, loadBibleDBEvent);
}

function addFontVersionBible() {
    showFontVersionBox();
}

function addFontVersionBibleOK() {
    var c = document.getElementById("selectVersionList").selectedIndex;
    var g = document.getElementById("selectVersionList").options[c].value;
    var b = $("#addFontVersionTextbox").val();
    b = b.trim();
    $RvW.bibleVersionArray[g][6] = b;
    var a = $RvW.bibleVersionArray[g][2].split(",");
    var f = $.inArray(b, a);
    if (f === -1) {
        Toast.show("Adding new font: " + b);
        $RvW.bibleVersionArray[g][2] = $RvW.bibleVersionArray[g][2] + "," + b;
    } else {
        Toast.show("Font " + b + " already available");
    }
    updateVersionDetails();
    hideFontVersionBox();
    var h = generateVersionXML();
    var d = "./xml/version.xml";
    save2file(h, d, false);
}

function showFontVersionBox() {
    $("#okFontVersionButton").show();
    $("#addFontVersionTextbox").show();
    $("#addFontVersionButton").hide();
}

function hideFontVersionBox() {
    $("#okFontVersionButton").hide();
    $("#addFontVersionTextbox").hide();
    $("#addFontVersionButton").show();
}

export function manageVersion() {
    showBibleManagePanel.set(true);
    fillVersionPanel();
    hideFontVersionBox();
}

export function processSingleVersion() {
    const a = document.getElementById("singleVersionBoxID").checked;
    $RvW.vvConfigObj.set_singleVersion(a);
    document.getElementById("version2Menu").disabled = !!$RvW.vvConfigObj.get_singleVersion();
    $RvW.vvConfigObj.save();
}

export function getVersion1Filename() {
    return $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][1];
}

export function getVersion1Font() {
    return $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][2];
}

export function getVersion1Name() {
    return $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][0];
}

export function updateVersionXML() {
    save2file(generateVersionXML(), "./xml/version.xml", false);
}

function __versionDbg(a) {
    if (vdebug) {
        air.trace("[Version.js].... " + a);
    }
}