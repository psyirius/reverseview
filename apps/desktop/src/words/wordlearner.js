import {$RvW} from "@/rvw";
import {console} from "@/platform/adapters/air";

export class WordLearner {
    constructor() {
        this.addWord = addWord;
        this.finishLearning = finishLearning;
        this.printWordList = printWordList;
        this.cancelLearning = cancelLearning;

        let i = null;
        let c = 25;
        let b = null;

        function d() {
            i = [];
            c = 25;
        }
        function addWord(j) {
            if (i == null) {
                d();
            }
            i.push(j);
            if (b != null) {
                clearTimeout(b);
                b = null;
            }
            b = setTimeout(cancelLearning, c * 1000);
        }
        function cancelLearning() {
            i = null;
        }
        function finishLearning() {
            if (i != null) {
                f();
                i = null;
            }
        }
        function f() {
            const l = i.pop();
            const k = i.length;
            const q = [];
            for (let n = 0; n < k; n++) {
                let o = true;
                const p = q.length;
                if (i[n].length > 1) {
                    for (let m = 0; m < p; m++) {
                        if (i[n] === q[m]) {
                            o = false;
                            break;
                        }
                    }
                } else {
                    o = false;
                }
                if (o) {
                    q.push(i[n]);
                    $RvW.wordbrain.addRecordBy_wordin_wordout(i[n], l);
                }
            }
        }
        function printWordList() {
            const j = i.length;
            console.trace("**** WORD LIST FOR LEARNING ****");
            for (let k = 0; k < j; k++) {
                console.trace(i[k]);
            }
        }
    }
}
