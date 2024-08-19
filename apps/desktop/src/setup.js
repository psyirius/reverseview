class BibleVersionSelector {
    constructor(bodyContent) {
        this.show = show;

        var c = null;
        var f = null;

        init(bodyContent);

        function init(h) {
            f = h;
            e();
            d();
        }
        function e() {
            c = new YAHOO.widget.Panel("panelObj2", {
                width: "300px",
                fixedcenter: true,
                modal: true,
                visible: false,
                constraintoviewport: true,
            });
            c.render(document.body);
            c.setHeader("Bible Version Selection");
            c.setBody(f);
            c.hide();
            c.bringToTop();
        }
        function d() { }
        function show() {
            c.show();
            c.bringToTop();
        }
        function b() {
            c.hide();
        }
    }
}
class RvwUpdate {
    constructor(bodyContent) {
        this.show = show;

        var b = null;
        var m_body = bodyContent;

        init();

        function init() {
            e();
            d();
        }

        function e() {
            b = new YAHOO.widget.Panel("panelObj5", {
                width: "300px",
                fixedcenter: true,
                modal: true,
                visible: false,
                constraintoviewport: true,
            });
            b.render(document.body);
            b.setHeader("VerseVIEW Updates");
            b.setBody(m_body);
            b.hide();
            b.bringToTop();
        }
        function d() { }
        function show() {
            b.show();
            b.bringToTop();
        }
        function c() {
            b.hide();
        }
    }
}
