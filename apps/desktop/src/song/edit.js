import {addTagList, fillTagsToUI} from "@/song/tags";
import {SongPresenter} from "./present";
import {Song} from '@/song/obj';
import {Prompt} from "@app/prompt";
import {Toast} from "@app/toast";
import {apple, clearSelectList, isBlank, specialCategory} from "@app/common";
import {$RvW} from "@/rvw";
import {showSongEditPanel, showLyricEditPanel} from "@stores/global";

import $ from "jquery";

export class SongEdit {
    constructor() {
        this.onPresent = onClick_se_presentID;
        this.onSave = onClick_songEdit_saveButtonID;
        this.onSaveAsNew = onClick_songAsNewEdit_saveButtonID;
        this.onCancel = onClick_cancelButtonID;

        this.onLyricEditOnGenerate = onClick_se_generateID;

        const _isDebug = false;

        let b = false;
        let v = -1;
        let _primaryKey = -1;
        let Z = false;
        let _slidesTabView;
        let u = "";
        let A = 0;
        let _fontsList = [];
        let _current_slide_num = 1;

        function init() {
            _debug("Initialize Song Edit Panel");

            _fontsList = ["Arial", "Times New Roman", "Calibri"];

            _loadUsedFonts();
            _setupSlides();
            _setupEvents();
        }

        this.setEditPrimaryKey = function (value) {
            _primaryKey = value;
        }

        this.showEditPanel = function(song, ad, ae, af) {
            b = ad;
            v = ae;
            _primaryKey = null;
            Z = af;
            if (af == null) {
                Z = false;
            }
            _loadSong(song);
            showSongEditPanel.set(true);
        }

        function _setupEvents() {
            _debug("Generating Events");

            document
                .getElementById("songEdit_moveSlideLeftButtonID")
                .addEventListener("click", onClick_moveSlideLeftButtonID, false);
            document
                .getElementById("songEdit_moveSlideRightButtonID")
                .addEventListener("click", moveCurrentSlideRight, false);
            document
                .getElementById("songEdit_addSlideButtonID")
                .addEventListener("click", onClick_addSlideButtonID, false);
            document
                .getElementById("songEdit_dupSlideButtonID")
                .addEventListener("click", onClick_dupSlideButtonID, false);
            document
                .getElementById("songEdit_deleteSlideButtonID")
                .addEventListener("click", deleteCurrentSlide, false);
            document
                .getElementById("songEdit_createSlidesButtonID")
                .addEventListener("click", onClick_createSlidesButtonID, false);
            document
                .getElementById("songEdit_addCatButtonID")
                .addEventListener("click", onClick_addCatButtonID, false);
            document
                .getElementById("se_submitCatButtonID2")
                .addEventListener("click", onClick_submitCatButtonID2, false);
            document
                .getElementById("songnav_category2")
                .addEventListener("click", onClick_category2, false);
            document
                .getElementById("se_addFontButtonID2")
                .addEventListener("click", onClick_addFontButtonID2, false);
            document
                .getElementById("se_submitFontButtonID2")
                .addEventListener("click", onClick_submitFontButtonID2, false);
            document
                .getElementById("se_fontID2")
                .addEventListener("change", onChange_se_fontID2, false);
            document
                .getElementById("se_fontID2_2")
                .addEventListener("change", onChange_se_fontID2_2, false);

            document.getElementById("se_catTextID").style.visibility = "hidden";
            document.getElementById("se_submitCatButtonID2").style.visibility = "hidden";
            document.getElementById("se_fontTextID").style.visibility = "hidden";
            document.getElementById("se_submitFontButtonID2").style.visibility = "hidden";
        }
        function _setupSlides() {
            _debug("Init Slide Tabs");

            {
                const { Tab, TabView } = $Y;

                const tabs = [
                    {
                        label: "1",
                        content: '<textarea id="slide1" style="width: 284px" class="textareaStyle"></textarea><textarea id="slide1_2" style="width: 284px" class="textareaStyle"></textarea>',
                    },
                    {
                        label: "2",
                        content: '<textarea id="slide2" style="width: 284px" class="textareaStyle"></textarea><textarea id="slide2_2" style="width: 284px" class="textareaStyle"></textarea>',
                    }
                ];

                const tabview = new TabView();

                tabs.forEach((tabMeta, index) => {
                    tabview.add(new Tab(tabMeta), index);
                });

                tabview.selectChild(0);

                tabview.render('#se_slides');

                _slidesTabView = tabview;
            }

            {
                let ac = document.getElementById("se_fontID2").selectedIndex;
                let tempFont = document.getElementById("se_fontID2").options[ac].text;
                document.getElementById("slide1").style.fontFamily = tempFont;
                document.getElementById("slide2").style.fontFamily = tempFont;
            }

            {
                let ac = document.getElementById("se_fontID2_2").selectedIndex;
                let tempFont = document.getElementById("se_fontID2_2").options[ac].text;
                document.getElementById("slide1_2").style.fontFamily = tempFont;
                document.getElementById("slide2_2").style.fontFamily = tempFont;
            }
        }
        function _clear_all_slides() {
            _slidesTabView.removeAll();
            _current_slide_num = 1;
        }
        function _setup_song_categories(ac) {
            var ak = [];
            ak.push("My Songs");
            var af = false;
            if (ac != null) {
                if (!apple) {
                    if (ac.match("^VV")) {
                        af = true;
                    }
                }
            }
            var ae = $RvW.songManagerObj.get_sm_cat_records();
            if (ae.data != null) {
                var ah = ae.data.length;
                for (var ag = 0; ag < ah; ag++) {
                    if (ae.data[ag].cat != null) {
                        var ai = ae.data[ag].cat;
                        var ad = ai.match("^VV");
                        if (apple) {
                            ak.push(ae.data[ag].cat);
                        } else {
                            if (!ad) {
                                ak.push(ae.data[ag].cat);
                            }
                        }
                    }
                }
                if (u != "") {
                    ak.push(u);
                }
                ak.sort();
            }
            var aj = ak.length;
            A = 0;
            for (var ag = 0; ag < aj; ag++) {
                document.getElementById("songnav_category2").options[ag] = new Option(
                    ak[ag],
                    ag
                );
                if (af) {
                    if (ak[ag] == "My Songs") {
                        A = ag;
                    }
                } else {
                    if (ac == null) {
                        if (ak[ag] == u) {
                            A = ag;
                        }
                    } else {
                        if (ak[ag] == ac) {
                            A = ag;
                        }
                    }
                }
            }
            u = "";
            document.getElementById("songnav_category2").selectedIndex = A;
        }
        function _loadUsedFonts(ad, ak) {
            const al = $RvW.songManagerObj.getFontList();
            let ao;
            let af = null;
            let ap = 0;
            let an = 0;
            if (al != null) {
                const am = _fontsList.length;
                for (let ah = am - 1; ah >= 0; ah--) {
                    af = al.indexOf(_fontsList[ah]);
                    if (af !== -1) {
                        _fontsList.splice(ah, 1);
                    }
                }
                ao = _fontsList.concat(al);
            } else {
                ao = _fontsList;
            }
            ao = ao.concat($RvW.systemFontList);
            ao.sort();
            const ac = ao.length;
            clearSelectList("se_fontID2");
            clearSelectList("se_fontID2_2");
            const aj = document.createDocumentFragment();
            const ai = document.createDocumentFragment();
            const ag = document.getElementById("se_fontID2");
            const ae = document.getElementById("se_fontID2_2");
            for (let ah = 0; ah < ac; ah++) {
                const ar = document.createElement("option");
                ar.innerHTML = ao[ah];
                ar.value = ah;
                aj.appendChild(ar);
                var aq = document.createElement("option");
                aq.innerHTML = ao[ah];
                aq.value = ah;
                ai.appendChild(aq);
                if (ao[ah] == ad) {
                    ap = ah;
                }
                if (ao[ah] == ak) {
                    an = ah;
                }
            }
            ag.appendChild(aj);
            ae.appendChild(ai);
            document.getElementById("se_fontID2").selectedIndex = ap;
            if (ak != null) {
                document.getElementById("se_fontID2_2").selectedIndex = an;
            }
        }
        function onClick_submitFontButtonID2() {
            const ad = document.getElementById("se_fontTextID").value;
            const ac = _validate_font_name(ad);
            if (ac) {
                document.getElementById("se_fontTextID").style.visibility = "hidden";
                document.getElementById("se_submitFontButtonID2").style.visibility = "hidden";
                _fontsList.push(ad);
                _loadUsedFonts(ad, null);
            }
        }

        function onChange_se_fontID2() {
            var ag = document.getElementById("se_fontID2").selectedIndex;
            var af = document.getElementById("se_fontID2").options[ag].text;
            var ae = "";
            var ac = 0;
            var ad = _slidesTabView.item(ac);
            while (ad != null) {
                ae = G(ad.get("content"));
                document.getElementById(ae).style.fontFamily = af;
                ac++;
                ad = _slidesTabView.item(ac);
            }
        }

        function onChange_se_fontID2_2() {
            var ag = document.getElementById("se_fontID2_2").selectedIndex;
            var af = document.getElementById("se_fontID2_2").options[ag].text;
            var ae = "";
            var ac = 0;
            var ad = _slidesTabView.item(ac);
            while (ad != null) {
                ae = G(ad.get("content"));
                ae = ae + "_2";
                document.getElementById(ae).style.fontFamily = af;
                ac++;
                ad = _slidesTabView.item(ac);
            }
        }
        function _validate_font_name(ac) {
            return true;
        }
        function _loadSong(sngObj) {
            if (sngObj != null) { // if edit mode
                document.getElementById("songEdit_NameID").value = sngObj.name;
                document.getElementById("se_copyrightID").value = sngObj.copyright;
                document.getElementById("se_yvideoID").value = sngObj.yvideo;
                if (specialCategory(sngObj.catIndex)) {
                    $("#songEdit_saveButtonID").hide();
                } else {
                    $("#songEdit_saveButtonID").show();
                }
                _setup_song_categories(sngObj.catIndex);
                _loadUsedFonts(sngObj.font, sngObj.font2);
                document.getElementById("se_keyID").value = sngObj.key;
                document.getElementById("se_notesID").value = sngObj.notes;
                document.getElementById("songEdit_Name2ID").value = sngObj.name2;
                document.getElementById("songEdit_SongNumberID").value = sngObj.subcat;
                document.getElementById("se_tagID").value = sngObj.tags;
                document.getElementById("se_sequenceID").value = sngObj.slideseq;
                _clear_all_slides();

                const numSlides = sngObj.slides.length;
                _debug("number of slides in preload: " + numSlides);
                for (let af = 0; af < numSlides; af++) {
                    const ae = sngObj.slides[af].replace(/<BR>|<br>/g, "\n");
                    let ad = sngObj.slides2[af];
                    if (ad != null) {
                        ad = ad.replace(/<BR>|<br>/g, "\n");
                    }
                    _append_Slide(ae, ad);
                }
            } else { // if add mode
                document.getElementById("songEdit_NameID").value = "";
                document.getElementById("se_copyrightID").value = "";
                document.getElementById("se_yvideoID").value = "";
                _setup_song_categories(null);
                _loadUsedFonts(null, null);
                document.getElementById("se_keyID").value = "";
                document.getElementById("se_notesID").value = "";
                document.getElementById("songEdit_Name2ID").value = "";
                document.getElementById("songEdit_SongNumberID").value = "";
                document.getElementById("se_tagID").value = "";
                document.getElementById("se_sequenceID").value = "";
                _clear_all_slides();

                _append_Slide();
            }
            _slidesTabView.selectChild(0);
        }
        function onClick_addCatButtonID() {
            document.getElementById("se_catTextID").value = "";
            document.getElementById("se_catTextID").style.visibility = "visible";
            document.getElementById("se_submitCatButtonID2").style.visibility =
                "visible";
        }
        function onClick_submitCatButtonID2() {
            var ad = document.getElementById("se_catTextID").value;
            if (specialCategory(ad)) {
                Toast.show(
                    "Add Edit Song",
                    "Category name starting with 'vv' are reserved."
                );
                return false;
            }
            var ac = _is_valid_category(ad);
            if (ac) {
                document.getElementById("se_catTextID").style.visibility = "hidden";
                document.getElementById("se_submitCatButtonID2").style.visibility =
                    "hidden";
                u = ad;
                _setup_song_categories(null);
            }
        }
        function onClick_moveSlideLeftButtonID() {
            _reset_seq_id();

            const currIndex = _slidesTabView.get("selection").get('index');

            if (currIndex > 0) {
                const prevIndex = currIndex - 1;

                {
                    const lx = "slide" + (currIndex + 1);
                    const rx = "slide" + (prevIndex + 1);

                    const tmp = document.getElementById(lx).value;
                    document.getElementById(lx).value = document.getElementById(rx).value;
                    document.getElementById(rx).value = tmp;
                }

                {
                    const lx = "slide" + (currIndex + 1) + "_2";
                    const rx = "slide" + (prevIndex + 1) + "_2";

                    const tmp = document.getElementById(lx).value;
                    document.getElementById(lx).value = document.getElementById(rx).value;
                    document.getElementById(rx).value = tmp;
                }

                _slidesTabView.selectChild(prevIndex);
            }
        }
        function moveCurrentSlideRight() {
            _reset_seq_id();

            const currIndex = _slidesTabView.get("selection").get('index');
            const numTabs = _slidesTabView.size();

            if (currIndex < numTabs - 1) {
                const nextIndex = currIndex + 1;

                {
                    const lx = "slide" + (currIndex + 1);
                    const rx = "slide" + (nextIndex + 1);

                    const tmp = document.getElementById(lx).value;
                    document.getElementById(lx).value = document.getElementById(rx).value;
                    document.getElementById(rx).value = tmp;
                }

                {
                    const lx = "slide" + (currIndex + 1) + "_2";
                    const rx = "slide" + (nextIndex + 1) + "_2";

                    const tmp = document.getElementById(lx).value;
                    document.getElementById(lx).value = document.getElementById(rx).value;
                    document.getElementById(rx).value = tmp;
                }

                _slidesTabView.selectChild(nextIndex);
            }
        }
        function onClick_dupSlideButtonID() {
            _reset_seq_id();

            const currIndex = _slidesTabView.get("selection").get('index');

            _debug("Active tab Index: " + currIndex);

            const ac = "slide" + (currIndex + 1);
            const af = "slide" + (currIndex + 1) + "_2";

            const s1 = document.getElementById(ac).value;
            const s2 = document.getElementById(af).value;

            _append_Slide(s1, s2);
        }
        function onClick_addSlideButtonID() {
            _reset_seq_id();

            _append_Slide(null, null);
        }
        function _append_Slide(slide1, slide2) {
            const slide1_id = `slide${_current_slide_num}`;
            const slide2_id = `slide${_current_slide_num}_2`;
            _debug("Slide ID: " + slide1_id);

            const { Tab } = $Y;

            _slidesTabView.add(
                new Tab({
                    label: _current_slide_num,
                    content: [
                        `<textarea id="${slide1_id}" style="width: 284px" class="textareaStyle"></textarea>`,
                        `<textarea id="${slide2_id}" style="width: 284px" class="textareaStyle"></textarea>`,
                    ].join(''),
                })
            );

            _current_slide_num++;

            {
                const ae = document.getElementById("se_fontID2").selectedIndex;
                document.getElementById(slide1_id).style.fontFamily =
                    document.getElementById("se_fontID2").options[ae].text;
            }

            {
                const ae = document.getElementById("se_fontID2_2").selectedIndex;
                document.getElementById(slide2_id).style.fontFamily =
                    document.getElementById("se_fontID2_2").options[ae].text;
            }

            if (slide1 != null) {
                document.getElementById(slide1_id).value = slide1;
            } else {
                document.getElementById(slide1_id).value = "";
            }

            if (slide2 != null) {
                document.getElementById(slide2_id).value = slide2;
            } else {
                document.getElementById(slide2_id).value = "";
            }
        }
        function onClick_createSlidesButtonID() {
            _reset_seq_id();

            // todo: make reactive to window resize
            const windowHeight = ($(window).height() * 0.8) - 100 /* guide text height */;

            $("#se_quickSlideID").height(windowHeight);
            $("#se_quickSlideID_2").height(windowHeight);

            {
                const al = document.getElementById("se_fontID2").selectedIndex;
                document.getElementById("se_quickSlideID").style.fontFamily =
                    document.getElementById("se_fontID2").options[al].text;
            }

            {
                const al = document.getElementById("se_fontID2_2").selectedIndex;
                document.getElementById("se_quickSlideID_2").style.fontFamily =
                    document.getElementById("se_fontID2_2").options[al].text;
            }

            const numSlides = _slidesTabView.size();

            const primarySlidesList = [];
            const secondarySlidesList = [];

            for (let slideIndex = 1; slideIndex <= numSlides; slideIndex++) {
                primarySlidesList.push(document.getElementById("slide" + slideIndex).value);
                secondarySlidesList.push(document.getElementById("slide" + slideIndex + "_2").value);
            }

            const DEFAULT_DELIMITER = '\\n\\n\\n';

            // LOAD SLIDES
            const _delimiter = $RvW.rvwPreferences.get("app.state.song.create.delimiter", DEFAULT_DELIMITER);
            const trimEmpty = $RvW.rvwPreferences.get("app.state.song.create.trim_empty", true);
            const trimSlides = $RvW.rvwPreferences.get("app.state.song.create.trim_slides", true);

            _debug("Delimiter: " + _delimiter);
            _debug("Trim Empty: " + trimEmpty);
            _debug("Trim Slides: " + trimSlides);

            $("#se-slide-delimiter").val(_delimiter);
            $Y.one("#se-trim-empty").set('checked', trimEmpty);
            $Y.one("#se-trim-slides").set('checked', trimSlides);

            const delimiter = _unescapeSlidesDelimiter(_delimiter);

            // write content to the textarea (primary and secondary)
            document.getElementById("se_quickSlideID").value = primarySlidesList.join(delimiter);
            document.getElementById("se_quickSlideID_2").value = secondarySlidesList.join(delimiter);

            showLyricEditPanel.set(true);
        }

        function _unescapeSlidesDelimiter(delimiter) {
            let res = "";
            for (let i = 0; i < delimiter.length; i++) {
                if (delimiter[i] === '\\') {
                    i++;
                    switch (delimiter[i]) {
                        case 'n': res += '\n'; break;
                        case 'r': res += '\r'; break;
                        case 'v': res += '\v'; break;
                        case 't': res += '\t'; break;
                        case '\\': res += '\\'; break;
                        case 's': res += ' '; break;
                        case '0': res += '\0'; break;
                        case 'x': {
                            res += String.fromCharCode(parseInt(delimiter.substr(i + 1, 2), 16));
                            i += 2;
                            break;
                        }
                        case 'u': {
                            res += String.fromCharCode(parseInt(delimiter.substr(i + 1, 4), 16));
                            i += 4;
                            break;
                        }
                        default: res += delimiter[i]; break;
                    }
                } else {
                    res += delimiter[i];
                }
            }
            return res;
        }

        function onClick_se_generateID() {
            // GENERATE SLIDES
            _current_slide_num = 1;

            const trimEmpty = $Y.one("#se-trim-empty").get('checked');
            const trimSlides = $Y.one("#se-trim-slides").get('checked');
            const _delimiter = $("#se-slide-delimiter").val();

            _debug("Delimiter: " + _delimiter);
            _debug("Trim Empty: " + trimEmpty);
            _debug("Trim Slides: " + trimSlides);

            $RvW.rvwPreferences.set("app.state.song.create.delimiter", _delimiter);
            $RvW.rvwPreferences.set("app.state.song.create.trim_empty", trimEmpty);
            $RvW.rvwPreferences.set("app.state.song.create.trim_slides", trimSlides);
            $RvW.rvwPreferences.commit();

            const delimiter = _unescapeSlidesDelimiter(_delimiter);

            const av = document.getElementById("se_quickSlideID").value;
            let sl1 = av.split(delimiter);
            const au = document.getElementById("se_quickSlideID_2").value;
            let sl2 = au.split(delimiter);

            if (trimSlides) {
                sl1 = sl1.map((slide) => slide.trim());
                sl2 = sl2.map((slide) => slide.trim());
            }

            if (trimEmpty) {
                sl1 = sl1.filter((slide) => !!slide.trim());
                sl2 = sl2.filter((slide) => !!slide.trim());
            }

            // FIXME: make it more efficient

            if (sl2[0] != null) {
                _append_Slide(sl1[0], sl2[0]);
            } else {
                _append_Slide(sl1[0], null);
            }

            let aw = _slidesTabView.item(1);
            while (aw != null) {
                _slidesTabView.remove(aw.get("index"));
                aw = _slidesTabView.item(1);
            }

            _current_slide_num = 2;

            for (let ix = 1; ix < sl1.length; ix++) {
                if (sl2[ix] != null) {
                    _append_Slide(sl1[ix], sl2[ix]);
                } else {
                    _append_Slide(sl1[ix], null);
                }
            }

            showLyricEditPanel.set(false);
        }

        function deleteCurrentSlide() {
            _reset_seq_id();

            // TODO: make the ui more obvious which slide is being deleted

            const currentIndex = _slidesTabView.get("selection").get('index');
            const numSlides = _slidesTabView.size();

            // move the slides to the right most
            for (let i = currentIndex; i < numSlides; ++i) {
                moveCurrentSlideRight();
            }

            const lastSlideIndex = numSlides - 1;
            _slidesTabView.remove(lastSlideIndex);
            _current_slide_num--;

            // select the previous slide
            _slidesTabView.selectChild(
                Math.min(currentIndex, _slidesTabView.size() - 1)
            );

            if (_current_slide_num === 0) {
                _append_Slide();
            }
        }
        function onClick_addFontButtonID2() {
            document.getElementById("se_fontTextID").value = "";
            document.getElementById("se_fontTextID").style.visibility = "visible";
            document.getElementById("se_submitFontButtonID2").style.visibility =
                "visible";
        }
        function _dumpSong() {
            _debug("Extract data from Form");

            let ao = document.getElementById("songEdit_NameID").value;
            ao = ao.replace(/^\s+|\s+$/g, "");
            ao = ao.replace(/\s\s+/g, " ");

            if (ao === "") {
                Toast.show("Add Edit Songs", "Enter a valid Song Name");
                return false;
            } else {
                const sngObj = new Song();
                sngObj.name = ao;
                ao = document.getElementById("songEdit_Name2ID").value;
                ao = ao.replace(/^\s+|\s+$/g, "");
                ao = ao.replace(/\s\s+/g, " ");
                sngObj.name2 = ao;

                const _slides = [];
                const _slides2 = [];

                _slidesTabView.each((slideTab, index) => {
                    const slideContent = slideTab.get("content");
                    const slideId = G(slideContent);

                    let ac = document.getElementById(slideId).value;
                    _slides[index] = ac.replace(/\n/g, "<BR>");

                    ac = slideId + "_2";
                    ac = document.getElementById(ac).value;
                    _slides2[index] = ac.replace(/\n/g, "<BR>");

                    if (isBlank(_slides2[index])) {
                        _slides2[index] = "";
                    }
                });

                sngObj.slides = _slides;
                sngObj.slides2 = _slides2;

                sngObj.copyright = document.getElementById("se_copyrightID").value;

                const ag = document.getElementById("se_yvideoID").value;

                const am = _parse_yt_videoID(ag);

                if (am) {
                    sngObj.yvideo = ag;
                } else {
                    Toast.show("Add Edit Songs", "Enter valid YouTube video link.");
                    return false;
                }

                {
                    const ai = document.getElementById("songnav_category2").selectedIndex;
                    sngObj.catIndex = document.getElementById("songnav_category2").options[ai].text;
                    sngObj.subcat = "";
                }

                if (!specialCategory(sngObj.catIndex)) {
                    if (sngObj.catIndex === "VV Malayalam 2021" || sngObj.catIndex === "VV Hindi 2021") {
                        const af = document.getElementById("songEdit_SongNumberID").value;
                        if (af === "" || af == null) {
                            sngObj.subcat = $RvW.songNumberObj.assignSongNumber(sngObj.catIndex);
                        } else {
                            sngObj.subcat = af;
                        }
                    }
                }

                {
                    const al = document.getElementById("se_fontID2").selectedIndex;
                    sngObj.font = document.getElementById("se_fontID2").options[al].text;
                }
                {
                    const al = document.getElementById("se_fontID2_2").selectedIndex;
                    sngObj.font2 = document.getElementById("se_fontID2_2").options[al].text;
                }

                sngObj.timestamp = _getTimestamp();
                sngObj.key = document.getElementById("se_keyID").value;
                sngObj.notes = document.getElementById("se_notesID").value;
                sngObj.rating = 5;

                {
                    sngObj.slideseq = document.getElementById("se_sequenceID").value;
                }
                {
                    const aq = document.getElementById("se_tagID").value;
                    sngObj.tags = aq.toUpperCase();
                }

                addTagList(sngObj.tags);
                fillTagsToUI();

                return sngObj;
            }
        }
        function onClick_se_presentID() {
            _debug("Process Present button");

            const currentIndex = _slidesTabView.get("selection").get('index');

            const ae = _dumpSong();
            if (ae !== false) {
                const sp = new SongPresenter(ae);
                sp.present(currentIndex);
            }
        }
        function onClick_songEdit_saveButtonID() {
            _debug("Process Save button");
            let ac = _dumpSong();
            if (ac !== false) {
                if (!b) {
                    _debug("Adding song..");
                    $RvW.songManagerObj.addSong(ac, true, false);
                    b = true;
                } else {
                    _debug("Updating song..");
                    $RvW.songManagerObj.updateSong(ac, v, _primaryKey, Z);
                }
                showSongEditPanel.set(false);
                return true;
            } else {
                _debug("Extract Data failed");
                return false;
            }
        }
        function onClick_songAsNewEdit_saveButtonID() {
            const ac = b;
            b = false;
            if (!onClick_songEdit_saveButtonID()) {
                b = ac;
            }
        }
        function onClick_category2() {
            const ac = $("#songnav_category2 option:selected").text();
            if (specialCategory(ac)) {
                $("#songEdit_saveButtonID").hide();
            } else {
                $("#songEdit_saveButtonID").show();
            }
        }
        function onClick_cancelButtonID() {
            const ac = "Song Add/Edit";
            const ad = "Do you want to CANCEL from Add/Edit Song panel?";
            Prompt.exec(ac, ad, _close_panel);
        }

        function _close_panel() {
            showSongEditPanel.set(false);
        }
        function G(ad) {
            const ac = ad.split('"');
            return ac[1];
        }
        function _is_valid_category(ac) {
            if (ac !== "ALL") {
                return true;
            } else {
                alert("ALL is reserved Category");
                return false;
            }
        }
        function _reset_seq_id() {
            document.getElementById("se_sequenceID").value = "";
        }
        function _parse_yt_videoID(af) {
            let ae = af.replace(/ /gi, "");
            if (ae === "") {
                document.getElementById("se_yvideoID").value = "";
                return true;
            }
            let ad = ae.split("&");
            ae = ad[0];
            document.getElementById("se_yvideoID").value = ae;
            ad = ae.split("?v=");
            const ac = "https://www.youtube.com/watch";
            return ad[0] === ac;
        }
        function _getTimestamp() {
            const ai = new Date();
            const ac = ai.getMonth() + 1;
            const ae = ai.getDate();
            const af = ai.getFullYear();
            const ad = ai.getHours();
            const ag = ai.getMinutes();
            const ah = `${ac}/${ae}/${af}  ${ad}:${ag}`;
            _debug("Timestamp: " + ah);
            return ah;
        }

        function _debug(ac) {
            if (_isDebug) {
                air.trace("[SongEdit]...." + ac);
            }
        }

        init();
    }
}