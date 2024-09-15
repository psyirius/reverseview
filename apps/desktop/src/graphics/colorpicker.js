import {$RvW} from "@/rvw";

export class ColorPickerPanel {
    constructor(initValueHex, kind) {
        this.show = show;

        let _dialog = null;
        let _picker = null;
        let _hexValue = initValueHex;

        document.getElementById('cp_panelx').innerHTML = `
        <div id="yui-picker-panel" class="yui-picker-panel">
            <div class="hd">Please choose a color:</div>
            <div class="bd">
                <div class="yui-picker" id="yui-picker"></div>
            </div>
            <div class="ft"></div>
        </div>
        `;

        _initDialog();

        function _initDialog() {
            if (kind === 0) {
                _dialog = new YAHOO.widget.Dialog("yui-picker-panel", {
                    width: "500px",
                    fixedcenter: true,
                    modal: false,
                    visible: true,
                    constraintoviewport: true,
                    buttons: [
                        {
                            text: "Color 1",
                            handler() {
                                $RvW.graphicsObj.assignColor(_hexValue, kind);
                            },
                            isDefault: true
                        },
                        {
                            text: "Color 2",
                            handler() {
                                $RvW.graphicsObj.assignColor(_hexValue, 4);
                            },
                            isDefault: true
                        },
                        {
                            text: "Close",
                            handler() {
                                _dialog.hide();
                            }
                        },
                    ],
                });
            } else {
                _dialog = new YAHOO.widget.Dialog("yui-picker-panel", {
                    width: "500px",
                    fixedcenter: true,
                    modal: false,
                    visible: true,
                    constraintoviewport: true,
                    buttons: [
                        {
                            text: "Submit",
                            handler() {
                                $RvW.graphicsObj.assignColor(_hexValue, kind);
                            },
                            isDefault: true
                        },
                        {
                            text: "Close",
                            handler() {
                                _dialog.hide();
                            }
                        }
                    ],
                });
            }
            _setupColorPicker();
            _dialog.hide();
            _dialog.render();
            _dialog.show();
            _dialog.bringToTop();
        }

        function _setupColorPicker() {
            _picker = new YAHOO.widget.ColorPicker("yui-picker", {
                container: _dialog,
                showcontrols: false,
                showhexcontrols: false,
                showhsvcontrols: false,
                showwebsafe: true,
                images: {
                    PICKER_THUMB: "graphics/picker_thumb.png",
                    HUE_THUMB: "graphics/hue_thumb.png",
                },
            });
            _picker.setValue(
                $Y.Color.toRGB(_hexValue),
                false
            );
            _picker.on("rgbChange", function () {
                _hexValue = _picker.get("hex");
            });
        }

        function show() {
            _dialog.show();
            _dialog.bringToTop();
        }
    }
}
