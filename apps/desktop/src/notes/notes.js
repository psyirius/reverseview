import {$RvW} from "@/rvw";

export class Notes {
    constructor(notesUI, containerID) {
        this.init = init;
        this.showNotesPanel = showNotesPanel;
        this.hideNotesPanel = hideNotesPanel;
        this.setVariables = setVariables;
        this.getNotes = getNotes;

        var m_containerID = containerID;
        var k;
        var a;
        var e;
        var v = null;
        var F = null;
        var t;
        var z;
        var B = false;
        var f = false;
        var I;
        var H;
        var p = 0;
        var j = 0;
        var n = 0;
        var g = null;

        function init(P, Q, R) {
            if (P == null || P === "./notes/") {
                t = "./notes/defaultnotes.db";
                I = "Default Notes";
                H =
                    "Default notes. Automatically created when VerseVIEW is launched the first time.";
            } else {
                t = P;
                I = Q;
                H = R;
            }
            if (!air.File.applicationStorageDirectory.resolvePath(t).exists) {
                f = true;
            }
            O();
            l();
            m();
        }
        function setVariables(P, R, Q) {
            p = P;
            j = R;
            n = Q;
        }
        function b() {
            var S;
            var R;
            var U = "";
            var P = p - 1;
            var W = j - 1;
            var Q = n - 1;
            var T = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][6];
            var V = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version2()][6];
            S = $RvW.content1[Q];
            R = $RvW.content2[Q];
            U = "<b>" + $RvW.booknames[P] + " " + j + ":" + n + "</b><br>";
            U =
                U +
                '<font face="' +
                T +
                '">' +
                S +
                '</font><BR><font face="' +
                V +
                '">' +
                R;
            return U;
        }
        function i() {
            var T = "";
            var R = n;
            B = false;
            if (v != null) {
                if (v.data != null) {
                    var Q = v.data.length;
                    for (var S = 0; S < Q; S++) {
                        var P = v.data[S].verseNum;
                        if (P == R) {
                            T = v.data[S].noteTextFormat;
                            B = true;
                            break;
                        }
                    }
                }
            }
            return T;
        }
        function l() {
            k = new YAHOO.widget.Panel(m_containerID, {
                width: "500px",
                fixedcenter: true,
                modal: false,
                visible: false,
                constraintoviewport: true,
            });
        }
        function m() {
            k.setHeader("Notes");
            k.setBody(notesUI);
            k.render();
            document
                .getElementById("notesSaveButton")
                .addEventListener("click", y, false);
            document
                .getElementById("notesCancelButton")
                .addEventListener("click", x, false);
        }
        function showNotesPanel() {
            document.getElementById("notesVerse").innerHTML = b();
            z = i();
            document.getElementById("notes_rte").value = z;
            $RvW.enterForSearchActive = false;
            k.cfg.setProperty("modal", true);
            k.show();
        }
        function hideNotesPanel() {
            k.hide();
            $RvW.enterForSearchActive = true;
        }
        function O() {
            var P = t;
            g = new air.SQLConnection();
            g.addEventListener(air.SQLEvent.OPEN, N);
            g.addEventListener(air.SQLErrorEvent.ERROR, r);
            var Q = air.File.applicationStorageDirectory.resolvePath(P);
            g.openAsync(Q);
        }
        function N(P) {
            A();
        }
        function r(P) {
            air.trace("Error message:", P.error.message);
            air.trace("Details (create DB):", P.error.details);
        }
        function A() {
            var S = new air.SQLStatement();
            S.sqlConnection = g;
            var R = "CREATE TABLE IF NOT EXISTS notesTable (noteId INTEGER PRIMARY KEY AUTOINCREMENT, noteText TEXT, noteTextFormat TEXT, bookNum INTEGER, chNum INTEGER, verseNum INTEGER )";
            S.text = R;
            S.addEventListener(air.SQLEvent.RESULT, Q);
            S.addEventListener(air.SQLErrorEvent.ERROR, P);
            S.execute();
            function Q(U) {
                if (f) {
                    K();
                }
                var V = document.getElementById("nm_note_type1");
                if (V.checked) {
                    var T = document.getElementById("bookList").selectedIndex + 1;
                    var W = document.getElementById("chapterList").selectedIndex + 1;
                    getNotes(T, W, 0);
                } else {
                    getNotes(-1, 0, 0);
                }
            }
            function P(T) {
                air.trace("Error message:", T.error.message);
                air.trace("Details (create DB):", T.error.details);
            }
        }
        function K() {
            var S = new air.SQLStatement();
            S.sqlConnection = g;
            var R = "CREATE TABLE IF NOT EXISTS notesInfoTable (noteInfoName TEXT, noteInfoDes TEXT)";
            S.text = R;
            S.addEventListener(air.SQLEvent.RESULT, Q);
            S.addEventListener(air.SQLErrorEvent.ERROR, P);
            S.execute();
            function Q() {
                h();
            }
            function P() { }
        }
        function h() {
            var S = new air.SQLStatement();
            S.sqlConnection = g;
            var R = "INSERT INTO notesInfoTable (noteInfoName, noteInfoDes) VALUES (:infoName, :infoDes);";
            S.text = R;
            S.addEventListener(air.SQLEvent.RESULT, Q);
            S.addEventListener(air.SQLErrorEvent.ERROR, P);
            S.parameters[":infoName"] = I;
            S.parameters[":infoDes"] = H;
            S.execute();
            function Q() { }
            function P() { }
        }
        function E(Q, P) {
            var S = new air.SQLStatement();
            S.sqlConnection = g;
            var R = "INSERT INTO notesTable (noteText, noteTextFormat, bookNum, chNum, verseNum) VALUES (:noteText, :noteTextFormat, :b, :c, :v);";
            S.text = R;
            S.addEventListener(air.SQLEvent.RESULT, q);
            S.addEventListener(air.SQLErrorEvent.ERROR, c);
            S.parameters[":noteText"] = Q;
            S.parameters[":noteTextFormat"] = P;
            S.parameters[":b"] = p;
            S.parameters[":c"] = j;
            S.parameters[":v"] = n;
            S.execute();
        }
        function q(P) {
            getNotes(p, j, n);
        }
        function c(P) {
            air.trace("Error message:", P.error.message);
            air.trace("Details (create DB):", P.error.details);
        }
        function u(S, Q) {
            var U = new air.SQLStatement();
            U.sqlConnection = g;
            var T = "UPDATE notesTable SET noteText = :noteText, noteTextFormat = :noteTextFormat WHERE bookNum = :b AND chNum = :c AND verseNum = :v;";
            U.text = T;
            U.addEventListener(air.SQLEvent.RESULT, P);
            U.addEventListener(air.SQLErrorEvent.ERROR, R);
            U.parameters[":noteText"] = S;
            U.parameters[":noteTextFormat"] = Q;
            U.parameters[":b"] = p;
            U.parameters[":c"] = j;
            U.parameters[":v"] = n;
            U.execute();
            function P(V) {
                getNotes(p, j, n);
            }
            function R(V) {
                air.trace("Error message:", V.error.message);
                air.trace("Details (create DB):", V.error.details);
            }
        }
        function getNotes(Q, R, P) {
            F = new air.SQLStatement();
            F.sqlConnection = g;
            var S;
            if (Q != -1) {
                S =
                    "SELECT * FROM notesTable WHERE bookNum = :b AND chNum = :c ORDER BY verseNum";
                F.text = S;
                F.parameters[":b"] = Q;
                F.parameters[":c"] = R;
            } else {
                S = "SELECT * FROM notesTable";
                F.text = S;
            }
            F.addEventListener(air.SQLEvent.RESULT, d);
            F.addEventListener(air.SQLErrorEvent.ERROR, D);
            F.execute();
        }
        function d() {
            var X = "No Notes for this chapter...";
            v = F.getResult();
            var P = document.getElementById("notesResultsID");
            var Q = $RvW.vvConfigObj.get_navFontSize();
            P.style.fontSize = Q + "px";
            P.innerHTML = "";
            if (v != null) {
                if (v.data != null) {
                    X = "";
                    var U = v.data.length;
                    X = X + "<table>";
                    for (var V = 0; V < U; V++) {
                        var S = v.data[V].bookNum - 1;
                        var T = $RvW.booknames[S];
                        var R = v.data[V].chNum;
                        var W = v.data[V].verseNum;
                        X = X + "<tr>";
                        X = X + '<td class="navtd" width=30%>';
                        X = X + "<b>" + T + " " + R + ":" + W + "</b><br>";
                        X = X + '<font  face="' + $RvW.priFontName + '"> </font><br>';
                        X = X + '<font  face="' + $RvW.secFontName + '"> </font><br>';
                        X = X + "</td>";
                        X = X + '<td class="navtd" width=40%>';
                        X =
                            X +
                            '<br><span class="notes_css">' +
                            v.data[V].noteTextFormat +
                            "</span>";
                        X = X + "</td>";
                        X = X + "</tr>";
                    }
                    X = X + "</table>";
                }
            }
            P.innerHTML = X;
        }
        function D(P) {
            air.trace("Error message:", P.error.message);
            air.trace("Details (displayNotes Error):", P.error.details);
        }
        function y() {
            var P = document.getElementById("notes_rte").value;
            var Q = s(P);
            if (B) {
                u(P, Q);
            } else {
                E(P, Q);
            }
            hideNotesPanel();
        }
        function s(P) {
            return P.replace(/(\r\n|[\r\n])/g, "<br />");
        }
        function x() {
            var Q = document.getElementById("notes_rte").value;
            if (Q != z) {
                var P = confirm(
                    "Are you sure you want to cancel? Any updates will be lost."
                );
                if (P == true) {
                    document.getElementById("notes_rte").value = "";
                    hideNotesPanel();
                }
            } else {
                document.getElementById("notes_rte").value = "";
                hideNotesPanel();
            }
        }
    }
}

export class PostIt {
    constructor() {
        this.init = d;
        var a = null;
        var e;
        var c;
        var f;
        function d(h, g, j, i) {
            a = h;
            e = g;
            c = j;
            f = i;
            document.getElementById(a).addEventListener("click", b, false);
        }
        function b() {
            $RvW.notesObj.setVariables(e, c, f);
            $RvW.notesObj.showNotesPanel();
        }
    }
}

export class NotesInfo {
    constructor(_arg) {
        var d = _arg;
        var c;

        b();

        function b() {
            c = new air.SQLConnection();
            c.addEventListener(air.SQLEvent.OPEN, g);
            c.addEventListener(air.SQLErrorEvent.ERROR, f);
            var h = "./notes/" + d;
            var i = air.File.applicationStorageDirectory.resolvePath(h);
            c.openAsync(i);
            function g(j) {
                i = null;
                a();
            }
            function f(j) {
                air.trace("[N Info] Error message:", j.error.message);
                air.trace("Details (open Conn DB):", j.error.details);
            }
        }
        function a() {
            var h = new air.SQLStatement();
            h.sqlConnection = c;
            var i = "SELECT * FROM notesInfoTable";
            h.text = i;
            h.addEventListener(air.SQLEvent.RESULT, g);
            h.addEventListener(air.SQLErrorEvent.ERROR, f);
            h.execute();
            function g(l) {
                var k = h.getResult();
                if (k.data != null) {
                    var j = k.data[0];
                    $RvW.notesManageObj.nm_addRecord_ext(j.noteInfoName, j.noteInfoDes, d);
                    c = null;
                }
            }
            function f(j) {
                alert("Invalid Notes Database");
            }
        }
    }
}
