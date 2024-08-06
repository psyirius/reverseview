class SongEdit {
  constructor(bodyContent) {
    const _isDebug = true;

    let b = false;
    let v = -1;
    let _primaryKey = -1;
    let Z = false;
    let _bodyContent = "";
    let _panel = null;
    let _slidesTabView;
    let u = "";
    let A = 0;
    let _fontsList = [];
    let _current_slide_num = 1;

    this.init = function(bodyContent) {
      _debug("Initialize Song Edit Panel");

      _fontsList = ["Arial", "Times New Roman", "Calibri"];

      _bodyContent = bodyContent;

      _setupPanel();
      _loadUsedFonts();
      _setupSlides();
      _setupEvents();
    }

    this.setEditPrimaryKey = function (value) {
      _primaryKey = value;
    }

    this.showEditPanel = function(songObj, ad, ae, af) {
      b = ad;
      v = ae;
      _primaryKey = null;
      Z = af;
      if (af == null) {
        Z = false;
      }
      _loadSong(songObj);
      _panel.show();
    }

    function _setupPanel() {
      _debug("Generating Panel");

      _panel = new YAHOO.widget.Panel("panelObj", {
        width: "600px",
        fixedcenter: true,
        modal: true,
        visible: false,
        constraintoviewport: true,
      });
      _panel.render(document.body);
      _panel.setHeader("Song ADD / EDIT");
      _panel.setBody(_bodyContent);
      _panel.hide();
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
      document
          .getElementById("se_presentID")
          .addEventListener("click", onClick_se_presentID, false);
      document
          .getElementById("songEdit_saveButtonID")
          .addEventListener("click", onClick_songEdit_saveButtonID, false);
      document
          .getElementById("songAsNewEdit_saveButtonID")
          .addEventListener("click", onClick_songAsNewEdit_saveButtonID, false);
      document
          .getElementById("songEdit_cancelButtonID")
          .addEventListener("click", onClick_cancelButtonID, false);

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
      var ae = songManagerObj.get_sm_cat_records();
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
      const al = songManagerObj.getFontList();
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
      ao = ao.concat(systemFontList);
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
        rvw.ui.Dialog.show(
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
      var ad = null;
      var ac = null;
      _append_Slide(ad, ac);
    }
    function _append_Slide(slide1, slide2) {
      const slide1_id = `slide${_current_slide_num}`;
      const slide2_id = `slide${_current_slide_num}_2`;
      _debug("Slide ID: " + slide1_id);

      const { Tab } = $Y;

      _slidesTabView.add(
        new Tab({
          label: _current_slide_num,
          content: `
            <textarea id="${slide1_id}" style="width: 284px" class="textareaStyle"></textarea>
            <textarea id="${slide2_id}" style="width: 284px" class="textareaStyle"></textarea>
          `,
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

      let ak = "";
      ak = ak + '<div class="style2">';
      ak =
        ak +
        '<textarea id="se_quickSlideID" rows="20" style="width: 390px" class="textareaStyle4songslide"></textarea>';
      ak =
        ak +
        '<textarea id="se_quickSlideID_2" rows="20" style="width: 390px" class="textareaStyle4songslide"></textarea><br>';
      ak = ak + "<i>Seperate the slides with 2 new lines. </i><br><br>";
      ak =
        ak +
        '<br><input type="button" id="se_generateID" value=" GENERATE SLIDES ">';
      ak =
        ak +
        '<input type="button" id="se_generateMunglishID" value=" TRANSLITERATE ">';
      ak =
        ak +
        '<input type="button" id="se_generateCancelID" value=" CANCEL "></DIV>';

      const _createPanel = new YAHOO.widget.Panel("gpanelObj", {
        width: "800px",
        fixedcenter: true,
        modal: true,
        visible: false,
        constraintoviewport: true,
      });
      _createPanel.render(document.body);
      _createPanel.setHeader("Generate Slides");
      _createPanel.setBody(ak);

      let windowHeight = $(window).height();
      windowHeight = windowHeight * 0.8;
      $("#se_quickSlideID").height(windowHeight);
      $("#se_quickSlideID_2").height(windowHeight);

      document
        .getElementById("se_generateID")
        .addEventListener("click", onClick_se_generateID, false);
      document
        .getElementById("se_generateMunglishID")
        .addEventListener("click", onClick_se_generateMunglishID, false);
      document
        .getElementById("se_generateCancelID")
        .addEventListener("click", onClick_se_generateCancelID, false);

      {
        const al = document.getElementById("se_fontID2").selectedIndex;
        const ad = document.getElementById("se_fontID2").options[al].text;
        document.getElementById("se_quickSlideID").style.fontFamily = ad;
      }

      {
        const al = document.getElementById("se_fontID2_2").selectedIndex;
        const ad = document.getElementById("se_fontID2_2").options[al].text;
        document.getElementById("se_quickSlideID_2").style.fontFamily = ad;
      }

      const numSlides = _slidesTabView.size();

      const primarySlidesList = [];
      const secondarySlidesList = [];

      for (let slideIndex = 1; slideIndex <= numSlides; slideIndex++) {
        primarySlidesList.push(document.getElementById("slide" + slideIndex).value);
        secondarySlidesList.push(document.getElementById("slide" + slideIndex + "_2").value);
      }

      // write content to the textarea (primary and secondary)
      document.getElementById("se_quickSlideID").value = primarySlidesList.join("\n\n\n").trim();
      document.getElementById("se_quickSlideID_2").value = secondarySlidesList.join("\n\n\n").trim();

      _createPanel.show();
      _createPanel.bringToTop();

      function onClick_se_generateID() {
        _current_slide_num = 1;

        const av = document.getElementById("se_quickSlideID").value;
        const az = av.split("\n\n\n");
        const ar = az.length;

        const au = document.getElementById("se_quickSlideID_2").value;
        const at = au.split("\n\n\n");
        const ay = at.length;

        if (at[0] != null) {
          _append_Slide(az[0], at[0]);
        } else {
          _append_Slide(az[0], null);
        }

        var aw = _slidesTabView.item(1);
        while (aw != null) {
          _slidesTabView.remove(aw.get("index"));
          aw = _slidesTabView.item(1);
        }

        _current_slide_num = 2;

        for (let ax = 1; ax < ar; ax++) {
          if (at[ax] != null) {
            _append_Slide(az[ax], at[ax]);
          } else {
            _append_Slide(az[ax], null);
          }
        }

        onClick_se_generateCancelID();
      }
      function onClick_se_generateCancelID() {
        _setup_clickHandlers();
        _createPanel.hide();
      }

      function _setup_clickHandlers() {
        document
          .getElementById("se_generateID")
          .removeEventListener("click", onClick_se_generateID, false);

        document
          .getElementById("se_generateMunglishID")
          .removeEventListener("click", onClick_se_generateMunglishID, false);

        document
          .getElementById("se_generateCancelID")
          .removeEventListener("click", onClick_se_generateCancelID, false);
      }

      function onClick_se_generateMunglishID() {
        var at = document.getElementById("se_quickSlideID").value;
        var ax = at.split("\n");
        var ar = ax.length;
        var av = new valsonachanTransliteration();
        var aw = "";
        for (var au = 0; au < ar; au++) {
          aw += av.munglishLine(ax[au]) + "\n";
        }
        av = null;
        document.getElementById("se_quickSlideID_2").value = aw;
        rvw.ui.Dialog.show(
          "Lyrics Transliteration",
          "Transliteration is only valid for Malayalam and it is not 100% accurate."
        );
      }
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
        rvw.ui.Dialog.show("Add Edit Songs", "Enter a valid Song Name");
        return false;
      } else {
        const sngObj = new songObj();
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
          rvw.ui.Dialog.show("Add Edit Songs", "Enter valid YouTube video link.");
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
              sngObj.subcat = songNumberObj.assignSongNumber(sngObj.catIndex);
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

        sngObj.timestamp = h();
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
        fillTagList();

        return sngObj;
      }
    }
    function onClick_se_presentID() {
      _debug("Process Present button");

      const currentIndex = _slidesTabView.get("selection").get('index');

      const ae = _dumpSong();
      if (ae !== false) {
        const sp = new songPresentObj();
        sp.init(ae);
        sp.present(currentIndex);
      }
    }
    function onClick_songEdit_saveButtonID() {
      _debug("Process Save button");
      var ac = new songObj();
      ac = _dumpSong();
      if (ac != false) {
        if (!b) {
          _debug("Adding song..");
          songManagerObj.addSong(ac, true, false);
          b = true;
        } else {
          _debug("Updating song..");
          songManagerObj.updateSong(ac, v, _primaryKey, Z);
        }
        _panel.hide();
        return true;
      } else {
        _debug("Extract Data failed");
        return false;
      }
    }
    function onClick_songAsNewEdit_saveButtonID() {
      var ac = b;
      b = false;
      if (!onClick_songEdit_saveButtonID()) {
        b = ac;
      }
    }
    function onClick_category2() {
      var ac = $("#songnav_category2 option:selected").text();
      if (specialCategory(ac)) {
        $("#songEdit_saveButtonID").hide();
      } else {
        $("#songEdit_saveButtonID").show();
      }
    }
    function onClick_cancelButtonID() {
      var ac = "Song Add/Edit";
      var ad = "Do you want to CANCEL from Add/Edit Song panel?";
      rvw.ui.Confirm.exec(ac, ad, _close_panel);
    }

    function _close_panel() {
      _panel.hide();
    }
    function G(ad) {
      const ac = ad.split('"');
      return ac[1];
    }
    function _is_valid_category(ac) {
      if (ac !== "_ALL") {
        return true;
      } else {
        alert("_ALL is reserved Category");
        return false;
      }
    }
    function _reset_seq_id() {
      document.getElementById("se_sequenceID").value = "";
    }
    function _parse_yt_videoID(af) {
      var ae = af.replace(/ /gi, "");
      if (ae == "") {
        document.getElementById("se_yvideoID").value = "";
        return true;
      }
      var ad = ae.split("&");
      ae = ad[0];
      document.getElementById("se_yvideoID").value = ae;
      ad = ae.split("?v=");
      var ac = "https://www.youtube.com/watch";
      if (ad[0] != ac) {
        return false;
      } else {
        return true;
      }
    }
    function h() {
      var ai = new Date();
      var ac = parseInt(ai.getMonth()) + 1;
      var ae = ai.getDate();
      var af = ai.getFullYear();
      var ad = ai.getHours();
      var ag = ai.getMinutes();
      var ah = ac + "/" + ae + "/" + af + "  " + ad + ":" + ag;
      _debug("Timestamp: " + ah);
      return ah;
    }

    function _debug(ac) {
      if (_isDebug) {
        air.trace("[SongEdit]...." + ac);
      }
    }

    this.init(bodyContent);
  }
}
