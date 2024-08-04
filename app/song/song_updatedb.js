function startUpdateProcess() {
  var a = new dbUpdater();
  a.init();
}
function dbUpdater() {
  var h = null;
  var j = false;
  var g = null;
  var k = "./song/default.db";
  var c = true;
  this.init = m;
  function m() {
    j = false;
    f();
  }
  function f() {
    h = new air.SQLConnection();
    h.addEventListener(air.SQLEvent.OPEN, b);
    h.addEventListener(air.SQLErrorEvent.ERROR, e);
    var n = air.File.applicationDirectory.resolvePath(k);
    h.openAsync(n, air.FileMode.READ);
  }
  function b(n) {
    a("DB was created successfully");
    j = true;
    l();
  }
  function e(n) {
    a("Error message:" + n.error.message);
    a("Details (create DB):" + n.error.details);
    j = false;
  }
  function l() {
    a("Getting ALL Data from Original Song DB");
    var p = new air.SQLStatement();
    p.sqlConnection = h;
    var q = "SELECT * FROM sm WHERE cat = :cat1 OR cat = :cat2 OR cat = :cat3";
    p.text = q;
    p.addEventListener(air.SQLEvent.RESULT, o);
    p.addEventListener(air.SQLErrorEvent.ERROR, n);
    p.parameters[":cat1"] = "VV Malayalam 2021";
    p.parameters[":cat2"] = "VV Hindi 2021";
    p.parameters[":cat3"] = "VV Tamil 2021";
    p.execute();
    function o(r) {
      a("Succesfuly got all data from Original Song DB");
      g = p.getResult();
      i();
    }
    function n(r) {
      a("Song DB updater data error...");
      a("UPDATE error:" + r.error);
      a("event.error.code:" + r.error.code);
      a("event.error.message:" + r.error.message);
      alert("Song DB updater data error...");
    }
  }
  function d() {
    j = false;
  }
  function i() {
    var o = g.data.length;
    var t = new songObj();
    var n = true;
    var s = false;
    var r = true;
    a("Records to add... " + o);
    for (var q = 0; q < o; q++) {
      t.name = g.data[q].name;
      t.catIndex = g.data[q].cat;
      t.font = g.data[q].font;
      t.font2 = g.data[q].font2;
      t.bkgnd_fname = g.data[q].bkgndfname;
      t.key = g.data[q].key;
      t.copyright = g.data[q].copy;
      t.notes = g.data[q].notes;
      t.slides = g.data[q].lyrics;
      var p = g.data[q].lyrics2;
      if (p != null) {
        t.slides2 = p;
      } else {
        t.slides2 = "";
      }
      t.timestamp = g.data[q].timestamp;
      t.yvideo = g.data[q].yvideo;
      t.name2 = g.data[q].title2;
      if (g.data[q].tags != null) {
        t.tags = g.data[q].tags;
        t.tags = t.tags.toUpperCase();
        addTagList(t.tags);
      } else {
        t.tags = "";
      }
      t.slideseq = g.data[q].slideseq;
      songManagerObj.addSong(t, s, n);
    }
  }
  function a(n) {
    if (c) {
      air.trace("[SongDB_Updater]...." + n);
    }
  }
}