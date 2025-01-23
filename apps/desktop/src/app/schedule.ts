// @ts-nocheck

import {processNavBibleRefFind} from "@/bible/navigation";
import {console} from "@/platform/adapters/air";
import {bibleNavSearch, ScheduleItemType, scheduleList} from "@stores/global";
import {songManager, songNavigator} from "@app/glc";
import {$RvW} from "@/rvw";

import $ from "jquery";

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

        this._dbConnection.openAsync(
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

        // console.log('DB schedule insert song:', addRecordQ.text, addRecordQ.parameters);

        addRecordQ.addEventListener(air.SQLEvent.RESULT, (evt: air.SQLEvent) => {
            // console.log('DB schedule insert lyric data:');
            const { lastInsertRowID } = addRecordQ.getResult();

            this.loadSchedule();
        });
        addRecordQ.addEventListener(air.SQLErrorEvent.ERROR, (evt: air.SQLErrorEvent) => {
            console.error('DB schedule insert lyric error:', evt.error);
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

            bibleNavSearch.set([$RvW.english_booknames[book], chapter + 1, verse + 1].join(' '));

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

            songNavigator.select(song);

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