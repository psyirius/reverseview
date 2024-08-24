export class WebEngine {
    constructor() {
        this.nextSlide = nextSlide;
        this.prevSlide = prevSlide;
        this.closePresentation = closePresentation;
        this.themePresentation = themePresentation;
        this.logoPresentation = logoPresentation;
        this.blankPresentation = blankPresentation;
        this.processVerses = processVerses;
        this.processSong = processSong;
        this.stageViewContent = stageViewContent;

        function nextSlide() {
            rvw.present.call_nextSlide();
        }

        function prevSlide() {
            rvw.present.call_prevSlide();
        }

        function closePresentation() {
            rvw.present.call_closePresentation();
        }

        function themePresentation() {
            if ($RvW.presentationWindow != null) {
                $RvW.presentationWindow.window.showThemeProcess();
            }
        }

        function logoPresentation() {
            rvw.common.showLogoSlide();
        }

        function blankPresentation() {
            rvw.common.blankSlide();
        }

        function processSong(song) {
            let p;
            let s = "";
            const l = song.name;
            const m = song.font;
            const q = song.font2;
            const n = song.slides;
            const t = song.slides2;
            const r = n.length;
            s = `${s + l}<|>${m}<|>${q}<|>`;
            for (p = 0; p < r; p++) {
                s = `${s + n[p]}<slide1>`;
            }
            s = `${s}<|>`;
            for (p = 0; p < r; p++) {
                if (t[p] != null) {
                    s = `${s + t[p]}<slide2>`;
                } else {
                    s = `${s} <slide2>`;
                }
            }
            return s;
        }

        function processVerses(q, n, m, s) {
            const l = q.length;
            let r = `${n}<break>`;
            r = `${r + m}<break>`;
            r = `${r + s}<break>`;
            for (let p = 0; p < l; p++) {
                const o = `${q[p]}<break>`;
                r = r + o;
            }
            return r;
        }

        function stageViewContent() {
            return $RvW.presentationContent;
        }
    }
}
