import {ColorPickerPanel} from "./colorpicker";
import {$RvW} from "@/rvw";

export class GradientBackgroundColor {
    constructor() {
        this._color_start = null;
        this._color_end = null;
        this._orientation = null;
        this.IS_DEBUG = false;

        this.loadColors();
        this.attachButtonClickHandlers();
    }

    loadColors() {
        const color1 = $RvW.vvConfigObj.get_p_bkgnd_color1();
        this._debug("Color 1 from config file... " + color1);
        this._color_start = color1 || "#000000";

        const color2 = $RvW.vvConfigObj.get_p_bkgnd_color2();
        this._debug("Color 2 from config file... " + color2);
        this._color_end =color2 || "#FFFFFF";

        const orientation = $RvW.vvConfigObj.get_p_bkgnd_grad_orient();
        this._debug("Orientation of gradient... " + orientation);
        this._orientation = orientation || 0;

        this._updateOrientationPreview(this._orientation);
        this._updateGradientColorPreview();
    }

    attachButtonClickHandlers() {
        document.getElementById("changeGradColor1Button").addEventListener("click", () => this.onClickEditColor1(), false);
        document.getElementById("changeGradColor2Button").addEventListener("click", () => this.onClickEditColor2(), false);
        document.getElementById("resetGradColorButton").addEventListener("click", () => this.onClickReset(), false);
        document.getElementById("orientGradListID").addEventListener("change", () => this.onChangeOrientation(), false);
    }

    onClickEditColor1() {
        new ColorPickerPanel(this._color_start, 2);
    }

    onClickEditColor2() {
        new ColorPickerPanel(this._color_end, 3);
    }

    onChangeOrientation() {
        this._orientation = document.getElementById("orientGradListID").selectedIndex;
        this._updateGradientColorPreview();
        this.saveToConfig();
    }

    assignGradColor1(color) {
        this._debug("Assigning color 1 for gradient:", color);
        if (color[0] !== '#') {
            color = '#' + color;
        }
        this._color_start = color;
        this._debug(this._color_start);
        this._updateGradientColorPreview();
        this.saveToConfig();
    }

    assignGradColor2(color) {
        this._debug("Assigning color 2 for gradient:", color);
        if (color[0] !== '#') {
            color = '#' + color;
        }
        this._color_end = color;
        this._debug(this._color_end);
        this._updateGradientColorPreview();
        this.saveToConfig();
    }

    onClickReset() {
        this._color_start = "#000000";
        this._color_end = "#FFFFFF";
        this._orientation = 0;
        this._updateOrientationPreview(this._orientation);
        this._updateGradientColorPreview();
        this.saveToConfig();
    }

    _updateOrientationPreview(value) {
        document.getElementById("orientGradListID").selectedIndex = value;
    }

    _updateGradientColorPreview() {
        this._debug("Change box color 1: " + this._color_start);
        this._debug("Change box color 2: " + this._color_end);
        this._debug("Change box Orientation: " + this._orientation);

        const type = 'linear';

        let gradient = `-webkit-gradient(${type}, `;

        switch (parseInt(this._orientation)) {
            case 3:
                gradient += "0% 0%, 0% 100%";
                break;
            case 1:
                gradient += "0% 0%, 100% 0%";
                break;
            case 2:
                gradient += "0% 100%, 0% 0%";
                break;
            case 0:
                gradient += "100% 0%, 0% 0%";
                break;
            default:
                gradient += "0% 0%, 0% 100%";
        }

        gradient += `, from(${this._color_start}), to(${this._color_end}))`;

        const el = document.getElementById("graphics_grad_color_id");

        el.style.backgroundImage = 'url()'; // reset first (hack for a bug)
        el.style.backgroundImage = gradient;

        this._debug("Gradient Expr: " + gradient);
    }

    saveToConfig() {
        $RvW.vvConfigObj.set_p_bkgnd_color1(this._color_start);
        $RvW.vvConfigObj.set_p_bkgnd_color2(this._color_end);
        $RvW.vvConfigObj.set_p_bkgnd_grad_orient(this._orientation);
        $RvW.vvConfigObj.save();
    }

    _debug(...messages) {
        if (this.IS_DEBUG) {
            air.trace("[Graphics Gradient BG]:", ...messages);
        }
    }
}
