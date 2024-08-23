$RvW.bibledbObj = [];
$RvW.queryCheckInterval = 100;

function loadSQLBible(c, b) {
    $RvW.bibledbObj[b] = new BibleDB();
    if ($RvW.bibleVersionArray[c] == null) {
        c = 1;
        rvw.ui.Toast.show("Bible Database", "Please select the Bible translation of choice");
        if (b === 1) {
            $RvW.vvConfigObj.set_version1(1);
        } else {
            $RvW.vvConfigObj.set_version2(1);
        }
    }
    const a = `./bible/${$RvW.bibleVersionArray[c][1]}`;
    $RvW.bibledbObj[b].init(a);
}
function getdata(j) {
    var g = [];
    var f = [];
    var e = $RvW.bookIndex * 1 + 1;
    var a = $RvW.chapterIndex * 1 + 1;
    vx = 1;
    var d = getVerseFromArray(e, a, vx);
    var c = $RvW.numofch[e][a];
    if (j) {
        for (var b = 0; b < c; b++) {
            g.push($RvW.bibledbObj[1].getSingleVerseFromBuffer(d - 1));
            f.push($RvW.bibledbObj[2].getSingleVerseFromBuffer(d - 1));
            d++;
        }
        $RvW.content1 = g;
        $RvW.content2 = f;
        $RvW.updateVerseContainer_continue();
    } else {
        var h = null;
        h = setInterval(function () {
            if ($RvW.bibledbObj[1].isFullDataReady() && $RvW.bibledbObj[2].isFullDataReady()) {
                clearTimeout(h);
                for (var k = 0; k < c; k++) {
                    g.push($RvW.bibledbObj[1].getSingleVerseFromBuffer(d - 1));
                    f.push($RvW.bibledbObj[2].getSingleVerseFromBuffer(d - 1));
                    d++;
                }
                $RvW.content1 = g;
                $RvW.content2 = f;
                $RvW.updateVerseContainer_continue();
            } else {
            }
        }, $RvW.queryCheckInterval);
    }
}
function getdataONLY() {
    var f = new Array();
    var d = new Array();
    var g = $RvW.bookIndex * 1 + 1;
    var a = $RvW.chapterIndex * 1 + 1;
    vx = 1;
    var c = getVerseFromArray(g, a, vx);
    var b = $RvW.numofch[g][a];
    for (var e = 0; e < b; e++) {
        f.push($RvW.bibledbObj[1].getSingleVerseFromBuffer(c - 1));
        d.push($RvW.bibledbObj[2].getSingleVerseFromBuffer(c - 1));
        c++;
    }
    $RvW.content1 = f;
    $RvW.content2 = d;
}
function getAllVersesFromChapter(d, k) {
    var h = [];
    var j = d * 1 + 1;
    var a = k * 1 + 1;
    vx = 1;
    var f = getVerseFromArray(j, a, vx);
    var e = $RvW.numofch[j][a];
    for (var g = 0; g < e; g++) {
        h.push($RvW.bibledbObj[1].getSingleVerseFromBuffer(f - 1));
        f++;
    }
    return h;
}
function getdata_sql() {
    var b = new Array();
    var a = new Array();
    air.trace(
        "getdata_sql: Index in getdata  " +
        $RvW.bookIndex +
        " " +
        $RvW.chapterIndex +
        " " +
        $RvW.verseIndex
    );
    $RvW.bibledbObj[1].setBookNumber($RvW.bookIndex);
    $RvW.bibledbObj[1].setChapterNumber($RvW.chapterIndex);
    $RvW.bibledbObj[1].setVerseNumber($RvW.verseIndex);
    $RvW.bibledbObj[2].setBookNumber($RvW.bookIndex);
    $RvW.bibledbObj[2].setChapterNumber($RvW.chapterIndex);
    $RvW.bibledbObj[2].setVerseNumber($RvW.verseIndex);
    $RvW.bibledbObj[1].getChapter();
    $RvW.bibledbObj[2].getChapter();
    var c = null;
    c = setInterval(function () {
        if ($RvW.bibledbObj[1].isDataReady() && $RvW.bibledbObj[2].isDataReady()) {
            clearTimeout(c);
            $RvW.content1 = $RvW.bibledbObj[1].getResultArray();
            $RvW.content2 = $RvW.bibledbObj[2].getResultArray();
            p_last_index = $RvW.content1.length;
            $RvW.updateVerseContainer_continue();
        } else {
        }
    }, $RvW.queryCheckInterval);
}
class verseClass {
    constructor() {
        this.init = k;
        var i = "";
        var l = null;
        var b = null;
        var j = null;
        var a = null;
        var c = null;
        var e = false;
        function k(n, p, m, u, o, r, s) {
            a = n;
            i = p;
            l = m;
            b = u;
            j = o;
            c = r;
            if (s == false) {
                e = false;
            } else {
                e = true;
            }
            var q = $RvW.vvConfigObj.get_navFontSize() + "px";
            document.getElementById(a).style.fontSize = q;
            document.getElementById(a).style.fontFamily = r;
            document.getElementById(a).innerHTML = '<a href="#">' + i + "</a>";
            d();
        }
        function d() {
            document.getElementById(a).addEventListener("click", h, false);
        }
        function h() {
            var n = $RvW.bookIndex;
            var m = $RvW.chapterIndex;
            var o = $RvW.verseIndex;
            $RvW.bookIndex = l - 1;
            $RvW.chapterIndex = b - 1;
            $RvW.verseIndex = j - 1;
            $RvW.recentBibleRefs.addSelection($RvW.bookIndex, $RvW.chapterIndex, $RvW.verseIndex);
            getdata(true);
            $RvW.p_footer = $RvW.getFooter();
            $RvW.p_title = $RvW.booknames[$RvW.bookIndex] + " " + ($RvW.chapterIndex + 1);
            $RvW.launch($RvW.verseIndex);
            document.getElementById("verseList").selectedIndex = $RvW.verseIndex;
            if (e) {
                $RvW.scroll_to_view = false;
                $RvW.highlightVerse($RvW.verseIndex);
            }
            rvw.navigation.disableNavButtons(false);
            $RvW.bookIndex = n;
            $RvW.chapterIndex = m;
            $RvW.verseIndex = o;
            getdata(true);
        }
        function f() {
            air.trace("Mouse Over");
        }
        function g() {
            air.trace("Mouse Out");
        }
    }
}
function getVerseFromArray(d, p, f) {
    var h = 0;
    var n = d;
    var l = p;
    var o = f;
    for (var g = 1; g < n; g++) {
        var m = $RvW.numofch[g][0];
        for (var e = 1; e <= m; e++) {
            h += $RvW.numofch[g][e];
        }
    }
    var m = $RvW.numofch[n][0];
    for (var a = 1; a < l; a++) {
        h += $RvW.numofch[n][a];
    }
    h += o;
    return h;
}
