import {ColorPickerPanel} from "./colorpicker";
import {$RvW} from "@/rvw";

export class GradiantBackgroundColor {
    constructor() {
        this.assignGradColor1 = assignGradColor1;
        this.assignGradColor2 = assignGradColor2;

        var p;
        var n;
        var f;

        const IS_DEBUG = false;

        e();
        m();

        function e() {
            {
                const r = $RvW.vvConfigObj.get_p_bkgnd_color1();
                __debug("Color 1 from config file... " + r);
                if (r != null) {
                    p = r;
                } else {
                    p = "#000000";
                }
            }
            {
                const r = $RvW.vvConfigObj.get_p_bkgnd_color2();
                __debug("Color 2 from config file... " + r);
                if (r != null) {
                    n = r;
                } else {
                    n = "#FFFFFF";
                }
            }
            {
                const s = $RvW.vvConfigObj.get_p_bkgnd_grad_orient();
                __debug("Orientation of gradient... " + s);
                if (s != null) {
                    f = s;
                } else {
                    f = 0;
                }
            }
            o(f);
            k();
        }
        function m() {
            document
                .getElementById("changeGradColor1Button")
                .addEventListener("click", h, false);
            document
                .getElementById("changeGradColor2Button")
                .addEventListener("click", g, false);
            document
                .getElementById("resetGradColorButton")
                .addEventListener("click", i, false);
            document
                .getElementById("orientGradListID")
                .addEventListener("change", a, false);
        }
        function h() {
            var r = new ColorPickerPanel(p, 2);
        }
        function g() {
            var r = new ColorPickerPanel(n, 3);
        }
        function a() {
            f = document.getElementById("orientGradListID").selectedIndex;
            k();
            b();
        }
        function assignGradColor1(r) {
            __debug("assigning color 1 for gradient: " + r);
            p = r;
            k();
            b();
        }
        function assignGradColor2(r) {
            n = r;
            k();
            b();
        }
        function i() {
            p = "000000";
            n = "FFFFFF";
            f = 0;
            o(f);
            k();
            b();
        }
        function o(r) {
            document.getElementById("orientGradListID").selectedIndex = r;
        }
        function k() {
            __debug("change box color 1: " + p);
            __debug("change box color 2: " + n);
            __debug("change box Orientation: " + f);
            var r = "";
            switch (f * 1) {
                case 3:
                    r = r + "-webkit-gradient(linear, 0% 0%, 0% 100%, from(#";
                    break;
                case 1:
                    r = r + "-webkit-gradient(linear, 0% 0%, 100% 0%, from(#";
                    break;
                case 2:
                    r = r + "-webkit-gradient(linear, 0% 100%, 0% 0%, from(#";
                    break;
                case 0:
                    r = r + "-webkit-gradient(linear, 100% 0%, 0% 0%, from(#";
                    break;
                default:
                    r = r + "-webkit-gradient(linear, 0% 0%, 0% 100%, from(#";
            }
            r = r + p + "), to(#" + n + "))";
            document.getElementById("graphics_grad_color_id").style.backgroundImage =
                "url()";
            document.getElementById("graphics_grad_color_id").style.backgroundImage = r;
        }
        function b() {
            $RvW.vvConfigObj.set_p_bkgnd_color1(p);
            $RvW.vvConfigObj.set_p_bkgnd_color2(n);
            $RvW.vvConfigObj.set_p_bkgnd_grad_orient(f);
            $RvW.vvConfigObj.save();
        }
        function __debug(r) {
            if (IS_DEBUG) {
                air.trace("[Graphics Gradient Bkgnd]: " + r);
            }
        }
    }
}
