import {SongPresenter} from "./present";
import {$RvW} from "@/rvw";

export class SongLyrics {
    constructor(song, elId, slideIndex, langIndex) {
        let html = '';
        if (langIndex === 1) {
            html = `<a href="#">${song.slides[slideIndex]}</a>`;
        } else {
            const f = song.slides2[slideIndex];
            if (f != null) {
                html = `<a href="#">${f}</a>`;
            }
        }

        const el = document.getElementById(elId);

        el.innerHTML = html;
        el.style.padding = "10px";
        el.style.backgroundColor = $RvW.highlightColor;
        el.style.borderRadius = "10px";
        el.addEventListener("click", () => (new SongPresenter(song)).present(slideIndex), false);
    }
}
