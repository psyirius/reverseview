import {SongPresenter} from "./present";
import {$RvW} from "@/rvw";

export class SongLyrics {
    constructor(h, g, i, l) {
        let d = null;
        let a = null;
        let e = 0;

        init(h, g, i, l);

        function init(h, g, i, l) {
            d = h;
            a = g;
            e = i;
            let j;
            if (l === 1) {
                j = '<a href="#">' + d.slides[e] + "</a>";
            } else {
                const f = d.slides2[e];
                if (f != null) {
                    j = '<a href="#">' + f + "</a>";
                }
            }
            document.getElementById(a).innerHTML = j;
            const k = document.getElementById(a);
            k.style.padding = "10px";
            k.style.backgroundColor = $RvW.highlightColor;
            k.style.borderRadius = "10px";
            document.getElementById(a).addEventListener("click", b, false);
        }

        function b() {
            const f = new SongPresenter(d);
            f.present(e);
        }
    }
}
