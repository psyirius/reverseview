// TODO: yui-migrate
// - YAHOO.util.Event
// - YAHOO.util.DataSource
// - YAHOO.widget.Paginator
// - YAHOO.widget.DataTable

import {fillTagList, getTags2Array, setTag2All} from "@/tags";
import {SongSearchType} from "@/const";
import {Deferred} from "@/utils/async";
import {SongPresenter} from "@/song/present";
import {SongLyrics} from "@/song/lyrics";
import {Song} from '@/song/obj';
import {Prompt} from "@app/prompt";
import {Toast} from "@app/toast";
import {call_closePresentation, call_nextSlide, call_prevSlide} from "@/p_window";
import {clearSelectList, ImageIcon, roundSearchBox, showNotification} from "@app/common";
import {$RvW} from "@/rvw";
import {menuYtLink, selectedTab} from "@stores/global";

export class SongNav {
    constructor() {
        this.setFormats = setFormats;
        this.update_songList = update_songList;
        this.get_songList = get_songList;
        this.update_CategoryList = update_CategoryList;
        this.searchComplete = searchComplete;
        this.processExportSongDB = processExportSongDB;
        this.isSongSearchEditActive = isSongSearchEditActive;
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

        let searchDelay = null;
        const searchDelayTime = 600;

        let N = [];
        let y = null;
        let s = true;
        let W = false;
        let Q = -1;
        let n = -1;
        let a = 0;
        let b = "";
        let v = 20;
        let m_keywords = [];
        let m_suggestion_defer = null;
        let aa = 30;
        let ag = false;
        let L = false;
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
                    m_suggestion_defer.then((data) => {
                        callback(data)
                    });
                },
            });

            inputNode.ac.on("select", (e) => {
                __debug("AC Select => " + e.itemNode.get("text"));
                sn_searchSong();
            });

            Z();
            l();
            y = new Song();
            y.slides = [];
            getTags2Array();
            fillTagList();
            s = true;
        }

        function hideLyricsElements() {
            $("#ly_name2").hide();
            $("#ly_edit").hide();
            $("#ly_add2schedule").hide();
            $("#ly_present").hide();
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
            $("#ly_edit").show();
            $("#ly_add2schedule").show();
            $("#ly_present").show();
            $("#ly_slide").show();
            $("#ly_tags").show();
            $("#ly_cat").show();
            $("#ly_key").show();
            $("#ly_copy").show();
            $("#ly_notes").show();
        }

        function Z() {
            new ImageIcon(
                "songnav_searchbutton",
                " SEARCH Song Lyrics ",
                "graphics/icon/search_32.png",
                "graphics/icon/search_32.png",
                ""
            );
            new ImageIcon(
                "songnav_searchauthorbutton",
                " SEARCH Song by Author ",
                "graphics/icon/search_author_32.png",
                "graphics/icon/search_author_32.png",
                ""
            );
            new ImageIcon(
                "songnav_clearbutton",
                " CLEAR Search ",
                "graphics/icon/clearsearch_32.png",
                "graphics/icon/clearsearch_32.png",
                ""
            );

            roundSearchBox(document.getElementById("songnav_filterbox"));
            document.getElementById("songnav_filterbox").style.margin = "2px 0px 0px 10px";
            roundSearchBox(document.getElementById("songnav_editbox"));
        }
        function l() {
            document.getElementById("songnav_category").addEventListener("change", songnav_category_change, false);
            document.getElementById("songnav_tags").addEventListener("change", songnav_tags_change, false);
            $("#songnav_filterbox").hide();
            document.getElementById("songnav_searchbutton").addEventListener("click", songnav_search, false);
            document.getElementById("songnav_searchauthorbutton").addEventListener("click", songnav_searchauthor, false);
            document.getElementById("songnav_clearbutton").addEventListener("click", songnav_clear, false);
            YAHOO.util.Event.addListener("songnav_editbox", "blur", songnav_editbox_onblur);
            YAHOO.util.Event.addListener("songnav_editbox", "focus", songnav_editbox_focus);
            $("#songnav_editbox").keyup(sn_searchSong);
            document.getElementById("ly_edit").addEventListener("click", ly_edit, false);
            document.getElementById("ly_add2schedule").addEventListener("click", ly_add2schedule, false);
            document.getElementById("ly_present").addEventListener("click", ly_present, false);
            document.getElementById("ly_copy").addEventListener("click", ly_copy, false);
        }
        function songnav_editbox_onblur() {
            W = false;
        }
        function songnav_editbox_focus() {
            W = true;
        }
        function isSongSearchEditActive() {
            return W;
        }
        function ly_edit() {
            if ($RvW.songNavObj != null) {
                $RvW.songNavObj.sn_editSong();
            }
        }
        function ly_add2schedule() {
            $RvW.learner.finishLearning();
            $RvW.songNavObj.sn_add2schedule();
            showNotification("Added to schedule");
        }
        function ly_present() {
            $RvW.songNavObj.sn_presentSong();
        }
        function setFormats() {
            v = (($RvW.tabHeight - 300) / 22);
            if (!s) {
                if (m_songTitle != null) {
                    U();
                }
            }
        }
        function songnav_category_change() {
            const am = document.getElementById("songnav_category").selectedIndex;
            const al = document.getElementById("songnav_category").options[am].text;
            __debug("Selected Category Value: " + al);
            $("#songnav_editbox").val("");
            setTag2All();
            ag = false;
            $RvW.songManagerObj.getSongsFromCat(al);
        }
        function songnav_tags_change() {
            const am = $("#songnav_tags option:selected").text();
            let al = "";
            if (searchDelay != null) {
                clearTimeout(searchDelay);
            }
            searchDelay = setTimeout(function () {
                clearTimeout(searchDelay);
                if (am !== "ALL") {
                    al = "%" + am + "%";
                    $RvW.songManagerObj.searchRecords(al, SongSearchType.TAGS);
                } else {
                    songnav_clear();
                }
                searchDelay = null;
            }, searchDelayTime);
        }
        function sn_newSong() {
            $RvW.songEditObj.showEditPanel(null, false, null);
        }
        function sn_editSong() {
            __debug("Launch panel edit song..");
            $RvW.songEditObj.showEditPanel(y, true, a, ag);
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
                var au = ap.data.length;
                __debug("update_songList: Number of songs: " + au);
                var an = 0;
                var aw = "";
                for (var ar = 0; ar < au; ar++) {
                    if (am == "ALL") {
                        var av = ap.data[ar].name;
                        if (C(av)) {
                            var aq = ap.data[ar].id;
                            m_songTitle.push({ ID: ar, Title: av });
                        }
                    } else {
                        if (ap.data[ar].cat == am) {
                            var av = ap.data[ar].name;
                            var al = ap.data[ar].title2;
                            var ao = ap.data[ar].font;
                            if (C(av)) {
                                var aq = ap.data[ar].id;
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
        function update_CategoryList(ap) {
            var ao = ap;
            clearSelectList("songnav_category");
            document.getElementById("songnav_category").options[0] = new Option(
                "ALL",
                0
            );
            if (ao.data != null) {
                var al = ao.data.length;
                var an = 1;
                for (var am = 0; am < al; am++) {
                    if (ao.data[am].cat != null) {
                        document.getElementById("songnav_category").options[an] = new Option(
                            ao.data[am].cat,
                            an
                        );
                        an++;
                    }
                }
            }
            document.getElementById("songnav_category").selectedIndex = 0;
        }
        function ab() {
            y = $RvW.songManagerObj.getSongObj(a, ag);
            J(y);
        }
        function sn_presentSong() {
            const al = new SongPresenter(y);
            al.present();
        }
        function O() {
            __debug("Calling prev slide from song_nav.js");
            call_prevSlide();
        }
        function k() {
            __debug("Calling next slide from song_nav.js");
            call_nextSlide();
        }
        function h() {
            call_closePresentation();
        }
        function sn_deleteSong() {
            var al = "Song Database";
            var an = 'Do you want to delete "' + b + '" ?';
            Prompt.exec(al, an, am);
            function am() {
                var ao = a;
                if (a != 0) {
                    a = a - 1;
                }
                $RvW.songManagerObj.deleteSong(ao, ag);
            }
        }
        function sn_deleteSongByCat() {
            var ao = document.getElementById("songnav_category").selectedIndex;
            var an = document.getElementById("songnav_category").options[ao].text;
            if (an != "ALL") {
                var am = "Song Database";
                var ap = 'Do you want to delete ALL songs from "' + an + '" category?';
                Prompt.exec(am, ap, al);
            } else {
                Toast.show(
                    "Song Database",
                    "Can not delete the ALL category. Please select a specific category."
                );
            }
            function al() {
                a = 0;
                $RvW.songManagerObj.deleteSongByCat(an);
            }
        }
        function sn_searchSong() {
            if (searchDelay != null) {
                clearTimeout(searchDelay);
            }
            searchDelay = setTimeout(function () {
                clearTimeout(searchDelay);
                var al = document.getElementById("songnav_editbox").value;
                al = $.trim(al);
                if ($.isNumeric(al)) {
                    $RvW.songManagerObj.searchRecords(al, SongSearchType.NUMBER);
                } else {
                    $RvW.learner.addWord(al);
                    al = al + "%";
                    $RvW.songManagerObj.searchRecords(al, SongSearchType.TITLE);
                }
                searchDelay = null;
            }, searchDelayTime);
        }
        function songnav_search() {
            var al = document.getElementById("songnav_editbox").value;
            al = $.trim(al);
            al = "%" + al + "%";
            $RvW.songManagerObj.searchRecords(al, SongSearchType.LYRICS);
        }
        function songnav_searchauthor() {
            var al = document.getElementById("songnav_editbox").value;
            var am = "%" + al + "%";
            $RvW.songManagerObj.searchRecords(am, SongSearchType.AUTHOR);
        }
        function songnav_clear() {
            ag = false;
            $RvW.learner.cancelLearning();
            $("#songnav_editbox").val("");
            setTag2All();
            songnav_category_change();
        }
        function J(at) {
            var az = $RvW.vvConfigObj.get_navFontSize() + "px";
            document.getElementById("ly_slide").style.fontSize = az;
            var an = at.name;
            if (at.catIndex == "VV Malayalam 2021" || at.catIndex == "VV Hindi 2021") {
                an += " (" + at.subcat + ") ";
            }
            document.getElementById("ly_name").innerHTML = an;
            if (at.name2 != "null") {
                document.getElementById("ly_name2").innerHTML = at.name2;
                const aF = $RvW.specialFontList.indexOf(at.font);
                if (aF === -1) {
                    document.getElementById("ly_name2").style.fontFamily = at.font;
                } else {
                    document.getElementById("ly_name2").style.fontFamily = "Arial";
                }
            } else {
                document.getElementById("ly_name2").innerHTML = "";
            }
            document.getElementById("ly_cat").innerHTML = at.catIndex;
            document.getElementById("ly_key").innerHTML = at.key;
            if (at.copyright == "" || at.copyright == null) {
                $("#ly_copy").hide();
            } else {
                $("#ly_copy").show();
            }
            document.getElementById("ly_copy").innerHTML = at.copyright;
            document.getElementById("ly_notes").innerHTML = at.notes;
            // menubar
            {
                if (!!at.yvideo) {
                    B = at.yvideo;
                } else {
                    B = null;
                }
                menuYtLink.set(B);
            }
            document.getElementById("ly_slide").style.fontFamily = at.font;
            var aC = at.slides2[0];
            if (aC == "") {
                aC = null;
            }
            var au = at.slides.length;
            var aB = "";
            var aH = window.nativeWindow.bounds.width;
            var aw = 5;
            if (aH < 2000 && aH >= 1600) {
                aw = 4;
            }
            if (aH < 1600 && aH > 1300) {
                aw = 3;
            }
            if (aH <= 1300 && aH > 990) {
                aw = 2;
            }
            if (aH <= 990) {
                aw = 1;
            }
            aB = aB + '<div class="ui cards">';
            for (var aD = 0; aD < au; aD++) {
                if (aC != null) {
                    aB =
                        aB +
                        '<div class="card"><div class="content"><div class="header">' +
                        (aD + 1) +
                        '</div><div class="meta"></div><div class="description"><div id="lyricsID' +
                        aD +
                        '" class="context"></div><div id="lyricsID' +
                        aD +
                        '_2" class="context"></div></div></div></div>';
                } else {
                    aB =
                        aB +
                        '<div class="card"><div class="content"><div class="header">' +
                        (aD + 1) +
                        '</div><div class="meta"></div><div class="description"><div id="lyricsID' +
                        aD +
                        '" class="context"></div></div></div></div>';
                }
                var av = (aD + 1) % aw;
                if (av === 0) {
                    aB = aB + "</div>";
                    aB = aB + '<div class="ui cards">';
                }
            }
            aB = aB + "</div>";
            document.getElementById("ly_slide").innerHTML = aB;
            var ar = [];
            var am = [];
            for (var aD = 0; aD < au; aD++) {
                var ay = "lyricsID" + aD;
                var aq = "lyricsID" + aD + "_2";
                document.getElementById(ay).style.fontFamily = at.font;
                ar[aD] = new SongLyrics(at, ay, aD, 1);
                if (aC != null) {
                    document.getElementById(aq).style.fontFamily = at.font2;
                    am[aD] = new SongLyrics(at, aq, aD, 2);
                }
            }
            if (ag) {
                let aA = document.getElementById("songnav_editbox").value;
                aA = String(aA).trim();
                if (aA.length > 2) {
                    // air.trace("Marking lyrics with search text: " + aA);
                    // TODO: add highlighting feature
                    // $(".context").mark(aA.toLowerCase());
                }
            }
            document.getElementById("ly_tags").innerHTML = "";
            if (at.tags != null && at.tags !== "") {
                __debug("Tags : " + at.tags);
                var aE = at.tags.split(",");
                var al = aE.length;
                var ap = "";
                for (var aD = 0; aD < al; aD++) {
                    var ao = '<button type="button" class="btn btn-outline-secondary btn-sm" id="tag_' +
                        aD +
                        '">' +
                        aE[aD].toUpperCase() +
                        "</button>\n";
                    ap += ao;
                }
                __debug("Tags Content : " + ap);
                document.getElementById("ly_tags").innerHTML = ap;
                for (var aD = 0; aD < al; aD++) {
                    var ax = "tag_" + aD;
                    document.getElementById(ax).addEventListener("click", q, false);
                }
            }
        }
        function sn_backupGlobalID() {
            Q = a;
            n = b;
        }
        function sn_showLyricsByID(al) {
            air.trace("show lyrics by ID called.. ");
            y = $RvW.songManagerObj.getSongObjWithID(al);
            air.trace("show lyrics by ID called.. " + y.name + "  " + a + "   " + b);
            J(y);
        }
        function q(al) {
            var an = document.getElementById(al.target.id).innerHTML;
            var am = "%" + an + "%";
            $RvW.songManagerObj.searchRecords(am, SongSearchType.TAGS);
        }
        function ly_copy(am) {
            var al = document.getElementById(am.target.id).innerHTML;
            var an = "%" + al + "%";
            $RvW.songManagerObj.searchRecords(an, SongSearchType.AUTHOR);
        }
        function searchComplete(res, al) {
            __debug("Search Complete " + res);

            if (res.data != null) {
                ag = true;
                $("#search_error_notification").html("");
                showLyricsElements();
                var an = document.getElementById("songnav_category").selectedIndex;
                var am = document.getElementById("songnav_category").options[an].text;
                _loadSuggestions(res, am, al);
                update_songList(res, am, ag);
            } else {
                m_keywords = [];
                hideLyricsElements();
                $("#ly_name").html("No matching song found.");
                $("#search_error_notification").html("No match");
                update_songList(res, am, ag);
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
            const al = $RvW.songManagerObj.getSongID(a, ag);
            $RvW.scheduleObj.processAddSong(al);
        }

        function j() {
            y.name = "Trading my Sorrows";
            y.catIndex = "English";
            y.font = "Ariel";
            y.copyright = "Darrel Evans";
            y.bkgnd_fname = "";
            y.key = "c";
            y.notes = "None";
            y.slides[0] = "Slide 1";
            y.slides[1] = "Slide 2";
            J(y);
        }
        function H() {
            m = document.getElementById("songnav_filterbox").value;
            m = m.toLowerCase();
            __debug("Filter value changed..." + m);
            songnav_category_change();
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
        function __debug(al) {
            if (m_isDebug) {
                air.trace("[SongNav]...." + al);
            }
        }
        function U() {
            var ao;
            var au = m_songTitle;
            var av = m_songTitle.length;
            if (au != null) {
                if (ao != null) {
                    ao.unsubscribe("rowMouseoverEvent", ao.onEventHighlightRow);
                    ao.unsubscribe("rowMouseoutEvent", ao.onEventUnhighlightRow);
                    ao.unsubscribe("rowClickEvent", ao.onEventSelectRow);
                    ao.unsubscribe("rowSelectEvent", _onSelectItemInDataList);
                }
                var am = [
                    { key: "ID", hiddden: true },
                    { key: "Title", sortable: true, resizeable: true, minWidth: 500 },
                ];
                var ar = new YAHOO.util.DataSource(m_songTitle);
                ar.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
                ar.responseSchema = { fields: [{ key: "ID" }, { key: "Title" }] };
                var at = new YAHOO.widget.Paginator({
                    rowsPerPage: v,
                    template: YAHOO.widget.Paginator.TEMPLATE_DEFAULT,
                    rowsPerPageOptions: [20],
                    pageLinks: 3,
                });
                var ap = {
                    sortedBy: { key: "Title", dir: "asc" },
                    paginator: at,
                    draggableColumns: false,
                    selectionMode: "single",
                    renderLoopSize: 0,
                };
                ao = new YAHOO.widget.DataTable("songnav_songlistnew", am, ar, ap);
                ao.hideColumn("ID");
                L = false;
                ao.subscribe("rowMouseoverEvent", ao.onEventHighlightRow);
                ao.subscribe("rowMouseoutEvent", ao.onEventUnhighlightRow);
                ao.subscribe("rowClickEvent", function () {
                    selectedTab.set(1); // make the lyrics tab active if on another tab

                    ao.onEventSelectRow.apply(ao, arguments);
                });
                ao.subscribe("rowSelectEvent", _onSelectItemInDataList);
                ao.subscribe("renderEvent", onRender);
                at.subscribe("pageChange", onPageChange);
                s = false;
                function onPageChange() {
                    L = true;
                }
                function onRender() {
                    if (L) {
                        L = false;
                    }
                    ao.selectRow(ao.getTrEl(0));
                }
                function _onSelectItemInDataList() {
                    const [aw] = ao.getSelectedTrEls();
                    const record = ao.getRecord(aw);

                    if (record != null) {
                        if (Q !== -1) {
                            a = Q;
                            b = n;
                            ab();
                            Q = -1;
                            n = -1;
                        } else {
                            a = record.getData("ID");
                            b = record.getData("Title");
                            ab();
                        }
                    } else {
                        a = 0;
                        b = "";
                    }
                }
            }
        }
    }
}