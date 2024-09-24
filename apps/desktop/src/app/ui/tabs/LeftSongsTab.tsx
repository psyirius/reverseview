// Song Lyric Navigation
import {selectedSongCategory, selectedSongTag, songCategories, songTags} from "@stores/global";
import {useEffect, useId, useRef, useState} from "preact/hooks";
import {useStoreState} from "@/utils/hooks";
import {SongSearchType} from "@/const";
import debounce from '@/utils/debounce';
import {$RvW} from "@/rvw";

const searchSong = debounce((q: string) => {
    $RvW.songNavObj.sn_searchSong(q);
}, 200);

export default function LeftSongsTab() {
    const categoryId = useId();
    const tagId = useId();

    const [searchQuery, setSearchQuery] = useState('');

    const categories = useStoreState(songCategories);
    const selectedCategory = useStoreState(selectedSongCategory);

    const tags = useStoreState(songTags);
    const selectedTag = useStoreState(selectedSongTag);

    const categorySelect = useRef(null);
    const tagSelect = useRef(null);

    useEffect(() => {
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
    }

    function onSearchInput(e: Event) {
        const q = (e.target as HTMLInputElement).value;
        setSearchQuery(q);
        searchSong(q);
    }

    return (
        <div id="songNavTab">
            {/* CATEGORY TAGS */}
            <div class="ui grid" style={{marginRight: '10px'}}>
                <div class="eight wide column">
                    <label htmlFor={categoryId} class="col-form-label form-control-sm">Category</label>
                    <div class="ui action input">
                        <select
                            class="ui dropdown"
                            ref={categorySelect}
                            id={categoryId}
                            onChange={onCategoryChange}
                            value={selectedCategory === -1 ? null : selectedCategory}
                        >
                            <option default value="">All</option>
                            {categories.map((category, i) => (
                                <option value={category} key={i}>{category}</option>
                            ))}
                        </select>
                        {/*<button class="ui icon button mini" onClick={() => selectedSongCategory.set(null)}>*/}
                        {/*    <i class="times circle icon"></i>*/}
                        {/*</button>*/}
                    </div>
                </div>

                <div class="eight wide column">
                    <label htmlFor={tagId} class="col-form-label form-control-sm">Tags</label>
                    <div class="ui action input">
                        <select
                            class="ui dropdown"
                            ref={tagSelect}
                            id={tagId}
                            onChange={onTagChange}
                            value={selectedTag === -1 ? null : selectedTag}
                        >
                            <option default value="">All</option>
                            {tags.map((tag, i) => (
                                <option value={tag} key={i}>{tag}</option>
                            ))}
                        </select>
                        {/*<button class="ui icon button mini" onClick={() => selectedSongTag.set(null)}>*/}
                        {/*    <i class="times circle icon"></i>*/}
                        {/*</button>*/}
                    </div>
                </div>
            </div>

            {/* TITLE SEQUENCE */}
            <div class="ui grid">
                <div class="ui action small input">
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
            </div>

            {/* ERROR Notification and word suggestions */}
            <div class="ui grid vvrow40">
                <div class="ten wide column">
                    <div class="col-form-label form-control-sm" id="search_error_notification"></div>
                </div>
            </div>

            <div class="style2">
                <div id="songnav_songlistnew" class="yui-skin-sam"></div>
            </div>
        </div>
    );
}