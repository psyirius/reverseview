import {$RvW} from "@/rvw";
import {getPrimaryBibleVersion, getSecondaryBibleVersion} from "@/bible/version";

export function setPrimaryBooknames() {
    $RvW.booknames = [];

    const e = parseInt($RvW.vvConfigObj.get_booknamestyle());

    switch (e) {
        default:
        case 1: { /* English */
            $RvW.booknames = $RvW.default_booknames;
            break;
        }
        case 2: { /* Primary */
            $RvW.booknames = getPrimaryBibleVersion().bookNames;
            break;
        }
        case 3: { /* Primary with English */
            let pbn = getPrimaryBibleVersion().bookNames;

            if (pbn[0] === $RvW.default_booknames[0]) {
                $RvW.booknames = pbn;
            } else {
                for (let i = 0; i < 66; i++) {
                    let b = pbn[i] + " (" + $RvW.default_booknames[i] + ")";
                    $RvW.booknames.push(b);
                }
            }
            break;
        }
        case 4: { /* Primary with Secondary */
            const pbn = getPrimaryBibleVersion().bookNames;
            const sbn = getSecondaryBibleVersion().bookNames;

            if (pbn[0] === sbn[0] || sbn[0] === "") {
                $RvW.booknames = pbn;
            } else {
                for (let f = 0; f < 66; f++) {
                    const b = `${pbn[f]} (${sbn[f]})`;
                    $RvW.booknames.push(b);
                }
            }
            break;
        }
    }
}