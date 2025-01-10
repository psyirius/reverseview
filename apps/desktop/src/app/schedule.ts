// @ts-nocheck

import {SongPresenter} from "@/song/present";
import {SongLyrics} from "@/song/lyrics";
import {Prompt} from "@app/prompt";
import {processNavBibleRefFind} from "@/bible/navigation";
import {Toast} from "@app/toast";
import {console} from "@/platform/adapters/air";
import {navFontSize, ScheduleItemType, scheduleList} from "@stores/global";
import {$RvW} from "@/rvw";
import $ from "jquery";
import {songManager} from "@app/glc";

type ResultCallback<Result = any, Error = any> = (
    result?: Result,
    error?: Error,
) => void;

interface ScheduleItem {
    id: string; // schedule id
    ordinal: number; // order
    type: ScheduleItemType; // isSong === 1
    ref: string | number; // verse ref or songID
}

export class _Scheduler_ {
    private readonly static DB_PATH: string = 'xml/schedules.db';

    private readonly _dbConnection: air.SQLConnection;

    private readonly _records: ScheduleItem[];

    constructor() {
        this._records = [];

        // DB setup
        {
            this._dbConnection = new air.SQLConnection();
            this.openDB();
        }
    }

    private getLabel(record: ScheduleItem): string {
        if (record.type === ScheduleItemType.VERSE) {
            const [book, chapter, verse] = String(record.ref).split(':').map(Number);

            return `${$RvW.english_booknames[book]} ${chapter + 1}:${verse + 1}`;
        } else {
            // TODO: fix getting null data for some entries
            // - by the time we call it, songs might not be finished loading
            const songID = Number(record.ref);

            const song = songManager.getSong(songID);

            return song?.name || 'Unknown';
        }
    }

    private onUpdate: ResultCallback<ScheduleItem[]> = (records) => {
        console.log('[SCHEDULE] Records updated:', records.length);
        for (const record of records) {
            console.log(record);
        }

        scheduleList.update((items) => {
            items = records.map((record) => {
                const label = this.getLabel(record);

                return {
                    id: record.id,
                    title: label,
                    ordinal: record.ordinal,
                    type: record.type,
                    description: '',
                    meta: {
                        ref: record.ref,
                    }
                }
            });

            return items;
        });
    };

    private openDB() {
        this._dbConnection.addEventListener(air.SQLEvent.OPEN, this._onDbOpen);
        this._dbConnection.addEventListener(air.SQLErrorEvent.ERROR, this._onDbOpenError);

        const appStorageDir = air.File.applicationStorageDirectory;

        this._dbConnection.open(
            appStorageDir.resolvePath(_Scheduler_.DB_PATH),
            // air.SQLMode.UPDATE,
        );
    }

    private _onDbOpen = (evt: air.SQLEvent) => {
        this._ensureDBSchema();
    }

    private _onDbOpenError = (evt: air.SQLErrorEvent) => {
        console.error('DB Open error:', evt);
    }

    private _ensureDBSchema() {
        const ensureSchemaQ = new air.SQLStatement();
        ensureSchemaQ.sqlConnection = this._dbConnection;

        // Schema Query
        // verseRef: '66:150:176'
        ensureSchemaQ.text = `
            CREATE TABLE IF NOT EXISTS schedule (
               id       INTEGER PRIMARY KEY AUTOINCREMENT,
               type     INTEGER NOT NULL,
               ordinal  INTEGER NOT NULL,
               verseRef VARCHAR(10),
               lyricRef INTEGER
            )
        `;

        ensureSchemaQ.addEventListener(air.SQLEvent.RESULT, (evt: air.SQLEvent) => {
            this.loadSchedule();
        });
        ensureSchemaQ.addEventListener(air.SQLErrorEvent.ERROR, (evt: air.SQLErrorEvent) => {
            console.error('DB schema ensure error:', evt);
        });
        ensureSchemaQ.execute();
    }

    private loadSchedule() {
        const loadScheduleQ = new air.SQLStatement();
        loadScheduleQ.sqlConnection = this._dbConnection;

        // Load Query
        loadScheduleQ.text = `
            SELECT *
            FROM schedule
            ORDER BY ordinal
        `;

        loadScheduleQ.addEventListener(air.SQLEvent.RESULT, (evt: air.SQLEvent) => {
            const { data } = loadScheduleQ.getResult();
            const _data = data ?? [];

            // console.log('DB schedule data:', _data);

            this._records.length = 0;
            this._records.push(..._data.map((record: any) => {
                return {
                    id: record.id,
                    ordinal: record.ordinal,
                    type: record.type,
                    ref: (record.type === ScheduleItemType.VERSE)
                        ? record.verseRef
                        : record.lyricRef,
                }
            }));

            this.onUpdate(this._records);
        });
        loadScheduleQ.addEventListener(air.SQLErrorEvent.ERROR, (evt: air.SQLErrorEvent) => {
            console.error('DB schedule load error:', evt);
        });
        loadScheduleQ.execute();
    }

    private getMaxOrdinal() {
        let maxOrd = -1;

        for (const record of this._records) {
            if (record.ordinal > maxOrd) {
                maxOrd = record.ordinal;
            }
        }

        return maxOrd;
    }

    private getRecordByIdCached(id: string): ScheduleItem | null {
        for (const record of this._records) {
            if (record.id === id) {
                return record;
            }
        }

        return null;
    }

    private getRecordIndexByIdCached(id: string): number {
        for (let i = 0; i < this._records.length; i++) {
            if (this._records[i].id === id) {
                return i;
            }
        }

        return -1;
    }

    private setRecordOrdinal(record: ScheduleItem, ordinal: number, notifyUpdate = true) {
        const { id } = record;

        const setOrdinalQ = new air.SQLStatement();
        setOrdinalQ.sqlConnection = this._dbConnection;

        // Update Query
        setOrdinalQ.text = `
            UPDATE
                schedule
            SET
                ordinal = :ord
            WHERE
                id = :id
        `;
        setOrdinalQ.parameters[":id"] = id;
        setOrdinalQ.parameters[":ord"] = ordinal;

        setOrdinalQ.addEventListener(air.SQLEvent.RESULT, (evt: air.SQLEvent) => {
            // console.log('DB schedule record ordinal update:', record, ordinal);

            // cost-effective way to update the record cache
            {
                const itemIndex = this.getRecordIndexByIdCached(id);

                if (itemIndex === -1) {
                    throw new Error('Record not found in the list');
                }

                this._records[itemIndex].ordinal = ordinal;

                // sort the records by ordinal
                this._records.sort((a: ScheduleItem, b: ScheduleItem) => {
                    return a.ordinal - b.ordinal;
                });

                notifyUpdate && this.onUpdate(this._records);
            }
        });
        setOrdinalQ.addEventListener(air.SQLErrorEvent.ERROR, (evt: air.SQLErrorEvent) => {
            console.error('DB schedule record ordinal update error:', evt);
        });
        setOrdinalQ.execute();
    }

    /// returns the id of the entry
    public addVerse(book: number, chapter: number, verse: number) {
        // skip if the verse is already in the schedule
        {
            const ref = `${book}:${chapter}:${verse}`;

            for (const record of this._records) {
                if (record.type === ScheduleItemType.VERSE && record.ref === ref) {
                    return false;
                }
            }
        }

        const addRecordQ = new air.SQLStatement();
        addRecordQ.sqlConnection = this._dbConnection;

        // Insert Query
        addRecordQ.text = `
            INSERT INTO schedule (
                type,
                ordinal,
                verseRef,
                lyricRef
            )
            VALUES (
                :ty,
                :ord,
                :vRef,
                :lRef
            )
        `;
        addRecordQ.parameters[":ty"] = ScheduleItemType.VERSE;
        addRecordQ.parameters[":ord"] = this.getMaxOrdinal() + 1;
        addRecordQ.parameters[":vRef"] = `${book}:${chapter}:${verse}`;
        addRecordQ.parameters[":lRef"] = null;

        addRecordQ.addEventListener(air.SQLEvent.RESULT, (evt: air.SQLEvent) => {
            // console.log('DB schedule insert verse data:');

            this.loadSchedule();
        });
        addRecordQ.addEventListener(air.SQLErrorEvent.ERROR, (evt: air.SQLErrorEvent) => {
            console.error('DB schedule insert verse error:', evt);
        });
        addRecordQ.execute();
    }

    /// returns the id of the entry
    public addSong(songID: number) {
        // skip if the song is already in the schedule
        {
            for (const record of this._records) {
                if (record.type === ScheduleItemType.LYRIC && record.ref === songID) {
                    return false;
                }
            }
        }

        const addRecordQ = new air.SQLStatement();
        addRecordQ.sqlConnection = this._dbConnection;

        // Insert Query
        addRecordQ.text = `
            INSERT INTO schedule (
                type,
                ordinal,
                verseRef,
                lyricRef
            )
            VALUES (
                :ty,
                :ord,
                :vRef,
                :lRef
            )
        `;
        addRecordQ.parameters[":ty"] = ScheduleItemType.LYRIC;
        addRecordQ.parameters[":ord"] = this.getMaxOrdinal() + 1;
        addRecordQ.parameters[":vRef"] = null;
        addRecordQ.parameters[":lRef"] = songID;

        addRecordQ.addEventListener(air.SQLEvent.RESULT, (evt: air.SQLEvent) => {
            // console.log('DB schedule insert lyric data:');
            const { lastInsertRowID } = addRecordQ.getResult();

            this.loadSchedule();
        });
        addRecordQ.addEventListener(air.SQLErrorEvent.ERROR, (evt: air.SQLErrorEvent) => {
            console.error('DB schedule insert lyric error:', evt);
        });
        addRecordQ.execute();
    }

    public remove(record: ScheduleItem) {
        const { id } = record;

        const deleteRecordQ = new air.SQLStatement();
        deleteRecordQ.sqlConnection = this._dbConnection;

        // Delete Query
        deleteRecordQ.text = `
            DELETE FROM schedule
            WHERE id = :id
        `;
        deleteRecordQ.parameters[":id"] = id;

        deleteRecordQ.addEventListener(air.SQLEvent.RESULT, (evt: air.SQLEvent) => {
            // console.log('DB schedule delete data: pre', record);

            this._dbConnection.compact();

            // cost-effective way to remove the record cache
            {
                const itemIndex = this.getRecordIndexByIdCached(id);

                if (itemIndex === -1) {
                    throw new Error('Record not found in the list');
                }

                this._records.splice(itemIndex, 1);

                this.onUpdate(this._records);

                // console.log('DB schedule delete data: post', this._records);
            }
        });
        deleteRecordQ.addEventListener(air.SQLErrorEvent.ERROR, (evt: air.SQLErrorEvent) => {
            console.error('DB schedule delete error:', evt);
        });
        deleteRecordQ.execute();
    }

    public clear() {
        const deleteRecordsQ = new air.SQLStatement();
        deleteRecordsQ.sqlConnection = this._dbConnection;

        // Delete Query
        deleteRecordsQ.text = `
            DELETE FROM schedule;
        `;

        deleteRecordsQ.addEventListener(air.SQLEvent.RESULT, (evt: air.SQLEvent) => {
            this._dbConnection.compact();

            this._records.length = 0;

            this.onUpdate(this._records);

            // console.log('DB schedule delete all', this._records);
        });
        deleteRecordsQ.addEventListener(air.SQLErrorEvent.ERROR, (evt: air.SQLErrorEvent) => {
            console.error('DB schedule delete all error:', evt);
        });
        deleteRecordsQ.execute();
    }

    public moveUp(record: ScheduleItem): boolean {
        const index = this.getRecordIndexByIdCached(record.id);
        const { ordinal } = record;

        if ((ordinal < 1) || (index < 1)) {
            return false;
        }

        const prevRecord = this._records[index - 1];

        this.setRecordOrdinal(record, prevRecord.ordinal, false);
        this.setRecordOrdinal(prevRecord, ordinal, false);

        this.onUpdate(this._records);

        return true;
    }

    public moveDown(record: ScheduleItem): boolean {
        const index = this.getRecordIndexByIdCached(record.id);
        const { ordinal } = record;

        const maxOrd = this.getMaxOrdinal();

        if ((ordinal >= maxOrd) || (index === -1) || (index === this._records.length - 1)) {
            return false;
        }

        const nextRecord = this._records[index + 1];

        this.setRecordOrdinal(record, nextRecord.ordinal, false);
        this.setRecordOrdinal(nextRecord, ordinal, false);

        this.onUpdate(this._records);

        return true;
    }

    public locate(record: ScheduleItem) {
        const item = this.getRecordByIdCached(record.id);

        if (!item) {
            throw new Error('Record not found');
        }

        // TODO: modernize the implementation
        if (item.type === ScheduleItemType.VERSE) {
            const [book, chapter, verse] = String(item.ref).split(':').map(Number);

            $("#nav_bibleRefID").val(
                [$RvW.english_booknames[book], chapter + 1, verse + 1].join(' ')
            );

            processNavBibleRefFind();

            $RvW.leftTabView.setSelectedTab(0);
            $RvW.rightTabView.setSelectedTab(0);
        } else {
            // FIXME: not selecting the song, use stores
            const songID = Number(item.ref);

            const song = songManager.getSong(songID);

            if (!song) {
                throw new Error('Song not found');
            }

            $("#songnav_editbox").val(song.name);

            $RvW.songNavObj.sn_searchSong();

            $RvW.leftTabView.setSelectedTab(1);
            $RvW.rightTabView.setSelectedTab(1);
        }
    }

    public entries(copy = true): readonly ScheduleItem[] {
        return copy ? [...this._records] : this._records;
    }

    public entriesForRemote(): any[] {
        return this._records.map((record, i) => {
            const label = this.getLabel(record);

            return {
                type: record.type,
                name: label,
                id: record.ref,
                index: i /*record.ordinal*/,
            }
        });
    }

    public dispose() {
        this._dbConnection.close();
    }
}

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
            document.getElementById("sch_verseTextID").style.fontSize = `${X}px`;
        }

        function processAddVerse(Z, Y, aa) {
            $RvW.webServerObj.broadcastWS({event: 'schedule:added', type: 'verse'});
            addItemToSchedule(false, Z, Y, aa, 0, getNextOrdinal());
        }

        function processAddSong(yyy) {
            $RvW.webServerObj.broadcastWS({event: 'schedule:added', type: 'lyric'});

            if (isSongNotInSchedule(yyy)) {
                addItemToSchedule(true, 0, 0, 0, yyy, getNextOrdinal());
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

            const X = _getRecordId(selectedIndex);
            const ac = _getRecordOrder(selectedIndex);

            const Y = _getRecordId(selectedIndex - 1);
            const ab = _getRecordOrder(selectedIndex - 1);

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

            const X = _getRecordId(selectedIndex);
            const ad = _getRecordOrder(selectedIndex);
            const Y = _getRecordId(selectedIndex + 1);
            const ac = _getRecordOrder(selectedIndex + 1);
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
            __debug('loadScheduleAtIndex', ai, (_scheduledItems));

            if (ai === -1) {
                Toast.error("Schedule", "No Schedule Selected");
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

        function _getRecordOrder(X) {
            if (_scheduledItems != null) {
                const Y = _scheduledItems[X];
                return Y.sch_order;
            }
        }

        function _getRecordId(X) {
            if (_scheduledItems != null) {
                const Y = _scheduledItems[X];
                return Y.schId;
            }
        }

        function getNextOrdinal() {
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
                __debug('SONG:', songID, (aa));
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

                __debug('SCHD|DATA:', (_scheduledItems));

                // if (_scheduledItems != null) {
                //     scheduleList.update(items => {
                //         items = _scheduledItems.map(item => {
                //             const label = _getItemLabel(item.isSong, item.book, item.ch, item.ver, item.songID);
                //
                //             return {
                //                 id: item.schId,
                //                 index: item.sch_order,
                //                 type: item.isSong ? ScheduleItemType.LYRIC : ScheduleItemType.VERSE,
                //                 title: label,
                //                 description: '',
                //                 meta: {
                //                     book: item.book,
                //                     chapter: item.ch,
                //                     verse: item.ver,
                //                     songID: item.songID,
                //                 }
                //             }
                //         });
                //
                //         return items;
                //     });
                // } else {
                //     scheduleList.set([]);
                // }
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
                    $RvW.leftTabView.setSelectedTab(1);
                    $RvW.rightTabView.setSelectedTab(1);
                } else {
                    $("#nav_bibleRefID").val(
                        [$RvW.english_booknames[X.book], (X.ch + 1), (X.ver + 1)].join(' ')
                    );
                    processNavBibleRefFind();
                    $RvW.leftTabView.setSelectedTab(0);
                    $RvW.rightTabView.setSelectedTab(0);
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