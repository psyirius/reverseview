!(function (exports) {
    class RecentsManager {
        maxNumofElements = 30
        numofElements = 0
        startIndex = 0
        nextIndex = 0
        bArray = []
        cArray = []
        vArray = []

        constructor() {
            this.numofElements = 0;
            this.startIndex = 0;
            this.nextIndex = 0;
            this.bArray = [];
            this.cArray = [];
            this.vArray = [];
            air.trace("Initialized Recent Selection");
            this.dispSelection();
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
                    this.dispSelection();
                }
            } else {
                this.bArray[this.nextIndex] = d;
                this.cArray[this.nextIndex] = h;
                this.vArray[this.nextIndex] = f;
                this.updateIndex();
                this.dispSelection();
            }
        }

        updateIndex() {
            this.nextIndex++;
            this.numofElements++;
        }

        dispSelection() {
            const a = [];
            for (let i = 0; i < this.numofElements; i++) {
                a[i] = `${$RvW.booknames[this.bArray[i]]} ${this.cArray[i] + 1}:${this.vArray[i] + 1}`;
            }
            rvw.common.clearSelectList("recentSel");
            let b = this.numofElements - 1;
            for (i = 0; i < this.numofElements; i++) {
                document.getElementById("recentSel").options[i] = new Option(a[b], b);
                b--;
            }
            document.getElementById("recentSel").selectedIndex = 0;
            document
                .getElementById("recentSel")
                .addEventListener("click", this.presentFromRecent, false);
        }

        presentFromRecent(c) {
            const a = document.getElementById("recentSel").selectedIndex;
            if (a !== -1) {
                const el = document.getElementById("recentSel");
                const b = el.options[el.selectedIndex].value;
                $RvW.bookIndex = this.bArray[b];
                $RvW.chapterIndex = this.cArray[b];
                $RvW.verseIndex = this.vArray[b];
                rvw.navigation.setBookChVer($RvW.bookIndex, $RvW.chapterIndex * 1 + 1, $RvW.verseIndex * 1 + 1);
                rvw.bible.getdata(true);
                rvw.presentation.p_footer = `${$RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][3]} / ${$RvW.bibleVersionArray[$RvW.vvConfigObj.get_version2()][3]}`;
                rvw.presentation.p_title = $RvW.booknames[$RvW.bookIndex] + " " + ($RvW.chapterIndex + 1);
                $RvW.launch($RvW.verseIndex);
            }
        }

        data2string() {
            let a = "";
            for (i = 0; i < this.numofElements; i++) {
                a += `${$RvW.booknames[this.bArray[i]]} ${this.cArray[i] + 1}:${this.vArray[i] + 1}|`;
            }
            air.trace("Recent list: " + a);
            return a;
        }
    }

    // Exports
    exports.RecentsManager = RecentsManager;
}(rvw.provide("rvw.bible")));
