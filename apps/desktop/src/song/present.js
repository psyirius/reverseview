!(function (exports) {
    class SongPresenter {
        constructor() {
            this.init = c;
            this.present = e;
            let d = new rvw.song.Song();

            function c(f) {
                d = f;
            }
            function a() {
                var f = d.slides2;
                if (f[0] == null) {
                    return true;
                }
                f = f[0].replace(/ /g, "");
                if (f == "") {
                    return true;
                } else {
                    return false;
                }
            }
            function e(g) {
                rvw.presentation.p_text1_arr = d.slides;
                rvw.presentation.p_text2_arr = d.slides2;
                rvw.presentation.p_text1_font = d.font;
                rvw.presentation.p_text2_font = d.font2;
                if ($RvW.vvConfigObj.get_p_showTitle()) {
                    rvw.presentation.p_title = d.name;
                } else {
                    rvw.presentation.p_title = "";
                }
                rvw.presentation.p_footer = d.copyright;
                if (g == null) {
                    rvw.presentation.p_current_index = 0;
                } else {
                    rvw.presentation.p_current_index = g;
                }
                rvw.presentation.p_last_index = d.slides.length - 1;
                rvw.presentation.p_bkgnd_filename = $RvW.graphicsObj.getBkgndFilename();
                rvw.presentation.p_bkgnd_motion = $RvW.graphicsObj.getMotionFlag();
                rvw.presentation.p_bkgnd_color = "blue";
                rvw.presentation.p_font_color = $RvW.vvConfigObj.get_p_textColor();
                rvw.presentation.p_font_color2 = $RvW.vvConfigObj.get_p_textColor2();
                rvw.presentation.p_ver1ScaleFactor = 2;
                rvw.presentation.p_ver2ScaleFactor = 2;
                var h = a();
                var f = $RvW.vvConfigObj.get_song_primaryOnly();
                if (f == "true" || h) {
                    rvw.presentation.p_text_orientation = "2";
                } else {
                    if ($RvW.vvConfigObj.get_song_text_orientation() == "0") {
                        rvw.presentation.p_text_orientation = "0";
                    } else {
                        rvw.presentation.p_text_orientation = "1";
                    }
                }
                rvw.present.presentation();
            }
            function b() {
                var h = [];
                var g = d.slides.length;
                for (var f = 0; f < g; f++) {
                    h[f] = "";
                }
                return h;
            }
        }
    }

    // Exports
    exports.SongPresenter = SongPresenter;
}(rvw.provide("rvw.song")));
