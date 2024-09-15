import {ColorPickerPanel} from "./colorpicker";
import {$RvW} from "@/rvw";

export class TextColor {
    constructor() {
        this.init = l;
        this.assignTextColor = e;
        this.assignTextColor2 = k;
        var i;
        var f;
        function l() {
            b();
            d();
            g();
            h();
        }
        function b() {
            var m = $RvW.vvConfigObj.get_p_textColor();
            if (m != null) {
                i = m;
            } else {
                i = "#FFFFFF";
            }
        }
        function d() {
            var m = $RvW.vvConfigObj.get_p_textColor2();
            if (m != null) {
                f = m;
            } else {
                f = "#FFFFFF";
            }
        }
        function h() {
            document
                .getElementById("changeTextColorButton")
                .addEventListener("click", a, false);
            document
                .getElementById("resetTextColorButton")
                .addEventListener("click", j, false);
        }
        function a() {
            var m = new ColorPickerPanel(i, 0);
        }
        function e(m) {
            i = m;
            g();
            c();
        }
        function k(m) {
            f = m;
            c();
        }
        function j() {
            i = "#FFFFFF";
            f = "#FFFFFF";
            g();
            c();
        }
        function g() {
            document.getElementById("graphics_text_color_id").style.background = i;
        }
        function c() {
            $RvW.vvConfigObj.set_p_textColor(i);
            $RvW.vvConfigObj.set_p_textColor2(f);
            $RvW.vvConfigObj.save();
        }
    }
}
