function vvbrain() {
  this.init = x;
  this.addRecord = w;
  this.addRecordBy_wordin_wordout = u;
  this.findRecordBy_wordin = B;
  this.getSuggestions = i;
  var g = null;
  var a = false;
  var k = null;
  var y = null;
  var q = "./song/words.db";
  var z = new Array();
  var c = "";
  var e;
  var C;
  var s;
  var m = null;
  var v = false;
  function x() {
    a = false;
    d();
  }
  function d() {
    g = new air.SQLConnection();
    g.addEventListener(air.SQLEvent.OPEN, p);
    g.addEventListener(air.SQLErrorEvent.ERROR, t);
    var D = air.File.applicationStorageDirectory.resolvePath(q);
    g.openAsync(D);
  }
  function p(D) {
    r("Brain DB was created successfully");
    a = true;
    f();
  }
  function t(D) {
    r("Error message:" + D.error.message);
    r("Details (create DB):" + D.error.details);
    a = false;
  }
  function f() {
    r(" Creating song table...");
    k = new air.SQLStatement();
    k.sqlConnection = g;
    var D =
      "CREATE TABLE IF NOT EXISTS wordbrain (id INTEGER PRIMARY KEY AUTOINCREMENT, wordin TEXT, wordout TEXT, count INTEGER )";
    k.text = D;
    k.addEventListener(air.SQLEvent.RESULT, b);
    k.addEventListener(air.SQLErrorEvent.ERROR, l);
    k.execute();
  }
  function b() {
    k.removeEventListener(air.SQLEvent.RESULT, b);
    k.removeEventListener(air.SQLErrorEvent.ERROR, l);
    r("Notes Table created.....");
  }
  function l(D) {
    k.removeEventListener(air.SQLEvent.RESULT, b);
    k.removeEventListener(air.SQLErrorEvent.ERROR, l);
    r("Error message:" + D.error.message);
    r("Details in creating table :" + D.error.details);
  }
  function o() {
    a = false;
  }
  function w(G, I) {
    var E = new air.SQLStatement();
    E.sqlConnection = g;
    var H = "";
    H +=
      "INSERT INTO wordbrain (wordin, wordout, count) VALUES (:w_in, :w_out, :w_count);";
    E.text = H;
    E.addEventListener(air.SQLEvent.RESULT, D);
    E.addEventListener(air.SQLErrorEvent.ERROR, F);
    E.parameters[":w_in"] = G;
    E.parameters[":w_out"] = I;
    E.parameters[":w_count"] = 1;
    E.execute();
    function D(J) {
      r("Add record passed ");
      E.removeEventListener(air.SQLEvent.RESULT, insertResult);
      E.removeEventListener(air.SQLErrorEvent.ERROR, insertError);
    }
    function F(J) {
      E.removeEventListener(air.SQLEvent.RESULT, insertResult);
      E.removeEventListener(air.SQLErrorEvent.ERROR, insertError);
      r("INSERT error:" + J.error);
      r("event.error.code:" + J.error.code);
      r("event.error.message:" + J.error.message);
    }
  }
  function h(H) {
    var F = new air.SQLStatement();
    F.sqlConnection = g;
    F.addEventListener(air.SQLEvent.RESULT, D);
    F.addEventListener(air.SQLErrorEvent.ERROR, E);
    var G = "UPDATE wordbrain SET count = count + 1 WHERE id = :param1";
    F.parameters[":param1"] = H;
    F.text = G;
    F.execute();
    function D(I) {
      F.removeEventListener(air.SQLEvent.RESULT, D);
      F.removeEventListener(air.SQLErrorEvent.ERROR, E);
      r("Add record count updated");
    }
    function E(I) {
      F.removeEventListener(air.SQLEvent.RESULT, D);
      F.removeEventListener(air.SQLErrorEvent.ERROR, E);
      r("VV Word Brain count update error...");
      r("Error message:" + I.error.message);
      r("Details (Tried to increment the count):" + I.error.details);
    }
  }
  function n(D) {}
  function u(G, I) {
    r("Adding Record by looking at word in and word out....");
    var F = new air.SQLStatement();
    F.sqlConnection = g;
    F.addEventListener(air.SQLEvent.RESULT, D);
    F.addEventListener(air.SQLErrorEvent.ERROR, E);
    var H =
      "SELECT * FROM wordbrain WHERE wordin == :param1 AND wordout == :param2";
    F.parameters[":param1"] = G;
    F.parameters[":param2"] = I;
    F.text = H;
    F.execute();
    function D(K) {
      F.removeEventListener(air.SQLEvent.RESULT, D);
      F.removeEventListener(air.SQLErrorEvent.ERROR, E);
      var L = F.getResult();
      if (L.data != null) {
        var J = L.data[0].id;
        r("About to update count of word with ID: " + J);
        h(J);
      } else {
        r("No record found... going to add new");
        w(G, I);
      }
    }
    function E(J) {
      F.removeEventListener(air.SQLEvent.RESULT, D);
      F.removeEventListener(air.SQLErrorEvent.ERROR, E);
      r("VV Word Brain search data error...");
      r("Error message:" + J.error.message);
      r("Details (Get Word IN/OUT data):" + J.error.details);
    }
  }
  function B(D) {
    y = new air.SQLStatement();
    y.sqlConnection = g;
    y.addEventListener(air.SQLEvent.RESULT, A);
    y.addEventListener(air.SQLErrorEvent.ERROR, j);
    var E =
      "SELECT * FROM wordbrain WHERE wordin LIKE :param1 ORDER BY count DESC";
    y.parameters[":param1"] = D;
    y.text = E;
    y.execute();
  }
  function A(G) {
    var H = y.getResult();
    if (H.data != null) {
      var D = H.data.length;
      r(D);
      z = new Array();
      c = "";
      for (var F = 0; F < D; F++) {
        var E = H.data[F].wordout;
        if (z.indexOf(E) === -1) {
          z.push(E);
        }
      }
      songNavObj.showSuggestedList();
    }
  }
  function j(D) {
    r("VV Word Brain search data error...");
    r("Error message:" + D.error.message);
    r("Details (Get Word brain data):" + D.error.details);
  }
  function i() {
    return z;
  }
  function r(D) {
    if (v) {
      air.trace("[VV Brain]...." + D);
    }
  }
}