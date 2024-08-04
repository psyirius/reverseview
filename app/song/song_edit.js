function songEditClass() {
  this.init = X;
  this.showEditPanel = m;
  this.setEditPrimaryKey = J;
  var b = false;
  var v = -1;
  var q = -1;
  var Z = false;
  var y = false;
  var f = "";
  var i = null;
  var I;
  var u = "";
  var A = 0;
  var D = "";
  var d = 0;
  var e = new Array();
  var n = 1;
  function X(ac) {
    E("Initialize Song Edit Panel");
    e = ["Arial", "Times New Roman", "Calibri"];
    f = ac;
    R();
    p();
    P();
    ab();
  }
  function R() {
    E("Generating Panel");
    i = new YAHOO.widget.Panel("panelObj", {
      width: "600px",
      fixedcenter: true,
      modal: true,
      visible: false,
      constraintoviewport: true,
    });
    i.render(document.body);
    i.setHeader("Song ADD / EDIT");
    i.setBody(f);
    i.hide();
  }
  function ab() {
    E("Generating Events");
    document
      .getElementById("songEdit_moveSlideLeftButtonID")
      .addEventListener("click", Y, false);
    document
      .getElementById("songEdit_moveSlideRightButtonID")
      .addEventListener("click", V, false);
    document
      .getElementById("songEdit_addSlideButtonID")
      .addEventListener("click", O, false);
    document
      .getElementById("songEdit_dupSlideButtonID")
      .addEventListener("click", t, false);
    document
      .getElementById("songEdit_deleteSlideButtonID")
      .addEventListener("click", K, false);
    document
      .getElementById("songEdit_createSlidesButtonID")
      .addEventListener("click", H, false);
    document
      .getElementById("songEdit_addCatButtonID")
      .addEventListener("click", z, false);
    document
      .getElementById("se_submitCatButtonID2")
      .addEventListener("click", a, false);
    document
      .getElementById("songnav_category2")
      .addEventListener("click", s, false);
    document
      .getElementById("se_addFontButtonID2")
      .addEventListener("click", N, false);
    document
      .getElementById("se_submitFontButtonID2")
      .addEventListener("click", L, false);
    document.getElementById("se_fontID2").addEventListener("change", w, false);
    document
      .getElementById("se_fontID2_2")
      .addEventListener("change", Q, false);
    document.getElementById("se_presentID").addEventListener("click", g, false);
    document
      .getElementById("songEdit_saveButtonID")
      .addEventListener("click", U, false);
    document
      .getElementById("songAsNewEdit_saveButtonID")
      .addEventListener("click", k, false);
    document
      .getElementById("songEdit_cancelButtonID")
      .addEventListener("click", C, false);
    document.getElementById("se_catTextID").style.visibility = "hidden";
    document.getElementById("se_submitCatButtonID2").style.visibility =
      "hidden";
    document.getElementById("se_fontTextID").style.visibility = "hidden";
    document.getElementById("se_submitFontButtonID2").style.visibility =
      "hidden";
  }
  function J(ac) {
    q = ac;
  }
  function P() {
    E("Init Slide Tabs");
    I = new YAHOO.widget.TabView();
    I.addTab(
      new YAHOO.widget.Tab({
        label: "1",
        content:
          '<textarea id="slide1" style="width: 284px" class="textareaStyle"></textarea><textarea id="slide1_2" style="width: 284px" class="textareaStyle"></textarea>',
        active: true,
      })
    );
    I.addTab(
      new YAHOO.widget.Tab({
        label: "2",
        content:
          '<textarea id="slide2" style="width: 284px" class="textareaStyle"></textarea><textarea id="slide2_2" style="width: 284px" class="textareaStyle"></textarea>',
      })
    );
    I.appendTo("se_slides");
    var ac = document.getElementById("se_fontID2").selectedIndex;
    tempFont = document.getElementById("se_fontID2").options[ac].text;
    document.getElementById("slide1").style.fontFamily = tempFont;
    document.getElementById("slide2").style.fontFamily = tempFont;
    var ac = document.getElementById("se_fontID2_2").selectedIndex;
    tempFont = document.getElementById("se_fontID2_2").options[ac].text;
    document.getElementById("slide1_2").style.fontFamily = tempFont;
    document.getElementById("slide2_2").style.fontFamily = tempFont;
  }
  function T() {
    var ac = 0;
    var ad = I.getTab(ac);
    while (ad != null) {
      I.removeTab(ad);
      ad = I.getTab(ac);
    }
    n = 1;
  }
  function aa(ac) {
    var ak = new Array();
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
  function p(ad, ak) {
    var al = songManagerObj.getFontList();
    var ao = new Array();
    var af = null;
    var ap = 0;
    var an = 0;
    if (al != null) {
      var am = e.length;
      for (var ah = am - 1; ah >= 0; ah--) {
        var at = al.length;
        af = al.indexOf(e[ah]);
        if (af != -1) {
          e.splice(ah, 1);
        }
      }
      ao = e.concat(al);
    } else {
      ao = e;
    }
    ao = ao.concat(systemFontList);
    ao.sort();
    var ac = ao.length;
    clearSelectList("se_fontID2");
    clearSelectList("se_fontID2_2");
    var aj = document.createDocumentFragment();
    var ai = document.createDocumentFragment();
    var ag = document.getElementById("se_fontID2");
    var ae = document.getElementById("se_fontID2_2");
    for (var ah = 0; ah < ac; ah++) {
      var ar = document.createElement("option");
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
  function L() {
    var ad = document.getElementById("se_fontTextID").value;
    var ac = F(ad);
    if (ac) {
      document.getElementById("se_fontTextID").style.visibility = "hidden";
      document.getElementById("se_submitFontButtonID2").style.visibility =
        "hidden";
      e.push(ad);
      p(ad, null);
    }
  }
  function w() {
    var ag = document.getElementById("se_fontID2").selectedIndex;
    var af = document.getElementById("se_fontID2").options[ag].text;
    var ae = "";
    var ac = 0;
    var ad = I.getTab(ac);
    while (ad != null) {
      ae = G(ad.get("content"));
      document.getElementById(ae).style.fontFamily = af;
      ac++;
      ad = I.getTab(ac);
    }
  }
  function Q() {
    var ag = document.getElementById("se_fontID2_2").selectedIndex;
    var af = document.getElementById("se_fontID2_2").options[ag].text;
    var ae = "";
    var ac = 0;
    var ad = I.getTab(ac);
    while (ad != null) {
      ae = G(ad.get("content"));
      ae = ae + "_2";
      document.getElementById(ae).style.fontFamily = af;
      ac++;
      ad = I.getTab(ac);
    }
  }
  function F(ac) {
    return true;
  }
  function c(ac) {
    if (ac != null) {
      document.getElementById("songEdit_NameID").value = ac.name;
      document.getElementById("se_copyrightID").value = ac.copyright;
      document.getElementById("se_yvideoID").value = ac.yvideo;
      if (specialCategory(ac.catIndex)) {
        $("#songEdit_saveButtonID").hide();
      } else {
        $("#songEdit_saveButtonID").show();
      }
      aa(ac.catIndex);
      p(ac.font, ac.font2);
      document.getElementById("se_keyID").value = ac.key;
      document.getElementById("se_notesID").value = ac.notes;
      document.getElementById("songEdit_Name2ID").value = ac.name2;
      document.getElementById("songEdit_SongNumberID").value = ac.subcat;
      document.getElementById("se_tagID").value = ac.tags;
      document.getElementById("se_sequenceID").value = ac.slideseq;
      T();
      var ag = ac.slides.length;
      E("number of slides in preload: " + ag);
      for (var af = 0; af < ag; af++) {
        var ae = ac.slides[af].replace(/<BR>|<br>/g, "\n");
        var ad = ac.slides2[af];
        if (ad != null) {
          ad = ad.replace(/<BR>|<br>/g, "\n");
        }
        W(ae, ad);
      }
    } else {
      document.getElementById("songEdit_NameID").value = "";
      document.getElementById("se_copyrightID").value = "";
      document.getElementById("se_yvideoID").value = "";
      aa(null);
      p(null, null);
      document.getElementById("se_keyID").value = "";
      document.getElementById("se_notesID").value = "";
      document.getElementById("songEdit_Name2ID").value = "";
      document.getElementById("songEdit_SongNumberID").value = "";
      document.getElementById("se_tagID").value = "";
      document.getElementById("se_sequenceID").value = "";
      T();
      W();
      W();
    }
  }
  function m(ac, ad, ae, af) {
    b = ad;
    v = ae;
    q = null;
    Z = af;
    if (af == null) {
      Z = false;
    }
    c(ac);
    i.show();
  }
  function z() {
    document.getElementById("se_catTextID").value = "";
    document.getElementById("se_catTextID").style.visibility = "visible";
    document.getElementById("se_submitCatButtonID2").style.visibility =
      "visible";
  }
  function a() {
    var ad = document.getElementById("se_catTextID").value;
    if (specialCategory(ad)) {
      vvDialog(
        "Add Edit Song",
        "Category name starting with 'vv' are reserved."
      );
      return false;
    }
    var ac = B(ad);
    if (ac) {
      document.getElementById("se_catTextID").style.visibility = "hidden";
      document.getElementById("se_submitCatButtonID2").style.visibility =
        "hidden";
      u = ad;
      aa(null);
    }
  }
  function Y() {
    M();
    var ad = I.get("activeIndex");
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
      I.set("activeIndex", ai);
    }
  }
  function V() {
    M();
    var ah = I.get("tabs").length;
    var ag = I.get("activeIndex");
    E(ag + "  " + ah);
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
      I.set("activeIndex", aj);
    }
  }
  function t() {
    M();
    var ag = I.get("activeIndex") + 1;
    E("Active tab Index: " + ag);
    var ac = "slide" + ag;
    var af = "slide" + ag + "_2";
    var ae = document.getElementById(ac).value;
    var ad = document.getElementById(af).value;
    W(ae, ad);
  }
  function O() {
    M();
    var ad = null;
    var ac = null;
    W(ad, ac);
  }
  function W(af, ac) {
    var ad = "slide" + n;
    var ag = "slide" + n + "_2";
    E("Slide ID: " + ad);
    if (n == 1) {
      I.addTab(
        new YAHOO.widget.Tab({
          label: n,
          content:
            '<textarea id="' +
            ad +
            '" style="width: 284px" class="textareaStyle"></textarea><textarea id="' +
            ag +
            '" style="width: 284px" class="textareaStyle"></textarea>',
          active: true,
        })
      );
    } else {
      I.addTab(
        new YAHOO.widget.Tab({
          label: n,
          content:
            '<textarea id="' +
            ad +
            '" style="width: 284px" class="textareaStyle"></textarea><textarea id="' +
            ag +
            '" style="width: 284px" class="textareaStyle"></textarea>',
        })
      );
    }
    var ae = document.getElementById("se_fontID2").selectedIndex;
    tempFont = document.getElementById("se_fontID2").options[ae].text;
    document.getElementById(ad).style.fontFamily = tempFont;
    var ae = document.getElementById("se_fontID2_2").selectedIndex;
    tempFont = document.getElementById("se_fontID2_2").options[ae].text;
    document.getElementById(ag).style.fontFamily = tempFont;
    if (af != null) {
      document.getElementById(ad).value = af;
    } else {
      document.getElementById(ad).value = "";
    }
    if (ac != null) {
      document.getElementById(ag).value = ac;
    } else {
      document.getElementById(ag).value = "";
    }
    n++;
  }
  function H() {
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
    var ai = $(window).height();
    ai = ai * 0.8;
    $("#se_quickSlideID").height(ai);
    $("#se_quickSlideID_2").height(ai);
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
    var an = I.get("tabs").length;
    var ag = "";
    var ae = "";
    for (var aq = 1; aq <= an; aq++) {
      var am = "slide" + aq;
      var aj = "slide" + aq + "_2";
      ag += document.getElementById(am).value + "\n\n\n";
      ae += document.getElementById(aj).value + "\n\n\n";
    }
    document.getElementById("se_quickSlideID").value = ag.slice(0, -3);
    document.getElementById("se_quickSlideID_2").value = ae.slice(0, -3);
    ac.show();
    ac.bringToTop();
    function ao() {
      n = 1;
      var av = document.getElementById("se_quickSlideID").value;
      var az = av.split("\n\n\n");
      var ar = az.length;
      var au = document.getElementById("se_quickSlideID_2").value;
      var at = au.split("\n\n\n");
      var ay = at.length;
      if (at[0] != null) {
        W(az[0], at[0]);
      } else {
        W(az[0], null);
      }
      var aw = I.getTab(1);
      while (aw != null) {
        I.removeTab(I.get("activeTab"));
        aw = I.getTab(1);
      }
      n = 2;
      for (var ax = 1; ax < ar; ax++) {
        if (at[ax] != null) {
          W(az[ax], at[ax]);
        } else {
          W(az[ax], null);
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
      vvDialog(
        "Lyrics Transliteration",
        "Transliteration is only valid for Malayalam and it is not 100% accurate."
      );
    }
  }
  function K() {
    M();
    var af = I.get("activeIndex");
    var ac = I.get("tabs").length;
    for (var ae = 0; ae < ac; ae++) {
      V();
    }
    var ad = I.getTab(1);
    if (ad != null) {
      I.removeTab(I.get("activeTab"));
      if (ac - 1 == af) {
        I.set("activeIndex", af - 1);
      } else {
        I.set("activeIndex", af);
      }
      n--;
    } else {
      vvDialog("Add Edit Songs", "Can not delete the last Slide");
    }
  }
  function N() {
    document.getElementById("se_fontTextID").value = "";
    document.getElementById("se_fontTextID").style.visibility = "visible";
    document.getElementById("se_submitFontButtonID2").style.visibility =
      "visible";
  }
  function S() {
    E("Extract data from Form");
    var ao = document.getElementById("songEdit_NameID").value;
    ao = ao.replace(/^\s+|\s+$/g, "");
    ao = ao.replace(/\s\s+/g, " ");
    if (ao == "") {
      vvDialog("Add Edit Songs", "Enter a valid Song Name");
      return false;
    } else {
      var ak = new songObj();
      ak.name = ao;
      ao = document.getElementById("songEdit_Name2ID").value;
      ao = ao.replace(/^\s+|\s+$/g, "");
      ao = ao.replace(/\s\s+/g, " ");
      ak.name2 = ao;
      var ae = new Array();
      var ah = new Array();
      var ac = "";
      var ad = 0;
      var aj = I.getTab(ad);
      while (aj != null) {
        ac = G(aj.get("content"));
        var an = document.getElementById(ac).value;
        ae[ad] = an.replace(/\n/g, "<BR>");
        ac = ac + "_2";
        var an = document.getElementById(ac).value;
        ah[ad] = an.replace(/\n/g, "<BR>");
        if (isBlank(ah[ad])) {
          ah[ad] = "";
        }
        ad++;
        aj = I.getTab(ad);
      }
      ak.slides = ae;
      ak.slides2 = ah;
      ak.copyright = document.getElementById("se_copyrightID").value;
      var ag = document.getElementById("se_yvideoID").value;
      var am = x(ag);
      if (am) {
        ak.yvideo = ag;
      } else {
        vvDialog("Add Edit Songs", "Enter valid You Tube video link.");
        return false;
      }
      var ai = document.getElementById("songnav_category2").selectedIndex;
      ak.catIndex =
        document.getElementById("songnav_category2").options[ai].text;
      ak.subcat = "";
      if (!specialCategory(ak.catIndex)) {
        if (
          ak.catIndex == "VV Malayalam 2021" ||
          ak.catIndex == "VV Hindi 2021"
        ) {
          var af = document.getElementById("songEdit_SongNumberID").value;
          if (af == "" || af == null) {
            ak.subcat = songNumberObj.assignSongNumber(ak.catIndex);
          } else {
            ak.subcat = af;
          }
        }
      }
      var al = document.getElementById("se_fontID2").selectedIndex;
      ak.font = document.getElementById("se_fontID2").options[al].text;
      var al = document.getElementById("se_fontID2_2").selectedIndex;
      ak.font2 = document.getElementById("se_fontID2_2").options[al].text;
      ak.timestamp = h();
      ak.key = document.getElementById("se_keyID").value;
      ak.notes = document.getElementById("se_notesID").value;
      ak.rating = 5;
      var ap = document.getElementById("se_sequenceID").value;
      ak.slideseq = ap;
      var aq = document.getElementById("se_tagID").value;
      ak.tags = aq.toUpperCase();
      addTagList(ak.tags);
      fillTagList();
      return ak;
    }
  }
  function g() {
    E("Process Present button");
    var ac = I.get("activeIndex");
    var ae = new songObj();
    ae = S();
    if (ae != false) {
      var ad = new songPresentObj();
      ad.init(ae);
      ad.present(ac);
    }
  }
  function U() {
    E("Process Save button");
    var ac = new songObj();
    ac = S();
    if (ac != false) {
      if (!b) {
        E("Adding song..");
        songManagerObj.addSong(ac, true, false);
        b = true;
      } else {
        E("Updating song..");
        songManagerObj.updateSong(ac, v, q, Z);
      }
      i.hide();
      return true;
    } else {
      E("Extract Data failed");
      return false;
    }
  }
  function k() {
    var ac = b;
    b = false;
    if (!U()) {
      b = ac;
    }
  }
  function j() {
    var ad = new songObj();
    ad = S();
    if (ad != false) {
      for (var ac = 0; ac < 200; ac++) {
        ad.name = "Test Song_" + ac;
        if (!b) {
          songManagerObj.addSong(ad, false, false);
          b = true;
        } else {
          songManagerObj.updateSong(ad, v, q);
        }
      }
    }
  }
  function s() {
    var ac = $("#songnav_category2 option:selected").text();
    if (specialCategory(ac)) {
      $("#songEdit_saveButtonID").hide();
    } else {
      $("#songEdit_saveButtonID").show();
    }
  }
  function C() {
    var ac = "Song Add/Edit";
    var ad = "Do you want to CANCEL from Add/Edit Song panel?";
    vvConfirm(ac, ad, l);
  }
  function l() {
    i.hide();
  }
  function G(ad) {
    var ac = ad.split('"');
    return ac[1];
  }
  function B(ac) {
    if (ac != "_ALL") {
      return true;
    } else {
      alert("_ALL is reserved Category");
      return false;
    }
  }
  function o(ac) {
    if (ac <= 5 && ac >= 1) {
      return true;
    } else {
      return false;
    }
  }
  function r(ac) {
    return true;
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
    E("Timestamp: " + ah);
    return ah;
  }
  function E(ac) {
    if (y) {
      air.trace("[SongEdit]...." + ac);
    }
  }
}
