function songImportClass() {
  this.init = q;
  var o = true;
  var l = null;
  var p = null;
  var k = null;
  var a = false;
  var f = null;
  var g = null;
  function q() {
    r();
  }
  function r() {
    k = air.File.desktopDirectory;
    var t = new window.runtime.Array();
    t.push(new air.FileFilter("VerseVIEW Song DB", "*.db"));
    k.browseForOpen("Select Song DB", t);
    k.addEventListener(air.Event.SELECT, s);
  }
  function s(t) {
    m(k.nativePath);
    p = k;
    d();
  }
  function m(t) {
    if (o) {
      air.trace("[SongImportManager]...." + t);
    }
  }
  function d() {
    f = new air.SQLConnection();
    f.addEventListener(air.SQLEvent.OPEN, j);
    f.addEventListener(air.SQLErrorEvent.ERROR, n);
    f.openAsync(p);
  }
  function j(t) {
    m("DB was created successfully");
    a = true;
    e();
  }
  function n(t) {
    m("Error message:" + t.error.message);
    m("Details (create DB):" + t.error.details);
    a = false;
  }
  function e() {
    m(" Creating song import Manager table...");
    createStmt = new air.SQLStatement();
    createStmt.sqlConnection = f;
    var t =
      "CREATE TABLE IF NOT EXISTS sm (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, cat TEXT, font TEXT, bkgndfname TEXT, key TEXT, copy TEXT, notes TEXT, lyrics TEXT )";
    createStmt.text = t;
    createStmt.addEventListener(air.SQLEvent.RESULT, b);
    createStmt.addEventListener(air.SQLErrorEvent.ERROR, h);
    createStmt.execute();
  }
  function b() {
    createStmt.removeEventListener(air.SQLEvent.RESULT, b);
    createStmt.removeEventListener(air.SQLErrorEvent.ERROR, h);
    m("Song Import Table created.....");
    c();
  }
  function h(t) {
    createStmt.removeEventListener(air.SQLEvent.RESULT, b);
    createStmt.removeEventListener(air.SQLErrorEvent.ERROR, h);
    m("Error message:" + t.error.message);
    m("Details in creating table :" + t.error.details);
  }
  function i() {
    f = null;
    a = false;
  }
  function c() {
    m("Getting ALL Data from Song Import DB");
    var v = new air.SQLStatement();
    v.sqlConnection = f;
    var w = "SELECT * FROM sm ORDER BY name ASC";
    v.text = w;
    v.addEventListener(air.SQLEvent.RESULT, u);
    v.addEventListener(air.SQLErrorEvent.ERROR, t);
    v.execute();
    function u(x) {
      m("Succesfuly got all data from Song Import DB");
      g = v.getResult();
      $RvW.songManagerObj.addImportSongs(g);
    }
    function t(x) {
      m("Song Import Manager data error...");
    }
  }
}
