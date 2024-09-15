import {$RvW} from "@/rvw";

let tags = [];

export function removeTag(a) {
    let b = a.split("%");
    b = b[1];
    const c = $.inArray(b, tags);
    if (c !== -1) {
        tags.splice(c, 1);
    }
    tags.pop();
    $RvW.vvConfigObj.set_taglist(tags);
    $RvW.vvConfigObj.save();
    tags.push("ALL");
}

export function addTagList(b) {
    const d = b.split(",");
    for (let c = 0; c < d.length; c++) {
        addTag(d[c].trim());
    }
}

function addTag(a) {
    if (isNewTag(a)) {
        tags.pop();
        tags.push(a);
        tags.sort();
        $RvW.vvConfigObj.set_taglist(tags);
        $RvW.vvConfigObj.save();
        tags.push("ALL");
    }
}

function isNewTag(a) {
    if (a !== "ALL") {
        return $.inArray(a, tags) === -1;
    } else {
        return false;
    }
}

export function getTags2Array() {
    const a = $RvW.vvConfigObj.get_taglist();
    tags = a.split(",");
    tags.sort();
    tags.push("ALL");
}

export function fillTagList() {
    /** @type {HTMLSelectElement} */
    const el = document.getElementById("songnav_tags");
    if (el) {
        el.options.length = 0;

        for (let i = 0; i < tags.length; i++) {
            el.options[i] = new Option(tags[i], i);
        }

        setTag2All();
    }
}

export function setTag2All() {
    const a = tags.length;
    const b = "#songnav_tags option:eq(" + (a - 1) + ")";
    $(b).prop("selected", true);
}