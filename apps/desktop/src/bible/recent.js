import { setBookChVer } from "@/bible/navigation";
import { $RvW } from "@/rvw";
import {recentBibleRefs} from "@stores/global";

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
        recentBibleRefs.update((_) => {
            const l = new Array(this.numElements);

            for (let i = 0; i < this.numElements; i++) {
                const label = `${$RvW.booknames[this.bArray[i]]} ${this.cArray[i] + 1}:${this.vArray[i] + 1}`;

                // save it in reverse
                const j = this.numElements - i - 1;
                l[j] = {
                    label,
                    index: i,
                    book: this.bArray[i],
                    chapter: this.cArray[i],
                    verse: this.vArray[i],
                }
            }

            return l
        });
    }

    selectRecent({ book, chapter, verse }) {
        $RvW.bookIndex = book;
        $RvW.chapterIndex = chapter;
        $RvW.verseIndex = verse;

        setBookChVer($RvW.bookIndex, chapter + 1, verse + 1);
    }
}
