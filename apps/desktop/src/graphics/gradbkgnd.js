import {ColorPickerPanel} from "./colorpicker";
import {$RvW} from "@/rvw";
import {bgGradientAngle, bgGradientColor1, bgGradientColor2} from "@stores/global";

export class GradientBackgroundColor {
    constructor() {
        this._color_start = null;
        this._color_end = null;
        this._orientation = null;

        this.IS_DEBUG = false;

        this.loadConfig();
        this.attachButtonClickHandlers();

        bgGradientAngle.subscribe((value) => {
            (value !== this._orientation) && this.assignOrientation(value, true);
        });
    }

    loadConfig() {
        const color1 = $RvW.vvConfigObj.get_p_bkgnd_color1();
        this._debug("Color 1 from config file... " + color1);
        this._color_start = color1 || "#000000";

        const color2 = $RvW.vvConfigObj.get_p_bkgnd_color2();
        this._debug("Color 2 from config file... " + color2);
        this._color_end = color2 || "#FFFFFF";

        const orientation = $RvW.vvConfigObj.get_p_bkgnd_grad_orient();
        this._debug("Orientation of gradient... " + orientation);
        this._orientation = orientation || 0;

        this._updateOrientationPreview();
        this._updateColorInputFields();
        this._updateGradientColorPreview();
    }

    attachButtonClickHandlers() {
        document.getElementById("gfx-gradient-color-1")
            .addEventListener("click", () => this.onClickEditColor1(), false);
        document.getElementById("gfx-gradient-color-2")
            .addEventListener("click", () => this.onClickEditColor2(), false);
        document.getElementById("resetGradColor1Button")
            .addEventListener("click", () => this.onClickResetColor1(), false);
        document.getElementById("resetGradColor2Button")
            .addEventListener("click", () => this.onClickResetColor2(), false);

        document.getElementById("resetGradColorButton")
            .addEventListener("click", () => this.onClickReset(), false);

        document.getElementById("gfx-gradient-color-1-input")
            .addEventListener("input", (e) => this.onChangeGradientInput1(e), false);
        document.getElementById("gfx-gradient-color-1-input")
            .addEventListener("blur", (e) => this.onChangeGradientInputBlur(e), false);
        document.getElementById("gfx-gradient-color-1-input")
            .addEventListener("keyup", (e) => this.onChangeGradientInputKeyUp(e), false);

        document.getElementById("gfx-gradient-color-2-input")
            .addEventListener("input", (e) => this.onChangeGradientInput2(e), false);
        document.getElementById("gfx-gradient-color-2-input")
            .addEventListener("blur", (e) => this.onChangeGradientInputBlur(e), false);
        document.getElementById("gfx-gradient-color-2-input")
            .addEventListener("keyup", (e) => this.onChangeGradientInputKeyUp(e), false);

        document.getElementById("randomizeGradColorButton")
            .addEventListener("click", () => this.onClickRandomize(), false);
    }

    onChangeGradientInput1(e) {
        this.assignGradColor1(e.target.value, true);
    }

    onChangeGradientInput2(e) {
        this.assignGradColor2(e.target.value, true);
    }

    onChangeGradientInputKeyUp(e) {
        if (e.keyCode === 13 /* Enter */) {
            this._updateColorInputFields();
        }
    }

    onChangeGradientInputBlur(e) {
        this._updateColorInputFields();
    }

    randomColor() {
        let v = Math.floor(Math.random() * 0xff_ff_ff).toString(16);
        while (v.length < 6) {
            v = '0' + v;
        }
        return '#' + v;
    }

    randomOrientation() {
        return Math.floor(Math.random() * 360);
    }

    onClickRandomize() {
        this.assignGradColor1(this.randomColor())
        this.assignGradColor2(this.randomColor())
        this.assignOrientation(this.randomOrientation())
    }

    onClickEditColor1() {
        new ColorPickerPanel(this._color_start, 2);
    }

    onClickEditColor2() {
        new ColorPickerPanel(this._color_end, 3);
    }

    assignOrientation(value, input = false) {
        this._orientation = value;
        input || this._updateColorInputFields();
        this._updateOrientationPreview();
        this._updateGradientColorPreview();
        this.saveToConfig();
    }

    assignGradColor1(color, input= false) {
        this._debug("Assigning color 1 for gradient:", color);
        this._color_start = $Y.Color.toRGB(color);
        this._debug(this._color_start);
        input || this._updateColorInputFields();
        this._updateGradientColorPreview();
        this.saveToConfig();
    }

    assignGradColor2(color, input=false) {
        this._debug("Assigning color 2 for gradient:", color);
        this._color_end = $Y.Color.toRGB(color);
        this._debug(this._color_end);
        input || this._updateColorInputFields();
        this._updateGradientColorPreview();
        this.saveToConfig();
    }

    onClickResetColor1() {
        this._color_start = "#000000";
        this._updateColorInputFields();
        this._updateGradientColorPreview();
        this.saveToConfig();
    }

    onClickResetColor2() {
        this._color_end = "#FFFFFF";
        this._updateColorInputFields();
        this._updateGradientColorPreview();
        this.saveToConfig();
    }

    onClickReset() {
        this._color_start = "#000000";
        this._color_end = "#FFFFFF";
        this._orientation = 0;
        this._updateOrientationPreview();
        this._updateColorInputFields();
        this._updateGradientColorPreview();
        this.saveToConfig();
    }

    _updateColorInputFields() {
        bgGradientColor1.set($Y.Color.toHex(this._color_start));
        bgGradientColor2.set($Y.Color.toHex(this._color_end));
    }

    _updateOrientationPreview() {
        bgGradientAngle.set(this._orientation);
    }

    angleToCartesianCoords(angle) {
        // Normalize angle to be between 0 and 360
        angle = angle % 360;
        if (angle < 0) {
            angle += 360;
        }

        // Convert angle to a coordinate space where
        // 0,0 is top-left and 100,100 is bottom-right
        const radian = (angle * Math.PI) / 180;
        const x = Math.cos(radian);
        const y = Math.sin(radian);

        // Calculate start and end points
        const startX = (50 * (1 - x)).toFixed(2) + '%';
        const startY = (50 * (1 + y)).toFixed(2) + '%';
        const endX = (50 * (1 + x)).toFixed(2) + '%';
        const endY = (50 * (1 - y)).toFixed(2) + '%';

        // Return formatted gradient string
        return `${startX} ${startY}, ${endX} ${endY}`;
    }

    _updateGradientColorPreview() {
        this._debug("Change box color 1: " + this._color_start);
        this._debug("Change box color 2: " + this._color_end);
        this._debug("Change box Orientation: " + this._orientation);
        
        
        // -webkit-gradient(linear, 0% 0%, 0% 100%, from(#265071), to(#439AC1))

        // TODO: multi color stops
        const type = 'linear'; // linear

        let gradient = `-webkit-gradient(${type}, `;

        gradient += this.angleToCartesianCoords(this._orientation);

        gradient += `, from(${this._color_start}), to(${this._color_end}))`;

        // supports
        // gradient = '-webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(249,252,246,1)), color-stop(100%,rgba(187,230,191,1)))';

        document.getElementById("gfx-gradient-color-1").style.backgroundColor = this._color_start;
        document.getElementById("gfx-gradient-color-2").style.backgroundColor = this._color_end;

        const el = document.getElementById("gfx-gradient-color");

        el.style.backgroundImage = 'url()'; // reset first (hack for the air webkit bug)
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
