// shared in both main and presenter

!(function (exports) {
    exports.p_text1_arr = [];
    exports.p_text2_arr = [];
    exports.p_text1_font = "";
    exports.p_text2_font = "";
    exports.p_title = "";
    exports.p_footer = "";
    exports.p_current_index = 0;
    exports.p_last_index = 0;
    exports.p_bkgnd_filename = "";
    exports.p_bkgnd_motion = false;
    exports.p_font_color = "";
    exports.p_font_color2 = "";
    exports.p_ver1ScaleFactor = 1;
    exports.p_ver2ScaleFactor = 1;
    exports.p_bkgnd_color = "000000";
    exports.p_text_orientation = "0";

    function savePresentationMargin() {
        let k = true;

        const e = document.getElementById("presentConfigMarginTop").value;
        const c = document.getElementById("presentConfigMarginBottom").value;
        const f = document.getElementById("presentConfigMarginLeft").value;
        const n = document.getElementById("presentConfigMarginRight").value;

        if (rvw.common.IsNumeric(e) && rvw.common.IsNumeric(c) && rvw.common.IsNumeric(f) && rvw.common.IsNumeric(n)) {
            $RvW.vvConfigObj.set_p_topMargin(e);
            $RvW.vvConfigObj.set_p_bottomMargin(c);
            $RvW.vvConfigObj.set_p_leftMargin(f);
            $RvW.vvConfigObj.set_p_rightMargin(n);
        } else {
            k = false;
            alert("Invalid entry for margin");
            document.getElementById("presentConfigMarginTop").value =
                $RvW.vvConfigObj.get_p_topMargin();
            document.getElementById("presentConfigMarginBottom").value =
                $RvW.vvConfigObj.get_p_bottomMargin();
            document.getElementById("presentConfigMarginLeft").value =
                $RvW.vvConfigObj.get_p_leftMargin();
            document.getElementById("presentConfigMarginRight").value =
                $RvW.vvConfigObj.get_p_rightMargin();
        }
        var v = document.getElementById("presentConfigMaxFontSize").value;
        if (rvw.common.IsNumeric(v)) {
            if (rvw.common.withinRange(30, 200, v)) {
                $RvW.vvConfigObj.set_p_maxFontSize(v);
            } else {
                k = false;
                alert("Maximum font size value out of Range");
                document.getElementById("presentConfigMaxFontSize").value =
                    $RvW.vvConfigObj.get_p_maxFontSize();
            }
        } else {
            k = false;
            alert("Invalid maximum font size value.");
            document.getElementById("presentConfigMaxFontSize").value =
                $RvW.vvConfigObj.get_p_maxFontSize();
        }
        var l = document.getElementById("presentConfigEnableTransition").checked;
        $RvW.vvConfigObj.set_p_enableTransition(l);
        var d = document.getElementById("presentConfigEnableSongTitle").checked;
        $RvW.vvConfigObj.set_p_showTitle(d);
        var g = document.getElementById("presentConfigEnableShadow").checked;
        $RvW.vvConfigObj.set_p_enableShadow(g);
        var q = document.getElementById("justify_left").checked;
        var z = document.getElementById("justify_center").checked;
        var a = document.getElementById("justify_right").checked;
        var i = "left";
        if (z) {
            i = "center";
        }
        if (a) {
            i = "right";
        }
        $RvW.vvConfigObj.set_p_align(i);
        var y = document.getElementById("porient_hori").checked;
        var h = document.getElementById("porient_vert").checked;
        var r = "0";
        if (h) {
            r = "1";
        }
        rvw.presentation.p_text_orientation = r;
        $RvW.vvConfigObj.set_p_text_orientation(rvw.presentation.p_text_orientation);
        var p = document.getElementById("showPrimaryFont").checked;
        if (p) {
            $RvW.vvConfigObj.set_song_primaryOnly("true");
        } else {
            $RvW.vvConfigObj.set_song_primaryOnly("false");
        }
        var y = document.getElementById("porient_song_hori").checked;
        var h = document.getElementById("porient_song_vert").checked;
        var r = "0";
        if (h) {
            r = "1";
        }
        $RvW.vvConfigObj.set_song_text_orientation(r);
        var x = document.getElementById("customLogoText1").value;
        var w = document.getElementById("customLogoText2").value;
        $RvW.vvConfigObj.set_logoText1(x);
        $RvW.vvConfigObj.set_logoText2(w);
        var t = document.getElementById("presentConfigShowDateTime").checked;
        var m = document.getElementById("presentConfigShowVVLogo").checked;
        var s = document.getElementById("presentConfigShowCustomLogo").checked;
        $RvW.vvConfigObj.set_showDateTime(t);
        $RvW.vvConfigObj.set_showVVLogo(m);
        $RvW.vvConfigObj.set_showCustomLogo(s);
        var j = document.getElementById("presentConfigOntop").checked;
        $RvW.vvConfigObj.set_presentationOnTop(j);
        var u = document.getElementById("show2LinesSlides").checked;
        $RvW.vvConfigObj.set_show2lines(u);
        var o = document.getElementById("hideStanzaNumber").checked;
        $RvW.vvConfigObj.set_hideStanzaNumber(o);
        var b = document.getElementById("fitLineSetup").checked;
        $RvW.vvConfigObj.set_pformat_multiplelines(b);
        if (k) {
            $RvW.vvConfigObj.save();
        }
    }

    // Exports
    exports.savePresentationMargin = savePresentationMargin;
}(rvw.provide("rvw.presentation")));
