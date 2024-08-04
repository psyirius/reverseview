function bibledb() {
  this.init = ae;
  this.closeDB = v;
  this.isConnectionReady = Y;
  this.isDataReady = N;
  this.isSingleDataReady = l;
  this.isFullDataReady = Q;
  this.isConfigDataReady = A;
  this.getVerse = y;
  this.getChapter = o;
  this.getFull = H;
  this.setBookNumber = h;
  this.setChapterNumber = P;
  this.setVerseNumber = a;
  this.getResultArray = E;
  this.getResultFullData = J;
  this.getSingleResult = ab;
  this.getSingleVerseFromBuffer = m;
  this.getConfigRevision = ac;
  this.getConfigFonts = R;
  this.getConfigBooknames = U;
  this.getConfigTitle = C;
  this.getConfigDescription = p;
  this.getConfigCopyrights = s;
  this.getConfigSizefactor = B;
  this.updateVerse = f;
  var r = false;
  var aa = false;
  var af = false;
  var i = false;
  var ah = false;
  var c = false;
  var T = "./bible/kjv.db";
  var G = null;
  var ag = null;
  var S = null;
  var W = null;
  var M = null;
  var q = new Array();
  var e = 1;
  var g = 1;
  var X = 1;
  var z;
  var K;
  var ad;
  var w;
  var t;
  var j;
  var x;
  var k = false;
  var O = 500;
  var I = false;
  function L(ai) {
    if (I) {
      air.trace("[Bible Database]...." + ai);
    }
  }
  function ae(aj, ai) {
    c = false;
    if (ai != null) {
      k = ai;
    } else {
      k = false;
    }
    if (aj != null) {
      T = aj;
    } else {
      T = "./bible/kjv.db";
    }
    D();
  }
  function Y() {
    return r;
  }
  function N() {
    var ai = false;
    L("Status of DB " + r + " " + aa);
    if (r && aa) {
      ai = true;
    }
    return ai;
  }
  function l() {
    var ai = false;
    L("Status of DB " + r + " " + af);
    if (r && af) {
      ai = true;
    }
    return ai;
  }
  function Q() {
    var ai = false;
    L("DataConnection:" + r + " | FullDataReady:" + i);
    if (r && i) {
      ai = true;
    }
    return ai;
  }
  function A() {
    return c;
  }
  function h(ai) {
    if (ai != null) {
      e = ai;
    } else {
      e = 1;
    }
  }
  function P(ai) {
    if (ai != null) {
      g = ai;
    } else {
      g = 1;
    }
  }
  function a(ai) {
    if (ai != null) {
      X = ai;
    } else {
      X = 1;
    }
  }
  function o() {
    V();
  }
  function y(ai, ak, aj) {
    d(ai, ak, aj);
  }
  function H() {
    Z();
  }
  function E() {
    var ai = ag.data.length;
    var al = new Array();
    for (var ak = 0; ak < ai; ak++) {
      var aj = ag.data[ak];
      al.push(aj.verseNum + " " + aj.word);
    }
    return al;
  }
  function J() {
    var ai = S.data.length;
    var al = new Array();
    for (var ak = 0; ak < ai; ak++) {
      var aj = S.data[ak];
      al.push(aj.verseNum + " " + aj.word);
    }
    return al;
  }
  function ab() {
    var ai = W.data[0];
    return ai.word;
  }
  function v() {
    G.close();
    if (G != null) {
      G = null;
    }
  }
  function D() {
    G = new air.SQLConnection();
    G.addEventListener(air.SQLEvent.OPEN, u);
    G.addEventListener(air.SQLErrorEvent.ERROR, b);
    var ai = air.File.applicationStorageDirectory.resolvePath(T);
    G.openAsync(ai, air.SQLMode.UPDATE);
  }
  function u(ai) {
    L("DB connection was successfully");
    r = true;
    n();
    if (!k) {
      F();
    }
  }
  function n() {
    var ai = new air.SQLStatement();
    ai.sqlConnection = G;
    var ak = "SELECT * FROM configuration";
    ai.text = ak;
    ai.addEventListener(air.SQLEvent.RESULT, aj);
    ai.addEventListener(air.SQLErrorEvent.ERROR, al);
    ai.execute();
    function aj(am) {
      L("Query successful. Data in searchResult");
      M = ai.getResult();
      z = M.data[0].revision;
      K = M.data[0].fonts;
      ad = M.data[0].booknames;
      w = M.data[0].title;
      t = M.data[0].description;
      j = M.data[0].copyrights;
      x = M.data[0].sizefactor;
      c = true;
    }
    function al() {
      L("Error message:", event.error.message);
      L("Details:", event.error.details);
    }
  }
  function b(ai) {
    L("Error message:" + ai.error.message);
    L("Details (create DB):" + ai.error.details);
    r = false;
  }
  function ac() {
    return z;
  }
  function R() {
    return K;
  }
  function U() {
    return ad;
  }
  function C() {
    return w;
  }
  function p() {
    return t;
  }
  function s() {
    return j;
  }
  function B() {
    return x;
  }
  function F() {
    i = false;
    var ai = new Array();
    H();
    var aj = null;
    aj = setInterval(function () {
      if (ah) {
        clearTimeout(aj);
        q = J();
        i = true;
      } else {
        L(" ****** Full Data not ready ");
      }
    }, O);
  }
  function m(ai) {
    return q[ai];
  }
  function V() {
    aa = false;
    var ai = new air.SQLStatement();
    ai.sqlConnection = G;
    var ak =
      "SELECT word, bookNum, chNum, verseNum FROM words WHERE bookNum = :param1 AND chNum = :param2 ORDER BY verseNum ASC";
    ai.parameters[":param1"] = e * 1 + 1;
    ai.parameters[":param2"] = g * 1 + 1;
    ai.text = ak;
    ai.addEventListener(air.SQLEvent.RESULT, aj);
    ai.addEventListener(air.SQLErrorEvent.ERROR, al);
    ai.execute();
    function aj(am) {
      L("Query successful. Data in searchResult");
      ag = ai.getResult();
      aa = true;
    }
    function al() {
      L("Error message:", event.error.message);
      L("Details:", event.error.details);
      aa = false;
    }
  }
  function d(ai, ao, aj) {
    af = false;
    var ak = new air.SQLStatement();
    ak.sqlConnection = G;
    var am =
      "SELECT word, bookNum, chNum, verseNum FROM words WHERE bookNum = :param1 AND chNum = :param2 AND verseNum = :param3";
    ak.parameters[":param1"] = ai * 1 + 0;
    ak.parameters[":param2"] = ao * 1 + 0;
    ak.parameters[":param3"] = aj * 1 + 0;
    ak.text = am;
    ak.addEventListener(air.SQLEvent.RESULT, al);
    ak.addEventListener(air.SQLErrorEvent.ERROR, an);
    ak.execute();
    function al(ap) {
      L("Query successful. Data in searchResult");
      W = ak.getResult();
      af = true;
    }
    function an() {
      L("Error message:", event.error.message);
      L("Details:", event.error.details);
      af = false;
    }
  }
  function Z() {
    ah = false;
    var ai = new air.SQLStatement();
    ai.sqlConnection = G;
    var ak = "SELECT word, bookNum, chNum, verseNum FROM words";
    ai.text = ak;
    ai.addEventListener(air.SQLEvent.RESULT, aj);
    ai.addEventListener(air.SQLErrorEvent.ERROR, al);
    ai.execute();
    function aj(am) {
      L("Query successful. Data in searchResult");
      S = ai.getResult();
      ah = true;
    }
    function al() {
      L("Error message:", event.error.message);
      L("Details:", event.error.details);
      ah = false;
    }
  }
  function f(ai, ap, aj, ao) {
    var ak = new air.SQLStatement();
    ak.sqlConnection = G;
    var an = "";
    an +=
      "UPDATE words SET word=:wordtxt WHERE bookNum=:b AND chNum=:c AND verseNum=:v;";
    ak.text = an;
    ak.addEventListener(air.SQLEvent.RESULT, al);
    ak.addEventListener(air.SQLErrorEvent.ERROR, am);
    ak.parameters[":wordtxt"] = ao;
    ak.parameters[":b"] = String(ai);
    ak.parameters[":c"] = String(ap);
    ak.parameters[":v"] = String(aj);
    ak.execute();
    function al() {
      ak.removeEventListener(air.SQLEvent.RESULT, al);
      ak.removeEventListener(air.SQLErrorEvent.ERROR, am);
      var aq = getVerseFromArray(ai, ap, aj);
      q[aq - 1] = aj + " " + ao;
      vvDialog("Bible Verse Update", "Verse Updated");
    }
    function am(aq) {
      ak.removeEventListener(air.SQLEvent.RESULT, al);
      ak.removeEventListener(air.SQLErrorEvent.ERROR, am);
      var ar =
        "UPDATE Record - error:" +
        aq.error +
        " | " +
        aq.error.code +
        " | " +
        aq.error.message;
      vvDialog("Bible Verse Update", ar);
    }
  }
}