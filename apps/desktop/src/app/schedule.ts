// @ts-nocheck

import {SongPresenter} from "@/song/present";
import {SongLyrics} from "@/song/lyrics";
import {Prompt} from "@app/prompt";
import {processNavBibleRefFind} from "@/bible/navigation";
import {clearSelectList} from "@app/common";
import {Toast} from "@app/toast";
import {console} from "@/platform/adapters/air";
import {navFontSize, ScheduleItemType, scheduleList} from "@stores/global";
import {$RvW} from "@/rvw";

import $ from "jquery";

export class Scheduler {
    static DB_FILENAME = "./xml/schedule.db";

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
        this.onSelChange = onSelChange;

        this.loadScheduleAtIndex = loadScheduleAtIndex;
        this.locateScheduleItem = locateScheduleItem;

        const IS_DEBUG = true;

        let _selectedIndex = 0;
        let _dbConnection = null;
        let _scheduledItems = null;

        setupDB();

        function changeFontsizeScheduleTab() {
            const X = parseInt($RvW.vvConfigObj.get_navFontSize());
            navFontSize.set(X);
            document.getElementById("sch_verseTextID").style.fontSize = `${X}px`;
        }

        function processAddVerse(Z, Y, aa) {
            $RvW.webServerObj.broadcastWS({event: 'schedule:added', type: 'verse'});
            addItemToSchedule(false, Z, Y, aa, 0, f());
        }

        function processAddSong(yyy) {
            $RvW.webServerObj.broadcastWS({event: 'schedule:added', type: 'lyric'});

            const X = f();
            if (isSongNotInSchedule(yyy)) {
                addItemToSchedule(true, 0, 0, 0, yyy, X);
            }
        }

        function isSongNotInSchedule(songID) {
            if (!!_scheduledItems) {
                for (const Y of _scheduledItems) {
                    if (Y && Y.isSong && Y.songID === songID) {
                        return false;
                    }
                }
            }

            return true;
        }

        function processUp(selectedIndex) {
            $RvW.webServerObj.broadcastWS({event: 'schedule:update'});

            __debug("Selected Index: " + selectedIndex);

            if (selectedIndex <= 0) {
                __debug("First record...Can not move up.");
                return
            }

            const X = D(selectedIndex);
            const ac = L(selectedIndex);
            const Y = D(selectedIndex - 1);
            const ab = L(selectedIndex - 1);
            _selectedIndex = selectedIndex - 1;
            _setOrderIdForRecord(X, ab);
            _setOrderIdForRecord(Y, ac);
        }

        function processDown(selectedIndex) {
            $RvW.webServerObj.broadcastWS({event: 'schedule:update'});

            __debug("Selected Index: " + selectedIndex);

            if (selectedIndex === (_scheduledItems ? _scheduledItems.length : 0) - 1) {
                __debug("Last record...Can not move down.");
                return
            }

            const X = D(selectedIndex);
            const ad = L(selectedIndex);
            const Y = D(selectedIndex + 1);
            const ac = L(selectedIndex + 1);
            _selectedIndex = selectedIndex + 1;
            _setOrderIdForRecord(X, ac);
            _setOrderIdForRecord(Y, ad);
        }

        function processDelete() {
            __debug("About to delete Selected");
            _deleteScheduleRecord(_selectedIndex);
            $RvW.webServerObj.broadcastWS({event: 'schedule:delete-one'});
        }

        function processDeleteAll() {
            __debug("About to delete ALL Records from Selected DB. New confirm");

            Prompt.exec(
                'SCHEDULE',
                'Are you sure you want to delete ALL schedule entries?',
                _deleteAllRecords
            );
        }

        function onSelChange(selectedIndex) {
            _selectedIndex = selectedIndex;
            loadSelected();
        }

        function x() {
            if (_scheduledItems != null) {
                const X = _scheduledItems[_selectedIndex];
                if (X.isSong) {
                    const ac = X.songID;
                    const ab = $RvW.songManagerObj.getSongObjWithID(ac);
                    const aa = new SongPresenter(ab);
                    aa.present();
                } else {
                    $RvW.present_external(X.book, X.ch, X.ver);
                }
            }
        }

        function processRemotePresent(Z, Y) {
            if (_scheduledItems != null) {
                var X = _scheduledItems[Z];
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

        function loadSelected() {
            loadScheduleAtIndex(_selectedIndex);
        }

        function loadScheduleAtIndex(ai) {
            console.trace('loadScheduleAtIndex', ai, JSON.stringify(_scheduledItems));

            if (ai === -1) {
                Toast.show("Schedule", "No Schedule Selected");
                return
            }

            if (_scheduledItems != null) {
                var X = $RvW.vvConfigObj.get_navFontSize();
                var ao = "";
                if (_scheduledItems[ai].isSong === false) {
                    var Z = _scheduledItems[ai];
                    var aq = $RvW.getSingleVerse(Z.book, Z.ch, Z.ver, 1);
                    var an = $RvW.getSingleVerse(Z.book, Z.ch, Z.ver, 2);
                    var ad = _getItemLabel(Z.isSong, Z.book, Z.ch, Z.ver, Z.songID);
                    ad = F(ad, $RvW.priFontName, $RvW.secFontName);
                    ao =
                        `${ao}<br><div id="scheduleTextDIV"><a href="#"><b>${ad}</b><br><br>`;
                    ao =
                        `${ao}<font  face="${$RvW.priFontName}"> ${aq}</font><br><br>`;
                    ao =
                        `${ao}<font  face="${$RvW.secFontName}"> ${an}</font></a></div><br><br>`;
                    document.getElementById("sch_verseTextID").style.fontSize = `${X}px`;
                    document.getElementById("sch_verseTextID").innerHTML = ao;
                    document
                        .getElementById("scheduleTextDIV")
                        .addEventListener("click", x, false);
                } else {
                    var af = _scheduledItems[ai].songID;
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
                        ao = `${ao}<div id="schTitleID"><b>${ar.name}</b></div><br>`;
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
                                    `${ao}<div class="card"><div class="content"><div class="header">${ap + 1}</div><div class="meta"></div><div class="description"><div id="schlyricsID${ap}"></div><div id="schlyrics2ID${ap}"></div></div></div></div>`;
                            } else {
                                ao =
                                    `${ao}<div class="card"><div class="content"><div class="header">${ap + 1}</div><div class="meta"></div><div class="description"><div id="schlyricsID${ap}"></div></div></div></div>`;
                            }
                            var ah = (ap + 1) % aj;
                            if (ah === 0) {
                                ao = `${ao}</div>`;
                                ao = `${ao}<div class="ui cards">`;
                            }
                        }
                        ao = ao + "</div>";
                        document.getElementById("sch_verseTextID").style.fontSize = X + "px";
                        document.getElementById("sch_verseTextID").innerHTML = ao;
                        var ab = [];
                        var ag = [];
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
                    } else {
                        processDelete();
                    }
                }
            }
        }

        function L(X) {
            if (_scheduledItems != null) {
                const Y = _scheduledItems[X];
                return Y.sch_order;
            }
        }

        function D(X) {
            if (_scheduledItems != null) {
                const Y = _scheduledItems[X];
                return Y.schId;
            }
        }

        function f() {
            let Y = 0;
            if (_scheduledItems != null) {
                for (let i = 0; i < _scheduledItems.length; i++) {
                    const X = _scheduledItems[i];
                    if (X.sch_order > Y) {
                        Y = X.sch_order;
                    }
                }
            }
            Y++;
            __debug("Next Order Value: " + Y);
            return Y;
        }

        function _getItemLabel(isSong, book, chapter, verse, songID) {
            if (isSong) {
                // TODO: fix getting null data for some entries
                // - by the time we call it, songs might not be finished loading
                const aa = $RvW.songManagerObj.getSongObjWithID(songID);
                __debug('SONG:', songID, JSON.stringify(aa));
                return aa?.name;
            } else {
                const ab = $RvW.booknames[book];
                __debug('VERSE:', ab, chapter, verse);
                return `${ab} ${chapter + 1}:${verse + 1}`;
            }
        }

        function getScheduleText(ab) {
            let Y = "";
            if (_scheduledItems != null) {
                var Z = _scheduledItems.length;
                for (var aa = 0; aa < Z; aa++) {
                    var X = _scheduledItems[aa];
                    var ac = _getItemLabel(X.isSong, X.book, X.ch, X.ver, X.songID);
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
            console.trace('getScheduleList', type);

            let res = [];

            if (!!_scheduledItems) {
                for (let aa = 0; aa < _scheduledItems.length; aa++) {
                    const schItem = _scheduledItems[aa];
                    const name = _getItemLabel(schItem.isSong, schItem.book, schItem.ch, schItem.ver, schItem.songID);
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
            if (_scheduledItems != null) {
                const X = _scheduledItems[Y];
                return X.songID;
            }
        }

        function J() {
            if (_scheduledItems != null) {
                var Y = _scheduledItems.length;
                for (var Z = 0; Z < Y; Z++) {
                    var X = _scheduledItems[Z];
                    __debug(
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
                __debug("No verse Scheduled");
            }
        }

        function _closeDB() {
            _dbConnection.close();
        }

        function setupDB() {
            _dbConnection = new air.SQLConnection();
            _dbConnection.addEventListener(air.SQLEvent.OPEN, onOpen);
            _dbConnection.addEventListener(air.SQLErrorEvent.ERROR, onError);

            _dbConnection.openAsync(
                air.File.applicationStorageDirectory.resolvePath(Scheduler.DB_FILENAME)
            );

            function onOpen(_) {
                __debug("DB was created successfully");
                ensureDBSchema();
            }

            function onError(e) {
                __debug("Error message:", e.error.message);
                __debug("Details (create schedule DB):", e.error.details);
            }
        }

        function ensureDBSchema() {
            __debug("Creating schedule table...");

            const aa = new air.SQLStatement();
            aa.sqlConnection = _dbConnection;

            aa.text = "CREATE TABLE IF NOT EXISTS sch (schId INTEGER PRIMARY KEY AUTOINCREMENT, isSong BOOLEAN, book INTEGER, ch INTEGER, ver INTEGER, songID INTEGER, sch_order INTEGER )";

            aa.addEventListener(air.SQLEvent.RESULT, onResult);
            aa.addEventListener(air.SQLErrorEvent.ERROR, onError);
            aa.execute();

            function onResult(ab) {
                aa.removeEventListener(air.SQLEvent.RESULT, onResult);
                aa.removeEventListener(air.SQLErrorEvent.ERROR, onError);

                __debug("Schedule table created.");
                loadDataFromDB();
            }

            function onError(ab) {
                aa.removeEventListener(air.SQLEvent.RESULT, onResult);
                aa.removeEventListener(air.SQLErrorEvent.ERROR, onError);

                __debug("Error message:" + ab.error.message);
                __debug("Details in creating schedule table :" + ab.error.details);
            }
        }

        function addItemToSchedule(isSong, book, chapter, verse, songID, sch_order) {
            __debug(
                `Adding Record ${book} ${chapter} ${verse} ${sch_order} ${isSong} ${songID}`
            );

            const statement = new air.SQLStatement();
            statement.sqlConnection = _dbConnection;

            statement.text =
                "INSERT INTO sch (isSong, book, ch, ver, songID, sch_order) VALUES (:is, :b, :c, :v, :sid, :o);";
            statement.parameters[":is"] = isSong;
            statement.parameters[":b"] = book;
            statement.parameters[":c"] = chapter;
            statement.parameters[":v"] = verse;
            statement.parameters[":sid"] = songID;
            statement.parameters[":o"] = sch_order;

            statement.addEventListener(air.SQLEvent.RESULT, onResult);
            statement.addEventListener(air.SQLErrorEvent.ERROR, onError);

            statement.execute();

            function onResult(_) {
                statement.removeEventListener(air.SQLEvent.RESULT, onResult);
                statement.removeEventListener(air.SQLErrorEvent.ERROR, onError);

                __debug("Inserted in to schedule DB successfully...");

                loadDataFromDB();
            }
            function onError(e) {
                statement.removeEventListener(air.SQLEvent.RESULT, onResult);
                statement.removeEventListener(air.SQLErrorEvent.ERROR, onError);

                console.trace("Adding record failed...");
                console.trace("INSERT error:" + e.error);
                console.trace("event.error.code:" + e.error.code);
                console.trace("event.error.message:" + e.error.message);
            }
        }

        function _deleteScheduleRecord(recordId) {
            __debug("Deleting schedule record with keyValue as primary key...");

            const stmt = new air.SQLStatement();
            stmt.sqlConnection = _dbConnection;

            stmt.text = "DELETE FROM sch WHERE schId = :id;";
            stmt.parameters[":id"] = recordId;

            stmt.addEventListener(air.SQLEvent.RESULT, onResult);
            stmt.addEventListener(air.SQLErrorEvent.ERROR, onError);
            stmt.execute();

            function onResult(ac) {
                stmt.removeEventListener(air.SQLEvent.RESULT, onResult);
                stmt.removeEventListener(air.SQLErrorEvent.ERROR, onError);

                if (_scheduledItems != null) {
                    if (_selectedIndex === (_scheduledItems.length - 1)) {
                        _selectedIndex--;
                    }
                }

                loadDataFromDB();
            }

            function onError(ac) {
                stmt.removeEventListener(air.SQLEvent.RESULT, onResult);
                stmt.removeEventListener(air.SQLErrorEvent.ERROR, onError);

                __debug("Error deleting record from schedule DB");
                __debug("event.error.code:" + ac.error.code);
                __debug("event.error.message:" + ac.error.message);
            }
        }

        function _deleteAllRecords() {
            __debug("Deleting ALL schedule record with keyValue as primary key...");

            $RvW.webServerObj.broadcastWS({event: 'schedule:delete-all'});

            const stmt = new air.SQLStatement();
            stmt.sqlConnection = _dbConnection;
            stmt.text = "DELETE FROM sch;";

            stmt.addEventListener(air.SQLEvent.RESULT, onResult);
            stmt.addEventListener(air.SQLErrorEvent.ERROR, onError);

            stmt.execute();

            function onResult(_) {
                stmt.removeEventListener(air.SQLEvent.RESULT, onResult);
                stmt.removeEventListener(air.SQLErrorEvent.ERROR, onError);

                _selectedIndex = 0;
                loadDataFromDB();
            }
            function onError(ab) {
                stmt.removeEventListener(air.SQLEvent.RESULT, onResult);
                stmt.removeEventListener(air.SQLErrorEvent.ERROR, onError);

                __debug("Error deleting record from schedule DB");
                __debug("event.error.code:" + ab.error.code);
                __debug("event.error.message:" + ab.error.message);
            }
        }

        function _setOrderIdForRecord(recordId, order) {
            __debug("Swapping Order Value for Key " + recordId + " to " + order);

            const stmt = new air.SQLStatement();
            stmt.sqlConnection = _dbConnection;

            stmt.text = "UPDATE sch SET sch_order = :val WHERE schId = :id;";
            stmt.parameters[":id"] = recordId;
            stmt.parameters[":val"] = order;

            stmt.addEventListener(air.SQLEvent.RESULT, onResult);
            stmt.addEventListener(air.SQLErrorEvent.ERROR, onError);
            stmt.execute();

            function onResult(_) {
                stmt.removeEventListener(air.SQLEvent.RESULT, onResult);
                stmt.removeEventListener(air.SQLErrorEvent.ERROR, onError);

                __debug("Changed the order value");
                loadDataFromDB();
            }

            function onError(ad) {
                stmt.removeEventListener(air.SQLEvent.RESULT, onResult);
                stmt.removeEventListener(air.SQLErrorEvent.ERROR, onError);

                __debug("Error updating the order value");
                __debug("event.error.code:" + ad.error.code);
                __debug("event.error.message:" + ad.error.message);
            }
        }

        function loadDataFromDB() {
            __debug("Getting ALL Data from Schedule DB");

            const stmt = new air.SQLStatement();
            stmt.sqlConnection = _dbConnection;

            stmt.text = "SELECT * FROM sch ORDER BY sch_order ASC";

            stmt.addEventListener(air.SQLEvent.RESULT, onResult);
            stmt.addEventListener(air.SQLErrorEvent.ERROR, onError);
            stmt.execute();

            function onResult(_) {
                stmt.removeEventListener(air.SQLEvent.RESULT, onResult);
                stmt.removeEventListener(air.SQLErrorEvent.ERROR, onError);

                __debug("Successfully got all data from schedule DB");
                _scheduledItems = stmt.getResult().data;

                __debug('SCHD|DATA:', JSON.stringify(_scheduledItems));

                if (_scheduledItems != null) {
                    scheduleList.update(items => {
                        items = _scheduledItems.map(item => {
                            const label = _getItemLabel(item.isSong, item.book, item.ch, item.ver, item.songID);

                            return {
                                id: item.schId,
                                index: item.sch_order,
                                type: item.isSong ? ScheduleItemType.LYRIC : ScheduleItemType.VERSE,
                                title: label,
                                description: '',
                                meta: {
                                    book: item.book,
                                    chapter: item.ch,
                                    verse: item.ver,
                                    songID: item.songID,
                                }
                            }
                        });

                        return items;
                    });
                } else {
                    scheduleList.set([]);
                }
            }

            function onError(_) {
                stmt.removeEventListener(air.SQLEvent.RESULT, onResult);
                stmt.removeEventListener(air.SQLErrorEvent.ERROR, onError);

                __debug("Error getting all records");
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

        function locateScheduleItem(selectedIndex) {
            if (_scheduledItems != null) {
                const X = _scheduledItems[selectedIndex];
                if (X.isSong) {
                    const ab = X.songID;
                    const aa = $RvW.songManagerObj.getSongObjWithID(ab);
                    $("#songnav_editbox").val(aa.name);
                    $RvW.songNavObj.sn_searchSong();
                    $RvW.leftTabView.selectChild(1);
                    $RvW.rightTabView.selectChild(1);
                } else {
                    $("#nav_bibleRefID").val(
                        [$RvW.english_booknames[X.book], (X.ch + 1), (X.ver + 1)].join(' ')
                    );
                    processNavBibleRefFind();
                    $RvW.leftTabView.selectChild(0);
                    $RvW.rightTabView.selectChild(0);
                }
            }
        }

        function __debug(...X) {
            if (IS_DEBUG) {
                console.trace("[SCHEDULE]:", ...X);
            }
        }
    }
}