import {$RvW} from "@/rvw";
import {selectedBible, showBibleNotesEditPanel} from "@stores/global";
import {console} from "@/platform/adapters/air";
import {getPrimaryBibleVersion, getSecondaryBibleVersion} from "@/bible/version";

// BibleNotes
export class Notes {
    constructor() {
        this.init = init;

        this.show = showNotesPanel;
        this.hide = hideNotesPanel;

        this.setVariables = setVariables;
        this.getNotes = getNotes;

        var _notesResults = null;
        var F = null;
        var t;
        var _isNoteExists = false;
        var f = false;
        var I;
        var H;
        var _book = 0;
        var _chapter = 0;
        var _verse = 0;
        var g = null;

        function init(db, Q, R) {
            if (db == null || db === "./notes/") {
                t = "./notes/defaultnotes.db";
                I = "Default Notes";
                H = "Default notes. Automatically created when VerseVIEW is launched the first time.";
            } else {
                t = db;
                I = Q;
                H = R;
            }
            if (!air.File.applicationStorageDirectory.resolvePath(t).exists) {
                f = true;
            }
            O();
        }

        function setVariables(b, c, v) {
            _book = b;
            _chapter = c;
            _verse = v;
        }

        function _getActiveBibleRef() {
            const bi = _book - 1;
            const ci = _chapter - 1;
            const vi = _verse - 1;

            const T = getPrimaryBibleVersion().selectedFont;
            const V = getSecondaryBibleVersion().selectedFont;

            const S = $RvW.content1[vi];
            const R = $RvW.content2[vi];

            let U = `<b>${$RvW.booknames[bi]} ${_chapter}:${_verse}</b><br>`;
            U += `<font face="${T}">${S}</font><BR><font face="${V}">${R}`;
            return U;
        }

        this.getNotesForActiveVerse = function() {
            const bi = _book - 1;
            const ci = _chapter - 1;
            const vi = _verse - 1;

            const f1 = getPrimaryBibleVersion().selectedFont;
            const f2 = getSecondaryBibleVersion().selectedFont;

            const c1 = $RvW.content1[vi];
            const c2 = $RvW.content2[vi];

            return {
                refText: `${$RvW.booknames[bi]} ${_chapter}:${_verse}`,
                contents: [
                    { font: f1, content: c1 },
                    { font: f2, content: c2 },
                ],
                notes: _getActiveNoteContent(),
            }
        }

        this.setNotesForActiveVerse = function(noteText) {
            const noteHtml = nl2br(noteText);
            if (_isNoteExists) {
                updateNote(noteText, noteHtml);
            } else {
                insertNote(noteText, noteHtml);
            }
        }

        function _getActiveNoteContent() {
            _isNoteExists = false;

            if (_notesResults != null && _notesResults.data != null) {
                for (let i = 0; i < _notesResults.data.length; i++) {
                    const P = _notesResults.data[i].verseNum;
                    if (P === _verse) {
                        _isNoteExists = true;
                        return _notesResults.data[i].noteTextFormat;
                    }
                }
            }

            return '';
        }

        function showNotesPanel() {
            $RvW.enterForSearchActive = false;
            showBibleNotesEditPanel.set(true);
        }

        function hideNotesPanel() {
            showBibleNotesEditPanel.set(false);
            $RvW.enterForSearchActive = true;
        }

        function O() {
            const P = t;
            g = new air.SQLConnection();
            g.addEventListener(air.SQLEvent.OPEN, function() {
                _onDbOpen();
            });
            g.addEventListener(air.SQLErrorEvent.ERROR, function(P) {
                console.trace("Error message:", P.error.message);
                console.trace("Details (create DB):", P.error.details);
            });
            const dbFile = air.File.applicationStorageDirectory.resolvePath(P);
            g.openAsync(dbFile);
        }

        function _onDbOpen() {
            const S = new air.SQLStatement();
            S.sqlConnection = g;
            S.text = "CREATE TABLE IF NOT EXISTS notesTable (noteId INTEGER PRIMARY KEY AUTOINCREMENT, noteText TEXT, noteTextFormat TEXT, bookNum INTEGER, chNum INTEGER, verseNum INTEGER )";
            S.addEventListener(air.SQLEvent.RESULT, Q);
            S.addEventListener(air.SQLErrorEvent.ERROR, P);
            S.execute();

            function Q(U) {
                if (f) {
                    K();
                }
                const V = document.getElementById("nm_note_type1");
                if (V.checked) {
                    const T = selectedBible.get()[0] + 1;
                    const W = selectedBible.get()[1] + 1;
                    getNotes(T, W, 0);
                } else {
                    getNotes(-1, 0, 0);
                }
            }

            function P(T) {
                console.trace("Error message:", T.error.message);
                console.trace("Details (create DB):", T.error.details);
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
            S.text = "INSERT INTO notesInfoTable (noteInfoName, noteInfoDes) VALUES (:infoName, :infoDes);";
            S.addEventListener(air.SQLEvent.RESULT, Q);
            S.addEventListener(air.SQLErrorEvent.ERROR, P);
            S.parameters[":infoName"] = I;
            S.parameters[":infoDes"] = H;
            S.execute();
            function Q() { }
            function P() { }
        }

        function insertNote(Q, P) {
            var S = new air.SQLStatement();
            S.sqlConnection = g;
            S.text = "INSERT INTO notesTable (noteText, noteTextFormat, bookNum, chNum, verseNum) VALUES (:noteText, :noteTextFormat, :b, :c, :v);";
            S.addEventListener(air.SQLEvent.RESULT, q);
            S.addEventListener(air.SQLErrorEvent.ERROR, c);
            S.parameters[":noteText"] = Q;
            S.parameters[":noteTextFormat"] = P;
            S.parameters[":b"] = _book;
            S.parameters[":c"] = _chapter;
            S.parameters[":v"] = _verse;
            S.execute();
        }

        function q(P) {
            getNotes(_book, _chapter, _verse);
        }

        function c(P) {
            console.trace("Error message:", P.error.message);
            console.trace("Details (create DB):", P.error.details);
        }

        function updateNote(S, Q) {
            var U = new air.SQLStatement();
            U.sqlConnection = g;
            U.text = "UPDATE notesTable SET noteText = :noteText, noteTextFormat = :noteTextFormat WHERE bookNum = :b AND chNum = :c AND verseNum = :v;";
            U.addEventListener(air.SQLEvent.RESULT, P);
            U.addEventListener(air.SQLErrorEvent.ERROR, R);
            U.parameters[":noteText"] = S;
            U.parameters[":noteTextFormat"] = Q;
            U.parameters[":b"] = _book;
            U.parameters[":c"] = _chapter;
            U.parameters[":v"] = _verse;
            U.execute();

            function P(V) {
                getNotes(_book, _chapter, _verse);
            }

            function R(V) {
                console.trace("Error message:", V.error.message);
                console.trace("Details (create DB):", V.error.details);
            }
        }

        function getNotes(Q, R, P) {
            F = new air.SQLStatement();
            F.sqlConnection = g;
            let S;
            if (Q != -1) {
                S = "SELECT * FROM notesTable WHERE bookNum = :b AND chNum = :c ORDER BY verseNum";
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
            _notesResults = F.getResult();
            var P = document.getElementById("notesResultsID");
            var Q = $RvW.vvConfigObj.get_navFontSize();
            P.style.fontSize = `${Q}px`;
            P.innerHTML = "";
            if (_notesResults != null) {
                if (_notesResults.data != null) {
                    X = "";
                    var U = _notesResults.data.length;
                    X += "<table>";
                    for (let V = 0; V < U; V++) {
                        var S = _notesResults.data[V].bookNum - 1;
                        var T = $RvW.booknames[S];
                        var R = _notesResults.data[V].chNum;
                        var W = _notesResults.data[V].verseNum;
                        X += "<tr>";
                        X += '<td class="navtd" width=30%>';
                        X += `<b>${T} ${R}:${W}</b><br>`;
                        X += `<font face="${$RvW.priFontName}"> </font><br>`;
                        X += `<font face="${$RvW.secFontName}"> </font><br>`;
                        X += "</td>";
                        X += '<td class="navtd" width=40%>';
                        X += `<br><span class="notes_css">${_notesResults.data[V].noteTextFormat}</span>`;
                        X += "</td>";
                        X += "</tr>";
                    }
                    X += "</table>";
                }
            }
            P.innerHTML = X;
        }

        function D(P) {
            console.trace("Error message:", P.error.message);
            console.trace("Details (displayNotes Error):", P.error.details);
        }

        function nl2br(P) {
            return P.replace(/(\r\n|[\r\n])/g, "<br/>");
        }
    }
}

export class PostIt {
    constructor(elId, bookNum, chNum, verseNum) {
        document.getElementById(elId).addEventListener("click", function() {
            $RvW.notesObj.setVariables(bookNum, chNum, verseNum);
            $RvW.notesObj.show();
        }, false);
    }
}
