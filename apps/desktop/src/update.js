

!(function (exports) {
    class Ui {
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

    // Exports
    exports.Ui = Ui;
}(rvw.provide("rvw.update")));