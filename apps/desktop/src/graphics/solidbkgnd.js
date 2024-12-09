import {ColorPickerPanel} from "./colorpicker";
import {$RvW} from "@/rvw";
import {bgSolidColor} from "@stores/global";

export class SolidBackgroundColor {
    constructor() {
        this._color = null;
        this.DEBUG = false;

        this.loadFromConfig();
        this.addEventsHandlers();
    }

    loadFromConfig() {
        const colorFromConfig = $RvW.vvConfigObj.get_p_solidBkgndColor();
        this.__debug("Color from config file... " + colorFromConfig);
        this._color = colorFromConfig || "#000000";
        this.updateInputField();
        this.updateColorPreview();
    }

    addEventsHandlers() {
        document.getElementById("gfx-solid-color")
            .addEventListener("click", () => this.onClickChange(), false);
        document.getElementById("gfx-solid-color-input")
            .addEventListener("input", (e) => this.onColorInput(e), false);
        document.getElementById("gfx-solid-color-input")
            .addEventListener("blur", (e) => this.onColorInputBlur(e), false);
        document.getElementById("gfx-solid-color-input")
            .addEventListener("keyup", (e) => this.onColorInputKeyUp(e), false);
        document.getElementById("resetBkgndColorButton")
            .addEventListener("click", () => this.onClickReset(), false);
    }

    onColorInput(e) {
        this.assignSolidColor(e.target.value, true);
    }

    onColorInputBlur(e) {
        this.updateInputField();
    }

    onColorInputKeyUp(e) {
        if (e.keyCode === 13 /* Enter */) {
            this.updateInputField();
        }
    }

    onClickChange() {
        new ColorPickerPanel(this._color, 1);
    }

    assignSolidColor(color, input=false) {
        this._color = $Y.Color.toRGB(color);
        input || this.updateInputField();
        this.updateColorPreview();
        this.saveConfig();
    }

    onClickReset() {
        this._color = "#000000";
        this.updateInputField();
        this.updateColorPreview();
        this.saveConfig();
    }

    updateInputField() {
        bgSolidColor.set($Y.Color.toHex(this._color));
    }

    updateColorPreview() {
        this.__debug("change box color: " + this._color);
        document.getElementById("gfx-solid-color").style.backgroundColor = this._color;
    }

    saveConfig() {
        $RvW.vvConfigObj.set_p_solidBkgndColor(this._color);
        $RvW.vvConfigObj.save();
    }

    __debug(...messages) {
        if (this.DEBUG) {
            air.trace("[Graphics Solid BG]: ", ...messages);
        }
    }
}
