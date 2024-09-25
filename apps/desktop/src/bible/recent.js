import { setBookChVer } from "@/bible/navigation";
import { $RvW } from "@/rvw";

export class BibleRecentRefManager {
    maxNumElements = 30

    numElements = 0
    startIndex = 0
    nextIndex = 0

    bArray = []
    cArray = []
    vArray = []

    constructor() {
        this.displaySelection();
    }

    addSelection(book, chapter, verse) {
        if (this.nextIndex !== 0) {
            const b = this.bArray[this.nextIndex - 1];
            const c = this.cArray[this.nextIndex - 1];
            const v = this.vArray[this.nextIndex - 1];

            if (b !== book || c !== chapter || v !== verse) {
                this.bArray[this.nextIndex] = book;
                this.cArray[this.nextIndex] = chapter;
                this.vArray[this.nextIndex] = verse;

                this.updateIndex();
                this.displaySelection();
            }
        } else {
            this.bArray[this.nextIndex] = book;
            this.cArray[this.nextIndex] = chapter;
            this.vArray[this.nextIndex] = verse;

            this.updateIndex();
            this.displaySelection();
        }
    }

    updateIndex() {
        this.nextIndex++;
        this.numElements++;
    }

    displaySelection() {
        const a = [];
        for (let i = 0; i < this.numElements; i++) {
            a.push(`${$RvW.booknames[this.bArray[i]]} ${this.cArray[i] + 1}:${this.vArray[i] + 1}`)
        }

        /** @type {HTMLSelectElement} */
        const el = document.getElementById('recentSel');
        el.innerHTML = '';

        let b = this.numElements - 1;
        for (let i = 0; i < this.numElements; i++) {
            el.options[i] = new Option(a[b], b);
            b--;
        }
        el.selectedIndex = 0;
        el.addEventListener("click", (e) => this.selectRecent(e), false);
    }

    selectRecent(e) {
        /** @type {HTMLSelectElement} */
        const el = document.getElementById("recentSel");

        if (el.selectedIndex !== -1) {
            const b = el.options[el.selectedIndex].value;

            $RvW.bookIndex = this.bArray[b];
            $RvW.chapterIndex = this.cArray[b];
            $RvW.verseIndex = this.vArray[b];

            setBookChVer($RvW.bookIndex, Number($RvW.chapterIndex) + 1, Number($RvW.verseIndex) + 1);
        }
    }
}
