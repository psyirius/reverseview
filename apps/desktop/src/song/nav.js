// TODO: yui-migrate
// - YAHOO.util.Event
// - YAHOO.util.DataSource
// - YAHOO.widget.Paginator
// - YAHOO.widget.DataTable

import {fillTagsToUI, loadTagsFromConfig, clearTagFilter} from "@/song/tags";
import {menuYtLink, selectedSongCategory, selectedTab, songCategories, songSearchError} from "@stores/global";
import {SongSearchType} from "@/const";
import {Deferred} from "@/utils/async";
import {SongPresenter} from "@/song/present";
import {SongLyrics} from "@/song/lyrics";
import {Song} from '@/song/obj';
import {Prompt} from "@app/prompt";
import {Toast} from "@app/toast";
import {$RvW} from "@/rvw";
import {console} from "@/platform/adapters/air";

import $ from "jquery";

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

        let searchDelay = null;
        const searchDelayTime = 600;

        let N = [];
        let _currentSongObj = null;
        let s = true;
        let Q = -1;
        let n = -1;
        let _itemID = 0;
        let _itemTitle = "";
        let rowsPerPage = 20;
        let m_keywords = [];
        let m_suggestion_defer = null;
        let aa = 30;
        let ag = false;
        let m = "";
        let B = null;
        let m_songTitle = [];
        const m_isDebug = false;

        init();

        function init() {
            const inputNode = $Y.one("#songnav_editbox");

            inputNode.plug($Y.Plugin.AutoComplete, {
                resultHighlighter: "phraseMatch",
                // minQueryLength: 0,
                // queryDelay: 0,
                maxResults: 50, // TODO: make this dynamic
                sourceType: "function",
                source: (query, callback) => {
                    __debug(`Query: ${query}`);

                    m_suggestion_defer = new Deferred();
                    // m_suggestion_defer.then((data) => {
                    //     callback(data)
                    // });
                },
            });

            inputNode.ac.on("select", (e) => {
                __debug("AC Select => " + e.itemNode.get("text"));
                sn_searchSong();
            });

            _currentSongObj = new Song();
            _currentSongObj.slides = [];
            loadTagsFromConfig();
            fillTagsToUI();
            s = true;
        }

        function hideLyricsElements() {
            $("#ly_name2").hide();
            // $("#ly_edit").hide();
            // $("#ly_add2schedule").hide();
            // $("#ly_present").hide();
            $("#ly_slide").hide();
            $("#ly_tags").hide();
            $("#ly_cat").hide();
            $("#ly_key").hide();
            $("#ly_copy").hide();
            $("#ly_notes").hide();
        }

        function showLyricsElements() {
            $("#ly_name").show();
            $("#ly_name2").show();
            // $("#ly_edit").show();
            // $("#ly_add2schedule").show();
            // $("#ly_present").show();
            $("#ly_slide").show();
            $("#ly_tags").show();
            $("#ly_cat").show();
            $("#ly_key").show();
            $("#ly_copy").show();
            $("#ly_notes").show();
        }

        function setFormats() {
            rowsPerPage = (($RvW.tabHeight - 300) / 22);
            if (!s) {
                if (m_songTitle != null) {
                    U();
                }
            }
        }

        function songnav_category_change(al = 'ALL') {
            __debug("Selected Category Value: " + al);
            $("#songnav_editbox").val("");
            clearTagFilter();
            ag = false;
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
            $RvW.songEditObj.showEditPanel(_currentSongObj, true, _itemID, ag);
        }

        function _loadSuggestions(sqlRes, category, searchMode) {
            m_keywords = [];
            let searchQuery = $.trim(document.getElementById("songnav_editbox").value);
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
                var az = ax.toLowerCase().split(" ");
                var ay = jQuery.inArray(az[0], m_keywords);
                if (ay === -1) {
                    m_keywords.push(az[0]);
                }
            }
        }

        function showSuggestedList() {
            const an = $RvW.wordbrain.getSuggestions();
            const all_sugg = an.concat(m_keywords);

            __debug("Suggested word - concatenated : " + all_sugg);

            m_suggestion_defer.resolve(all_sugg);
        }

        function update_songList(ap, am, at) {
            if (at == null) {
                ag = false;
            }
            m_songTitle.length = 0;
            if (ap.data != null) {
                __debug("update_songList: Number of songs: " + ap.data.length);
                var an = 0;
                var aw = "";
                var aq;
                for (let ar = 0; ar < ap.data.length; ar++) {
                    if (am == "ALL") {
                        let av = ap.data[ar].name;
                        if (C(av)) {
                            aq = ap.data[ar].id;
                            m_songTitle.push({ ID: ar, Title: av });
                        }
                    } else {
                        if (ap.data[ar].cat == am) {
                            var av = ap.data[ar].name;
                            var al = ap.data[ar].title2;
                            var ao = ap.data[ar].font;
                            if (C(av)) {
                                aq = ap.data[ar].id;
                                m_songTitle.push({ ID: ar, Title: av });
                            }
                        }
                    }
                }
            }
            U();
        }

        function get_songList(sqlResult, category, query) {
            let res = [];

            if (sqlResult.data != null) {
                const { data } = sqlResult;

                for (let ii = 0; ii < data.length; ii++) {
                    if (category === "ALL") {
                        const ar = data[ii].name;
                        const an = C(ar, query);
                        if (an) {
                            res.push({
                                id: data[ii].id,
                                name: ar
                            })
                        }
                    } else {
                        if (data[ii].cat === category) {
                            const ar = data[ii].name;
                            const an = C(ar, query);
                            if (an) {
                                res.push({
                                    id: data[ii].id,
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
            const catz = categories?.map((c) => String(c.cat).trim()).filter(e => !!e) || [];
            // console.trace("Update Category List: ", catz);
            songCategories.set(catz);
            selectedSongCategory.set(null);
        }

        function ab() {
            try {
                _currentSongObj = $RvW.songManagerObj.getSongObj(_itemID, ag);
            } catch (e) {
                _currentSongObj = null;
            }
            render_lyrics(_currentSongObj);
        }

        function sn_presentSong() {
            const al = new SongPresenter(_currentSongObj);
            al.present();
        }

        function sn_deleteSong() {
            var al = "Song Database";
            var an = 'Do you want to delete "' + _itemTitle + '" ?';
            Prompt.exec(al, an, am);
            function am() {
                var ao = _itemID;
                if (_itemID != 0) {
                    _itemID = _itemID - 1;
                }
                $RvW.songManagerObj.deleteSong(ao, ag);
            }
        }

        function sn_deleteSongByCat() {
            const ao = selectedSongCategory.get();
            if (ao !== null) {
                const cat = songCategories.get()[ao];
                Prompt.exec(
                    'Song Database',
                    `Do you want to delete ALL songs from "${cat}" category?`,
                    () => {
                    _itemID = 0;
                    $RvW.songManagerObj.deleteSongByCat(cat);
                });
            } else {
                Toast.show(
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
                let al = document.getElementById("songnav_editbox").value;
                al = $.trim(al);
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
            ag = false;
            $RvW.learner.cancelLearning();
            songnav_category_change();
        }

        function render_lyrics(s) {
            __debug("Render Lyrics: ", JSON.stringify(s));

            if (!s) {
                // Reset the lyrics
                document.getElementById("ly_name").innerHTML = '';
                document.getElementById("ly_name2").innerHTML = '';
                document.getElementById("ly_cat").innerHTML = '';
                document.getElementById("ly_key").innerHTML = '';
                document.getElementById("ly_copy").innerHTML = '';
                document.getElementById("ly_notes").innerHTML = '';
                document.getElementById("ly_slide").innerHTML = '';
                document.getElementById("ly_tags").innerHTML = '';

                menuYtLink.set(null);
                $("#ly_copy").hide();

                return;
            }

            document.getElementById("ly_slide").style.fontSize = $RvW.vvConfigObj.get_navFontSize() + "px";
            let name = s.name;
            if (s.subcat) {
                name += ` (${s.subcat}) `;
            }
            document.getElementById("ly_name").innerHTML = name;
            if (s.name2 != "null") {
                document.getElementById("ly_name2").innerHTML = s.name2;
                const aF = $RvW.specialFontList.indexOf(s.font);
                if (aF === -1) {
                    document.getElementById("ly_name2").style.fontFamily = s.font;
                } else {
                    document.getElementById("ly_name2").style.fontFamily = "Arial";
                }
            } else {
                document.getElementById("ly_name2").innerHTML = "";
            }
            document.getElementById("ly_cat").innerHTML = s.catIndex;
            document.getElementById("ly_key").innerHTML = s.key;
            if (!s.copyright) {
                $("#ly_copy").hide();
            } else {
                $("#ly_copy").show();
            }
            document.getElementById("ly_copy").innerHTML = s.copyright;
            document.getElementById("ly_notes").innerHTML = s.notes;
            // menubar
            {
                menuYtLink.set(s.yvideo || null);
            }
            document.getElementById("ly_slide").style.fontFamily = s.font;

            let aC = s.slides2[0] || null;
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

            let html = '<div class="ui cards">';
            for (let i = 0; i < s.slides.length; i++) {
                if (aC != null) {
                    html +=
                        '<div class="card">' +
                            '<div class="content">' +
                                '<div class="header">' + (i + 1) + '</div>' +
                                '<div class="meta"></div>' +
                                '<div class="description">' +
                                    '<div id="lyricsID' + i + '" class="context"></div>' +
                                    '<div id="lyricsID' + i + '_2" class="context"></div>' +
                                '</div>' +
                            '</div>' +
                        '</div>'
                    ;
                } else {
                    html +=
                        '<div class="card">' +
                            '<div class="content">' +
                                '<div class="header">' + (i + 1) + '</div>' +
                                '<div class="meta"></div>' +
                                '<div class="description">' +
                                    '<div id="lyricsID' + i + '" class="context"></div>' +
                                '</div>' +
                            '</div>' +
                        '</div>'
                    ;
                }

                if (((i + 1) % numCellsPerRow) === 0) {
                    html += '</div>';
                    html += '<div class="ui cards">';
                }
            }
            html += "</div>";

            document.getElementById("ly_slide").innerHTML = html;

            for (let jjj = 0; jjj < s.slides.length; jjj++) {
                const ay = "lyricsID" + jjj;
                const aq = "lyricsID" + jjj + "_2";
                document.getElementById(ay).style.fontFamily = s.font;
                new SongLyrics(s, ay, jjj, 1);
                if (aC != null) {
                    document.getElementById(aq).style.fontFamily = s.font2;
                    new SongLyrics(s, aq, jjj, 2);
                }
            }

            if (ag) {
                let aA = document.getElementById("songnav_editbox").value;
                aA = String(aA).trim();
                if (aA.length > 2) {
                    // console.trace("Marking lyrics with search text: " + aA);
                    // TODO: add highlighting feature
                    // $(".context").mark(aA.toLowerCase());
                }
            }

            document.getElementById("ly_tags").innerHTML = "";
            if (s.tags != null && s.tags !== "") {
                __debug("Tags : " + s.tags);
                const aE = s.tags.split(",");
                let ap = "";
                for (let i = 0; i < aE.length; i++) {
                    ap += `<button type="button" class="btn btn-outline-secondary btn-sm" id="tag_${i}">${aE[i].toUpperCase()}</button>`;
                }
                __debug("Tags Content : " + ap);
                document.getElementById("ly_tags").innerHTML = ap;
                for (let i = 0; i < aE.length; i++) {
                    document.getElementById(`tag_${i}`).addEventListener("click", filterByTag, false);
                }
            }
        }

        function sn_backupGlobalID() {
            Q = _itemID;
            n = _itemTitle;
        }
        function sn_showLyricsByID(al) {
            console.trace("show lyrics by ID called.. ");
            _currentSongObj = $RvW.songManagerObj.getSongObjWithID(al);
            console.trace(`show lyrics by ID called.. ${_currentSongObj.name}  ${_itemID}   ${_itemTitle}`);
            render_lyrics(_currentSongObj);
        }
        function filterByTag(tag) {
            const _tag = tag.target.innerHTML;
            $RvW.songManagerObj.searchRecords(`%${_tag}%`, SongSearchType.TAGS);
        }
        function searchComplete(res, al) {
            __debug("Search Complete " + res);

            const cix = selectedSongCategory.get();
            const cat = cix === null ? 'ALL' : songCategories.get()[cix];

            if (res.data != null) {
                ag = true;
                songSearchError.set(undefined);
                showLyricsElements();

                _loadSuggestions(res, cat, al);
                update_songList(res, cat, ag);
            } else {
                m_keywords = [];
                hideLyricsElements();
                $("#ly_name").html("No matching song found.");
                songSearchError.set("No match");
                update_songList(res, cat, ag);
            }
        }

        function processExportSongDB() {
            const { File } = air;
            const { applicationStorageDirectory, desktopDirectory } = File;

            const src = applicationStorageDirectory.resolvePath("./song/default.db");
            const dst = desktopDirectory.resolvePath("./vvexport/default_songs.db");

            src.addEventListener(air.Event.COMPLETE, function() {
                Toast.show(
                    "Song Database",
                    'Song database saved to Desktop under the "vvexport" folder'
                );
            });
            src.addEventListener(air.IOErrorEvent.IO_ERROR, function() {
                Toast.show(
                    "Song Database",
                    "Unable to save the song database to the Desktop"
                );
            });
            src.copyToAsync(dst, true);
        }

        function sn_add2schedule() {
            const al = $RvW.songManagerObj.getSongID(_itemID, ag);
            $RvW.scheduleObj.processAddSong(al);
        }

        function j() {
            _currentSongObj.name = "Trading my Sorrows";
            _currentSongObj.catIndex = "English";
            _currentSongObj.font = "Ariel";
            _currentSongObj.copyright = "Darrel Evans";
            _currentSongObj.bkgnd_fname = "";
            _currentSongObj.key = "c";
            _currentSongObj.notes = "None";
            _currentSongObj.slides[0] = "Slide 1";
            _currentSongObj.slides[1] = "Slide 2";
            render_lyrics(_currentSongObj);
        }
        function C(ao, am) {
            var al = m;
            if (am != null) {
                al = am;
            }
            var ao = ao.toLowerCase();
            var an = ao.indexOf(al);
            if (an == 0) {
                return true;
            } else {
                return false;
            }
        }
        function __debug(...al) {
            if (m_isDebug) {
                console.trace("[SongNav]....", ...al);
            }
        }
        function U() {
            var au = m_songTitle;
            var av = m_songTitle.length;
            if (au != null) {
                let isRenderPending = false;
                s = false;

                const source = new YAHOO.util.DataSource(m_songTitle);
                source.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
                source.responseSchema = { fields: [{ key: "ID" }, { key: "Title" }] };

                const paginator = new YAHOO.widget.Paginator({
                    rowsPerPage,
                    containers : [ "songnav_paginator" ],
                    template: YAHOO.widget.Paginator.TEMPLATE_DEFAULT,
                    pageLinks: 3,
                });
                const options = {
                    sortedBy: {key: "Title", dir: "asc"},
                    paginator: paginator,
                    draggableColumns: false,
                    selectionMode: "single",
                    renderLoopSize: 0,
                };
                const dataTable = new YAHOO.widget.DataTable("songnav_songlistnew", [
                    {key: "ID", hidden: true},
                    {key: "Title", sortable: true, resizeable: true, minWidth: 500},
                ], source, options);

                dataTable.subscribe("rowMouseoverEvent", dataTable.onEventHighlightRow);
                dataTable.subscribe("rowMouseoutEvent", dataTable.onEventUnhighlightRow);
                dataTable.subscribe("rowClickEvent", function () {
                    selectedTab.set(1); // make the lyrics tab active if on another tab

                    dataTable.onEventSelectRow.apply(this, arguments);
                });
                dataTable.subscribe("renderEvent", function() {
                    __debug("onRender called...");
                    if (isRenderPending) {
                        isRenderPending = false;
                    }
                    const firstRow = dataTable.getTrEl(0);

                    __debug("First Row:", firstRow);

                    if (firstRow) {
                        dataTable.selectRow(firstRow);
                    } else {
                        _itemID = 0;
                        _itemTitle = "";
                        ab();
                    }
                });
                paginator.subscribe("pageChange", function() {
                    isRenderPending = true;
                });
                dataTable.subscribe("rowSelectEvent", _onSelectItemInDataList);

                function _onSelectItemInDataList() {
                    const [selectedEl] = dataTable.getSelectedTrEls();
                    const selectedRecord = dataTable.getRecord(selectedEl);

                    __debug("Selected Record: ", JSON.stringify(selectedRecord));

                    if (selectedRecord != null) {
                        if (Q !== -1) {
                            _itemID = Q;
                            _itemTitle = n;
                            ab();
                            Q = -1;
                            n = -1;
                        } else {
                            _itemID = selectedRecord.getData("ID");
                            _itemTitle = selectedRecord.getData("Title");
                            ab();
                        }
                    } else {
                        _itemID = 0;
                        _itemTitle = "";
                        ab();
                    }
                }
            }
        }
    }
}