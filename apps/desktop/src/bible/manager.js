import {BibleDB} from "./db";
import {$RvW} from "@/rvw";
import {Toast} from "@app/toast";
import {presentationCtx} from "@app/presentation";
import {console} from "@/platform/adapters/air";
import {selectedBible} from "@stores/global";

$RvW.bibledbObj = [];
$RvW.queryCheckInterval = 100;

export function loadSQLBible(c, b) {
    $RvW.bibledbObj[b] = new BibleDB();
    if ($RvW.bibleVersionArray[c] == null) {
        c = 1;
        Toast.error("Bible Database", "Please select the Bible translation of choice");
        if (b === 1) {
            $RvW.vvConfigObj.set_version1(1);
        } else {
            $RvW.vvConfigObj.set_version2(1);
        }
    }
    const a = `./bible/${$RvW.bibleVersionArray[c][1]}`;
    $RvW.bibledbObj[b].init(a);
}
export function getdata(immediate) {
    const content1 = [];
    const content2 = [];

    const bookNum = parseInt($RvW.bookIndex) + 1;
    const chapterNum = parseInt($RvW.chapterIndex) + 1;

    let vx = 1;
    let d = getVerseFromArray(bookNum, chapterNum, vx);

    if (immediate) {
        for (let i = 0; i < $RvW.numofch[bookNum][chapterNum]; i++) {
            content1.push($RvW.bibledbObj[1].getSingleVerseFromBuffer(d - 1));
            content2.push($RvW.bibledbObj[2].getSingleVerseFromBuffer(d - 1));
            d++;
        }
        $RvW.content1 = content1;
        $RvW.content2 = content2;
        $RvW.updateVerseContainer_continue();
    } else {
        let h = setInterval(function () {
            if ($RvW.bibledbObj[1].isFullDataReady() && $RvW.bibledbObj[2].isFullDataReady()) {
                clearTimeout(h);
                for (let k = 0; k < $RvW.numofch[bookNum][chapterNum]; k++) {
                    content1.push($RvW.bibledbObj[1].getSingleVerseFromBuffer(d - 1));
                    content2.push($RvW.bibledbObj[2].getSingleVerseFromBuffer(d - 1));
                    d++;
                }
                $RvW.content1 = content1;
                $RvW.content2 = content2;
                $RvW.updateVerseContainer_continue();
            } else {
            }
        }, $RvW.queryCheckInterval);
    }
}

export function getdataONLY() {
    const content1 = [];
    const content2 = [];

    const bookNum = parseInt($RvW.bookIndex) + 1;
    const chapterNum = parseInt($RvW.chapterIndex) + 1;

    let vx = 1;

    let c = getVerseFromArray(bookNum, chapterNum, vx);

    for (let i = 0; i < $RvW.numofch[bookNum][chapterNum]; i++) {
        content1.push($RvW.bibledbObj[1].getSingleVerseFromBuffer(c - 1));
        content2.push($RvW.bibledbObj[2].getSingleVerseFromBuffer(c - 1));
        c++;
    }

    $RvW.content1 = content1;
    $RvW.content2 = content2;
}

export function getAllVersesFromChapter(d, k) {
    const h = [];
    const j = d * 1 + 1;
    const a = k * 1 + 1;
    let vx = 1;
    let f = getVerseFromArray(j, a, vx);
    const e = $RvW.numofch[j][a];
    for (let g = 0; g < e; g++) {
        h.push($RvW.bibledbObj[1].getSingleVerseFromBuffer(f - 1));
        f++;
    }
    return h;
}
function getdata_sql() {
    console.trace(
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
    const c = setInterval(function () {
        if ($RvW.bibledbObj[1].isDataReady() && $RvW.bibledbObj[2].isDataReady()) {
            clearTimeout(c);
            $RvW.content1 = $RvW.bibledbObj[1].getResultArray();
            $RvW.content2 = $RvW.bibledbObj[2].getResultArray();
            presentationCtx.p_last_index = $RvW.content1.length;
            $RvW.updateVerseContainer_continue();
        } else {
        }
    }, $RvW.queryCheckInterval);
}
export class verseClass {
    constructor(...argz) {
        let _text = "";
        let _bookNum = null;
        let _chapterNum = null;
        let _verseNum = null;
        let _elId = null;
        let _font = null;
        let e = false;

        this.presentVerse = onClick;

        init(...argz);

        function init(elId, verseText, bookNum, chapterNum, verseNum, verseFont, s) {
            _elId = elId;
            _text = verseText;
            _bookNum = bookNum;
            _chapterNum = chapterNum;
            _verseNum = verseNum;
            _font = verseFont;
            e = s !== false;

            document.getElementById(_elId).style.fontSize = $RvW.vvConfigObj.get_navFontSize() + "px";
            document.getElementById(_elId).style.fontFamily = _font;
            document.getElementById(_elId).innerHTML = '<a href="#">' + _text + "</a>";

            setupEventListeners();
        }

        function setupEventListeners() {
            document.getElementById(_elId).addEventListener("click", onClick, false);
        }

        function onClick() {
            const n = $RvW.bookIndex;
            const m = $RvW.chapterIndex;
            const o = $RvW.verseIndex;

            $RvW.bookIndex = _bookNum - 1;
            $RvW.chapterIndex = _chapterNum - 1;
            $RvW.verseIndex = _verseNum - 1;

            $RvW.recentBibleRefs.addSelection($RvW.bookIndex, $RvW.chapterIndex, $RvW.verseIndex);

            getdata(true);

            presentationCtx.p_footer = $RvW.getFooter();
            presentationCtx.p_title = $RvW.booknames[$RvW.bookIndex] + " " + ($RvW.chapterIndex + 1);
            selectedBible.update((_l) => {
                const l = [..._l];
                l[2] = $RvW.verseIndex;
                console.trace("manager|h:", _l, l);
                return l;
            });
            $RvW.launch($RvW.verseIndex);
            if (e) {
                $RvW.scroll_to_view = false;
                $RvW.highlightVerse($RvW.verseIndex);
            }
            $RvW.bookIndex = n;
            $RvW.chapterIndex = m;
            $RvW.verseIndex = o;
            getdata(true);
        }
    }
}
export function getVerseFromArray(d, p, f) {
    let h = 0;

    const n = d;
    const l = p;
    const o = f;

    for (let i = 1; i < n; i++) {
        for (let j = 1; j <= $RvW.numofch[i][0]; j++) {
            h += $RvW.numofch[i][j];
        }
    }

    for (let i = 1; i < l; i++) {
        h += $RvW.numofch[n][i];
    }

    h += o;

    return h;
}
