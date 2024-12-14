import {getVersion1Filename, getVersion1Name, updateVersionXML} from "@/bible/version";
import {$RvW} from "@/rvw";
import {console} from "@/platform/adapters/air";

let indexConn = null;
let insertStmt = null;
let count = 0;
let startTime, endTime;
let dbFile = null;
const wordA = [];
const bookA = [];
const chapterA = [];
const verseA = [];

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
    console.trace("Indexing words to array....");
    var f = new Date();
    var n = f.getTime();
    for (var h = 1; h <= 66; h++) {
        console.trace(h);
        var o = $RvW.numofch[h][0];
        for (var g = 1; g <= o; g++) {
            var a = $RvW.numofch[h][g];
            for (var m = 1; m <= a; m++) {
                var l = $RvW.bible[$RvW.vvConfigObj.get_version1()]
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
    console.trace("Words to be Indexed: " + e);
    var f = new Date();
    var k = f.getTime();
    var j = endTime - startTime;
    console.trace("Time to index to Array: " + j);
}

function getIndexFilepath() {
    const a = getVersion1Filename();
    const b = a.split(".");
    return b[0] + ".db";
}

function createIndexDB() {
    indexConn = new air.SQLConnection();
    indexConn.addEventListener(air.SQLEvent.OPEN, indexOpenHandler);
    indexConn.addEventListener(air.SQLErrorEvent.ERROR, indexErrorHandler);
    dbFile = air.File.applicationStorageDirectory.resolvePath(`./bible/${getIndexFilepath()}`);
    indexConn.openAsync(dbFile);
}

function indexOpenHandler(a) {
    console.trace("DB was created successfully");
    createIndexTable();
}

function indexErrorHandler(a) {
    console.trace("Error message:", a.error.message);
    console.trace("Details (create DB):", a.error.details);
}

function createIndexTable() {
    console.trace("Creating table...");
    const d = new air.SQLStatement();
    d.sqlConnection = indexConn;
    d.text = "CREATE TABLE IF NOT EXISTS words (wordId INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT, bookNum INTEGER, chNum INTEGER, verseNum INTEGER )";
    d.addEventListener(air.SQLEvent.RESULT, b);
    d.addEventListener(air.SQLErrorEvent.ERROR, a);
    d.execute();

    function b() {
        console.trace("Table created");
        addIndexData();
    }
    function a() {
        console.trace("Error message:", error.message);
        console.trace("Details in creating table :", error.details);
    }
}

function addIndexData() {
    if (count === 0) {
        const c = new Date();
        startTime = c.getTime();
        insertStmt = new air.SQLStatement();
        insertStmt.sqlConnection = indexConn;
        insertStmt.sqlConnection.begin();
        insertStmt.text = "INSERT INTO words (word, bookNum, chNum, verseNum) VALUES (:word, :b, :c, :v);";
        insertStmt.addEventListener(air.SQLEvent.RESULT, insertResult);
        insertStmt.addEventListener(air.SQLErrorEvent.ERROR, insertError);
    }

    if (count < wordA.length) {
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

/**
 * @param {air.Event} e
 * */
export function insertResult(e) {
    if (count === wordA.length) {
        const now = new Date();
        endTime = now.getTime();
        const f = endTime - startTime;
        $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][5] = getIndexFilepath();
        updateVersionXML();
        alert(
            `Completed indexing ${getVersion1Name()} Bible. Please restart VerseVIEW.`
        );
    }
    addIndexData();
}

/**
 * @param {air.ErrorEvent} e
 * */
export function insertError(e) {
    insertStmt.removeEventListener(air.SQLEvent.RESULT, insertResult);
    insertStmt.removeEventListener(air.SQLErrorEvent.ERROR, insertError);

    console.trace("INSERT error:", e.error);
    console.trace("event.error.code:", e.error.code);
    console.trace("event.error.message:", e.error.message);
}
