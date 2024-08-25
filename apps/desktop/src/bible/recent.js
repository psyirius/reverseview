import {getdata} from "@/bible/manager";
import {setBookChVer} from "@/navigation";

export class BibleRecentRefManager {
    maxNumElements = 30
    numElements = 0
    startIndex = 0
    nextIndex = 0
    bArray = []
    cArray = []
    vArray = []

    constructor() {
        this.numElements = 0;
        this.startIndex = 0;
        this.nextIndex = 0;
        this.bArray = [];
        this.cArray = [];
        this.vArray = [];
        air.trace("Initialized Recent Selection");
        this.displaySelection();
    }

    addSelection(d, h, f) {
        if (this.nextIndex !== 0) {
            const a = this.bArray[this.nextIndex - 1];
            const g = this.cArray[this.nextIndex - 1];
            const e = this.vArray[this.nextIndex - 1];
            if (a !== d || g !== h || e !== f) {
                this.bArray[this.nextIndex] = d;
                this.cArray[this.nextIndex] = h;
                this.vArray[this.nextIndex] = f;
                this.updateIndex();
                this.displaySelection();
            }
        } else {
            this.bArray[this.nextIndex] = d;
            this.cArray[this.nextIndex] = h;
            this.vArray[this.nextIndex] = f;
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
        // clear
        el.innerHTML = '';

        let b = this.numElements - 1;
        for (let i = 0; i < this.numElements; i++) {
            el.options[i] = new Option(a[b], b);
            b--;
        }
        el.selectedIndex = 0;
        el.addEventListener("click", () => this.presentFromRecent(), false);
    }

    presentFromRecent() {
        /** @type {HTMLSelectElement} */
        const el = document.getElementById('recentSel');

        const a = el.selectedIndex;
        if (a !== -1) {
            const b = el.options[el.selectedIndex].value;
            $RvW.bookIndex = this.bArray[b];
            $RvW.chapterIndex = this.cArray[b];
            $RvW.verseIndex = this.vArray[b];
            setBookChVer($RvW.bookIndex, $RvW.chapterIndex * 1 + 1, $RvW.verseIndex * 1 + 1);
            getdata(true);
            rvw.presentation.p_footer = `${$RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][3]} / ${$RvW.bibleVersionArray[$RvW.vvConfigObj.get_version2()][3]}`;
            rvw.presentation.p_title = $RvW.booknames[$RvW.bookIndex] + " " + ($RvW.chapterIndex + 1);
            $RvW.launch($RvW.verseIndex);
        }
    }

    data2string() {
        let a = "";
        for (i = 0; i < this.numElements; i++) {
            a += `${$RvW.booknames[this.bArray[i]]} ${this.cArray[i] + 1}:${this.vArray[i] + 1}|`;
        }
        air.trace("Recent list: " + a);
        return a;
    }
}
