function chordsEditClass() {
  this.init = am;
  this.showEditChordsPanel = ab;
  this.setActiveData = ad;
  this.setSongValues = K;
  this.configureChordsEdit = ap;
  this.chordUpdateReady = x;
  var s = true;
  var k = false;
  var aq = s;
  var R;
  var W = null;
  var t;
  var d;
  var af;
  var U;
  var T;
  var S;
  var ar;
  var aa;
  var Z;
  var F;
  var e;
  var ak;
  var ae;
  var v;
  var r;
  var I;
  var c;
  var X;
  var V;
  var al;
  var at;
  var f;
  var ah;
  var i;
  var p;
  var u;
  var J;
  var a = true;
  var B = false;
  function am(au) {
    R = au;
    G("Initialize Chords Edit Panel");
    E();
    F = $("#chedit_name");
    e = $("#chedit_author");
    ak = $("#chedit_key");
    ae = $("#chedit_majorminor");
    v = $("#chedit_signature");
    r = $("#chedit_tempo");
    I = $("#chedit_chordsIdTXT");
    c = $("#chedit_chordsId");
    X = $("#chedit_version");
    V = $("#chedit_notes");
    al = $("#chedit_rhythm");
    at = $("#chedit_complexity");
    ah = $("#chedit_save");
    i = $("#chedit_clear");
    p = $("#chedit_lyrics1");
    u = $("#chedit_lyrics2");
    J = $("#chedit_cancel");
    f = $("#chedit_message");
    aq = s;
    n();
  }
  function ap(au) {
    if (au != null) {
      aq = au;
    } else {
      aq = s;
    }
  }
  function E() {
    G("Generating Chords Edit Panel");
    W = new YAHOO.widget.Panel("chordsEditPanelObj", {
      width: "1000px",
      fixedcenter: true,
      modal: true,
      visible: false,
      close: false,
      constraintoviewport: true,
    });
    W.render(document.body);
    W.setHeader("EDIT CHORDS");
    W.setBody(R);
    W.hide();
  }
  function n() {
    G("Setting Events for Chords edit");
    ah.on("click", function () {
      j();
    });
    i.on("click", function () {
      g();
    });
    p.on("click", function () {
      D();
    });
    u.on("click", function () {
      C();
    });
    J.on("click", function () {
      ag();
    });
    I.keydown(false);
    I.on("click", function (au) {
      chedit_chords_jselement = document.getElementById("chedit_chordsIdTXT");
      chordsKeyboard.edit(I.text(), M(chedit_chords_jselement));
    });
  }
  function M(au) {
    var av = 0;
    if (au.selectionStart || au.selectionStart == "0") {
      av =
        au.selectionDirection == "backward"
          ? au.selectionStart
          : au.selectionEnd;
    }
    return av;
  }
  function x() {
    var au = chordsKeyboard.get_txt();
    I.html(au);
    ai();
  }
  function Y() {
    G("Deleting Events for Chords");
  }
  function j() {
    G("Saved edit chords...");
    w();
  }
  function O() {
    G("Delete chords...");
  }
  function ag() {
    var au = "Chords";
    var av = "Do you want to discard the edits?";
    vvConfirm(au, av, h);
  }
  function h() {
    G("Close Edit chords...");
    an();
  }
  function ad(av, aw, au) {
    if (aq) {
      Z = av.id;
    }
    t = av;
    d = aw;
    af = au;
    if (av != null) {
      m();
    } else {
      G("No Chords so just show blank with title and version number..");
      g();
      F.val(S);
      X.val("Version 1");
    }
  }
  function m() {
    G("Active chord title in edit " + t.title);
    F.val(t.title);
    X.val("Version " + af);
    var au = ao();
    c.html(au);
    au = H();
    au = au.replace(/<BR>/gi, "\n");
    I.html(au);
  }
  function ao() {
    var aD = "";
    var aE = d;
    var aC = aE.length;
    var au = t.chords.split("<slide>");
    for (var aI = 0; aI < aC; aI++) {
      var aG = aE[aI].replace(/<BR>/g, "<br>");
      var aB = aG.split("<br>");
      var ay = aB.length;
      var ax = "";
      var az = "";
      if (au[aI] != null) {
        au[aI] = au[aI].replace(/\|/g, " ");
        ax = au[aI].split("<br>");
        az = ax.length;
      }
      for (l = 0; l < ay; l++) {
        var aH = new Array();
        var aw = 0;
        var aA = 0;
        var av = false;
        var aF = false;
        while (A(aB, l, aw) || A(ax, l, aA)) {
          if (A(ax, l, aA)) {
            if (
              ax[l][aA].charCodeAt(0) == 32 ||
              ax[l][aA].charCodeAt(0) == 160
            ) {
              if (av) {
                aH.push("]");
                av = false;
              }
              while (aw <= aA) {
                if (A(aB, l, aw)) {
                  aH.push(aB[l][aw]);
                  aw++;
                } else {
                  aH.push(" ");
                  aw++;
                }
              }
              aA++;
            } else {
              if (!av) {
                aH.push("[");
                av = true;
              }
              aH.push(ax[l][aA]);
              aA++;
            }
          } else {
            if (av) {
              aH.push("]");
              av = false;
            }
            if (aB[l][aw] != null) {
              aH.push(aB[l][aw]);
              aw++;
            }
          }
        }
        if (av) {
          aH.push("]");
          av = false;
        }
        aD = aD + N(z(aH)) + "<BR>";
      }
      aD = aD + "<BR>";
    }
    return aD;
  }
  function z(aw) {
    var av = aw.length;
    var ax = "";
    for (var au = 0; au < av; au++) {
      ax = ax + aw[au];
    }
    return ax;
  }
  function N(au) {
    var av = "";
    av = au;
    av = av.replace(/ /g, "&nbsp;");
    av = av.replace(/\[/g, "<span class='chordsedit_chords'>[");
    av = av.replace(/\]/g, "]</span>");
    return av;
  }
  function H() {
    var au = c.html();
    au = au.replace(/<span class="chordsedit_chords">/g, "");
    au = au.replace(/<\/span>/g, "");
    au = au.replace("&nbsp;", " ");
    au = au.replace(/ \[/g, "  [");
    return au;
  }
  function ai() {
    var au = I.val();
    au = au.replace(/\n/g, "<BR>");
    var av = N(au);
    c.html(av);
  }
  function A(au, aw, av) {
    if (au == null) {
      return false;
    }
    if (au[aw] == null) {
      return false;
    }
    if (au[aw][av] == null) {
      return false;
    }
    return true;
  }
  function w() {
    a = true;
    var au = y();
    if (a) {
      if (aq == k) {
        chordsManagerObj.addNew(au);
      } else {
        chordsManagerObj.updateChords(au, Z);
      }
      an();
    }
  }
  function ac() {
    var ay = c.html();
    ay = ay.replace(/<span class="chordsedit_chords">/g, "");
    ay = ay.replace(/<\/span>/g, "");
    ay = ay.replace(/ \[/g, "  [");
    ay = ay.replace(/<\/div>/g, "<br>");
    ay = ay.replace(/<div>/g, "");
    ay = ay.replace(/&nbsp;/g, " ");
    var au = ay.split("<br>");
    var aC = au.length;
    G("Number of lines to parse: " + au.length + " " + au);
    ar = "";
    aa = "";
    for (var aD = 0; aD < aC; aD++) {
      var aI = new Array();
      var aA = new Array();
      var aG = 0;
      var aE = 0;
      au[aD] = au[aD].replace(/\]\[/g, "] [");
      var av = au[aD].split("");
      var az = av.length;
      var aH = false;
      var aB = false;
      for (var ax = 0; ax < az; ax++) {
        if (av[ax] == "[") {
          aH = true;
          aB = true;
          if (aE > aG) {
            var aF = aE - aG;
            for (var aw = 0; aw < aF; aw++) {
              aI.push(" ");
              aG++;
            }
          }
        }
        if (av[ax] == "]") {
          aH = false;
          aB = true;
          aI.push("  ");
          aG++;
          aG++;
        }
        if (!aB) {
          if (aH) {
            aI.push(av[ax]);
            aG++;
          } else {
            aA.push(av[ax]);
            aE++;
          }
        } else {
          aB = false;
        }
      }
      if (aE > aG) {
        var aF = aE - aG;
        for (var aw = 0; aw < aF; aw++) {
          aI.push(" ");
          aG++;
        }
      } else {
        var aF = aG - aE;
        for (var aw = 0; aw < aF; aw++) {
          aA.push(" ");
          aE++;
        }
      }
      ar = ar + z(aI) + "<br>";
      aa = aa + z(aA) + "<BR>";
    }
  }
  function Q() {}
  function y() {
    var au = new chordsObjClass();
    au.init();
    au.title = F.val();
    ac();
    au.lyrics = aa;
    au.chords = ar;
    au.key = o(ak.val(), "key");
    au.chordsby = e.val();
    au.bpm = o(r.val(), "bpm");
    au.notes = V.val();
    au.timesignature = v.val();
    au.rhythm = al.val();
    au.complexity = at.val();
    if (ae.val() == "minor") {
      au.key = au.key + "m";
    }
    au.original = false;
    return au;
  }
  function K(aw, av, au) {
    G("Song title coming to chord edit : " + aw);
    S = aw;
    U = av;
    T = au;
  }
  function ab() {
    W.show();
  }
  function an() {
    W.hide();
  }
  function o(ax, av) {
    var au = "";
    switch (av) {
      case "key":
        au = ax;
        break;
      case "bpm":
        var aw = $.isNumeric(ax);
        if (!aw) {
          if (ax == "") {
            au = 0;
          } else {
            au = 0;
            L("Invalid BPM value");
            a = false;
          }
        } else {
          au = parseInt(ax);
        }
        break;
      default:
        au = "";
    }
    return au;
  }
  function L(au) {
    f.text(au);
  }
  function g() {
    var au = "Chords";
    var av = "Do you want to clear the lyrics for this version?";
    vvConfirm(au, av, q);
  }
  function q() {
    G("Clear chords");
    e.val("");
    ak.val("C");
    v.val("");
    r.val("");
    c.html("");
    I.text("");
    V.val("");
    f.text("");
  }
  function D() {
    var au = "Chords";
    var av = "Do you want to switch to Lyrics 1 for this progression?";
    vvConfirm(au, av, aj);
  }
  function aj() {
    G("Load Lyrics 1");
    c.html("");
    var au = P(U);
    c.html(au);
    au = au.replace(/<BR>/gi, "\n");
    I.html(au);
  }
  function C() {
    var au = "Chords";
    var av = "Do you want to switch to Lyrics 2 for this progression?";
    vvConfirm(au, av, b);
  }
  function b() {
    G("Load Lyrics 2");
    var au = P(T);
    c.html(au);
    au = au.replace(/<BR>/gi, "\n");
    I.html(au);
  }
  function P(aw) {
    var av = aw.length;
    var ax = "";
    for (var au = 0; au < av; au++) {
      ax = ax + aw[au] + "<br><br>";
    }
    return ax;
  }
  function G(au) {
    if (B) {
      air.trace("[Chords Edit]...." + au);
    }
  }
}