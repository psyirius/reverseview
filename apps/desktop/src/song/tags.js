import {$RvW} from "@/rvw";
import {selectedSongTag, songTags} from "@stores/global";

const $tags$ = [];

function commit() {
    $RvW.vvConfigObj.set_taglist($tags$);
    $RvW.vvConfigObj.save();
}

/**
 * @param tag {string}
 */
export function removeTag(tag) {
    const pos = $tags$.indexOf(tag);
    if (pos !== -1) {
        $tags$.splice(pos, 1); // remove tag
    }
    commit();
}

/**
 * @param {string} tagList
 */
export function addTagList(tagList) {
    tagList
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => !!tag)
        .forEach(addTag);
}

/**
 * @param tag {string}
 */
function isNewTag(tag) {
    return $tags$.indexOf(tag) === -1;
}

/**
 * @param tag {string}
 */
function addTag(tag) {
    if (isNewTag(tag)) {
        $tags$.push(tag);
        $tags$.sort();
        commit();
    }
}

export const loadTagsFromConfig = () => {
    const _tags = $RvW.vvConfigObj.get_taglist()
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => !!tag)
    ;
    _tags.sort();

    // assign tags
    $tags$.length = 0;
    $tags$.push(..._tags);
};

export const fillTagsToUI = () => {
    songTags.set($tags$);
};

export function clearTagFilter() {
    selectedSongTag.set(null); // All
}