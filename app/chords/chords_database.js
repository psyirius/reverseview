function chordsDatabaseClass() {
  this.init = M;
  this.loadAllChordsRecords = f;
  this.loadChordsForExport = o;
  this.getExportChords = R;
  this.getAllChords = G;
  this.getChordsObj = d;
  this.addRecord = y;
  this.updateRecord = x;
  this.deleteRecord = S;
  this.special_updateRecord = k;
  var r = null;
  var n = "./song/chords.db";
  var g = false;
  var K = false;
  var l = null;
  var j = null;
  var P = null;
  var C;
  var E;
  var e;
  var B;
  var Q;
  var L;
  var h;
  var O;
  var b;
  var u;
  var m;
  var c;
  var F;
  var N;
  var D;
  var w;
  var A;
  var H = null;
  var J = 0;
  var s = false;
  function M() {
    v("Initialize Chords DATABASE");
    H = new chordsObjClass();
    H.init();
    p();
  }
  function p() {
    r = new air.SQLConnection();
    r.addEventListener(air.SQLEvent.OPEN, i);
    r.addEventListener(air.SQLErrorEvent.ERROR, a);
    var T = air.File.applicationStorageDirectory.resolvePath(n);
    r.openAsync(T);
  }
  function i(T) {
    v("Chords DB was created successfully");
    g = true;
    if (g) {
      q();
    }
  }
  function a(T) {
    v("Error message:" + T.error.message);
    v("Details (create Chords DB):" + T.error.details);
    g = false;
  }
  function q() {
    v(" Creating Chords table...");
    l = new air.SQLStatement();
    l.sqlConnection = r;
    var T =
      "CREATE TABLE IF NOT EXISTS cm (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, lyrics TEXT, chords TEXT, key TEXT, chordsby TEXT, timestamp TEXT, bpm INTEGER, notes TEXT, timesignature TEXT, rhythm TEXT, complexity TEXT, tags TEXT, rating INTEGER, original BOOLEAN, usagecount INTEGER, category TEXT, additional TEXT )";
    l.text = T;
    l.addEventListener(air.SQLEvent.RESULT, t);
    l.addEventListener(air.SQLErrorEvent.ERROR, z);
    l.execute();
  }
  function t() {
    l.removeEventListener(air.SQLEvent.RESULT, t);
    l.removeEventListener(air.SQLErrorEvent.ERROR, z);
    v("Chords Table created.....");
    f();
  }
  function z(T) {
    l.removeEventListener(air.SQLEvent.RESULT, t);
    l.removeEventListener(air.SQLErrorEvent.ERROR, z);
    v("Error message:" + T.error.message);
    v("Details in creating Chords table :" + T.error.details);
  }
  function o() {
    v("Loading ALL Data from Chords DB for export");
    var V = new air.SQLStatement();
    V.sqlConnection = r;
    var W = "SELECT * FROM cm WHERE original = :org ORDER BY title ASC";
    V.text = W;
    V.parameters[":org"] = false;
    V.addEventListener(air.SQLEvent.RESULT, U);
    V.addEventListener(air.SQLErrorEvent.ERROR, T);
    V.execute();
    function U(X) {
      v("Succesfuly got all data from Chords DB for export");
      P = V.getResult();
      if (P.data == null) {
        v("No Chords records found..");
      } else {
        v("Reading SQL data passed: " + P.data.length);
      }
      chordsManagerObj.taskcomplete(CHORDS_EXPORT_LOAD_PASS, "");
    }
    function T(X) {
      v("Export Chords data error...");
      var Y =
        "Loading chords record for export error:" +
        X.error +
        " | " +
        X.error.code +
        " | " +
        X.error.message;
      chordsManagerObj.taskcomplete(CHORDS_EXPORT_LOAD_FAIL, Y);
    }
  }
  function f() {
    v("Loading ALL Data from Chords DB");
    K = false;
    var V = new air.SQLStatement();
    V.sqlConnection = r;
    var W = "SELECT * FROM cm ORDER BY title ASC";
    V.text = W;
    V.addEventListener(air.SQLEvent.RESULT, U);
    V.addEventListener(air.SQLErrorEvent.ERROR, T);
    V.execute();
    function U(X) {
      v("Succesfuly got all data from Chords DB");
      j = V.getResult();
      K = true;
      chordsManagerObj.taskcomplete(CHORDS_LOAD_PASS, "");
    }
    function T(X) {
      v("Chords Manager data error...");
      var Y =
        "Loading chords record error:" +
        X.error +
        " | " +
        X.error.code +
        " | " +
        X.error.message;
      chordsManagerObj.taskcomplete(CHORDS_LOAD_FAIL, Y);
    }
  }
  function R() {
    v("About to return the exported records...");
    return P;
  }
  function G() {
    if (K) {
      return j;
    } else {
      return false;
    }
  }
  function d(Y) {
    var V = new chordsObjClass();
    V.init();
    var X = -1;
    var U = j.data.length;
    for (var T = 0; T < U; T++) {
      var W = j.data[T].id;
      if (W == Y) {
        X = T;
        break;
      }
    }
    if (X != -1) {
      V.title = j.data[X].title;
      V.lyrics = j.data[X].lyrics;
      V.chords = j.data[X].chords;
      V.key = j.data[X].key;
      V.chordsby = j.data[X].chordsby;
      V.timestamp = j.data[X].timestamp;
      V.bpm = j.data[X].bpm;
      V.notes = j.data[X].notes;
      V.timesignature = j.data[X].timesignature;
      V.rhythm = j.data[X].rhythm;
      V.complexity = j.data[X].complexity;
      V.tags = j.data[X].tags;
      V.rating = j.data[X].rating;
      V.original = j.data[X].original;
      V.usagecount = j.data[X].usagecount;
      V.category = j.data[X].category;
      V.additional = j.data[X].additional;
      return V;
    } else {
      return false;
    }
  }
  function y(T) {
    var V = new air.SQLStatement();
    V.sqlConnection = r;
    var X = "";
    X +=
      "INSERT INTO cm (title, lyrics, chords, key, chordsby, timestamp, bpm, notes, timesignature, rhythm, complexity, tags, rating, original, usagecount, category, additional)";
    X +=
      " SELECT :ti, :lyr, :chr, :key, :chby, :ts, :bpm, :not, :tsig, :rhy, :cmx, :tag, :rat, :org, :uc, :cat, :a1";
    V.text = X;
    V.addEventListener(air.SQLEvent.RESULT, U);
    V.addEventListener(air.SQLErrorEvent.ERROR, W);
    V.parameters[":ti"] = T.title;
    V.parameters[":lyr"] = T.lyrics;
    V.parameters[":chr"] = T.chords;
    V.parameters[":key"] = T.key;
    V.parameters[":chby"] = T.chordsby;
    V.parameters[":ts"] = getDate();
    V.parameters[":bpm"] = T.bpm;
    V.parameters[":not"] = T.notes;
    V.parameters[":tsig"] = T.timesignature;
    V.parameters[":rhy"] = T.rhythm;
    V.parameters[":cmx"] = T.complexity;
    V.parameters[":tag"] = T.tags;
    V.parameters[":rat"] = T.rating;
    V.parameters[":org"] = T.original;
    V.parameters[":uc"] = T.usagecount;
    V.parameters[":cat"] = T.category;
    V.parameters[":a1"] = T.additional;
    J++;
    V.execute();
    function U(Y) {
      J--;
      v("Record count while adding to database " + J);
      V.removeEventListener(air.SQLEvent.RESULT, U);
      V.removeEventListener(air.SQLErrorEvent.ERROR, W);
      if (J == 0) {
        chordsManagerObj.taskcomplete(
          CHORDS_ADDNEW_PASS,
          "Added the record to db"
        );
      }
    }
    function W(Y) {
      J--;
      V.removeEventListener(air.SQLEvent.RESULT, U);
      V.removeEventListener(air.SQLErrorEvent.ERROR, W);
      v("ADD Record - INSERT error:" + Y.error);
      v("event.error.code:" + Y.error.code);
      v("event.error.message:" + Y.error.message);
      var Z =
        "ADD Record - INSERT error:" +
        Y.error +
        " | " +
        Y.error.code +
        " | " +
        Y.error.message;
      chordsManagerObj.taskcomplete(CHORDS_ADDNEW_FAIL, Z);
    }
  }
  function x(T, Y) {
    var U = new air.SQLStatement();
    U.sqlConnection = r;
    var X = "";
    X +=
      "UPDATE cm SET title=:ti, lyrics=:lyr, chords=:chr, key=:key, chordsby=:chby, timestamp=:ts, bpm=:bpm, notes=:not, timesignature=:tsig,";
    X +=
      " rhythm=:rhy, complexity=:cmx, tags=:tag, rating=:rat, original=:org, usagecount=:uc, category=:cat, additional=:a1 WHERE id=:id;";
    U.text = X;
    U.addEventListener(air.SQLEvent.RESULT, V);
    U.addEventListener(air.SQLErrorEvent.ERROR, W);
    U.parameters[":id"] = Y;
    U.parameters[":ti"] = T.title;
    U.parameters[":lyr"] = T.lyrics;
    U.parameters[":chr"] = T.chords;
    U.parameters[":key"] = T.key;
    U.parameters[":chby"] = T.chordsby;
    U.parameters[":ts"] = getDate();
    U.parameters[":bpm"] = T.bpm;
    U.parameters[":not"] = T.notes;
    U.parameters[":tsig"] = T.timesignature;
    U.parameters[":rhy"] = T.rhythm;
    U.parameters[":cmx"] = T.complexity;
    U.parameters[":tag"] = T.tags;
    U.parameters[":rat"] = T.rating;
    U.parameters[":org"] = T.original;
    U.parameters[":uc"] = T.usagecount;
    U.parameters[":cat"] = T.category;
    U.parameters[":a1"] = T.additional;
    U.execute();
    function V(Z) {
      U.removeEventListener(air.SQLEvent.RESULT, insertResult);
      U.removeEventListener(air.SQLErrorEvent.ERROR, insertError);
      v("Updated DB sucessfully...");
      chordsManagerObj.taskcomplete(
        CHORDS_UPDATE_PASS,
        "Updated the record to db"
      );
    }
    function W(Z) {
      U.removeEventListener(air.SQLEvent.RESULT, insertResult);
      U.removeEventListener(air.SQLErrorEvent.ERROR, insertError);
      v("UPDATE Chords record error:" + Z.error);
      v("event.error.code:" + Z.error.code);
      v("event.error.message:" + Z.error.message);
      var aa =
        "UPDATE Record - error:" +
        Z.error +
        " | " +
        Z.error.code +
        " | " +
        Z.error.message;
      chordsManagerObj.taskcomplete(CHORDS_UPDATE_FAIL, aa);
    }
  }
  function S(X) {
    v("Deleting record with keyValue as primary key from Chords Database...");
    var V = new air.SQLStatement();
    V.sqlConnection = r;
    var W = "";
    W += "DELETE FROM cm WHERE id = :id;";
    V.text = W;
    V.addEventListener(air.SQLEvent.RESULT, T);
    V.addEventListener(air.SQLErrorEvent.ERROR, U);
    V.parameters[":id"] = X;
    V.execute();
    function T(Y) {
      V.removeEventListener(air.SQLEvent.RESULT, insertResult);
      V.removeEventListener(air.SQLErrorEvent.ERROR, insertError);
      chordsManagerObj.taskcomplete(
        CHORDS_DELETE_PASS,
        "Delete record from db passed"
      );
    }
    function U(Y) {
      V.removeEventListener(air.SQLEvent.RESULT, insertResult);
      V.removeEventListener(air.SQLErrorEvent.ERROR, insertError);
      v("Error deleting chords DB");
      v("event.error.code:" + Y.error.code);
      v("event.error.message:" + Y.error.message);
      var Z = "Delete record from db failed. " + Y.error.message;
      chordsManagerObj.taskcomplete(CHORDS_DELETE_FAIL, Z);
    }
  }
  function k(T, ab, U, Z, aa, X) {
    var Y = new air.SQLStatement();
    Y.sqlConnection = r;
    var ac = "";
    ac += "UPDATE cm SET bpm=:bpm, timesignature=:tsig,";
    ac += " rhythm=:rhy, additional=:a1 WHERE id=:id;";
    Y.text = ac;
    Y.addEventListener(air.SQLEvent.RESULT, V);
    Y.addEventListener(air.SQLErrorEvent.ERROR, W);
    Y.parameters[":id"] = T;
    Y.parameters[":bpm"] = Z;
    Y.parameters[":tsig"] = aa;
    Y.parameters[":rhy"] = X;
    Y.parameters[":a1"] = U;
    Y.execute();
    function V(ad) {
      Y.removeEventListener(air.SQLEvent.RESULT, insertResult);
      Y.removeEventListener(air.SQLErrorEvent.ERROR, insertError);
      v("Updated DB sucessfully...");
    }
    function W(ad) {
      Y.removeEventListener(air.SQLEvent.RESULT, insertResult);
      Y.removeEventListener(air.SQLErrorEvent.ERROR, insertError);
      v("UPDATE Chords record error:" + ad.error);
      v("event.error.code:" + ad.error.code);
      v("event.error.message:" + ad.error.message);
      var ae =
        "UPDATE Record - error:" +
        ad.error +
        " | " +
        ad.error.code +
        " | " +
        ad.error.message;
      chordsManagerObj.taskcomplete(CHORDS_UPDATE_FAIL, ae);
    }
  }
  function I() {
    g = false;
  }
  function v(T) {
    if (s) {
      air.trace("[Chords DATABASE]...." + T);
    }
  }
}