import {SongPresenter} from "./present";

export class SongLyrics {
    constructor() {
        this.init = c;
        var d = null;
        var a = null;
        var e = 0;
        function c(h, g, i, l) {
            d = h;
            a = g;
            e = i;
            if (l == 1) {
                var j = '<a href="#">' + d.slides[e] + "</a>";
            } else {
                var f = d.slides2[e];
                if (f != null) {
                    var j = '<a href="#">' + f + "</a>";
                }
            }
            document.getElementById(a).innerHTML = j;
            var k = document.getElementById(a);
            k.style.padding = "10px";
            k.style.backgroundColor = $RvW.highlightColor;
            k.style.borderRadius = "10px";
            document.getElementById(a).addEventListener("click", b, false);
        }
        function b() {
            var f = new SongPresenter();
            f.init(d);
            f.present(e);
        }
    }
}
