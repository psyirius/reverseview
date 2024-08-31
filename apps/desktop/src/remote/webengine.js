import {call_closePresentation, call_nextSlide, call_prevSlide} from "@/p_window";
import {blankSlide, showLogoSlide} from "@app/common";
import {$RvW} from "@/rvw";

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
            call_nextSlide();
        }

        function prevSlide() {
            call_prevSlide();
        }

        function closePresentation() {
            call_closePresentation();
        }

        function themePresentation() {
            if ($RvW.presentationWindow != null) {
                $RvW.presentationWindow.window.showThemeProcess();
            }
        }

        function logoPresentation() {
            showLogoSlide();
        }

        function blankPresentation() {
            blankSlide();
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
