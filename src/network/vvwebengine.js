class vvWebEngine {
    constructor() {
        this.nextSlide = c;
        this.prevSlide = b;
        this.closePresentation = j;
        this.themePresentation = g;
        this.logoPresentation = f;
        this.blankPresentation = i;
        this.processVerses = a;
        this.processSong = h;
        this.stageViewContent = e;
        this.listOfSongs = k;
        function c() {
            call_nextSlide();
        }
        function b() {
            call_prevSlide();
        }
        function j() {
            call_closePresentation();
        }
        function g() {
            if (newWindow != null) {
                newWindow.window.showThemeProcess();
            }
        }
        function f() {
            showLogoSlide();
        }
        function i() {
            blankSlide();
        }
        function h(o) {
            var s = "";
            var l = o.name;
            var m = o.font;
            var q = o.font2;
            var n = o.slides;
            var t = o.slides2;
            var r = n.length;
            s = s + l + "<|>" + m + "<|>" + q + "<|>";
            for (var p = 0; p < r; p++) {
                s = s + n[p] + "<slide1>";
            }
            s = s + "<|>";
            for (var p = 0; p < r; p++) {
                if (t[p] != null) {
                    s = s + t[p] + "<slide2>";
                } else {
                    s = s + " <slide2>";
                }
            }
            return s;
        }
        function a(q, n, m, s) {
            var l = q.length;
            var r = n + "<break>";
            r = r + m + "<break>";
            r = r + s + "<break>";
            for (var p = 0; p < l; p++) {
                var o = q[p] + "<break>";
                r = r + o;
            }
            return r;
        }
        function k(l) {
            var m = "";
            m = "Song 1 | Song 2 | Song 3";
            return m;
        }
        function e() {
            return presentationContent;
        }
        function d(l) { }
    }
}