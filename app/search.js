function vvsearch(O) {
  this.init = S;
  this.close = P;
  this.setFontSize = A;
  this.searchKeywordInit = J;
  var r = 3;
  var K = null;
  var N = null;
  var I = null;
  var o = O;
  var T;
  var q;
  var C;
  var R = 0;
  var L = 50;
  var E;
  var I = null;
  var e = 0;
  var l = 0;
  var y = false;
  var H = false;
  var u = new Array();
  var s = new Array();
  var M = null;
  function S() {
    $("#searchID").css("font-family", getVersion1Font());
    $("#adSearch").css("font-family", getVersion1Font());
    D();
    v();
    G();
  }
  function P() {
    V();
    if (K != null) {
      K = null;
    }
  }
  function v() {
    document.getElementById("searchButtonID").addEventListener("click", p);
    document.getElementById("adSearchButton").addEventListener("click", t);
    YAHOO.util.Event.addListener("searchID", "blur", d);
    YAHOO.util.Event.addListener("searchID", "focus", n);
    YAHOO.util.Event.addListener("adSearch", "blur", w);
    YAHOO.util.Event.addListener("adSearch", "focus", x);
  }
  function n() {
    y = true;
  }
  function d() {
    y = false;
  }
  function x() {
    H = true;
  }
  function w() {
    H = false;
  }
  function V() {
    document.getElementById("searchButtonID").removeEventListener("click", p);
    document.getElementById("adSearchButton").removeEventListener("click", t);
  }
  function G() {
    clearSelectList("searchBook");
    document.getElementById("searchBook").options[0] = new Option(
      "All Books",
      0
    );
    var Y = booknames.length;
    for (var X = 1; X <= Y; X++) {
      document.getElementById("searchBook").options[X] = new Option(
        booknames[X - 1],
        X
      );
    }
    document.getElementById("searchBook").selectedIndex = 0;
  }
  function D() {
    K = new air.SQLConnection();
    K.addEventListener(air.SQLEvent.OPEN, U);
    K.addEventListener(air.SQLErrorEvent.ERROR, F);
    var X = air.File.applicationStorageDirectory.resolvePath(o);
    K.openAsync(X, air.SQLMode.UPDATE);
  }
  function U(X) {
    K.removeEventListener(air.SQLEvent.OPEN, U);
    K.removeEventListener(air.SQLErrorEvent.ERROR, F);
  }
  function F(Y) {
    K.removeEventListener(air.SQLEvent.OPEN, U);
    K.removeEventListener(air.SQLErrorEvent.ERROR, F);
    var X =
      "Error message:" +
      Y.error.message +
      " Details:" +
      Y.error.details +
      "Error opening connection Contact verseview@yahoo.com with this error message";
    vvDialog("Searh", X);
  }
  function W() {
    N = new air.SQLStatement();
    N.sqlConnection = K;
    var Y = m(0);
    var aa =
      "SELECT wordId, word, bookNum, chNum, verseNum FROM words WHERE word LIKE :param1 ";
    for (var X = 0; X < Y.length - 1; X++) {
      var Z = ":param" + (X + 2);
      aa = aa + "AND word LIKE " + Z + " ";
    }
    N.text = aa;
    N.addEventListener(air.SQLEvent.RESULT, z);
    N.addEventListener(air.SQLErrorEvent.ERROR, b);
    for (var X = 0; X < Y.length; X++) {
      var Z = ":param" + (X + 1);
      N.parameters[Z] = Y[X];
    }
    N.execute();
  }
  function f() {
    N = new air.SQLStatement();
    N.sqlConnection = K;
    var aa = null;
    var Y = m(e);
    var aa =
      "SELECT wordID, word, bookNum, chNum, verseNum FROM words WHERE word LIKE :param1 ";
    for (var X = 0; X < Y.length - 1; X++) {
      var Z = ":param" + (X + 2);
      aa = aa + "AND word LIKE " + Z + " ";
    }
    if (l != 0) {
      aa = aa + "AND bookNum = :param0";
    }
    N.text = aa;
    for (var X = 0; X < Y.length; X++) {
      var Z = ":param" + (X + 1);
      N.parameters[Z] = Y[X];
    }
    if (l != 0) {
      N.parameters[":param0"] = l;
    }
    N.addEventListener(air.SQLEvent.RESULT, z);
    N.addEventListener(air.SQLErrorEvent.ERROR, b);
    N.execute();
  }
  function z(X) {
    I = N.getResult();
    R = 0;
    L = 50;
    Q();
    tabViewN.selectTab(3);
  }
  function Q() {
    if (I.data == null) {
    } else {
      var X = I.data.length;
      u = new Array();
      s = new Array();
      for (var Z = 0; Z < X; Z++) {
        var aa = I.data[Z];
        u.push(aa.word);
        var Y = getVerseFromArray(aa.bookNum, aa.chNum, aa.verseNum);
        s.push(bibledbObj[2].getSingleVerseFromBuffer(Y - 1));
      }
    }
    k();
  }
  function k() {
    var ak = document.getElementById("searchSummaryID");
    var Y = document.getElementById("searchResultID");
    ak.innerHTML = "";
    Y.innerHTML = "";
    if (I.data == null) {
      ak.innerHTML = 'No match found for "<b>' + E + '</b>".';
    } else {
      C = I.data.length;
      var al = "";
      var ab = "";
      var aa = L;
      if (C < R + L) {
        aa = C - R;
      }
      ab =
        ab +
        "Found <b>" +
        C +
        '</b> results for "<b>' +
        E +
        '</b>". Showing results ' +
        (R + 1) +
        " to " +
        (R + aa) +
        "<br>";
      if (C > L) {
        ab =
          ab +
          '<input class="style2" type="button" id="prevResult" value=" PREVIOUS ">';
        ab =
          ab +
          '<input class="style2" type="button" id="nextResult" value="   NEXT   ">';
      }
      ab =
        ab +
        '<input class="style2" type="button" id="saveResult" value=" SAVE RESULTS ">';
      ab = ab + "<br><br>";
      al = al + "<table border=0>";
      for (i = R; i < R + aa; i++) {
        al = al + '<tr class="vcClass"><td width="4%">';
        var ag = "searchNC_" + i;
        al =
          al +
          '<div class="vcClassIcon" id="' +
          ag +
          '"><img class="vcClassIcon" src="graphics/icon/notes_s.png"></div>';
        al = al + '</td><td class="navtd" width="48%">';
        var ag = "searchVC1_" + i;
        al = al + '<div class="vcClass" id="' + ag + '">a</div>';
        al = al + '</td><td class="navtd" width="48%">';
        var ag = "searchVC2_" + i;
        al = al + '<div class="vcClass" id="' + ag + '">b</div>';
        al = al + "</td></tr>";
      }
      al = al + "</table>";
      ak.innerHTML = ab;
      Y.innerHTML = al;
      var am = new Array();
      var ad = new Array();
      var ac = new Array();
      for (i = R; i < R + aa; i++) {
        var af = "searchNC_" + i;
        var aj = "searchVC1_" + i;
        var ae = "searchVC2_" + i;
        var an = I.data[i];
        am[i] = new postit();
        am[i].init(af, an.bookNum, an.chNum, an.verseNum);
        var Z = u[i];
        var X = s[i];
        Z = g(Z);
        ad[i] = new verseClass();
        var ai =
          '<font face="Arial, Helvetica, sans-serif">' +
          booknames[an.bookNum - 1] +
          " " +
          an.chNum +
          ":" +
          an.verseNum +
          "</font><br>" +
          Z;
        var ah = bibleVersionArray[vvConfigObj.get_version1()][6];
        ad[i].init(aj, ai, an.bookNum, an.chNum, an.verseNum, ah, false);
        ac[i] = new verseClass();
        var ai =
          '<font face="Arial, Helvetica, sans-serif">' +
          booknames[an.bookNum - 1] +
          " " +
          an.chNum +
          ":" +
          an.verseNum +
          "</font><br>" +
          X;
        var ah = bibleVersionArray[vvConfigObj.get_version2()][6];
        ac[i].init(ae, ai, an.bookNum, an.chNum, an.verseNum, ah, false);
      }
      if (C > L) {
        document.getElementById("prevResult").addEventListener("click", a);
        document.getElementById("nextResult").addEventListener("click", h);
      }
      document.getElementById("saveResult").addEventListener("click", c);
    }
  }
  function c() {
    var Z = "";
    Z =
      Z +
      '<div class="style2">Enter a filename for the search results. <br><input type="text" size="20" id="promptTextID"><br>';
    Z = Z + '<br><input type="button" id="promptSaveID" value=" SAVE "> |';
    Z = Z + '<input type="button" id="promptCancelID" value=" CANCEL "></DIV>';
    var X = new YAHOO.widget.Panel("prompt_panelObj", {
      width: "300px",
      fixedcenter: true,
      modal: true,
      visible: false,
      constraintoviewport: true,
    });
    X.render(document.body);
    X.setHeader("Filename");
    X.setBody(Z);
    document.getElementById("promptSaveID").addEventListener("click", Y, false);
    document
      .getElementById("promptCancelID")
      .addEventListener("click", aa, false);
    X.show();
    function aa() {
      document.getElementById("promptTextID").value = "";
      X.hide();
    }
    function Y() {
      var ah = I.data.length;
      var aj = "";
      var ad = document.getElementById("promptTextID").value;
      X.hide();
      aj =
        aj +
        "<HTML>\n<HEAD>\n<TITLE>Search Result for: " +
        E +
        "</TITLE>\n</HEAD>\n<BODY>\n";
      aj = aj + "<H1>Search Result for: " + E + "</H1>\n";
      aj =
        aj +
        '<H3>Generated by <a href="http://www.verseview.info/">VerseVIEW</a></H3><br>\n';
      aj = aj + '<TABLE cellpadding="10">\n';
      for (var ai = 0; ai < ah; ai++) {
        var ak = I.data[ai];
        var ae =
          ai +
          1 +
          "......" +
          booknames[ak.bookNum - 1] +
          " " +
          ak.chNum +
          ":" +
          ak.verseNum;
        var ac = u[ai];
        var ab = s[ai];
        var ag = bibleVersionArray[vvConfigObj.get_version1()][6];
        var af = bibleVersionArray[vvConfigObj.get_version2()][6];
        aj = aj + "<tr>\n";
        aj = aj + "<td width=14%>" + ae + "</td>\n";
        aj =
          aj + '<td width=43%><font face="' + ag + '">' + ac + "</font></td>\n";
        aj =
          aj + '<td width=43%><font face="' + af + '">' + ab + "</font></td>\n";
        aj = aj + "</tr>\n";
        aj = aj + "<tr><td><br></td> <td><br></td> <td><br></td></tr>\n";
      }
      aj = aj + "</TABLE>\n</BODY>";
      filesave2vvexport(aj, ad);
      alert(
        'Search Result File "' +
          ad +
          '.html" saved to vvexport folder on the desktop.'
      );
    }
  }
  function h() {
    var X = R + L;
    if (X > C) {
      X = 0;
    }
    R = X;
    k();
  }
  function a() {
    var X = R - L;
    if (X < 0) {
      var Y = C % L;
      X = C - Y;
    }
    R = X;
    k();
  }
  function b(Y) {
    air.trace("Error message:", Y.error.message);
    air.trace("Details:", Y.error.details);
    var X =
      "Error message:" +
      Y.error.message +
      " Details:" +
      Y.error.details +
      "Error handling results Contact verseview@yahoo.com with this error message";
    vvDialog("Bible Search", X);
  }
  function p() {
    var X = j(0);
    if (X) {
      document.getElementById("adSearch").value = E;
      e = 0;
      W();
    }
  }
  function t() {
    var X = j(1);
    if (X) {
      e = document.getElementById("searchStyle").value;
      l = document.getElementById("searchBook").value;
      f();
    }
  }
  function J() {
    if (y) {
      p();
    } else {
      if (H) {
        t();
      } else {
      }
    }
  }
  function j(Y) {
    if (Y == 0) {
      E = document.getElementById("searchID").value;
    } else {
      E = document.getElementById("adSearch").value;
    }
    E = E.trim();
    var Z = E.replace(/ /g, "");
    if (Z == null) {
      vvDialog("Bible Search", "Invalid Search Entry");
      return false;
    }
    var X = Z.split("");
    if (X.length < 3) {
      vvDialog("Bible Search", "Invalid or Small word for search");
      return false;
    }
    return true;
  }
  function B(X) {
    var Y = null;
    if (X == 0) {
      var aa = E.split(" ");
      Y = "%";
      for (var Z = 0; Z < aa.length; Z++) {
        if (aa[Z] != "") {
          Y = Y + aa[Z] + "%";
        }
      }
    } else {
      Y = "%" + E + "%";
    }
    return Y;
  }
  function m(X) {
    var Y = new Array();
    if (X == 0) {
      var ab = 0;
      var aa = E.split(" ");
      for (var Z = 0; Z < aa.length; Z++) {
        if (aa[Z] != "") {
          Y[ab] = "%" + aa[Z] + "%";
          ab++;
        }
      }
    } else {
      Y[0] = "%" + E + "%";
    }
    return Y;
  }
  function g(X) {
    var ae = X;
    if (e == 0) {
      var ac = E.split(" ");
      var af = ae.split(" ");
      for (var ad = 0; ad < af.length; ad++) {
        for (var aa = 0; aa < ac.length; aa++) {
          var Z = af[ad].toLowerCase();
          var ag = ac[aa].toLowerCase();
          var ab = Z.match(ag);
          if (ab != null) {
            af[ad] = '<span class="highlighttext">' + af[ad] + "</span> ";
            break;
          }
        }
      }
      ae = "";
      for (var ad = 0; ad < af.length; ad++) {
        ae = ae + af[ad] + " ";
      }
    } else {
      var Y = '<span class="highlighttext">' + E + "</span> ";
      ae = ae.replace(new RegExp(E, "gi"), Y);
    }
    return ae;
  }
  function A(X) {
    r = X;
    if (I != null) {
      k();
    }
  }
}