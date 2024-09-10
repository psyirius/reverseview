import {getVerseFromArray} from "./manager"; // probable circular dependency
import {Toast} from "@app/toast";

export class BibleDB {
    constructor() {
        this.init = init;
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
        var q = [];
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
        var __is_debug = false;

        function __debug(ai) {
            if (__is_debug) {
                air.trace("[Bible Database]...." + ai);
            }
        }
        function init(aj, ai) {
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
            __debug("Status of DB " + r + " " + aa);
            if (r && aa) {
                ai = true;
            }
            return ai;
        }
        function l() {
            var ai = false;
            __debug("Status of DB " + r + " " + af);
            if (r && af) {
                ai = true;
            }
            return ai;
        }
        function Q() {
            var ai = false;
            __debug("DataConnection:" + r + " | FullDataReady:" + i);
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
            var al = [];
            for (var ak = 0; ak < ai; ak++) {
                var aj = ag.data[ak];
                al.push(aj.verseNum + " " + aj.word);
            }
            return al;
        }
        function J() {
            var ai = S.data.length;
            var al = [];
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
            __debug("DB connection was successfully");
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
                __debug("Query successful. Data in searchResult");
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
                __debug("Error message:", event.error.message);
                __debug("Details:", event.error.details);
            }
        }
        function b(ai) {
            __debug("Error message:" + ai.error.message);
            __debug("Details (create DB):" + ai.error.details);
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
                    __debug(" ****** Full Data not ready ");
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
            var ak = "SELECT word, bookNum, chNum, verseNum FROM words WHERE bookNum = :param1 AND chNum = :param2 ORDER BY verseNum ASC";
            ai.parameters[":param1"] = e * 1 + 1;
            ai.parameters[":param2"] = g * 1 + 1;
            ai.text = ak;
            ai.addEventListener(air.SQLEvent.RESULT, aj);
            ai.addEventListener(air.SQLErrorEvent.ERROR, al);
            ai.execute();
            function aj(am) {
                __debug("Query successful. Data in searchResult");
                ag = ai.getResult();
                aa = true;
            }
            function al() {
                __debug("Error message:", event.error.message);
                __debug("Details:", event.error.details);
                aa = false;
            }
        }
        function d(ai, ao, aj) {
            af = false;
            var ak = new air.SQLStatement();
            ak.sqlConnection = G;
            var am = "SELECT word, bookNum, chNum, verseNum FROM words WHERE bookNum = :param1 AND chNum = :param2 AND verseNum = :param3";
            ak.parameters[":param1"] = ai * 1 + 0;
            ak.parameters[":param2"] = ao * 1 + 0;
            ak.parameters[":param3"] = aj * 1 + 0;
            ak.text = am;
            ak.addEventListener(air.SQLEvent.RESULT, al);
            ak.addEventListener(air.SQLErrorEvent.ERROR, an);
            ak.execute();
            function al(ap) {
                __debug("Query successful. Data in searchResult");
                W = ak.getResult();
                af = true;
            }
            function an() {
                __debug("Error message:", event.error.message);
                __debug("Details:", event.error.details);
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
                __debug("Query successful. Data in searchResult");
                S = ai.getResult();
                ah = true;
            }
            function al() {
                __debug("Error message:", event.error.message);
                __debug("Details:", event.error.details);
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
                Toast.show("Bible Verse Update", "Verse Updated");
            }
            function am(aq) {
                ak.removeEventListener(air.SQLEvent.RESULT, al);
                ak.removeEventListener(air.SQLErrorEvent.ERROR, am);
                var ar = "UPDATE Record - error:" +
                    aq.error +
                    " | " +
                    aq.error.code +
                    " | " +
                    aq.error.message;
                Toast.show("Bible Verse Update", ar);
            }
        }
    }
}

function newSQLConnection(db, callback, mode = air.SQLMode.READ) {
    const conn = new air.SQLConnection();

    conn.addEventListener(air.SQLEvent.OPEN, function (event) {
        if (!callback(null, conn, () => conn.close())) {
            conn.close();
        }
    });
    conn.addEventListener(air.SQLErrorEvent.ERROR, function (event) {
        callback(event.error, null);
        conn.close();
    });

    const dbFile = air.File.applicationStorageDirectory.resolvePath(db);
    conn.openAsync(dbFile, mode);
}

function executeSQL(conn, query, params, callback) {
    const stmt = new air.SQLStatement();
    stmt.sqlConnection = conn;
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            stmt.parameters[key] = String(value);
        });
    }
    stmt.text = query;

    stmt.addEventListener(air.SQLEvent.RESULT, function (event) {
        callback(null, event.target.getResult());
    });
    stmt.addEventListener(air.SQLErrorEvent.ERROR, function (event) {
        callback(event.error, null);
    });

    stmt.execute();
}

const bibleDbMap = {
    'en-US': 'kjv.db',
};

export function loadBibleBookNames(bibleVersionId, callback) {
    newSQLConnection(`./bible/${bibleDbMap[bibleVersionId]}`, function (e, conn, closeConn) {
        if (e) {
            return callback(e);
        }

        // Get bible metadata
        executeSQL(conn, `
SELECT
    *
FROM
    configuration
;
`.trim(), null, function (e, result) {
            if (e) {
                return callback(e);
            }

            const rows = result.data;

            // will have only one row
            const {title, description, booknames, fonts} = rows[0];

            callback(null, {
                title,
                description,
                booknames: JSON.parse('[' + booknames + ']'),
                fonts: fonts.split(',').map((font) => font.trim()),
            });

            closeConn();
        });

        return true;
    }, air.SQLMode.READ);
}

export function loadBibleInfo(bibleId, callback) {
    const numChMap = {};

    newSQLConnection(`./bible/${bibleDbMap[bibleId]}`, function (e, conn, closeConn) {
        if (e) {
            return callback(e);
        }

        // Get Num of chapters per book
        executeSQL(conn, `
SELECT
    bookNum,
    COUNT(DISTINCT chNum) AS numChapters
FROM
    words
GROUP BY
    bookNum
;
`.trim(), null, function (e, result) {
            if (e) {
                return callback(e);
            }

            const rows = result.data;

            rows.forEach(({ bookNum, numChapters }) => {
                // air.trace(bookNum, numChapters);
                numChMap[bookNum] = [numChapters];
            });

            // Get Num of verses per chapter
            executeSQL(conn, `
SELECT
    bookNum,
    chNum,
    COUNT(*) AS numVerses
FROM
    words
GROUP BY
    bookNum,
    chNum
;
`.trim(), null, function (e, result) {
                if (e) {
                    return callback(e);
                }

                const rows = result.data;

                rows.forEach(({ bookNum, chNum, numVerses }) => {
                    // air.trace(bookNum, chNum, numVerses);
                    numChMap[bookNum].push(numVerses);
                });

                // TODO: Verify

                callback(null, [numChMap]);

                closeConn();
            });
        });

        return true;
    }, air.SQLMode.READ);
}