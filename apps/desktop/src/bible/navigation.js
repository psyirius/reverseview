import {Toast} from "@/app/toast";
import {$RvW} from "@/rvw";
import {console} from "@/platform/adapters/air";
import {selectedBible} from "@stores/global";

function getNumofVerses() {
    return $RvW.numofch[$RvW.bookIndex + 1][$RvW.chapterIndex + 1];
}
function processNextButton() {
    console.trace("navigation.js: processNextButton()");
    var a;
    var b = getNumofVerses();
    if ($RvW.verseIndex + 1 === b) {
        a = 0;
    } else {
        a = $RvW.verseIndex + 1;
    }
    $RvW.verseIndex = a;
    $RvW.launch($RvW.verseIndex);
}
function processPrevButton() {
    var a;
    var b = getNumofVerses();
    if ($RvW.verseIndex + 1 === 1) {
        a = b - 1;
    } else {
        a = $RvW.verseIndex - 1;
    }
    $RvW.verseIndex = a;
    $RvW.launch($RvW.verseIndex);
}
export function processNavBibleRef() {
    var d = document.getElementById("nav_bibleRefID").value;
    var e = $RvW.bibleRefObj.init(d);
    if (e) {
        var c = $RvW.bibleRefObj.getBook();
        var b = $RvW.bibleRefObj.getChapter();
        var a = $RvW.bibleRefObj.getVerse();
        selectedBible.update((_l) => {
            const l = [..._l];
            l[0] = c;
            console.trace("processNavBibleRef:", _l, l);
            return l;
        });
        $RvW.putch(b - 1, true);
        $RvW.putver(a - 1);
        var f = null;
        f = setInterval(function () {
            if ($RvW.bibledbObj[1].isFullDataReady() && $RvW.bibledbObj[2].isFullDataReady()) {
                clearTimeout(f);
                $RvW.bibleRefObj.present();
                $RvW.scroll_to_view = true;
                $RvW.highlightVerse(a - 1);
            } else {
            }
        }, $RvW.queryCheckInterval);
    } else {
        Toast.show("Bible Reference", $RvW.bibleRefObj.getErrorMessage());
    }
}
export function processNavBibleRefFind() {
    var d = document.getElementById("nav_bibleRefID").value;
    var e = $RvW.bibleRefObj.init(d);
    if (e) {
        const c = $RvW.bibleRefObj.getBook();
        const b = $RvW.bibleRefObj.getChapter();
        const a = $RvW.bibleRefObj.getVerse();
        setBookChVer(c, b, a);
        $RvW.scroll_to_view = true;
        $RvW.highlightVerse(a - 1);
    } else {
        Toast.show("Bible Reference", $RvW.bibleRefObj.getErrorMessage());
    }
}
export function setBookChVer(a, e, d) {
    selectedBible.update((_l) => {
        const l = [..._l];
        l[0] = a;
        console.trace("navigation.js: setBookChVer():", _l, l);
        return l;
    });
    $RvW.putch(e - 1, true);
    $RvW.putver(d - 1);
}
export function bibleRefBlur() {
    $RvW.enterForBibleRef = false;
}
export function bibleRefFocus() {
    $RvW.enterForBibleRef = true;
}