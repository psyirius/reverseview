// Song Lyric Navigation
import {selectedSongCategory, selectedSongTag, songCategories, songSearchError, songTags} from "@stores/global";
import {useEffect, useId, useRef, useState} from "preact/hooks";
import {useStoreState} from "@/utils/hooks";
import {SongSearchType} from "@/const";
import debounce from '@/utils/debounce';
import {$RvW} from "@/rvw";

const searchSong = debounce((q: string) => {
    $RvW.songNavObj.sn_searchSong(q);
}, 200);

export default function LeftSongsTab() {
    const catId = useId();
    const tagId = useId();

    const [searchQuery, setSearchQuery] = useState('');

    const categories = useStoreState(songCategories);
    const selectedCategory = useStoreState(selectedSongCategory);

    const searchError = useStoreState(songSearchError);

    const tags = useStoreState(songTags);
    const selectedTag = useStoreState(selectedSongTag);

    const catSelect = useRef(null);
    const tagSelect = useRef(null);

    useEffect(() => {
        // @ts-ignore
        // $(`#${catId}`).dropdown();
        // @ts-ignore
        // $(`#${tagId}`).dropdown();
    }, []);

    function onCategoryChange(e: Event) {
        const el = (e.target as HTMLSelectElement);

        air.trace('onCategoryChange', el.value, el.selectedIndex);

        $RvW.songNavObj.songnav_category_change(el.selectedIndex > 0 ? el.value : 'ALL');
        selectedSongCategory.set(el.selectedIndex > 0 ? el.selectedIndex - 1 : null);
    }

    function onTagChange(e: Event) {
        const el = (e.target as HTMLSelectElement);

        air.trace('onTagChange', el.value, el.selectedIndex);

        $RvW.songNavObj.songnav_tags_change(el.selectedIndex > 0 ? el.value : 'ALL');
        selectedSongTag.set(el.selectedIndex > 0 ? el.selectedIndex - 1 : null);
    }

    function filterByLyrics() {
        const q = searchQuery.trim();
        $RvW.songManagerObj.searchRecords(`%${q}%`, SongSearchType.LYRICS);
    }

    function filterByAuthor() {
        const q = searchQuery.trim();
        $RvW.songManagerObj.searchRecords(`%${q}%`, SongSearchType.AUTHOR);
    }

    function clearFilters() {
        $RvW.songNavObj.songnav_clear();
        songSearchError.set(undefined);
    }

    function onSearchInput(e: Event) {
        const q = (e.target as HTMLInputElement).value;
        setSearchQuery(q);
        searchSong(q);
    }

    return (
        <div class="ui left fluid vertical segment">
            {/* CATEGORY TAGS */}
            <div class="ui form">
                <div class="two fields">
                    <div class="field">
                        <label>Category</label>
                        <div class="ui input">
                            <select
                                class="ui search dropdown"
                                ref={catSelect}
                                id={catId}
                                onChange={onCategoryChange}
                                value={selectedCategory === -1 ? null : selectedCategory}
                            >
                                <option value="">All</option>
                                {categories.map((category, i) => (
                                    <option value={category} key={i}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div class="field">
                        <label>Tag</label>
                        <div class="ui input">
                            <select
                                class="ui search dropdown"
                                ref={tagSelect}
                                id={tagId}
                                onChange={onTagChange}
                                value={selectedTag === -1 ? null : selectedTag}
                            >
                                <option value="">All</option>
                                {tags.map((tag, i) => (
                                    <option value={tag} key={i}>{tag}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/*<div class="ui divider"></div>*/}

            {/* Search Input */}
            <div class="ui action input">
                <input
                    type="text"
                    size={20}
                    id="songnav_editbox"
                    placeholder="Search..."
                    value={searchQuery}
                    onSearch={onSearchInput}
                    onKeyUp={onSearchInput}
                />

                <button
                    class="ui icon button"
                    id="song-search-lyrics"
                    data-tooltip="Search by Lyrics"
                    onClick={filterByLyrics}
                >
                    <i class="file alternate icon"></i>
                </button>

                <button
                    class="ui icon button"
                    id="song-search-author"
                    data-tooltip="Search by Author"
                    onClick={filterByAuthor}
                >
                    <i class="user icon"></i>
                </button>

                <button
                    class="ui icon button"
                    id="song-search-clear"
                    data-tooltip="Clear Filters"
                    onClick={clearFilters}
                >
                    <i class="times circle icon"></i>
                </button>
            </div>

            {/* ERROR Notification and word suggestions */}
            {searchError && (
                <div class="ui red mini message">{searchError}</div>
            )}

            {/*<div class="ui divider"></div>*/}

            {/*<table class="ui fixed single line very compact striped celled table">*/}
            {/*    /!*<thead>*!/*/}
            {/*    /!*<tr>*!/*/}
            {/*    /!*    <th>Number</th>*!/*/}
            {/*    /!*    <th>Title</th>*!/*/}
            {/*    /!*</tr>*!/*/}
            {/*    /!*</thead>*!/*/}
            {/*    <tbody>*/}
            {/*    <tr>*/}
            {/*        <td width={48}>John</td>*/}
            {/*        <td>Approved</td>*/}
            {/*    </tr>*/}
            {/*    <tr>*/}
            {/*        <td>Jamie</td>*/}
            {/*        <td>Approved</td>*/}
            {/*    </tr>*/}
            {/*    <tr>*/}
            {/*        <td>John</td>*/}
            {/*        <td>Approved</td>*/}
            {/*    </tr>*/}
            {/*    <tr>*/}
            {/*        <td>Jamie</td>*/}
            {/*        <td>Approved</td>*/}
            {/*    </tr>*/}
            {/*    <tr>*/}
            {/*        <td>John</td>*/}
            {/*        <td>Approved</td>*/}
            {/*    </tr>*/}
            {/*    <tr>*/}
            {/*        <td>Jamie</td>*/}
            {/*        <td>Approved</td>*/}
            {/*    </tr>*/}
            {/*    <tr>*/}
            {/*        <td>John</td>*/}
            {/*        <td>Approved</td>*/}
            {/*    </tr>*/}
            {/*    <tr>*/}
            {/*        <td>Jamie</td>*/}
            {/*        <td>Approved</td>*/}
            {/*    </tr>*/}
            {/*    </tbody>*/}

            {/*    <tfoot>*/}
            {/*    <tr>*/}
            {/*        <th colspan={2}>*/}
            {/*            <div class="ui right floated pagination menu">*/}
            {/*                <a class="icon item">*/}
            {/*                    <i class="left chevron icon"></i>*/}
            {/*                </a>*/}
            {/*                <a class="item">1</a>*/}
            {/*                <a class="item">2</a>*/}
            {/*                <a class="item">3</a>*/}
            {/*                <a class="item">4</a>*/}
            {/*                <a class="icon item">*/}
            {/*                    <i class="right chevron icon"></i>*/}
            {/*                </a>*/}
            {/*            </div>*/}
            {/*        </th>*/}
            {/*    </tr>*/}
            {/*    </tfoot>*/}
            {/*</table>*/}

            <div class="ui fluid vertical segment">
                <div id="songnav_songlistnew" class="yui-skin-sam"></div>
                <div class="ui center aligned basic segment">
                    <div id="songnav_paginator" class="yui-skin-sam"></div>
                </div>
            </div>
        </div>
    );
}