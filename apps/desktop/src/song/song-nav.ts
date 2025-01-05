// @ts-nocheck

import {fillTagsToUI, loadTagsFromConfig, clearTagFilter} from "@/song/tags";
import {
    menuYtLink,
    selectedSongCategory,
    selectedSongStateAuthor,
    selectedSongStateCategory,
    selectedSongStateKey,
    selectedSongStateName1,
    selectedSongStateName2,
    selectedSongStateNotes, selectedSongStateObject,
    selectedSongStateSeqNum,
    selectedSongStateSlides,
    selectedSongStateTags,
    songCategories,
    songListState,
    songSearchError,
} from "@stores/global";
import {SongSearchType} from "@/const";
import {Deferred} from "@/utils/async";
import {scheduler} from "@app/glc";
import {SongPresenter} from "@/song/present";
import {SongLyrics} from "@/song/lyrics";
import {Song} from '@/song/song-obj';
import {Prompt} from "@app/prompt";
import {Toast} from "@app/toast";
import {$RvW} from "@/rvw";
import {console} from "@/platform/adapters/air";

import $ from "jquery";

// export class _SongNavigator_ {
//     constructor() {
//     }
//
//     public createDialog() {
//
//     }
//
//     public editDialog() {
//
//     }
//
//     public select(id: number) {
//
//     }
//
//     public delete(id: number) {
//
//     }
//
//     public deleteByCategory(category: string) {
//
//     }
//
//     public entries() {
//
//     }
// }

export class SongNav {
    constructor() {
        this.setFormats = setFormats;
        this.update_songList = update_songList;
        this.get_songList = get_songList;
        this.update_CategoryList = update_CategoryList;
        this.searchComplete = searchComplete;
        this.processExportSongDB = processExportSongDB;
        this.sn_searchSong = sn_searchSong;
        this.sn_showLyricsByID = sn_showLyricsByID;
        this.sn_backupGlobalID = sn_backupGlobalID;
        this.sn_presentSong = sn_presentSong;
        this.sn_add2schedule = sn_add2schedule;
        this.sn_newSong = sn_newSong;
        this.sn_editSong = sn_editSong;
        this.sn_deleteSong = sn_deleteSong;
        this.sn_deleteSongByCat = sn_deleteSongByCat;
        this.showSuggestedList = showSuggestedList;
        this.songnav_tags_change = songnav_tags_change;
        this.songnav_category_change = songnav_category_change;
        this.songnav_clear = songnav_clear;
        this.selectSong = selectSong;

        let searchDelay = null;
        const searchDelayTime = 600;

        let m_currentSongObj = null;
        let m_itemID_bkp = -1;
        let m_itemTitle_bkp = -1;
        let m_itemID = 0;
        let m_itemTitle = "";
        let m_rowsPerPage = 20;
        let m_keywords = [];
        let m_resNotEmpty = false;
        let m_currentQuery = "";
        let m_songs_columns = [];

        const IS_DEBUG = true;

        init();

        function init() {
            m_currentSongObj = new Song();
            m_currentSongObj.name = '<@INIT@>';
            m_currentSongObj.slides = [];

            loadTagsFromConfig();
            fillTagsToUI();
        }

        function hideLyricsElements() {
            // $("#ly_name").hide();
            // $("#ly_name2").hide();
            // $("#ly_edit").hide();
            // $("#ly_add2schedule").hide();
            // $("#ly_present").hide();
            // $("#ly_slide").hide();
            // $("#ly_tags").hide();
            // $("#ly_cat").hide();
            // $("#ly_key").hide();
            // $("#ly_copy").hide();
            // $("#ly_notes").hide();
        }

        function showLyricsElements() {
            // $("#ly_name").show();
            // $("#ly_name2").show();
            // $("#ly_edit").show();
            // $("#ly_add2schedule").show();
            // $("#ly_present").show();
            // $("#ly_slide").show();
            // $("#ly_tags").show();
            // $("#ly_cat").show();
            // $("#ly_key").show();
            // $("#ly_copy").show();
            // $("#ly_notes").show();
        }

        function setFormats(rpp) {
            m_rowsPerPage = rpp;

            // console.trace("Rows per page: ", m_rowsPerPage);

            _renderSongList();
        }

        function songnav_category_change(al = 'ALL') {
            __debug("Selected Category Value: " + al);

            $("#songnav_editbox").val("");

            clearTagFilter();

            m_resNotEmpty = false;

            $RvW.songManagerObj.getSongsFromCat(al);
        }

        function songnav_tags_change(am = 'ALL') {
            if (am !== 'ALL') {
                $RvW.songManagerObj.searchRecords(`%${am}%`, SongSearchType.TAGS);
            } else {
                songnav_clear();
            }
        }

        function sn_newSong() {
            $RvW.songEditObj.showEditPanel(null, false, null);
        }

        function sn_editSong() {
            __debug("Launch panel edit song..");
            $RvW.songEditObj.showEditPanel(m_currentSongObj, true, m_itemID, m_resNotEmpty);
        }

        function _loadSuggestions(sqlRes, category, searchMode) {
            m_keywords = [];
            let searchQuery = $.trim(
                document.getElementById("songnav_editbox").value
            );
            __debug("|" + searchQuery + "|");
            __debug("Search Flag " + searchMode);
            const wordsInQuery = searchQuery.split(" ");
            const numWordsInQuery = wordsInQuery.length;
            __debug("Words " + numWordsInQuery);
            if (searchMode === SongSearchType.TITLE && numWordsInQuery === 1) {
                const av = sqlRes.data.length;
                for (let ap = 0; ap < av; ap++) {
                    if (category === "ALL" || sqlRes.data[ap].cat === category) {
                        const aw = sqlRes.data[ap].name.toLowerCase();
                        const ar = aw.indexOf(searchQuery.toLowerCase());
                        if (ar === 0) {
                            ao(aw);
                        }
                    }
                }
                __debug("Keywords Length: " + m_keywords.length);
                __debug("Keywords: " + m_keywords);

                showSuggestedList();
            }
            function ao(ax) {
                const az = ax.toLowerCase().split(" ");
                const ay = jQuery.inArray(az[0], m_keywords);
                if (ay === -1) {
                    m_keywords.push(az[0]);
                }
            }
        }

        function showSuggestedList() {
            const an = $RvW.wordbrain.getSuggestions();
            const allSuggestions = an.concat(m_keywords);

            __debug("Suggested word - concatenated : " + allSuggestions);
        }

        function update_songList(sqlResult, am, at) {
            if (at == null) {
                m_resNotEmpty = false;
            }

            m_songs_columns.length = 0;

            if (sqlResult.data != null) {
                __debug("update_songList: Number of songs: " + sqlResult.data.length);
                var an = 0;
                var aw = "";
                var aq;

                for (let ar = 0; ar < sqlResult.data.length; ar++) {
                    if (am === "ALL") {
                        let av = sqlResult.data[ar].name;
                        if (startsWith(av)) {
                            aq = sqlResult.data[ar].id;
                            m_songs_columns.push({ ID: ar, Title: av });
                        }
                    } else {
                        if (sqlResult.data[ar].cat === am) {
                            const av = sqlResult.data[ar].name;
                            var al = sqlResult.data[ar].title2;
                            var ao = sqlResult.data[ar].font;

                            if (startsWith(av)) {
                                aq = sqlResult.data[ar].id;
                                m_songs_columns.push({ ID: ar, Title: av });
                            }
                        }
                    }
                }
            }
            _renderSongList();
        }

        function get_songList(sqlResult, category, query) {
            let res = [];

            if (sqlResult.data != null) {
                const { data } = sqlResult;

                for (const item of data) {
                    if (category === "ALL") {
                        const itemName = item.name;
                        const an = startsWith(itemName, query);
                        if (an) {
                            res.push({
                                id: item.id,
                                name: itemName
                            })
                        }
                    } else {
                        if (item.cat === category) {
                            const ar = item.name;
                            const an = startsWith(ar, query);
                            if (an) {
                                res.push({
                                    id: item.id,
                                    name: ar
                                })
                            }
                        }
                    }
                }
            }

            return res;
        }

        function update_CategoryList(categories) {
            const catz = categories?.map((c) => $.trim(c.cat)).filter(e => !!e) || [];
            __debug("Update Category List: ", catz);
            songCategories.set(catz);
            selectedSongCategory.set(null);
        }

        function renderLyricsForSelectedSong() {
            try {
                m_currentSongObj = $RvW.songManagerObj.getSongObj(m_itemID, m_resNotEmpty);
            } catch (e) {
                m_currentSongObj = null;
            }
            render_lyrics(m_currentSongObj);
        }

        function sn_presentSong() {
            const al = new SongPresenter(m_currentSongObj);
            al.present();
        }

        function sn_deleteSong() {
            Prompt.exec(
                `Song Database`,
                `Do you want to delete "${m_itemTitle}" ?`,
                () => {
                    $RvW.songManagerObj.deleteSong(m_itemID, m_resNotEmpty);
                    if (m_itemID !== 0) { m_itemID -= 1; }
                }
            );
        }

        function sn_deleteSongByCat() {
            const catIdx = selectedSongCategory.get();
            if (catIdx !== null) {
                const cat = songCategories.get()[catIdx];
                Prompt.exec(
                    'Song Database',
                    `Do you want to delete ALL songs from "${cat}" category?`,
                    () => {
                        m_itemID = 0;
                        $RvW.songManagerObj.deleteSongByCat(cat);
                    }
                );
            } else {
                Toast.error(
                    "Song Database",
                    "Can not delete the ALL category. Please select a specific category."
                );
            }
        }

        function sn_searchSong() {
            if (searchDelay != null) {
                clearTimeout(searchDelay);
            }

            searchDelay = setTimeout(function () {
                clearTimeout(searchDelay);
                let al = $.trim(
                    document.getElementById("songnav_editbox").value
                );
                if ($.isNumeric(al)) {
                    $RvW.songManagerObj.searchRecords(al, SongSearchType.NUMBER);
                } else {
                    $RvW.learner.addWord(al);
                    $RvW.songManagerObj.searchRecords(`${al}%`, SongSearchType.TITLE);
                }
                searchDelay = null;
            }, searchDelayTime);
        }

        function songnav_clear() {
            m_resNotEmpty = false;
            $RvW.learner.cancelLearning();
            songnav_category_change();
        }

        function render_lyrics(s) {
            __debug("Render Lyrics:", (s));

            if (!s) {
                // Reset the lyrics
                selectedSongStateObject.set(null);
                selectedSongStateName1.set(null);
                selectedSongStateName2.set(null);
                selectedSongStateCategory.set(null);
                selectedSongStateKey.set(null);
                selectedSongStateAuthor.set(null);
                selectedSongStateTags.set([]);
                selectedSongStateNotes.set(null);
                selectedSongStateSlides.set(null);

                menuYtLink.set(null);

                return;
            }

            selectedSongStateObject.set(s);

            if (s.subcat) {
                selectedSongStateSeqNum.set(s.subcat);
            } else {
                selectedSongStateSeqNum.set(null);
            }

            selectedSongStateName1.set(s.name);

            if (s.name2 != "null") {
                selectedSongStateName2.set(s.name2);
            } else {
                selectedSongStateName2.set(null);
            }

            selectedSongStateCategory.set(s.catIndex);
            selectedSongStateKey.set(s.key);
            selectedSongStateAuthor.set(s.copyright);
            selectedSongStateNotes.set(s.notes);
            selectedSongStateSlides.set([
                s.slides,
                s.slides2
            ]);

            // menubar
            {
                menuYtLink.set(s.yvideo || null);
            }

            const aH = window.nativeWindow.bounds.width;
            let numCellsPerRow = 5;
            if (aH < 2000 && aH >= 1600) {
                numCellsPerRow = 4;
            }
            if (aH < 1600 && aH > 1300) {
                numCellsPerRow = 3;
            }
            if (aH <= 1300 && aH > 990) {
                numCellsPerRow = 2;
            }
            if (aH <= 990) {
                numCellsPerRow = 1;
            }

            // let aC = s.slides2[0] || null;
            // let html = '<div class="ui cards">';
            // for (let i = 0; i < s.slides.length; i++) {
            //     if (aC != null) {
            //         html +=
            //             '<div class="card">' +
            //                 '<div class="content">' +
            //                     '<div class="header">' + (i + 1) + '</div>' +
            //                     '<div class="meta"></div>' +
            //                     '<div class="description">' +
            //                         '<div id="lyricsID' + i + '" class="context"></div>' +
            //                         '<div id="lyricsID' + i + '_2" class="context"></div>' +
            //                     '</div>' +
            //                 '</div>' +
            //             '</div>'
            //         ;
            //     } else {
            //         html +=
            //             '<div class="card">' +
            //                 '<div class="content">' +
            //                     '<div class="header">' + (i + 1) + '</div>' +
            //                     '<div class="meta"></div>' +
            //                     '<div class="description">' +
            //                         '<div id="lyricsID' + i + '" class="context"></div>' +
            //                     '</div>' +
            //                 '</div>' +
            //             '</div>'
            //         ;
            //     }
            //
            //     if (((i + 1) % numCellsPerRow) === 0) {
            //         html += '</div>';
            //         html += '<div class="ui cards">';
            //     }
            // }
            // html += "</div>";

            // document.getElementById("ly_slide").innerHTML = html;

            // for (let jjj = 0; jjj < s.slides.length; jjj++) {
            //     const ay = "lyricsID" + jjj;
            //     const aq = "lyricsID" + jjj + "_2";
            //     document.getElementById(ay).style.fontFamily = s.font;
            //     new SongLyrics(s, ay, jjj, 1);
            //     if (aC != null) {
            //         document.getElementById(aq).style.fontFamily = s.font2;
            //         new SongLyrics(s, aq, jjj, 2);
            //     }
            // }

            if (m_resNotEmpty) {
                let aA = $.trim(
                    document.getElementById("songnav_editbox").value
                );

                if (aA.length > 2) {
                    // console.trace("Marking lyrics with search text: " + aA);
                    // TODO: add highlighting feature
                    // $(".context").mark(aA.toLowerCase());
                }
            }

            if (s.tags != null && s.tags !== "") {
                const aE = s.tags.split(",");
                selectedSongStateTags.set(aE);
            }
        }

        function sn_backupGlobalID() {
            m_itemID_bkp = m_itemID;
            m_itemTitle_bkp = m_itemTitle;
        }

        function sn_showLyricsByID(al) {
            console.trace("show lyrics by ID called.. ");
            m_currentSongObj = $RvW.songManagerObj.getSongObjWithID(al);
            console.trace(`show lyrics by ID called.. ${m_currentSongObj.name}  ${m_itemID}   ${m_itemTitle}`);
            render_lyrics(m_currentSongObj);
        }

        function filterByTag(tag) {
            const _tag = tag.target.innerHTML;
            $RvW.songManagerObj.searchRecords(`%${_tag}%`, SongSearchType.TAGS);
        }

        function searchComplete(sqlRes, al) {
            __debug("Search Complete:", sqlRes);

            const catIdx = selectedSongCategory.get();
            const selectedCategory = catIdx === null ? 'ALL' : songCategories.get()[catIdx];

            if (sqlRes.data != null) {
                m_resNotEmpty = true;
                songSearchError.set(undefined);
                showLyricsElements();

                _loadSuggestions(sqlRes, selectedCategory, al);
                update_songList(sqlRes, selectedCategory, m_resNotEmpty);
            } else {
                m_keywords = [];
                hideLyricsElements();
                // $("#ly_name").html("No matching song found.");
                songSearchError.set("No match");
                update_songList(sqlRes, selectedCategory, m_resNotEmpty);
            }
        }

        function processExportSongDB() {
            const { File } = air;
            const { applicationStorageDirectory, desktopDirectory } = File;

            const src = applicationStorageDirectory.resolvePath("./song/default.db");
            const dst = desktopDirectory.resolvePath("./vvexport/default_songs.db");

            src.addEventListener(air.Event.COMPLETE, function() {
                Toast.success(
                    "Song Database",
                    'Song database saved to Desktop under the "vvexport" folder'
                );
            });
            src.addEventListener(air.IOErrorEvent.IO_ERROR, function() {
                Toast.error(
                    "Song Database",
                    "Unable to save the song database to the Desktop"
                );
            });
            src.copyToAsync(dst, true);
        }

        function sn_add2schedule() {
            const songID = $RvW.songManagerObj.getSongID(m_itemID, m_resNotEmpty);
            scheduler.addSong(songID);
            // $RvW.scheduleObj.processAddSong(songID);
        }

        function startsWith(str, start) {
            const ss = String(start ?? m_currentQuery);
            return str.toLowerCase().indexOf(ss) === 0;
        }

        function _renderSongList() {
            if (m_songs_columns != null) {
                console.trace("Updating song list...", m_songs_columns.length);
                console.trace(m_songs_columns[0]);

                songListState.update((state) => {
                    return {
                        ...state,
                        songs: m_songs_columns,
                        perPage: m_rowsPerPage,
                    };
                });

                if (!m_currentSongObj || (m_currentSongObj.name === '<@INIT@>')) {
                    selectSong(m_songs_columns[0]); // select the first song
                }
            }
        }

        function selectSong(p) {
            if (p) {
                const {ID, Title} = p;
                m_itemID = ID;
                m_itemTitle = Title;
                renderLyricsForSelectedSong();
            }
        }

        function __debug(...messages) {
            if (IS_DEBUG) {
                console.trace("[SongNav]....", ...messages);
            }
        }
    }
}