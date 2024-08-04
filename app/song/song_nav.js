var searchDelay = null;
var searchDelayTime = 600;
function songNavClass() {
  this.init = af;
  this.setFormats = T;
  this.update_songList = ae;
  this.get_songList = t;
  this.update_CategoryList = V;
  this.searchComplete = D;
  this.processExportSongDB = K;
  this.isSongSearchEditActive = d;
  this.sn_searchSong = c;
  this.sn_showLyricsByID = S;
  this.sn_backupGlobalID = g;
  this.sn_presentSong = u;
  this.sn_add2schedule = M;
  this.sn_newSong = p;
  this.sn_editSong = z;
  this.sn_deleteSong = w;
  this.sn_deleteSongByCat = A;
  this.showSuggestedList = o;
  var N = new Array();
  var y = null;
  var s = true;
  var W = false;
  var Q = -1;
  var n = -1;
  var a = 0;
  var b = "";
  var v = 20;
  var f = new Array();
  var aa = 30;
  var ag = false;
  var E = false;
  var L = false;
  var m = "";
  var B = null;
  var P = false;
  YAHOO.example.Data = { songTitle: [] };
  function af() {
    Z();
    l();
    y = new songObj();
    y.init();
    y.slides = new Array();
    getTags2Array();
    fillTagList();
    s = true;
  }
  function Z() {
    var al = new icon(
      "songnav_searchbutton",
      " SEARCH Song Lyrics ",
      "graphics/icon/search_32.png",
      "graphics/icon/search_32.png",
      ""
    );
    var al = new icon(
      "songnav_searchauthorbutton",
      " SEARCH Song by Author ",
      "graphics/icon/search_author_32.png",
      "graphics/icon/search_author_32.png",
      ""
    );
    var am = new icon(
      "songnav_clearbutton",
      " CLEAR Search ",
      "graphics/icon/clearsearch_32.png",
      "graphics/icon/clearsearch_32.png",
      ""
    );
    var an = new icon(
      "songnav_suggestbutton",
      " Suggestions ",
      "graphics/icon/suggestionsearch.png",
      "graphics/icon/suggestionsearch.png",
      ""
    );
    roundSearchBox(document.getElementById("songnav_filterbox"));
    document.getElementById("songnav_filterbox").style.margin =
      "2px 0px 0px 10px";
    roundSearchBox(document.getElementById("songnav_editbox"));
  }
  function l() {
    document
      .getElementById("songnav_category")
      .addEventListener("change", R, false);
    document
      .getElementById("songnav_tags")
      .addEventListener("change", ac, false);
    $("#songnav_filterbox").hide();
    document
      .getElementById("songAddScheduleButton")
      .addEventListener("click", F, false);
    document
      .getElementById("songnav_searchbutton")
      .addEventListener("click", e, false);
    document
      .getElementById("songnav_searchauthorbutton")
      .addEventListener("click", aj, false);
    document
      .getElementById("songnav_clearbutton")
      .addEventListener("click", i, false);
    document
      .getElementById("songnav_suggestbutton")
      .addEventListener("click", Y, false);
    YAHOO.util.Event.addListener("songnav_editbox", "blur", ah);
    YAHOO.util.Event.addListener("songnav_editbox", "focus", ad);
    $("#songnav_editbox").keyup(c);
    document.getElementById("ly_edit").addEventListener("click", x, false);
    document.getElementById("ly_chords").addEventListener("click", I, false);
    document
      .getElementById("ly_add2schedule")
      .addEventListener("click", F, false);
    document.getElementById("ly_present").addEventListener("click", r, false);
    document.getElementById("ly_copy").addEventListener("click", ak, false);
  }
  function ah() {
    W = false;
  }
  function ad() {
    W = true;
  }
  function d() {
    return W;
  }
  function x() {
    song_edit_menu();
  }
  function F() {
    learner.finishLearning();
    vvPanelClose();
    songNavObj.sn_add2schedule();
    showNotification("Added to schedule");
  }
  function r() {
    songNavObj.sn_presentSong();
  }
  function I() {
    if (chordsNavObj != null) {
      chordsNavObj.setSongValues(y.name, y.slides, y.slides2);
      chordsNavObj.showChordsPanelForSong(y.name, y.slides, y.slides2, 1);
    }
  }
  function T() {
    v = parseInt((tabHeight - 300) / 22);
    var al = YAHOO.example.Data.songTitle;
    if (s) {
    } else {
      if (al != null) {
        U();
      }
    }
  }
  function R() {
    var am = document.getElementById("songnav_category").selectedIndex;
    var al = document.getElementById("songnav_category").options[am].text;
    G("Selected Category Value: " + al);
    $("#songnav_editbox").val("");
    setTag2All();
    ag = false;
    songManagerObj.getSongsFromCat(al);
  }
  function ac() {
    var am = $("#songnav_tags option:selected").text();
    var al = "";
    if (searchDelay != null) {
      clearTimeout(searchDelay);
    }
    searchDelay = setTimeout(function () {
      clearTimeout(searchDelay);
      if (am != "ALL") {
        al = "%" + am + "%";
        songManagerObj.searchRecords(al, SEARCH_TAGS);
      } else {
        i();
      }
      searchDelay = null;
    }, searchDelayTime);
  }
  function p() {
    var al = false;
    songEditObj.showEditPanel(null, al, null);
  }
  function z() {
    G("Launch panel edit song..");
    var al = true;
    songEditObj.showEditPanel(y, al, a, ag);
  }
  function X(an, am, al) {
    f = new Array();
    var au = document.getElementById("songnav_editbox").value;
    au = $.trim(au);
    G("|" + au + "|");
    G("Search Flag " + al);
    var at = au.split(" ");
    var aq = at.length;
    G("Words " + aq);
    if (al == SEARCH_TITLE && aq == 1) {
      var av = an.data.length;
      for (var ap = 0; ap < av; ap++) {
        if (am == "_ALL" || an.data[ap].cat == am) {
          var aw = an.data[ap].name.toLowerCase();
          var ar = aw.indexOf(au.toLowerCase());
          if (ar == 0) {
            ao(aw);
          }
        }
      }
      G("Keywords Length: " + f.length);
      G("Keywords: " + f);
      if (!P) {
        o();
      } else {
        P = false;
      }
    }
    function ao(ax) {
      var az = ax.toLowerCase().split(" ");
      var ay = jQuery.inArray(az[0], f);
      if (ay == -1) {
        f.push(az[0]);
      }
    }
  }
  function o() {
    var an = wordbrain.getSuggestions();
    var aq = an.concat(f);
    G("Suggested word - concatenated : " + aq);
    var am = aq.length;
    if (am > 0) {
      if (am > aa) {
        am = aa;
      }
      var ap = "";
      for (var al = 0; al < am; al++) {
        if (al % 2 == 0) {
          var ao =
            '<a class="hintwords" style="color:black" data-evalz="' +
            aq[al] +
            '">' +
            aq[al] +
            "</a>";
        } else {
          var ao =
            '<a class="hintwords" style="color:red" data-evalz="' +
            aq[al] +
            '">' +
            aq[al] +
            "</a>";
        }
        ap = ap + ao + " | ";
      }
      vvPanel("Suggestions", ap);
      $(".hintwords").each(function () {
        var ar = $(this);
        ar.on("click", function () {
          var at = $(this).data("evalz");
          $("#songnav_editbox").val(at);
          vvPanelClose();
          P = true;
          songNavObj.sn_searchSong();
        });
      });
    } else {
      vvPanelClose();
    }
  }
  function ae(ap, am, at) {
    if (at == null) {
      ag = false;
    }
    YAHOO.example.Data.songTitle.length = 0;
    if (ap.data != null) {
      var au = ap.data.length;
      G("update_songList: Number of songs: " + au);
      var an = 0;
      var aw = "";
      for (var ar = 0; ar < au; ar++) {
        if (am == "_ALL") {
          var av = ap.data[ar].name;
          if (C(av)) {
            var aq = ap.data[ar].id;
            YAHOO.example.Data.songTitle.push({ ID: ar, Title: av });
          }
        } else {
          if (ap.data[ar].cat == am) {
            var av = ap.data[ar].name;
            var al = ap.data[ar].title2;
            var ao = ap.data[ar].font;
            if (testTAB) {
              if (ao != "Tamil Bible") {
                aw = aw + av + "|" + al + "| <BR>";
              } else {
                aw = aw + av + "| |" + al + "<BR>";
              }
            }
            if (C(av)) {
              var aq = ap.data[ar].id;
              YAHOO.example.Data.songTitle.push({ ID: ar, Title: av });
            }
          }
        }
      }
      if (testTAB) {
        document.getElementById("texttest").innerHTML = aw;
      }
    }
    U();
  }
  function t(am, aq, at) {
    var al = "";
    if (am.data != null) {
      var ao = am.data.length;
      for (var ap = 0; ap < ao; ap++) {
        if (aq == "_ALL") {
          var ar = am.data[ap].name;
          var an = C(ar, at);
          if (an) {
            al = al + ar + "|";
          }
        } else {
          if (am.data[ap].cat == aq) {
            var ar = am.data[ap].name;
            var an = C(ar, at);
            if (an) {
              al = al + ar + "|";
            }
          }
        }
      }
    }
    return al;
  }
  function V(ap) {
    var ao = ap;
    clearSelectList("songnav_category");
    document.getElementById("songnav_category").options[0] = new Option(
      "_ALL",
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
    y = songManagerObj.getSongObj(a, ag);
    J(y);
  }
  function u() {
    var al = new songPresentObj();
    al.init(y);
    al.present();
  }
  function O() {
    G("Calling prev slide from song_nav.js");
    call_prevSlide();
  }
  function k() {
    G("Calling next slide from song_nav.js");
    call_nextSlide();
  }
  function h() {
    call_closePresentation();
  }
  function w() {
    var al = "Song Database";
    var an = 'Do you want to delete "' + b + '" ?';
    vvConfirm(al, an, am);
    function am() {
      var ao = a;
      if (a != 0) {
        a = a - 1;
      }
      songManagerObj.deleteSong(ao, ag);
    }
  }
  function A() {
    var ao = document.getElementById("songnav_category").selectedIndex;
    var an = document.getElementById("songnav_category").options[ao].text;
    if (an != "_ALL") {
      var am = "Song Database";
      var ap = 'Do you want to delete ALL songs from "' + an + '" category?';
      vvConfirm(am, ap, al);
    } else {
      vvDialog(
        "Song Database",
        "Can not delete the _ALL category. Please select a specific category."
      );
    }
    function al() {
      a = 0;
      songManagerObj.deleteSongByCat(an);
    }
  }
  function c() {
    if (searchDelay != null) {
      clearTimeout(searchDelay);
    }
    searchDelay = setTimeout(function () {
      clearTimeout(searchDelay);
      var al = document.getElementById("songnav_editbox").value;
      al = $.trim(al);
      if ($.isNumeric(al)) {
        songManagerObj.searchRecords(al, SEARCH_SONGNUMBER);
      } else {
        learner.addWord(al);
        al = al + "%";
        songManagerObj.searchRecords(al, SEARCH_TITLE);
      }
      searchDelay = null;
    }, searchDelayTime);
  }
  function e() {
    var al = document.getElementById("songnav_editbox").value;
    al = $.trim(al);
    al = "%" + al + "%";
    songManagerObj.searchRecords(al, SEARCH_LYRICS);
  }
  function aj() {
    var al = document.getElementById("songnav_editbox").value;
    var am = "%" + al + "%";
    songManagerObj.searchRecords(am, SEARCH_AUTHOR);
  }
  function i() {
    ag = false;
    learner.cancelLearning();
    $("#songnav_editbox").val("");
    setTag2All();
    R();
  }
  function Y() {
    vvPanelToggle();
  }
  function J(at) {
    var az = vvConfigObj.get_navFontSize() + "px";
    document.getElementById("ly_slide").style.fontSize = az;
    var an = at.name;
    if (at.catIndex == "VV Malayalam 2021" || at.catIndex == "VV Hindi 2021") {
      an += " (" + at.subcat + ") ";
    }
    document.getElementById("ly_name").innerHTML = an;
    if (at.name2 != "null") {
      document.getElementById("ly_name2").innerHTML = at.name2;
      var aF = specialFontList.indexOf(at.font);
      if (aF == -1) {
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
    var aG = true;
    if (aG) {
      if (at.yvideo != null && at.yvideo != "") {
        B = at.yvideo;
        document.getElementById("ytubeid").disabled = false;
        $("#ytubeid").removeClass("disabled");
        document.getElementById("ytubeid").addEventListener("click", ai, false);
      } else {
        B = null;
        document
          .getElementById("ytubeid")
          .removeEventListener("click", ai, false);
        document.getElementById("ytubeid").disabled = true;
        $("#ytubeid").addClass("disabled");
      }
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
      if (av == 0) {
        aB = aB + "</div>";
        aB = aB + '<div class="ui cards">';
      }
    }
    aB = aB + "</div>";
    document.getElementById("ly_slide").innerHTML = aB;
    var ar = new Array();
    var am = new Array();
    for (var aD = 0; aD < au; aD++) {
      var ay = "lyricsID" + aD;
      var aq = "lyricsID" + aD + "_2";
      document.getElementById(ay).style.fontFamily = at.font;
      ar[aD] = new songLyricsClass();
      ar[aD].init(at, ay, aD, 1);
      if (aC != null) {
        document.getElementById(aq).style.fontFamily = at.font2;
        am[aD] = new songLyricsClass();
        am[aD].init(at, aq, aD, 2);
      }
    }
    if (ag) {
      var aA = document.getElementById("songnav_editbox").value;
      aA = $.trim(aA);
      if (aA.length > 2) {
        $(".context").mark(aA.toLowerCase());
      }
    }
    document.getElementById("ly_tags").innerHTML = "";
    if (at.tags != null && at.tags != "") {
      G("Tags : " + at.tags);
      var aE = at.tags.split(",");
      var al = aE.length;
      var ap = "";
      for (var aD = 0; aD < al; aD++) {
        var ao =
          '<button type="button" class="btn btn-outline-secondary btn-sm" id="tag_' +
          aD +
          '">' +
          aE[aD].toUpperCase() +
          "</button>\n";
        ap += ao;
      }
      G("Tags Content : " + ap);
      document.getElementById("ly_tags").innerHTML = ap;
      for (var aD = 0; aD < al; aD++) {
        var ax = "tag_" + aD;
        document.getElementById(ax).addEventListener("click", q, false);
      }
    }
  }
  function g() {
    Q = a;
    n = b;
  }
  function S(al) {
    air.trace("show lyrics by ID called.. ");
    y = songManagerObj.getSongObjWithID(al);
    air.trace("show lyrics by ID called.. " + y.name + "  " + a + "   " + b);
    J(y);
  }
  function q(al) {
    var an = document.getElementById(al.target.id).innerHTML;
    var am = "%" + an + "%";
    songManagerObj.searchRecords(am, SEARCH_TAGS);
  }
  function ak(am) {
    var al = document.getElementById(am.target.id).innerHTML;
    var an = "%" + al + "%";
    songManagerObj.searchRecords(an, SEARCH_AUTHOR);
  }
  function D(ao, al) {
    G("Search Complete " + ao);
    if (ao.data != null) {
      ag = true;
      $("#search_error_notification").html("");
      showLyricsElements();
      var an = document.getElementById("songnav_category").selectedIndex;
      var am = document.getElementById("songnav_category").options[an].text;
      X(ao, am, al);
      ae(ao, am, ag);
    } else {
      f = new Array();
      hideLyricsElements();
      $("#ly_name").html("No matching song found.");
      $("#search_error_notification").html("No match");
      ae(ao, am, ag);
    }
  }
  function K() {
    var ap = "./song/default.db";
    var am = air.File.applicationStorageDirectory;
    am = am.resolvePath(ap);
    var al = air.File.desktopDirectory;
    var aq = "./vvexport/default_songs.db";
    al = al.resolvePath(aq);
    am.addEventListener(air.Event.COMPLETE, an);
    am.addEventListener(air.IOErrorEvent.IO_ERROR, ao);
    am.copyToAsync(al, true);
    function an(ar) {
      vvDialog(
        "Song Database",
        'Song database saved to Desktop under the "vvexport" folder'
      );
    }
    function ao(ar) {
      vvDialog(
        "Song Database",
        "Unable to save the song database to the Desktop"
      );
    }
  }
  function M() {
    var al = songManagerObj.getSongID(a, ag);
    scheduleObj.processAddSong(al);
  }
  function ai() {
    var al = new air.URLRequest(B);
    air.navigateToURL(al);
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
    G("Filter value changed..." + m);
    R();
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
  function G(al) {
    if (E) {
      air.trace("[SongNav]...." + al);
    }
  }
  function U() {
    var au = YAHOO.example.Data.songTitle;
    var av = YAHOO.example.Data.songTitle.length;
    if (au != null) {
      if (ao != null) {
        ao.unsubscribe("rowMouseoverEvent", ao.onEventHighlightRow);
        ao.unsubscribe("rowMouseoutEvent", ao.onEventUnhighlightRow);
        ao.unsubscribe("rowClickEvent", ao.onEventSelectRow);
        ao.unsubscribe("rowSelectEvent", an);
      }
      var am = [
        { key: "ID", hiddden: true },
        { key: "Title", sortable: true, resizeable: true, minWidth: 500 },
      ];
      var ar = new YAHOO.util.DataSource(YAHOO.example.Data.songTitle);
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
      var ao = new YAHOO.widget.DataTable("songnav_songlistnew", am, ar, ap);
      ao.hideColumn("ID");
      L = false;
      ao.subscribe("rowMouseoverEvent", ao.onEventHighlightRow);
      ao.subscribe("rowMouseoutEvent", ao.onEventUnhighlightRow);
      ao.subscribe("rowClickEvent", ao.onEventSelectRow);
      ao.subscribe("rowSelectEvent", an);
      ao.subscribe("renderEvent", al);
      at.subscribe("pageChange", aq);
      s = false;
      function aq() {
        L = true;
      }
      function al() {
        if (L) {
          L = false;
        }
        ao.selectRow(ao.getTrEl(0));
      }
      function an() {
        var aw = ao.getSelectedTrEls()[0];
        record = ao.getRecord(aw);
        if (record != null) {
          if (Q != -1) {
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
function hideLyricsElements() {
  $("#ly_name2").hide();
  $("#ly_edit").hide();
  $("#ly_add2schedule").hide();
  $("#ly_present").hide();
  $("#ly_chords").hide();
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
  $("#ly_chords").show();
  $("#ly_slide").show();
  $("#ly_tags").show();
  $("#ly_cat").show();
  $("#ly_key").show();
  $("#ly_copy").show();
  $("#ly_notes").show();
}
function splitIN2(j) {
  var e = j.length;
  var a = new Array();
  for (var b = 0; b < e; b++) {
    var h = isBlank(j[b]);
    var k = j[b].split("<BR>");
    var d = "";
    var f = k.length;
    var c = 1;
    if (!h) {
      for (var g = 0; g < f; g++) {
        if (c == 2) {
          d = d + k[g];
          a.push(d);
          d = "";
          c = 1;
        } else {
          d = d + k[g] + "<BR>";
          c++;
        }
      }
      if (c == 2) {
        a.push(d);
      }
    } else {
      a.push(d);
    }
  }
  return a;
}
