class colorPickerPanel {
    constructor() {
        this.init = n;
        this.show = k;
        var p = null;
        var i = null;
        var h = null;
        var o = null;
        var g = -1;
        var a = YAHOO.util.Color;
        function n(r, q) {
            o = r;
            g = q;
            i = m();
            document.getElementById("cp_panelx").innerHTML = i;
            c();
            j();
        }
        function c() {
            if (g == 0) {
                p = new YAHOO.widget.Dialog("yui-picker-panel", {
                    width: "500px",
                    fixedcenter: true,
                    modal: false,
                    visible: true,
                    constraintoviewport: true,
                    buttons: [
                        { text: "Color 1", handler: l, isDefault: true },
                        { text: "Color 2", handler: d, isDefault: true },
                        { text: "Close", handler: f },
                    ],
                });
            } else {
                p = new YAHOO.widget.Dialog("yui-picker-panel", {
                    width: "500px",
                    fixedcenter: true,
                    modal: false,
                    visible: true,
                    constraintoviewport: true,
                    buttons: [
                        { text: "Submit", handler: l, isDefault: true },
                        { text: "Close", handler: f },
                    ],
                });
            }
            b();
            p.hide();
            p.render();
            p.show();
            p.bringToTop();
        }
        function b() {
            h = new YAHOO.widget.ColorPicker("yui-picker", {
                container: p,
                showcontrols: false,
                showhexcontrols: false,
                showhsvcontrols: false,
                showwebsafe: true,
                images: {
                    PICKER_THUMB: "graphics/picker_thumb.png",
                    HUE_THUMB: "graphics/hue_thumb.png",
                },
            });
            (Event = YAHOO.util.Event), h;
            h.setValue(a.hex2rgb(o), false);
            h.on("rgbChange", e);
        }
        function m() {
            var q = "";
            q =
                '<div id="yui-picker-panel" class="yui-picker-panel"><div class="hd">Please choose a color:</div><div class="bd"><div class="yui-picker" id="yui-picker"></div></div><div class="ft"></div></div>';
            return q;
        }
        function j() { }
        function e() {
            o = h.get("hex");
        }
        function k() {
            p.show();
            p.bringToTop();
        }
        function l() {
            $RvW.graphicsObj.assignColor(o, g);
        }
        function d() {
            $RvW.graphicsObj.assignColor(o, 4);
        }
        function f() {
            p.hide();
        }
    }
}
