import {SongPresenter} from "@/song/present";
import {SongLyrics} from "@/song/lyrics";
import {Prompt} from "@app/prompt";
import {processNavBibleRefFind} from "@/bible/navigation";
import {clearSelectList, ImageIcon} from "@app/common";
import {Toast} from "@app/toast";
import {$RvW} from "@/rvw";

export class Scheduler {
    constructor() {
        this.changeFontsizeScheduleTab = changeFontsizeScheduleTab;

        this.processAddSong = processAddSong;
        this.processAddVerse = processAddVerse;
        this.getScheduleText = getScheduleText;
        this.getScheduleList = getScheduleList;

        this.processRemotePresent = processRemotePresent;
        this.getSongIndexFromSch = getSongIndexFromSch;

        this.processUp = processUp;
        this.processDown = processDown;
        this.processDelete = processDelete;
        this.processDeleteAll = processDeleteAll;

        const _is_debug = false;

        let M;
        let N = 0;
        let K = "./xml/schedule.db";
        let _dbConnection = null;
        let t = null;

        init();

        function init() {
            _debug_log("Initializing Schedule");
            M = 0;
            k();
            v();
            w();
        }

        function changeFontsizeScheduleTab() {
            const X = $RvW.vvConfigObj.get_navFontSize();
            document.getElementById("sch_verseTextID").style.fontSize = X + "px";
        }

        function v() {
            document.getElementById("sch_selectID").addEventListener("change", onSelChange, false);
            document.getElementById("sch_upID").addEventListener("click", processUp, false);
            document.getElementById("sch_downID").addEventListener("click", processDown, false);
            document.getElementById("sch_deleteID").addEventListener("click", processDelete, false);
            document.getElementById("sch_deleteAllID").addEventListener("click", processDeleteAll, false);
            document.getElementById("sch_show_in_lyrics").addEventListener("click", showInLyrics, false);
        }

        function k() {
            new ImageIcon(
                "sch_upID",
                " Move Schedule Item UP ",
                "graphics/icon/up.png",
                "graphics/icon/up.png",
                ""
            );
            new ImageIcon(
                "sch_downID",
                " Move Schedule Item DOWN ",
                "graphics/icon/down.png",
                "graphics/icon/down.png",
                ""
            );
            new ImageIcon(
                "sch_deleteID",
                " REMOVE Selected Schedule Item ",
                "graphics/icon/sch_del.png",
                "graphics/icon/sch_del.png",
                ""
            );
            new ImageIcon(
                "sch_deleteAllID",
                " CLEAR Schedule ",
                "graphics/icon/sch_delall.png",
                "graphics/icon/sch_delall.png",
                ""
            );
            // new ImageIcon(
            //     "sch_presentID",
            //     " PRESENT Selected Schedule Item ",
            //     "graphics/icon/present_48.png",
            //     "graphics/icon/present_48.png",
            //     ""
            // );
        }

        function processAddVerse(Z, Y, aa) {
            var X = f();
            H(false, Z, Y, aa, 0, X);
        }

        function processAddSong(Y) {
            var X = f();
            if (d(Y)) {
                H(true, 0, 0, 0, Y, X);
            }
        }

        function d(X) {
            var ab = true;
            if (t.data != null) {
                var Z = t.data.length;
                for (var aa = 0; aa < Z; aa++) {
                    var Y = t.data[aa];
                    if (Y.isSong) {
                        if (Y.songID == X) {
                            return false;
                            break;
                        }
                    }
                }
            }
            return ab;
        }

        function processUp() {
            var aa = document.getElementById("sch_selectID");
            var Z = aa.selectedIndex;
            _debug_log("Selected Index: " + Z);
            if (Z != 0) {
                var X = D(Z);
                var ac = L(Z);
                M = Z - 1;
                var Y = D(Z - 1);
                var ab = L(Z - 1);
                G(X, ab);
                G(Y, ac);
            } else {
                _debug_log("First record...Can not move up.");
            }
        }

        function processDown() {
            var ab = document.getElementById("sch_selectID");
            var Z = ab.selectedIndex;
            var aa = 0;
            _debug_log("Selected Index: " + Z);
            if (t.data != null) {
                aa = t.data.length;
            }
            if (Z != aa - 1) {
                var X = D(Z);
                var ad = L(Z);
                var Y = D(Z + 1);
                var ac = L(Z + 1);
                M = Z + 1;
                G(X, ac);
                G(Y, ad);
            } else {
                _debug_log("Last record...Can not move down.");
            }
        }

        function processDelete() {
            _debug_log("About to delete Selected");
            W(getSelectedSchedule());
        }

        function processDeleteAll() {
            _debug_log("About to delete ALL Records from Selected DB. New confirm");
            var X = "SCHEDULE";
            var Y = "Are you sure you want to delete ALL schedule entries?";
            Prompt.exec(X, Y, n);
        }

        function onSelChange() {
            M = document.getElementById("sch_selectID").selectedIndex;
            e();
        }

        function x() {
            var Z = document.getElementById("sch_selectID");
            var Y = Z.selectedIndex;
            if (t.data != null) {
                var X = t.data[Y];
                if (X.isSong) {
                    var ac = X.songID;
                    var ab = $RvW.songManagerObj.getSongObjWithID(ac);
                    var aa = new SongPresenter(ab);
                    aa.present();
                } else {
                    $RvW.present_external(X.book, X.ch, X.ver);
                }
            }
        }

        function processRemotePresent(Z, Y) {
            if (t.data != null) {
                var X = t.data[Z];
                if (X.isSong) {
                    var ac = X.songID;
                    var ab = $RvW.songManagerObj.getSongObjWithID(ac);
                    var aa = new SongPresenter(ab);
                    aa.present(Y);
                } else {
                    $RvW.present_external(X.book, X.ch, X.ver);
                }
            }
        }

        function j() {
            J();
        }

        function i() {
            _debug_log("Updating Schedule UI");
            if (t.data != null) {
                clearSelectList("sch_selectID");
                var Y = t.data.length;
                for (var Z = 0; Z < Y; Z++) {
                    var X = t.data[Z];
                    var aa = b(X.isSong, X.book, X.ch, X.ver, X.songID);
                    document.getElementById("sch_selectID").options[Z] = new Option(
                        aa,
                        X.schId
                    );
                }
                e();
            } else {
                clearSelectList("sch_selectID");
                document.getElementById("sch_verseTextID").innerHTML = "";
                document.getElementById("sch_selectID").options[0] = new Option(
                    "None",
                    0
                );
            }
        }

        function V() {
            _debug_log("Updating Schedule UI");
            if (t.data != null) {
                clearSelectList("sch_selectID");
                var Y = t.data.length;
                for (var Z = 0; Z < Y; Z++) {
                    var X = t.data[Z];
                    var aa = b(X.isSong, X.book, X.ch, X.ver, X.songID);
                    $("#sch_selectID").append(
                        '<option value="' + X.schId + '" >' + aa + "</option>"
                    );
                }
                e();
            } else {
                clearSelectList("sch_selectID");
                document.getElementById("sch_verseTextID").innerHTML = "";
                document.getElementById("sch_selectID").options[0] = new Option(
                    "None",
                    0
                );
                $("#sch_show_in_lyrics").hide();
            }
        }

        function e() {
            var X = document.getElementById("sch_selectID");
            X.selectedIndex = M;
            u(M);
        }

        function u(ai) {
            $("#sch_show_in_lyrics").show();
            if (t.data != null) {
                var X = $RvW.vvConfigObj.get_navFontSize();
                var ao = "";
                if (t.data[ai].isSong == false) {
                    var Z = t.data[ai];
                    var aq = $RvW.getSingleVerse(Z.book, Z.ch, Z.ver, 1);
                    var an = $RvW.getSingleVerse(Z.book, Z.ch, Z.ver, 2);
                    var ad = b(Z.isSong, Z.book, Z.ch, Z.ver, Z.songID);
                    ad = F(ad, $RvW.priFontName, $RvW.secFontName);
                    ao =
                        ao +
                        '<br><div id="scheduleTextDIV"><a href="#"><b>' +
                        ad +
                        "</b><br><br>";
                    ao =
                        ao + '<font  face="' + $RvW.priFontName + '"> ' + aq + "</font><br><br>";
                    ao =
                        ao +
                        '<font  face="' +
                        $RvW.secFontName +
                        '"> ' +
                        an +
                        "</font></a></div><br><br>";
                    document.getElementById("sch_verseTextID").style.fontSize = X + "px";
                    document.getElementById("sch_verseTextID").innerHTML = ao;
                    document
                        .getElementById("scheduleTextDIV")
                        .addEventListener("click", x, false);
                    $("#sch_show_in_lyrics").text("Show Chapter");
                } else {
                    var af = t.data[ai].songID;
                    var ar = $RvW.songManagerObj.getSongObjWithID(af);
                    if (ar != null) {
                        var ak = ar.font;
                        var am = ar.font2;
                        var ac = true;
                        if (am == null || am == "") {
                            ac = false;
                        } else {
                            if (ar.slides2 != null) {
                                var Y = ar.slides2[0];
                                if (Y == null || Y == "") {
                                    ac = false;
                                }
                            } else {
                                ac = false;
                            }
                        }
                        var ae = ar.slides.length;
                        var ao = "";
                        ao = ao + '<div id="schTitleID"><b>' + ar.name + "</b></div><br>";
                        var at = window.nativeWindow.bounds.width;
                        var aj = 4;
                        if (at < 1600 && at > 1300) {
                            aj = 3;
                        }
                        if (at <= 1300 && at > 990) {
                            aj = 2;
                        }
                        if (at <= 990) {
                            aj = 1;
                        }
                        ao = ao + '<div class="ui cards">';
                        for (var ap = 0; ap < ae; ap++) {
                            if (ac) {
                                ao =
                                    ao +
                                    '<div class="card"><div class="content"><div class="header">' +
                                    (ap + 1) +
                                    '</div><div class="meta"></div><div class="description"><div id="schlyricsID' +
                                    ap +
                                    '"></div><div id="schlyrics2ID' +
                                    ap +
                                    '"></div></div></div></div>';
                            } else {
                                ao =
                                    ao +
                                    '<div class="card"><div class="content"><div class="header">' +
                                    (ap + 1) +
                                    '</div><div class="meta"></div><div class="description"><div id="schlyricsID' +
                                    ap +
                                    '"></div></div></div></div>';
                            }
                            var ah = (ap + 1) % aj;
                            if (ah == 0) {
                                ao = ao + "</div>";
                                ao = ao + '<div class="ui cards">';
                            }
                        }
                        ao = ao + "</div>";
                        document.getElementById("sch_verseTextID").style.fontSize = X + "px";
                        document.getElementById("sch_verseTextID").innerHTML = ao;
                        var ab = new Array();
                        var ag = new Array();
                        for (var ap = 0; ap < ae; ap++) {
                            var al = "schlyricsID" + ap;
                            document.getElementById(al).style.fontFamily = ak;
                            document.getElementById(al).style.fontSize = X + "px";
                            ab[ap] = new SongLyrics(ar, al, ap, 1);
                            if (ac) {
                                var aa = "schlyrics2ID" + ap;
                                document.getElementById(aa).style.fontFamily = am;
                                document.getElementById(aa).style.fontSize = X + "px";
                                ag[ap] = new SongLyrics(ar, aa, ap, 2);
                            }
                        }
                        $("#sch_show_in_lyrics").text("Show in Lyrics Tab");
                    } else {
                        processDelete();
                        $("#sch_show_in_lyrics").hide();
                    }
                }
            }
        }

        function L(X) {
            if (t.data != null) {
                var Y = t.data[X];
                return Y.sch_order;
            }
        }

        function D(X) {
            if (t.data != null) {
                var Y = t.data[X];
                return Y.schId;
            }
        }

        function f() {
            var Y = 0;
            if (t.data != null) {
                var Z = t.data.length;
                for (var aa = 0; aa < Z; aa++) {
                    var X = t.data[aa];
                    if (X.sch_order > Y) {
                        Y = X.sch_order;
                    }
                }
            }
            Y++;
            _debug_log("Next Order Value: " + Y);
            return Y;
        }

        function b(ae, X, ad, Z, ac) {
            let Y = null;
            if (ae) {
                const aa = $RvW.songManagerObj.getSongObjWithID(ac);
                if (aa != null) {
                    Y = aa.name;
                }
            } else {
                const ab = $RvW.booknames[X];
                Y = `${ab} ${ad + 1}:${Z + 1}`;
            }
            return Y;
        }

        function getSelectedSchedule() {
            const Y = document.getElementById("sch_selectID");
            if (Y.selectedIndex === -1) {
                Toast.show("Schedule", "Please select a Schedule");
                return
            }
            return Y.options[Y.selectedIndex].value;
        }

        function getScheduleText(ab) {
            var Y = "";
            if (t.data != null) {
                var Z = t.data.length;
                for (var aa = 0; aa < Z; aa++) {
                    var X = t.data[aa];
                    var ac = b(X.isSong, X.book, X.ch, X.ver, X.songID);
                    if (ab == 1) {
                        if (X.isSong) {
                            Y = Y + ac + "|";
                        }
                    } else {
                        if (ab == 2 && !X.isSong) {
                            Y = Y + ac + "|";
                        } else {
                            Y = Y + ac + "|";
                        }
                    }
                }
            }
            return Y;
        }

        function getScheduleList(type) {
            let res = [];

            if (t.data != null) {
                for (let aa = 0; aa < t.data.length; aa++) {
                    const schItem = t.data[aa];
                    const name = b(schItem.isSong, schItem.book, schItem.ch, schItem.ver, schItem.songID);
                    switch (type) {
                        case 1: {
                            if (schItem.isSong) {
                                res.push({
                                    type: schItem.isSong ? 0 : 1,
                                    name,
                                    id: schItem.isSong ? schItem.songID : `${schItem.book}.${schItem.ch}.${schItem.ver}`,
                                    index: aa,
                                });
                            }
                            break;
                        }
                        case 2: {
                            if (!schItem.isSong) {
                                res.push({
                                    type: schItem.isSong ? 0 : 1,
                                    name,
                                    id: schItem.isSong ? schItem.songID : `${schItem.book}.${schItem.ch}.${schItem.ver}`,
                                    index: aa,
                                });
                            }
                            break;
                        }
                        default: {
                            res.push({
                                type: schItem.isSong ? 0 : 1,
                                name,
                                id: schItem.isSong ? schItem.songID : `${schItem.book}.${schItem.ch}.${schItem.ver}`,
                                index: aa,
                            });
                        }
                    }
                }
            }

            return res;
        }

        function getSongIndexFromSch(Y) {
            if (t.data != null) {
                var X = t.data[Y];
                return X.songID;
            }
        }

        function _debug_log(X) {
            if (_is_debug) {
                air.trace("[SCHEDULE]..." + X);
            }
        }

        function J() {
            if (t.data != null) {
                var Y = t.data.length;
                for (var Z = 0; Z < Y; Z++) {
                    var X = t.data[Z];
                    _debug_log(
                        X.schId +
                        " | " +
                        X.isSong +
                        " | " +
                        X.book +
                        " | " +
                        X.ch +
                        " | " +
                        X.ver +
                        " | " +
                        X.songID +
                        " | " +
                        X.sch_order
                    );
                }
            } else {
                _debug_log("No verse Scheduled");
            }
        }

        function O() {
            _dbConnection.close();
        }

        function w() {
            _dbConnection = new air.SQLConnection();
            _dbConnection.addEventListener(air.SQLEvent.OPEN, Y);
            _dbConnection.addEventListener(air.SQLErrorEvent.ERROR, X);
            var Z = air.File.applicationStorageDirectory.resolvePath(K);
            _dbConnection.openAsync(Z);
            function Y(aa) {
                _debug_log("DB was created successfully");
                h();
            }
            function X(aa) {
                _debug_log("Error message:", aa.error.message);
                _debug_log("Details (create schedule DB):", aa.error.details);
            }
        }

        function h() {
            _debug_log("Creating schedule table...");
            var aa = new air.SQLStatement();
            aa.sqlConnection = _dbConnection;
            aa.text = "CREATE TABLE IF NOT EXISTS sch (schId INTEGER PRIMARY KEY AUTOINCREMENT, isSong BOOLEAN, book INTEGER, ch INTEGER, ver INTEGER, songID INTEGER, sch_order INTEGER )";
            aa.addEventListener(air.SQLEvent.RESULT, Y);
            aa.addEventListener(air.SQLErrorEvent.ERROR, X);
            aa.execute();
            function Y(ab) {
                _debug_log("Schedule table created.");
                aa.removeEventListener(air.SQLEvent.RESULT, Y);
                aa.removeEventListener(air.SQLErrorEvent.ERROR, X);
                a();
            }
            function X(ab) {
                aa.removeEventListener(air.SQLEvent.RESULT, Y);
                aa.removeEventListener(air.SQLErrorEvent.ERROR, X);
                _debug_log("Error message:" + ab.error.message);
                _debug_log("Details in creating schedule table :" + ab.error.details);
            }
        }

        function H(Z, ad, ac, ae, Y, aa) {
            _debug_log(
                "Adding Record " + ad + " " + ac + " " + ae + " " + aa + " " + Z + " " + Y
            );
            var ab = new air.SQLStatement();
            ab.sqlConnection = _dbConnection;
            ab.text = "INSERT INTO sch (isSong, book, ch, ver, songID, sch_order) VALUES (:is, :b, :c, :v, :sid, :o);";
            ab.addEventListener(air.SQLEvent.RESULT, af);
            ab.addEventListener(air.SQLErrorEvent.ERROR, X);
            ab.parameters[":is"] = Z;
            ab.parameters[":b"] = ad;
            ab.parameters[":c"] = ac;
            ab.parameters[":v"] = ae;
            ab.parameters[":sid"] = Y;
            ab.parameters[":o"] = aa;
            ab.execute();
            function af(ah) {
                ab.removeEventListener(air.SQLEvent.RESULT, af);
                ab.removeEventListener(air.SQLErrorEvent.ERROR, X);
                _debug_log("Inserted in to schedule DB sucessfully...");
                a();
            }
            function X(ah) {
                air.trace("Adding record failed...");
                ab.removeEventListener(air.SQLEvent.RESULT, af);
                ab.removeEventListener(air.SQLErrorEvent.ERROR, X);
                air.trace("INSERT error:" + ah.error);
                air.trace("event.error.code:" + ah.error.code);
                air.trace("event.error.message:" + ah.error.message);
            }
        }

        function W(Z) {
            _debug_log("Deleting schedule record with keyValue as primary key...");
            var Y = new air.SQLStatement();
            Y.sqlConnection = _dbConnection;
            Y.text = "DELETE FROM sch WHERE schId = :id;";
            Y.addEventListener(air.SQLEvent.RESULT, X);
            Y.addEventListener(air.SQLErrorEvent.ERROR, aa);
            Y.parameters[":id"] = Z;
            Y.execute();
            function X(ac) {
                Y.removeEventListener(air.SQLEvent.RESULT, X);
                Y.removeEventListener(air.SQLErrorEvent.ERROR, aa);
                if (t.data != null) {
                    const numofRecords = t.data.length;
                    if (M == numofRecords - 1) {
                        M--;
                    }
                }
                a();
            }
            function aa(ac) {
                Y.removeEventListener(air.SQLEvent.RESULT, X);
                Y.removeEventListener(air.SQLErrorEvent.ERROR, aa);
                _debug_log("Error deleting record from schedule DB");
                _debug_log("event.error.code:" + ac.error.code);
                _debug_log("event.error.message:" + ac.error.message);
            }
        }

        function n() {
            _debug_log("Deleting ALL schedule record with keyValue as primary key...");
            var X = new air.SQLStatement();
            X.sqlConnection = _dbConnection;
            X.text = "DELETE FROM sch;";
            X.addEventListener(air.SQLEvent.RESULT, aa);
            X.addEventListener(air.SQLErrorEvent.ERROR, Y);
            X.execute();
            function aa(ab) {
                X.removeEventListener(air.SQLEvent.RESULT, aa);
                X.removeEventListener(air.SQLErrorEvent.ERROR, Y);
                M = 0;
                a();
            }
            function Y(ab) {
                X.removeEventListener(air.SQLEvent.RESULT, aa);
                X.removeEventListener(air.SQLErrorEvent.ERROR, Y);
                _debug_log("Error deleting record from schedule DB");
                _debug_log("event.error.code:" + ab.error.code);
                _debug_log("event.error.message:" + ab.error.message);
            }
        }

        function G(Y, aa) {
            _debug_log("Swapping Order Value for Key " + Y + " to " + aa);
            var Z = new air.SQLStatement();
            Z.sqlConnection = _dbConnection;
            Z.text = "UPDATE sch SET sch_order = :val WHERE schId = :id;";
            Z.addEventListener(air.SQLEvent.RESULT, ab);
            Z.addEventListener(air.SQLErrorEvent.ERROR, X);
            Z.parameters[":id"] = Y;
            Z.parameters[":val"] = aa;
            Z.execute();
            function ab(ad) {
                Z.removeEventListener(air.SQLEvent.RESULT, ab);
                Z.removeEventListener(air.SQLErrorEvent.ERROR, X);
                _debug_log("Changed the order value");
                a();
            }
            function X(ad) {
                Z.removeEventListener(air.SQLEvent.RESULT, ab);
                Z.removeEventListener(air.SQLErrorEvent.ERROR, X);
                _debug_log("Error updating the order value");
                _debug_log("event.error.code:" + ad.error.code);
                _debug_log("event.error.message:" + ad.error.message);
            }
        }

        function a() {
            _debug_log("Getting ALL Data from Schedule DB");
            var Z = new air.SQLStatement();
            Z.sqlConnection = _dbConnection;
            Z.text = "SELECT * FROM sch ORDER BY sch_order ASC";
            Z.addEventListener(air.SQLEvent.RESULT, X);
            Z.addEventListener(air.SQLErrorEvent.ERROR, Y);
            Z.execute();
            function X(ab) {
                Z.removeEventListener(air.SQLEvent.RESULT, X);
                Z.removeEventListener(air.SQLErrorEvent.ERROR, Y);
                _debug_log("Succesfuly got all data from schedule DB");
                t = Z.getResult();
                V();
            }
            function Y(ab) {
                Z.removeEventListener(air.SQLEvent.RESULT, X);
                Z.removeEventListener(air.SQLErrorEvent.ERROR, Y);
                _debug_log("Error getting all records");
            }
        }

        function F(af, Z, Y) {
            var ae = "";
            var X = af.split(")");
            if (X[1] != null) {
                var ac = X[1];
                var ad = X[0].split("(");
                var ab = ad[0];
                var aa = ad[1];
                ae += `<span style="font-family:${Z};">${ab}</span>`;
                ae += `<span style="font-family:${Y};"> (${aa}) </span>`;
                ae += `<span style="font-family:${Z};">${ac}</span>`;
            } else {
                ae += `<span style="font-family:${Z};">${af}</span>`;
            }
            return ae;
        }

        function showInLyrics() {
            var Z = document.getElementById("sch_selectID");
            var Y = Z.selectedIndex;
            if (t.data != null) {
                var X = t.data[Y];
                if (X.isSong) {
                    var ab = X.songID;
                    var aa = $RvW.songManagerObj.getSongObjWithID(ab);
                    $("#songnav_editbox").val(aa.name);
                    $RvW.songNavObj.sn_searchSong();
                    $RvW.leftTabView.selectChild(1);
                    $RvW.rightTabView.selectChild(1);
                } else {
                    $("#nav_bibleRefID").val(
                        $RvW.booknames[X.book] + " " + (X.ch + 1) + " " + (X.ver + 1)
                    );
                    processNavBibleRefFind();
                    $RvW.leftTabView.selectChild(0);
                    $RvW.rightTabView.selectChild(0);
                }
            }
        }
    }
}