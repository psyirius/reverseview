import {Song} from '@/song/obj';
import {presentation} from "@/p_window";
import {presentationCtx} from "@app/presentation";
import {$RvW} from "@/rvw";

export class SongPresenter {
    constructor() {
        this.init = c;
        this.present = e;
        let d = new Song();

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
            presentationCtx.p_text1_arr = d.slides;
            presentationCtx.p_text2_arr = d.slides2;
            presentationCtx.p_text1_font = d.font;
            presentationCtx.p_text2_font = d.font2;
            if ($RvW.vvConfigObj.get_p_showTitle()) {
                presentationCtx.p_title = d.name;
            } else {
                presentationCtx.p_title = "";
            }
            presentationCtx.p_footer = d.copyright;
            if (g == null) {
                presentationCtx.p_current_index = 0;
            } else {
                presentationCtx.p_current_index = g;
            }
            presentationCtx.p_last_index = d.slides.length - 1;
            presentationCtx.p_bkgnd_filename = $RvW.graphicsObj.getBkgndFilename();
            presentationCtx.p_bkgnd_motion = $RvW.graphicsObj.getMotionFlag();
            presentationCtx.p_bkgnd_color = "blue";
            presentationCtx.p_font_color = $RvW.vvConfigObj.get_p_textColor();
            presentationCtx.p_font_color2 = $RvW.vvConfigObj.get_p_textColor2();
            presentationCtx.p_ver1ScaleFactor = 2;
            presentationCtx.p_ver2ScaleFactor = 2;
            var h = a();
            var f = $RvW.vvConfigObj.get_song_primaryOnly();
            if (f == "true" || h) {
                presentationCtx.p_text_orientation = "2";
            } else {
                if ($RvW.vvConfigObj.get_song_text_orientation() == "0") {
                    presentationCtx.p_text_orientation = "0";
                } else {
                    presentationCtx.p_text_orientation = "1";
                }
            }
            presentation();
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
