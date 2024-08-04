var indexConn = null;
var insertStmt = null;
var insertStmtArr = new Array();
var count = 0;
var startTime, endTime;
var dbFile = null;
var wordA = new Array();
var bookA = new Array();
var chapterA = new Array();
var verseA = new Array();
function cleanWord(d) {
  var c = d.toLowerCase();
  var b = c.split("");
  var e = b.length;
  var a = b[e - 1];
  if (a == "." || a == ";") {
  }
  return c;
}
function indexWords2Array() {
  var e = 0;
  air.trace("Indexing words to array....");
  var f = new Date();
  var n = f.getTime();
  for (var h = 1; h <= 66; h++) {
    air.trace(h);
    var o = numofch[h][0];
    for (var g = 1; g <= o; g++) {
      var a = numofch[h][g];
      for (var m = 1; m <= a; m++) {
        var l = bible[vvConfigObj.get_version1()]
          .getElementsByTagName("b")
          [h - 1].getElementsByTagName("c")
          [g - 1].getElementsByTagName("v")[m - 1];
        if (l != null) {
          var i = l.textContent;
          wordA[e] = i;
          bookA[e] = h;
          chapterA[e] = g;
          verseA[e] = m;
          e++;
        }
      }
    }
  }
  air.trace("Words to be Indexed: " + e);
  var f = new Date();
  var k = f.getTime();
  var j = endTime - startTime;
  air.trace("Time to index to Array: " + j);
}
function getIndexFilepath() {
  var a = getVersion1Filename();
  var b = a.split(".");
  var c = b[0] + ".db";
  return c;
}
function createIndexDB() {
  indexConn = new air.SQLConnection();
  indexConn.addEventListener(air.SQLEvent.OPEN, indexOpenHandler);
  indexConn.addEventListener(air.SQLErrorEvent.ERROR, indexErrorHandler);
  dbFile = air.File.applicationStorageDirectory.resolvePath(
    "./bible/" + getIndexFilepath()
  );
  indexConn.openAsync(dbFile);
}
function indexOpenHandler(a) {
  air.trace("DB was created successfully");
  createIndexTable();
}
function indexErrorHandler(a) {
  air.trace("Error message:", a.error.message);
  air.trace("Details (create DB):", a.error.details);
}
function createIndexTable() {
  air.trace("Creating table...");
  var d = new air.SQLStatement();
  d.sqlConnection = indexConn;
  var c =
    "CREATE TABLE IF NOT EXISTS words (wordId INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT, bookNum INTEGER, chNum INTEGER, verseNum INTEGER )";
  d.text = c;
  d.addEventListener(air.SQLEvent.RESULT, b);
  d.addEventListener(air.SQLErrorEvent.ERROR, a);
  d.execute();
  function b() {
    air.trace("Table created");
    addIndexData();
  }
  function a() {
    air.trace("Error message:", error.message);
    air.trace("Details in creating table :", error.details);
  }
}
function addIndexData() {
  if (count == 0) {
    var c = new Date();
    startTime = c.getTime();
    insertStmt = new air.SQLStatement();
    insertStmt.sqlConnection = indexConn;
    var b = "";
    b +=
      "INSERT INTO words (word, bookNum, chNum, verseNum) VALUES (:word, :b, :c, :v);";
    insertStmt.sqlConnection.begin();
    insertStmt.text = b;
    insertStmt.addEventListener(air.SQLEvent.RESULT, insertResult);
    insertStmt.addEventListener(air.SQLErrorEvent.ERROR, insertError);
  }
  var a = wordA.length;
  if (count < a) {
    insertStmt.parameters[":word"] = wordA[count];
    insertStmt.parameters[":b"] = bookA[count];
    insertStmt.parameters[":c"] = chapterA[count];
    insertStmt.parameters[":v"] = verseA[count];
    count++;
    insertStmt.execute();
  } else {
    count = 0;
    insertStmt.sqlConnection.commit();
    insertStmt.removeEventListener(air.SQLEvent.RESULT, insertResult);
    insertStmt.removeEventListener(air.SQLErrorEvent.ERROR, insertError);
  }
}
function insertResult(c) {
  var e = c.target;
  var b = wordA.length;
  if (count == b) {
    var g = new Date();
    endTime = g.getTime();
    var f = endTime - startTime;
    var a = getIndexFilepath();
    bibleVersionArray[vvConfigObj.get_version1()][5] = a;
    updateVersionXML();
    alert(
      "Completed indexing " +
        getVersion1Name() +
        " Bible. Please restart VerseVIEW."
    );
  }
  addIndexData();
}
function insertError(a) {
  insertStmt.removeEventListener(air.SQLEvent.RESULT, insertResult);
  insertStmt.removeEventListener(air.SQLErrorEvent.ERROR, insertError);
  air.trace("INSERT error:", a.error);
  air.trace("event.error.code:", a.error.code);
  air.trace("event.error.message:", a.error.message);
}
