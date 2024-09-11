import {getVerseFromArray} from "./manager";
import {$RvW} from "@/rvw";
import {selectedTab, showVerseEditPanel} from "@stores/global";

export function setupVerseEditObject() {
    var b = $RvW.getBookValue();
    var d = $RvW.getChapterValue();
    var c = $RvW.getVerseValue();
    var a = $RvW.getSingleVerse(b, d, c, 1);
    $RvW.editVerse_UI_Obj.setValue(b, d, c, a);
}

export class VerseEditUI {
    constructor() {
        this.show = show;
        this.hide = hide;
        this.setValue = setValue;

        let e, b, j;
        let l;
        let a;

        i();

        function i() {
            $("#updateVerseTextButton").click(function () {
                h();
                hide();
            });
            $("#cancelVerseTextButton").click(function () {
                hide();
            });
        }

        function h() {
            a = $("#updatedVerseTextDiv").val();
            var o = getVerseFromArray(e, b, j);
            $RvW.bibledbObj[1].updateVerse(e, b, j, a);
        }

        function setValue(o, t, p, q) {
            e = parseInt(o) + 1;
            b = parseInt(t) + 1;
            j = parseInt(p) + 1;
            l = q;
            l = l.substr(l.indexOf(" ") + 1);
            var r = $RvW.booknames[o] + " " + (parseInt(t) + 1) + ":" + (parseInt(p) + 1);
            $("#currentVerseRefDiv").html(r);
            $("#currentVerseTextDiv").html(l);
            $("#updatedVerseTextDiv").val(l);
            var s = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][6];
            $("#currentVerseTextDiv").css("font-family", s);
            $("#updatedVerseTextDiv").css("font-family", s);
        }

        function show() {
            air.trace("showing edit UI");
            selectedTab.set(0);
            showVerseEditPanel.set(true);
        }

        function hide() {
            showVerseEditPanel.set(false);
        }
    }
}