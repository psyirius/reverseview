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
          .addEventListener("click", onClick_moveSlideRightButtonID, false);
      document
          .getElementById("songEdit_addSlideButtonID")
          .addEventListener("click", onClick_addSlideButtonID, false);
      document
          .getElementById("songEdit_dupSlideButtonID")
          .addEventListener("click", onClick_dupSlideButtonID, false);
      document
          .getElementById("songEdit_deleteSlideButtonID")
          .addEventListener("click", onClick_deleteSlideButtonID, false);
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

      _slidesTabView = new YAHOO.widget.TabView();
      _slidesTabView.addTab(
        new YAHOO.widget.Tab({
          label: "1",
          content: '<textarea id="slide1" style="width: 284px" class="textareaStyle"></textarea><textarea id="slide1_2" style="width: 284px" class="textareaStyle"></textarea>',
          active: true,
        })
      );
      _slidesTabView.addTab(
        new YAHOO.widget.Tab({
          label: "2",
          content: '<textarea id="slide2" style="width: 284px" class="textareaStyle"></textarea><textarea id="slide2_2" style="width: 284px" class="textareaStyle"></textarea>',
        })
      );
      _slidesTabView.appendTo("se_slides");

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
      const i = 0;
      let st = _slidesTabView.getTab(i);
      while (st != null) {
        _slidesTabView.removeTab(st);
        st = _slidesTabView.getTab(i);
      }
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
      var ad = _slidesTabView.getTab(ac);
      while (ad != null) {
        ae = G(ad.get("content"));
        document.getElementById(ae).style.fontFamily = af;
        ac++;
        ad = _slidesTabView.getTab(ac);
      }
    }
    function onChange_se_fontID2_2() {
      var ag = document.getElementById("se_fontID2_2").selectedIndex;
      var af = document.getElementById("se_fontID2_2").options[ag].text;
      var ae = "";
      var ac = 0;
      var ad = _slidesTabView.getTab(ac);
      while (ad != null) {
        ae = G(ad.get("content"));
        ae = ae + "_2";
        document.getElementById(ae).style.fontFamily = af;
        ac++;
        ad = _slidesTabView.getTab(ac);
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
      M();
      var ad = _slidesTabView.get("activeIndex");
      if (ad != 0) {
        var ai = ad - 1;
        var ag = "slide" + (ad + 1);
        var ae = "slide" + (ai + 1);
        var aj = "slide" + (ad + 1) + "_2";
        var af = "slide" + (ai + 1) + "_2";
        var ah = document.getElementById(ag).value;
        document.getElementById(ag).value = document.getElementById(ae).value;
        document.getElementById(ae).value = ah;
        var ac = document.getElementById(aj).value;
        document.getElementById(aj).value = document.getElementById(af).value;
        document.getElementById(af).value = ac;
        _slidesTabView.set("activeIndex", ai);
      }
    }
    function onClick_moveSlideRightButtonID() {
      M();
      var ah = _slidesTabView.get("tabs").length;
      var ag = _slidesTabView.get("activeIndex");
      _debug(ag + "  " + ah);
      if (ag < ah - 1) {
        var aj = parseInt(ag) + 1;
        var af = "slide" + (ag + 1);
        var ai = "slide" + (aj + 1);
        var ac = "slide" + (ag + 1) + "_2";
        var ad = "slide" + (aj + 1) + "_2";
        var ae = document.getElementById(af).value;
        document.getElementById(af).value = document.getElementById(ai).value;
        document.getElementById(ai).value = ae;
        var ak = document.getElementById(ac).value;
        document.getElementById(ac).value = document.getElementById(ad).value;
        document.getElementById(ad).value = ak;
        _slidesTabView.set("activeIndex", aj);
      }
    }
    function onClick_dupSlideButtonID() {
      M();
      var ag = _slidesTabView.get("activeIndex") + 1;
      _debug("Active tab Index: " + ag);
      var ac = "slide" + ag;
      var af = "slide" + ag + "_2";
      var ae = document.getElementById(ac).value;
      var ad = document.getElementById(af).value;
      _append_Slide(ae, ad);
    }
    function onClick_addSlideButtonID() {
      M();
      var ad = null;
      var ac = null;
      _append_Slide(ad, ac);
    }
    function _append_Slide(slide1, slide2) {
      const slide1_id = `slide${_current_slide_num}`;
      const slide2_id = `slide${_current_slide_num}_2`;
      _debug("Slide ID: " + slide1_id);
      if (_current_slide_num === 1) {
        _slidesTabView.addTab(
          new YAHOO.widget.Tab({
            label: _current_slide_num,
            content: `<textarea id="${slide1_id}" style="width: 284px" class="textareaStyle"></textarea><textarea id="${slide2_id}" style="width: 284px" class="textareaStyle"></textarea>`,
            active: true,
          })
        );
      } else {
        _slidesTabView.addTab(
          new YAHOO.widget.Tab({
            label: _current_slide_num,
            content: `<textarea id="${slide1_id}" style="width: 284px" class="textareaStyle"></textarea><textarea id="${slide2_id}" style="width: 284px" class="textareaStyle"></textarea>`,
          })
        );
      }

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

      _current_slide_num++;
    }
    function onClick_createSlidesButtonID() {
      M();
      var ak = "";
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
      var ac = new YAHOO.widget.Panel("gpanelObj", {
        width: "800px",
        fixedcenter: true,
        modal: true,
        visible: false,
        constraintoviewport: true,
      });
      ac.render(document.body);
      ac.setHeader("Generate Slides");
      ac.setBody(ak);

      var windowHeight = $(window).height();
      windowHeight = windowHeight * 0.8;
      $("#se_quickSlideID").height(windowHeight);
      $("#se_quickSlideID_2").height(windowHeight);

      document
        .getElementById("se_generateID")
        .addEventListener("click", ao, false);
      document
        .getElementById("se_generateMunglishID")
        .addEventListener("click", ap, false);
      document
        .getElementById("se_generateCancelID")
        .addEventListener("click", ah, false);
      var al = document.getElementById("se_fontID2").selectedIndex;
      var ad = document.getElementById("se_fontID2").options[al].text;
      document.getElementById("se_quickSlideID").style.fontFamily = ad;
      var al = document.getElementById("se_fontID2_2").selectedIndex;
      var ad = document.getElementById("se_fontID2_2").options[al].text;
      document.getElementById("se_quickSlideID_2").style.fontFamily = ad;

      var numSlides = _slidesTabView.get("tabs").length;

      var primarySlidesList = [];
      var secondarySlidesList = [];

      for (var slideIndex = 1; slideIndex <= numSlides; slideIndex++) {
        primarySlidesList.push(document.getElementById("slide" + slideIndex).value);
        secondarySlidesList.push(document.getElementById("slide" + slideIndex + "_2").value);
      }

      // write content to the textarea (primary and secondary)
      document.getElementById("se_quickSlideID").value = primarySlidesList.join("\n\n\n").trim();
      document.getElementById("se_quickSlideID_2").value = secondarySlidesList.join("\n\n\n").trim();

      ac.show();
      ac.bringToTop();
      function ao() {
        _current_slide_num = 1;
        var av = document.getElementById("se_quickSlideID").value;
        var az = av.split("\n\n\n");
        var ar = az.length;
        var au = document.getElementById("se_quickSlideID_2").value;
        var at = au.split("\n\n\n");
        var ay = at.length;
        if (at[0] != null) {
          _append_Slide(az[0], at[0]);
        } else {
          _append_Slide(az[0], null);
        }
        var aw = _slidesTabView.getTab(1);
        while (aw != null) {
          _slidesTabView.removeTab(_slidesTabView.get("activeTab"));
          aw = _slidesTabView.getTab(1);
        }
        _current_slide_num = 2;
        for (var ax = 1; ax < ar; ax++) {
          if (at[ax] != null) {
            _append_Slide(az[ax], at[ax]);
          } else {
            _append_Slide(az[ax], null);
          }
        }
        ah();
      }
      function ah() {
        af();
        ac.hide();
      }
      function af() {
        document
          .getElementById("se_generateID")
          .removeEventListener("click", ao, false);
        document
          .getElementById("se_generateMunglishID")
          .removeEventListener("click", ap, false);
        document
          .getElementById("se_generateCancelID")
          .removeEventListener("click", ah, false);
      }
      function ap() {
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
    function onClick_deleteSlideButtonID() {
      M();
      var af = _slidesTabView.get("activeIndex");
      var ac = _slidesTabView.get("tabs").length;
      for (var ae = 0; ae < ac; ae++) {
        onClick_moveSlideRightButtonID();
      }
      var ad = _slidesTabView.getTab(1);
      if (ad != null) {
        _slidesTabView.removeTab(_slidesTabView.get("activeTab"));
        if (ac - 1 == af) {
          _slidesTabView.set("activeIndex", af - 1);
        } else {
          _slidesTabView.set("activeIndex", af);
        }
        _current_slide_num--;
      } else {
        rvw.ui.Dialog.show("Add Edit Songs", "Can not delete the last Slide");
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
        var ae = [];
        var ah = [];
        var ac = "";
        var ad = 0;
        let slideTab = _slidesTabView.getTab(ad);
        while (slideTab != null) {
          ac = G(slideTab.get("content"));

          const anx = document.getElementById(ac).value;
          ae[ad] = anx.replace(/\n/g, "<BR>");
          ac = ac + "_2";

          var any = document.getElementById(ac).value;
          ah[ad] = any.replace(/\n/g, "<BR>");
          if (isBlank(ah[ad])) {
            ah[ad] = "";
          }

          ad++;
          slideTab = _slidesTabView.getTab(ad);
        }
        sngObj.slides = ae;
        sngObj.slides2 = ah;
        sngObj.copyright = document.getElementById("se_copyrightID").value;
        var ag = document.getElementById("se_yvideoID").value;
        var am = x(ag);
        if (am) {
          sngObj.yvideo = ag;
        } else {
          rvw.ui.Dialog.show("Add Edit Songs", "Enter valid You Tube video link.");
          return false;
        }
        var ai = document.getElementById("songnav_category2").selectedIndex;
        sngObj.catIndex =
          document.getElementById("songnav_category2").options[ai].text;
        sngObj.subcat = "";
        if (!specialCategory(sngObj.catIndex)) {
          if (sngObj.catIndex == "VV Malayalam 2021" ||
            sngObj.catIndex == "VV Hindi 2021") {
            var af = document.getElementById("songEdit_SongNumberID").value;
            if (af == "" || af == null) {
              sngObj.subcat = songNumberObj.assignSongNumber(sngObj.catIndex);
            } else {
              sngObj.subcat = af;
            }
          }
        }
        var al = document.getElementById("se_fontID2").selectedIndex;
        sngObj.font = document.getElementById("se_fontID2").options[al].text;
        var al = document.getElementById("se_fontID2_2").selectedIndex;
        sngObj.font2 = document.getElementById("se_fontID2_2").options[al].text;
        sngObj.timestamp = h();
        sngObj.key = document.getElementById("se_keyID").value;
        sngObj.notes = document.getElementById("se_notesID").value;
        sngObj.rating = 5;
        var ap = document.getElementById("se_sequenceID").value;
        sngObj.slideseq = ap;
        var aq = document.getElementById("se_tagID").value;
        sngObj.tags = aq.toUpperCase();
        addTagList(sngObj.tags);
        fillTagList();
        return sngObj;
      }
    }
    function onClick_se_presentID() {
      _debug("Process Present button");
      var ac = _slidesTabView.get("activeIndex");
      var ae = new songObj();
      ae = _dumpSong();
      if (ae != false) {
        var ad = new songPresentObj();
        ad.init(ae);
        ad.present(ac);
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
    function M() {
      document.getElementById("se_sequenceID").value = "";
    }
    function x(af) {
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
