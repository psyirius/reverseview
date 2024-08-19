function setupVerseEditObject() {
    var b = $RvW.getBookValue();
    var d = $RvW.getChapterValue();
    var c = $RvW.getVerseValue();
    var a = $RvW.getSingleVerse(b, d, c, 1);
    $RvW.editVerse_UI_Obj.setValue(b, d, c, a);
}
class editVerse_UI_Class {
    constructor() {
        this.init = n;
        this.show = k;
        this.hide = f;
        this.setValue = d;
        var e, b, j;
        var l;
        var a;
        var m = null;
        var g = null;
        function n(o) {
            g = o;
            c();
            i();
        }
        function c() {
            m = new YAHOO.widget.Panel("verseedit_panelObj", {
                width: "600px",
                height: "200px",
                fixedcenter: true,
                modal: true,
                visible: false,
                constraintoviewport: true,
            });
            m.render(document.body);
            m.setHeader("Edit Bible Verse");
            m.setBody(g);
            m.hide();
            m.bringToTop();
        }
        function i() {
            $("#updateVerseTextButton").click(function () {
                h();
                f();
            });
            $("#cancelVerseTextButton").click(function () {
                f();
            });
        }
        function h() {
            a = $("#updatedVerseTextDiv").val();
            var o = getVerseFromArray(e, b, j);
            $RvW.bibledbObj[1].updateVerse(e, b, j, a);
        }
        function d(o, t, p, q) {
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
        function k() {
            air.trace("showing edit UI");
            m.show();
            m.bringToTop();
        }
        function f() {
            m.hide();
        }
    }
}
