import {insertError, insertResult} from "@/song/indexing";
import {$RvW} from "@/rvw";

export class WordBrain {
    constructor() {
        this.addRecord = addRecord;
        this.addRecordBy_wordin_wordout = addRecordBy_wordin_wordout;
        this.findRecordBy_wordin = findRecordBy_wordin;
        this.getSuggestions = getSuggestions;

        var m_sqlConn = null;
        var a = false;
        var k = null;
        var m_sqlQuery = null;
        var q = "./song/words.db";
        var z = [];
        var c = "";
        var e;
        var C;
        var s;
        var m = null;
        const _isDebug = false;

        d();

        function d() {
            m_sqlConn = new air.SQLConnection();
            m_sqlConn.addEventListener(air.SQLEvent.OPEN, p);
            m_sqlConn.addEventListener(air.SQLErrorEvent.ERROR, t);
            var D = air.File.applicationStorageDirectory.resolvePath(q);
            m_sqlConn.openAsync(D);
        }
        function p(D) {
            __debug_log("Brain DB was created successfully");
            a = true;
            f();
        }
        function t(D) {
            __debug_log("Error message:" + D.error.message);
            __debug_log("Details (create DB):" + D.error.details);
            a = false;
        }
        function f() {
            __debug_log(" Creating song table...");
            k = new air.SQLStatement();
            k.sqlConnection = m_sqlConn;
            var D = "CREATE TABLE IF NOT EXISTS wordbrain (id INTEGER PRIMARY KEY AUTOINCREMENT, wordin TEXT, wordout TEXT, count INTEGER )";
            k.text = D;
            k.addEventListener(air.SQLEvent.RESULT, b);
            k.addEventListener(air.SQLErrorEvent.ERROR, l);
            k.execute();
        }
        function b() {
            k.removeEventListener(air.SQLEvent.RESULT, b);
            k.removeEventListener(air.SQLErrorEvent.ERROR, l);
            __debug_log("Notes Table created.....");
        }
        function l(D) {
            k.removeEventListener(air.SQLEvent.RESULT, b);
            k.removeEventListener(air.SQLErrorEvent.ERROR, l);
            __debug_log("Error message:" + D.error.message);
            __debug_log("Details in creating table :" + D.error.details);
        }
        function o() {
            a = false;
        }
        function addRecord(G, I) {
            var E = new air.SQLStatement();
            E.sqlConnection = m_sqlConn;
            var H = "";
            H += "INSERT INTO wordbrain (wordin, wordout, count) VALUES (:w_in, :w_out, :w_count);";
            E.text = H;
            E.addEventListener(air.SQLEvent.RESULT, D);
            E.addEventListener(air.SQLErrorEvent.ERROR, F);
            E.parameters[":w_in"] = G;
            E.parameters[":w_out"] = I;
            E.parameters[":w_count"] = 1;
            E.execute();
            function D(J) {
                __debug_log("Add record passed ");
                E.removeEventListener(air.SQLEvent.RESULT, insertResult);
                E.removeEventListener(air.SQLErrorEvent.ERROR, insertError);
            }
            function F(J) {
                E.removeEventListener(air.SQLEvent.RESULT, insertResult);
                E.removeEventListener(air.SQLErrorEvent.ERROR, insertError);
                __debug_log("INSERT error:" + J.error);
                __debug_log("event.error.code:" + J.error.code);
                __debug_log("event.error.message:" + J.error.message);
            }
        }
        function h(H) {
            var F = new air.SQLStatement();
            F.sqlConnection = m_sqlConn;
            F.addEventListener(air.SQLEvent.RESULT, D);
            F.addEventListener(air.SQLErrorEvent.ERROR, E);
            var G = "UPDATE wordbrain SET count = count + 1 WHERE id = :param1";
            F.parameters[":param1"] = H;
            F.text = G;
            F.execute();
            function D(I) {
                F.removeEventListener(air.SQLEvent.RESULT, D);
                F.removeEventListener(air.SQLErrorEvent.ERROR, E);
                __debug_log("Add record count updated");
            }
            function E(I) {
                F.removeEventListener(air.SQLEvent.RESULT, D);
                F.removeEventListener(air.SQLErrorEvent.ERROR, E);
                __debug_log("VV Word Brain count update error...");
                __debug_log("Error message:" + I.error.message);
                __debug_log("Details (Tried to increment the count):" + I.error.details);
            }
        }
        function n(D) { }
        function addRecordBy_wordin_wordout(G, I) {
            __debug_log("Adding Record by looking at word in and word out....");
            var F = new air.SQLStatement();
            F.sqlConnection = m_sqlConn;
            F.addEventListener(air.SQLEvent.RESULT, D);
            F.addEventListener(air.SQLErrorEvent.ERROR, E);
            var H = "SELECT * FROM wordbrain WHERE wordin == :param1 AND wordout == :param2";
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
                    __debug_log("About to update count of word with ID: " + J);
                    h(J);
                } else {
                    __debug_log("No record found... going to add new");
                    addRecord(G, I);
                }
            }
            function E(J) {
                F.removeEventListener(air.SQLEvent.RESULT, D);
                F.removeEventListener(air.SQLErrorEvent.ERROR, E);
                __debug_log("VV Word Brain search data error...");
                __debug_log("Error message:" + J.error.message);
                __debug_log("Details (Get Word IN/OUT data):" + J.error.details);
            }
        }
        function findRecordBy_wordin(qwrd) {
            m_sqlQuery = new air.SQLStatement();
            m_sqlQuery.sqlConnection = m_sqlConn;
            m_sqlQuery.addEventListener(air.SQLEvent.RESULT, _onSqlResult);
            m_sqlQuery.addEventListener(air.SQLErrorEvent.ERROR, _onSqlError);
            m_sqlQuery.parameters[":param1"] = qwrd;
            m_sqlQuery.text = "SELECT * FROM wordbrain WHERE wordin LIKE :param1 ORDER BY count DESC";
            m_sqlQuery.execute();
        }
        function _onSqlResult(G) {
            var H = m_sqlQuery.getResult();
            if (H.data != null) {
                var D = H.data.length;
                __debug_log(D);
                z = new Array();
                c = "";
                for (var F = 0; F < D; F++) {
                    var E = H.data[F].wordout;
                    if (z.indexOf(E) === -1) {
                        z.push(E);
                    }
                }
                $RvW.songNavObj.showSuggestedList();
            }
        }
        function _onSqlError(D) {
            __debug_log("VV Word Brain search data error...");
            __debug_log("Error message:" + D.error.message);
            __debug_log("Details (Get Word brain data):" + D.error.details);
        }
        function getSuggestions() {
            return z;
        }
        function __debug_log(D) {
            if (_isDebug) {
                air.trace("[VV Brain]...." + D);
            }
        }
    }
}
