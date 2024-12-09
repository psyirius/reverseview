import {ColorPickerPanel} from "./colorpicker";
import {$RvW} from "@/rvw";

export class TextColor {
    constructor() {
        this.el = {
            primaryPreview: "graphics_text_color_1",
            secondaryPreview: "graphics_text_color_2",
            editButton: "changeTextColorButton",
            resetButton: "resetTextColorButton",
        }

        this._primary = "#FFFFFF";
        this._secondary = "#FFFFFF";

        this.loadPrimary();
        this.loadSecondary();

        this.updatePreviews();
        this.attachButtonClickHandlers();
    }

    loadPrimary() {
        const m = $RvW.vvConfigObj.get_p_textColor();
        if (m != null) {
            this._primary = m;
        }
    }

    loadSecondary() {
        const m = $RvW.vvConfigObj.get_p_textColor2();
        if (m != null) {
            this._secondary = m;
        }
    }

    attachButtonClickHandlers() {
        document
            .getElementById(this.el.editButton)
            .addEventListener("click", () => this.onClickEdit(), false);
        document
            .getElementById(this.el.resetButton)
            .addEventListener("click", () => this.onClickReset(), false);
    }

    onClickEdit() {
        new ColorPickerPanel(this._primary, 0);
    }

    assignTextColor(value) {
        this._primary = value;
        this.updatePreviews();
        this.updateConfig();
    }

    assignTextColor2(value) {
        this._secondary = value;
        this.updatePreviews();
        this.updateConfig();
    }

    onClickReset() {
        this._primary = "#FFFFFF";
        this._secondary = "#FFFFFF";
        this.updatePreviews();
        this.updateConfig();
    }

    updatePreviews() {
        document.getElementById(this.el.primaryPreview).style.background = this._primary;
        document.getElementById(this.el.secondaryPreview).style.background = this._secondary;
    }

    updateConfig() {
        $RvW.vvConfigObj.set_p_textColor(this._primary);
        $RvW.vvConfigObj.set_p_textColor2(this._secondary);
        $RvW.vvConfigObj.save();
    }
}
