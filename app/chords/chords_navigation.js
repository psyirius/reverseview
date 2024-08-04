function chordsNavClass() {
  this.init = ai;
  this.showChordsPanelForSong = F;
  this.setSongValues = E;
  var p = new Array();
  var ak =
    "The chords provided within this application are for general information and education purposes only. Chords provided in this application may not reflect the same way as played in the original recording. <br>";
  var f = "";
  var O = "";
  var o = "";
  var m = null;
  var d = null;
  var ad = 1;
  var n = 1;
  var W;
  var S;
  var R;
  var Q;
  var l = null;
  var H = false;
  var N;
  var aj;
  var b;
  var v;
  var Y;
  var u;
  var V;
  var k;
  var am;
  var K;
  var e;
  var i;
  var j;
  var C;
  var U;
  var G;
  var I;
  var q;
  var x = false;
  function ai(ap) {
    Q = ap;
    y("Initialize Chords Panel");
    s();
    chordsImportExportObj = new chordsImporExportClass();
    chordsManagerObj = new chordsManagerClass();
    chordsManagerObj.init();
    N = $("#ch_name");
    aj = $("#ch_author");
    b = $("#ch_key");
    v = $("#ch_majorminor");
    Y = $("#ch_signature");
    u = $("#ch_tempo");
    V = $("#chordsId");
    k = $("#ch_versions");
    am = $("#ch_notes");
    i = $("#ch_disclaimer");
    K = $("#ch_complexity");
    e = $("#ch_rhythm");
    j = $("#ch_piano");
    C = $("#ch_guitar");
    U = $("#ch_new");
    G = $("#ch_edit");
    I = $("#ch_delete");
    q = $("#ch_cancel");
    m = null;
    d = null;
    h();
  }
  function s() {
    y("Generating Chords Panel");
    l = new YAHOO.widget.Panel("chordsPanelObj", {
      width: "1000px",
      fixedcenter: true,
      modal: true,
      visible: false,
      close: false,
      constraintoviewport: true,
    });
    l.render(document.body);
    l.setHeader("CHORDS");
    l.setBody(Q);
    l.hide();
    $(".menu .item").tab();
  }
  function h() {
    y("Setting Events for Chords");
    b.on("change", function () {
      a();
    });
    k.on("change", function () {
      ad = k.val();
      var ap = N.val();
      F(ap, "", d, ad);
    });
    U.on("click", function () {
      chordsKeyboard.clearRecent();
      T();
    });
    G.on("click", function () {
      chordsKeyboard.clearRecent();
      X();
    });
    I.on("click", function () {
      t();
    });
    q.on("click", function () {
      chordsKeyboard.clearRecent();
      af();
    });
  }
  function ab() {
    y("Deleting Events for Chords");
  }
  function T() {
    chordsEditObj.configureChordsEdit(false);
    chordsEditObj.setSongValues(R, W, S);
    chordsEditObj.setActiveData(m, d, parseInt(n) + 1);
    chordsEditObj.showEditChordsPanel();
  }
  function X() {
    y("Edit chords...");
    chordsEditObj.configureChordsEdit(true);
    chordsEditObj.setSongValues(R, W, S);
    chordsEditObj.setActiveData(m, d, parseInt(ad) + 0);
    chordsEditObj.showEditChordsPanel();
  }
  function t() {
    var ap = "Chords";
    var aq = "Are you sure you want to delete this version?";
    vvConfirm(ap, aq, g);
  }
  function g() {
    y("Delete chords...");
    var ap = chordsManagerObj.getChordsByTitle(N.val());
    if (ap.length == 0) {
      y("No chords...");
    } else {
      y("About to delete version : " + ad);
      y("Original " + ap[ad - 1].original);
      y("About to delete...ID " + ap[ad - 1].id);
      var ar = ap[ad - 1].original;
      if (!ar) {
        var aq = ap[ad - 1].id;
        chordsManagerObj.deleteChords(aq);
      } else {
        vvDialog("Chords", "Can not be deleted..");
      }
    }
  }
  function af() {
    y("Close chords...");
    B();
  }
  function ah() {
    l.show();
    H = true;
  }
  function B() {
    l.hide();
    H = false;
  }
  function E(ar, aq, ap) {
    y("Song title coming to navigation: " + ar);
    R = ar;
    W = aq;
    S = ap;
  }
  function F(at, aq, ap, au) {
    if (!H) {
      if (at == null) {
      } else {
        var ar = chordsManagerObj.getChordsByTitle(at);
        if (ar.length == 0) {
          y("No chords...");
        }
        ad = 1;
        L(ar, ap, true);
      }
    } else {
      var ar = chordsManagerObj.getChordsByTitle(N.val());
      if (ar.length == 0) {
        y("No chords...");
      }
      if (au == null) {
        ad = 1;
      } else {
        ad = au;
      }
      L(ar, d, false);
    }
  }
  function c() {
    N.val("");
    aj.val("");
    K.html("");
    e.val("");
    b.val("C");
    v.html("Major");
    Y.val("");
    u.val("");
    V.html("");
    k.val(ad);
    am.val("");
    j.html("");
    C.html("");
  }
  function L(ar, aq, ap) {
    if (ar.length == 0) {
      y("populatePanel : No chords...");
      c();
      Z("Major");
      an(true);
      V.html("No Chords are available");
      N.val(R);
      k.html(z(1));
      v.hide();
      m = null;
      d = null;
    } else {
      n = ar.length;
      k.html(z(ar.length));
      c();
      y("About to populate the panel with active record...");
      A(ar[ad - 1], aq);
    }
    if (ap) {
      ah();
    }
  }
  function A(at, ar) {
    m = at;
    an(at.original);
    N.val(at.title);
    aj.val(at.chordsby);
    v.hide();
    if (at.key != "") {
      var ap = at.key;
      var au = at.key;
      ap = ap[at.key.length - 1];
      if (ap == "m") {
        Z("minor");
        au = au.slice(0, -1);
      } else {
        Z("Major");
      }
      b.val(au);
      o = au;
    } else {
      o = "C";
    }
    f = at.chords;
    if (at.lyrics == "") {
      O = ar;
    } else {
      O = at.lyrics;
    }
    d = O.split("<slide>");
    if (at.complexity == null) {
      K.hide();
    } else {
      var aq = "Beginner";
      switch (at.complexity) {
        case "0":
          aq = "Beginner";
          break;
        case "1":
          aq = "Intermediate";
          break;
        case "2":
          aq = "Advanced";
          break;
        default:
          aq = "Beginner";
      }
      K.html(aq);
      K.show();
    }
    Y.val(at.timesignature);
    u.val(at.bpm);
    e.val(at.rhythm);
    am.val(at.notes);
    a();
  }
  function a() {
    var ap = b.val();
    new_chords = w(f, o, ap);
    V.html(P(new_chords, O));
    i.html(ak);
    ag();
    J();
  }
  function P(au, at) {
    var ax = "";
    var aE = at.replace(/<BR>/g, "<br>");
    var az = aE.split("<slide>");
    var aq = au.split("<slide>");
    var aC = az.length;
    for (var aD = 0; aD < aC; aD++) {
      var aw = az[aD].split("<br>");
      var ay = aw.length;
      var ap = [""];
      if (aq[aD] != null) {
        ap = aq[aD].split("<br>");
      }
      for (var aB = 0; aB < ay; aB++) {
        var av = ap[aB].split("|");
        var ar = av.length;
        if (ar == 1) {
          ax = ax + al(ap[aB], aw[aB]) + "<br>";
        } else {
          for (var aA = 0; aA < ar; aA++) {
            ax = ax + al(av[aA], aw[aB]) + "<br>";
          }
        }
      }
      ax += "<br>";
    }
    return ax;
  }
  function al(aA, at) {
    var aE = "";
    var aA = aA.replace(/\xa0/g, " ");
    var aC = aA.split("");
    var aB = aC.length;
    var av = 0;
    var aD = new Array();
    var aG = new Array();
    var ax = "";
    var aw = 0;
    for (var aF = 0; aF < aB; aF++) {
      var ap = aC[av].charCodeAt(0);
      switch (ap) {
        case 160:
          if (ax != "") {
            aG.push(ax);
            var au = ax.length;
            aD.push(av - au);
          }
          av++;
          ax = "";
          break;
        case 32:
          if (ax != "") {
            aG.push(ax);
            var au = ax.length;
            aD.push(av - au);
          }
          av++;
          ax = "";
          break;
        case 47:
          if (ax != "") {
            aG.push(ax + "/");
            var au = ax.length + 1;
            aD.push(av - au + 1);
          }
          av++;
          ax = "";
          break;
        case 124:
          ax += "|";
          aG.push(ax);
          var au = ax.length;
          aD.push(av - 0);
          av++;
          ax = "";
          break;
        case 67:
          ax += "C";
          av++;
          break;
        case 68:
          ax += "D";
          av++;
          break;
        case 69:
          ax += "E";
          av++;
          break;
        case 70:
          ax += "F";
          av++;
          break;
        case 71:
          ax += "G";
          av++;
          break;
        case 65:
          ax += "A";
          av++;
          break;
        case 66:
          ax += "B";
          av++;
          break;
        case 109:
          ax += "m";
          av++;
          break;
        case 98:
          ax += "b";
          av++;
          break;
        case 35:
          ax += "#";
          av++;
          break;
        case 100:
          ax += "d";
          av++;
          break;
        case 105:
          ax += "i";
          av++;
          break;
        case 50:
          ax += "2";
          av++;
          break;
        case 52:
          ax += "4";
          av++;
          break;
        case 55:
          ax += "7";
          av++;
          break;
        case 57:
          ax += "9";
          av++;
          break;
        case 115:
          ax += "s";
          av++;
          break;
        case 117:
          ax += "u";
          av++;
          break;
        default:
          vvDialog(
            "Chords",
            'Invalid Chord: "' + aC[av],
            '". Please edit chords in this version.'
          );
          aC[av] = " ";
          av++;
      }
    }
    if (ax != "") {
      aG.push(ax);
      var au = ax.length;
      aD.push(av - au);
    }
    var ar = aG.length;
    var aH = new Array();
    var az = null;
    var aF = 0;
    var aI = 0;
    aE += "<div>";
    if (aD[aF] != 0) {
      az = at.substring(0, aD[aF]);
      aE += ae("", az);
    }
    for (var ay = aF; ay < ar; ay++) {
      aI = aF + 1;
      var aq = 0;
      if (aI >= ar) {
        aq = at.length;
      } else {
        aq = aD[aI];
      }
      az = at.substring(aD[aF], aq);
      aE += ae(aG[aF], az);
      aF++;
    }
    aE += "</div><br>";
    return aE;
  }
  function ae(aq, ap) {
    var ar = "";
    var ap = ap.replace(/ /g, "&nbsp;");
    ar =
      ar +
      '<div class="chunk">  <span class="chordsedit_chords">' +
      aq +
      '</span><br><span class="lyric">' +
      ap +
      "</span> </div>";
    return ar;
  }
  function w(aC, aP, aD) {
    var aI = "";
    p = new Array();
    var aq = aC.split("<slide>");
    var aF = aq.length;
    for (var aB = 0; aB < aF; aB++) {
      var aE = aq[aB].split("<BR>");
      var aL = aE.length;
      if (aL == 1) {
        aE = aq[aB].split("<br>");
        aL = aE.length;
      }
      for (var az = 0; az < aL; az++) {
        var aM = aE[az].length;
        var av = 0;
        var aG = new Array();
        var aK = new Array();
        var aA = "";
        var ax = 0;
        while (av < aM) {
          var ap = aE[az][av].charCodeAt(0);
          switch (ap) {
            case 160:
              if (aA != "") {
                aK.push(aA);
                var at = aA.length;
                aG.push(av - at);
              }
              av++;
              aA = "";
              break;
            case 32:
              if (aA != "") {
                aK.push(aA);
                var at = aA.length;
                aG.push(av - at);
              }
              av++;
              aA = "";
              break;
            case 47:
              if (aA != "") {
                aK.push(aA + "/");
                var at = aA.length + 1;
                aG.push(av - at);
              }
              av++;
              aA = "";
              break;
            case 124:
              aA += "|";
              aK.push(aA);
              var at = aA.length;
              aG.push(av - 0);
              av++;
              aA = "";
              break;
            case 67:
              aA += "C";
              av++;
              break;
            case 68:
              aA += "D";
              av++;
              break;
            case 69:
              aA += "E";
              av++;
              break;
            case 70:
              aA += "F";
              av++;
              break;
            case 71:
              aA += "G";
              av++;
              break;
            case 65:
              aA += "A";
              av++;
              break;
            case 66:
              aA += "B";
              av++;
              break;
            case 109:
              aA += "m";
              av++;
              break;
            case 98:
              aA += "b";
              av++;
              break;
            case 35:
              aA += "#";
              av++;
              break;
            case 100:
              aA += "d";
              av++;
              break;
            case 105:
              aA += "i";
              av++;
              break;
            case 50:
              aA += "2";
              av++;
              break;
            case 52:
              aA += "4";
              av++;
              break;
            case 55:
              aA += "7";
              av++;
              break;
            case 57:
              aA += "9";
              av++;
              break;
            case 115:
              aA += "s";
              av++;
              break;
            case 117:
              aA += "u";
              av++;
              break;
            default:
              vvDialog(
                "Chords",
                'Invalid Chord: "' + aE[az][av],
                '". Please edit chords in this version.'
              );
              av++;
          }
        }
        if (aA != "") {
          aK.push(aA);
          var at = aA.length;
          aG.push(av - at);
        }
        var aO = new Array();
        for (var ay = 0; ay < aM + 5; ay++) {
          aO.push("\xa0");
        }
        for (var aJ = 0; aJ < aK.length; aJ++) {
          var au = aG[aJ];
          var aw = aK[aJ];
          if (aw != "|") {
            aw = r(aw);
            aw = ac(aw, aP, aD);
            aw = r(aw);
            M(aw);
            var ar = aw.split("");
            for (var aH = 0; aH < ar.length; aH++) {
              aO[au] = ar[aH];
              au++;
            }
          } else {
            aO[au] = "|";
          }
        }
        var aN = "";
        for (var aJ = 0; aJ < aO.length; aJ++) {
          aN += aO[aJ];
        }
        aI += aN + "<br>";
      }
      aI += "<slide>";
    }
    return aI;
  }
  function M(aq) {
    var ar = aq;
    ar = ar.replace("/", "");
    var ap = p.indexOf(ar);
    if (ap == -1) {
      p.push(ar);
    }
  }
  function Z(ar) {
    var aq = new Array(
      "C",
      "C#",
      "Db",
      "D",
      "D#",
      "Eb",
      "E",
      "F",
      "F#",
      "Gb",
      "G",
      "G#",
      "Ab",
      "A",
      "A#",
      "Bb",
      "B"
    );
    clearSelectList("ch_key");
    var ap = aq.length;
    for (var at = 0; at < ap; at++) {
      var au = aq[at] + " " + ar;
      $("#ch_key").append(
        '<option value="' + aq[at] + '" >' + au + "</option>"
      );
    }
  }
  function D(av) {
    var au = av.split("<slide>");
    var at = au[0].split("<br>");
    var ar = at[0].split("");
    var ax = ar.length;
    var aq = 0;
    var aw = 0;
    for (var ap = 0; ap < ax; ap++) {
      if (ar[ap].charCodeAt(0) != 32 && ar[ap].charCodeAt(0) != 160) {
        if ($.isNumeric(ar[ap])) {
          aq++;
        } else {
          aw++;
        }
      }
    }
    if (aq > aw) {
      return true;
    } else {
      return false;
    }
  }
  function aa(ap) {
    var aw = "";
    var ar = ap.split("<slide>");
    var aB = ar.length;
    for (var aC = 0; aC < aB; aC++) {
      var au = ar[aC].split("<BR>");
      var ax = au.length;
      if (ax == 1) {
        au = ar[aC].split("<br>");
        ax = au.length;
      }
      for (var aA = 0; aA < ax; aA++) {
        var av = au[aA].length;
        var at = new Array();
        for (var az = 0; az < av; az++) {
          var aq = au[aA][az].charCodeAt(0);
          switch (aq) {
            case 160:
              at.push("\xa0");
              break;
            case 32:
              at.push("\xa0");
              break;
            case 49:
              at.push("C");
              break;
            case 50:
              at.push("Dm");
              break;
            case 51:
              at.push("Em");
              break;
            case 52:
              at.push("F");
              break;
            case 53:
              at.push("G");
              break;
            case 54:
              at.push("Am");
              break;
            case 55:
              at.push("Bdim");
              break;
            case 77:
              at.push("m");
              break;
          }
        }
        var ay = "";
        for (var az = 0; az < av; az++) {
          ay += at[az];
        }
        aw += ay + "<br>";
      }
      aw += "<slide>";
    }
    return aw;
  }
  function ac(au, ar, ap) {
    var aq = teoria.interval(teoria.note(ar), teoria.note(ap));
    var at;
    try {
      at = teoria.chord(au);
    } catch (av) {
      return " ";
    }
    var aw = at.interval(aq);
    return aw.toString();
  }
  function J() {
    var aq = p.length;
    var aw = "";
    var ax = "";
    var av = 0;
    for (var ap = 0; ap < aq; ap++) {
      var ar = 0;
      var au = true;
      ar = p[ap].search(/sus4/i);
      if (ar > -1) {
        au = false;
      }
      ar = p[ap].search(/dim/i);
      if (ar > -1) {
        au = false;
      }
      ar = p[ap].search(/m7/i);
      if (ar > -1) {
        au = false;
      }
      if (au) {
        aw += '<div class="row">';
        aw += '<div class="col-33">' + p[ap] + "</div>";
        var at = p[ap].replace("#", "sharp");
        at = at.replace("sus", "");
        ax = at.toLowerCase() + ".jpg";
        aw +=
          '<div class="col-66"><img src="./graphics/chords/guitar/' +
          ax +
          '" width=100 height=90 class="imgGuitar"></div>';
        aw += "</div>";
      }
    }
    C.html(aw);
  }
  function ag() {
    var aq = p.length;
    var aw = "";
    var ax = "";
    var av = 0;
    for (var ap = 0; ap < aq; ap++) {
      var ar = 0;
      var au = true;
      ar = p[ap].search(/sus4/i);
      if (ar > -1) {
        au = false;
      }
      ar = p[ap].search(/dim/i);
      if (ar > -1) {
        au = false;
      }
      ar = p[ap].search(/m7/i);
      if (ar > -1) {
        au = false;
      }
      if (au) {
        aw += '<div class="row">';
        aw += '<div class="col-33">' + p[ap] + "</div>";
        var at = p[ap].replace("#", "sharp");
        at = at.replace("sus", "");
        ax = at.toLowerCase() + ".jpg";
        aw +=
          '<div class="col-66"><img src="./graphics/chords/piano/' +
          ax +
          '" width=200 height=50 class="imgGuitar"></div>';
        aw += "</div>";
      }
    }
    j.html(aw);
  }
  function r(ap) {
    var aq;
    aq = ap;
    aq = aq.replace("Cb", "B");
    aq = aq.replace("Fb", "E");
    aq = aq.replace("E#", "F");
    aq = aq.replace("B#", "C");
    aq = aq.replace("D#", "Eb");
    aq = aq.replace("A#", "Bb");
    aq = aq.replace("Cx", "D");
    aq = aq.replace("Dx", "E");
    aq = aq.replace("Ex", "F#");
    aq = aq.replace("Fx", "G");
    aq = aq.replace("Gx", "A");
    aq = aq.replace("Ax", "B");
    aq = aq.replace("Bx", "C#");
    aq = aq.replace("Bbb", "A");
    aq = aq.replace("Ebb", "D");
    return aq;
  }
  function ao(ap) {
    var aq = false;
    if (ap.indexOf("#") >= 0) {
      aq = true;
    }
    return aq;
  }
  function z(ap) {
    var ar = "";
    for (var aq = 1; aq <= ap; aq++) {
      ar = ar + "<option value=" + aq + ">Version " + aq + "</option>";
    }
    return ar;
  }
  function an(ap) {
    if (ap) {
      G.hide();
    } else {
      G.show();
    }
  }
  function y(ap) {
    if (x) {
      air.trace("[Chords Navigation]...." + ap);
    }
  }
}