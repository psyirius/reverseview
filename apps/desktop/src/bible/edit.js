import {getVerseFromArray} from "./manager";
import {$RvW} from "@/rvw";

export function setupVerseEditObject() {
    var b = $RvW.getBookValue();
    var d = $RvW.getChapterValue();
    var c = $RvW.getVerseValue();
    var a = $RvW.getSingleVerse(b, d, c, 1);
    $RvW.editVerse_UI_Obj.setValue(b, d, c, a);
}

const INNER_HTML = `
<div class="ui form container segment">

    <div id="generalPanelDIV_delete" class="ui grid bibleEditDIV">

        <div class="column">
            <div class="form-group row field">
                <label>Reference</label>
                <div id="currentVerseRefDiv"></div>
            </div>

            <div class="form-group row field">
                <label>Current Verse Text</label>
                <div rows="3" id="currentVerseTextDiv"></div>
            </div>

            <div class="form-group row field">
                <label>Updated Verse Text</label>
                <textarea rows="3" id="updatedVerseTextDiv"></textarea>
            </div>

            <div class="form-group row field">
                <button class="ui primary button" id="updateVerseTextButton" >UPDATE</button>
                <button class="ui primary button" id="cancelVerseTextButton" >CANCEL</button>
            </div>

        </div>

    </div>

</div>
`;

export class VerseEditUI {
    constructor() {
        this.show = show;
        this.hide = hide;
        this.setValue = setValue;

        let e, b, j;
        let l;
        let a;
        let _panel = null;
        const _body = INNER_HTML;

        init();

        function init() {
            c();
            i();
        }
        function c() {
            _panel = new YAHOO.widget.Panel("verseedit_panelObj", {
                width: "600px",
                height: "200px",
                fixedcenter: true,
                modal: true,
                visible: false,
                constraintoviewport: true,
            });
            _panel.render(document.body);
            _panel.setHeader("Edit Bible Verse");
            _panel.setBody(_body);
            _panel.hide();
            _panel.bringToTop();
        }
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
            _panel.show();
            _panel.bringToTop();
        }
        function hide() {
            _panel.hide();
        }
    }
}