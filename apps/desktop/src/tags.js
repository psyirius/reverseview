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
    const a = tags.length;
    const b = rvw.common.clearSelectList("songnav_tags");
    if (b) {
        const c = document.createDocumentFragment();
        const g = document.getElementById("songnav_tags");
        for (let d = 0; d < a; d++) {
            const e = document.createElement("option");
            e.innerHTML = tags[d];
            e.value = String(d);
            c.appendChild(e);
        }
        g.appendChild(c);
        setTag2All();
    }
}
export function setTag2All() {
    const a = tags.length;
    const b = "#songnav_tags option:eq(" + (a - 1) + ")";
    $(b).prop("selected", true);
}