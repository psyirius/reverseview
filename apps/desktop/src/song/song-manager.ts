// TODO: yui-migrate
// - YAHOO.widget.Panel

// @ts-nocheck

import {SongExporter} from "./exporter";
import {removeTag} from "@/song/tags";
import {SongSearchType} from "@/const";
import {Song} from '@/song/song-obj';
import {Toast} from "@app/toast";
import {insertError, insertResult} from "@/song/indexing";
import {
    checkVerUpdateFlags,
    isUpToDate,
    task1Complete,
    task1Status
} from "@/versionupdate";
import {isBlank, saveFileInAppStorage} from "@app/common";
import {$RvW} from "@/rvw";
import {console} from "@/platform/adapters/air";
import {songCategories, songTags} from "@stores/global";

type SongSlide = string; // string with newlines

export interface SongLyrics {
    font: string,
    slides: SongSlide[],
}

export interface SongItem {
    id: number,
    name: string, // english name
    title?: string, // local lang title
    lyrics: SongLyrics[],
    author?: string,
    copyright?: string,
    category: string,
    tags: string[],
    serial?: number,
    youtube?: string,
    key?: string,
    chords?: string,
    bpm?: number,
    notes?: string,
    sequence?: string,
    timestamp: Date,
}

export enum SearchFilterType {
    ID,
    TITLE,
    LYRICS,
    SERIAL,
    CATEGORY,
    TAGS,
    AUTHOR,
    KEY,
    BPM,
}

interface SearchFilterWithID {
    type: SearchFilterType.ID;
    value: number;
}

interface SearchFilterWithSERIAL {
    type: SearchFilterType.SERIAL;
    value: number;
}

interface SearchFilterWithTITLE {
    type: SearchFilterType.TITLE;
    value: string;
    exact?: boolean;
}

interface SearchFilterWithCONTENT {
    type: SearchFilterType.LYRICS;
    value: string;
}

interface SearchFilterWithCATEGORY {
    type: SearchFilterType.CATEGORY;
    value: string;
}

interface SearchFilterWithTAGS {
    type: SearchFilterType.TAGS;
    value: string[];
}

interface SearchFilterWithAUTHOR {
    type: SearchFilterType.AUTHOR;
    value: string;
    exact?: boolean;
}

interface SearchFilterWithKEY {
    type: SearchFilterType.KEY;
    value: string;
}

interface SearchFilterWithBPM {
    type: SearchFilterType.BPM;
    value: number;
}

export type SearchFilter = (
    SearchFilterWithID          |
    SearchFilterWithSERIAL      |
    SearchFilterWithCONTENT     |
    SearchFilterWithCATEGORY    |
    SearchFilterWithTAGS        |
    SearchFilterWithAUTHOR      |
    SearchFilterWithKEY         |
    SearchFilterWithBPM         |
    SearchFilterWithTITLE
);

type SearchFilterOptions = {
    limit?: number,
    page?: number, // 0-based, used with limit
}

type ResultCallback<Result, Error = any> = (
    result?: Result,
    error?: Error,
) => void;

type Nullable<T> = T | null;
type Optional<T> = T | undefined;

type PaginationState = {
    page: number,
    limit: number,
}

export class _SongManager_ {
    private readonly static DB_PATH: string = 'song/songs.db';

    private readonly _dbConnection: air.SQLConnection;

    private readonly _records: SongItem[];

    private _ready: boolean = false;

    public isReady() {
        return this._ready;
    }

    private onUpdate: ResultCallback<SongItem[]> = (records) => {
        console.log('[SONGS] Records updated:', records.length);

        // for (const record of records) {
        //     console.log(record);
        // }
        // console.log(records[0]);
    };

    constructor() {
        this._records = [];

        // DB setup
        {
            this._dbConnection = new air.SQLConnection();
            this.openDB();
        }
    }

    public search(filters: SearchFilter[], callback: ResultCallback<SongItem[]>): void;
    public search(filters: SearchFilter[], options: SearchFilterOptions, callback: ResultCallback<SongItem[]>): void {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        const searchQ = new air.SQLStatement();
        searchQ.sqlConnection = this._dbConnection;

        const qs = [
            'SELECT * FROM songs',
        ];
        const wcq = [];

        const params = searchQ.parameters;

        for (let i = 0; i < filters.length; i++) {
            const {type, value, ...args} = filters[i];

            switch (type) {
                case SearchFilterType.ID: { // args: {value: number}
                    wcq.push(`id = :param_${i}`);
                    params[`:param_${i}`] = value;
                    break;
                }
                case SearchFilterType.KEY: { // args: {value: string}
                    wcq.push(`key = :param_${i}`);
                    params[`:param_${i}`] = value;
                    break;
                }
                case SearchFilterType.BPM: { // args: {value: number}
                    wcq.push(`bpm = :param_${i}`);
                    params[`:param_${i}`] = value;
                    break;
                }
                case SearchFilterType.TITLE: { // args: {value: string, exact: boolean}
                    if (args.exact) {
                        wcq.push([
                            `title = :param_${i}`,
                            `name = :param_${i}`,
                        ].join(' OR '));
                        params[`:param_${i}`] = value;
                    } else {
                        wcq.push([
                            `title LIKE :param_${i}`,
                            `name LIKE :param_${i}`,
                        ].join(' OR '));
                        params[`:param_${i}`] = `%${value}%`;
                    }
                    break;
                }
                case SearchFilterType.LYRICS: { // args: {value: string}
                    wcq.push(`lyrics LIKE :param_${i}`);
                    params[`:param_${i}`] = `%${value}%`;
                    break;
                }
                case SearchFilterType.SERIAL: { // args: {value: number}
                    wcq.push(`serial = :param_${i}`);
                    params[`:param_${i}`] = value;
                    break;
                }
                case SearchFilterType.CATEGORY: { // args: {value: string}
                    wcq.push(`category = :param_${i}`);
                    params[`:param_${i}`] = value;
                    break;
                }
                case SearchFilterType.TAGS: { // args: {value: string[]}
                    wcq.push(value.map((tag, j) => {
                        params[`:param_${i}_${j}`] = `%"${tag}"%`;
                        return `tags LIKE :param_${i}_${j}`;
                    }).join(' AND '));
                    break;
                }
                case SearchFilterType.AUTHOR: { // args: {value: string, exact: boolean}
                    if (args.exact) {
                        wcq.push(`author = :param_${i}`);
                        params[`:param_${i}`] = value;
                    } else {
                        wcq.push(`author LIKE :param_${i}`);
                        params[`:param_${i}`] = `%${value}%`;
                    }
                    break;
                }
            }
        }

        if (wcq.length > 0) {
            qs.push('WHERE');
            qs.push(wcq.map((c) => `(${c})`).join(' AND '));
        }

        qs.push(
            'ORDER BY name ASC',
        )

        if (options.limit) {
            qs.push(`LIMIT ${options.limit}`);

            if (options.page) {
                qs.push(`OFFSET ${options.page * options.limit}`);
            }
        }

        searchQ.text = qs.join(' ');

        console.log("SQX:", searchQ.text, searchQ.parameters);

        searchQ.addEventListener(air.SQLEvent.RESULT, (evt: air.SQLEvent) => {
            const { data } = searchQ.getResult();
            const _data = data ?? [];

            console.log('DB song search result:', _data.length);

            callback(_data.map((record: any) => {
                return {
                    id: record.id,
                    name: record.name,
                    title: record.title,
                    serial: record.serial,
                    category: record.category,
                    tags: JSON.parse(record.tags),
                    lyrics: JSON.parse(record.lyrics),
                    youtube: record.youtube,
                    author: record.author,
                    copyright: record.copyright,
                    chords: record.chords,
                    key: record.key,
                    bpm: record.bpm,
                    notes: record.notes,
                    sequence: record.sequence,
                    timestamp: new Date(record.timestamp),
                }
            }), null);
        });
        searchQ.addEventListener(air.SQLErrorEvent.ERROR, (evt: air.SQLErrorEvent) => {
            console.error('DB song search error:', evt);

            callback(null, evt);
        });
        searchQ.execute();
    }

    private openDB() {
        this._dbConnection.addEventListener(air.SQLEvent.OPEN, this._onDbOpen);
        this._dbConnection.addEventListener(air.SQLErrorEvent.ERROR, this._onDbOpenError);

        const appStorageDir = air.File.applicationStorageDirectory;

        this._dbConnection.open(
            appStorageDir.resolvePath(_SongManager_.DB_PATH),
            // air.SQLMode.UPDATE,
        );
    }

    private _onDbOpen = (evt: air.SQLEvent) => {
        this._ensureDBSchema();
    }

    private _onDbOpenError = (evt: air.SQLErrorEvent) => {
        console.error('DB Open error:', evt);
    }

    private getRecordByIdCached(id: string): SongItem | null {
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

    public getSong(id: number) {
        return this.getRecordByIdCached(id);
    }

    private _ensureDBSchema() {
        const ensureSchemaQ = new air.SQLStatement();
        ensureSchemaQ.sqlConnection = this._dbConnection;

        // Schema Query
        // tags: '\x1F{tag1}\x1F{tag2}\x1F{tag3}\x1F'
        ensureSchemaQ.text = `
            CREATE TABLE IF NOT EXISTS songs (
                id              INTEGER PRIMARY KEY AUTOINCREMENT,
                name            TEXT NOT NULL,
                title           TEXT,
                serial          INTEGER,
                category        TEXT,
                tags            TEXT,
                lyrics          TEXT,
                youtube         TEXT,
                author          TEXT,
                notes           TEXT,
                copyright       TEXT,
                sequence        TEXT,
                chords          TEXT,
                key             TEXT,
                bpm             INTEGER,
                timestamp       INTEGER
            )
        `;

        ensureSchemaQ.addEventListener(air.SQLEvent.RESULT, (evt: air.SQLEvent) => {
            this.loadSongs();
        });
        ensureSchemaQ.addEventListener(air.SQLErrorEvent.ERROR, (evt: air.SQLErrorEvent) => {
            console.error('DB schema ensure error:', evt);
        });
        ensureSchemaQ.execute();
    }

    private getCount(callback: ResultCallback<number>) {
        const countQ = new air.SQLStatement();
        countQ.sqlConnection = this._dbConnection;

        // Count Query
        countQ.text = `
            SELECT COUNT(*) as count FROM songs
        `;

        countQ.addEventListener(air.SQLEvent.RESULT, (evt: air.SQLEvent) => {
            const { data } = countQ.getResult();

            callback(data[0].count, null);
        });
        countQ.addEventListener(air.SQLErrorEvent.ERROR, (evt: air.SQLErrorEvent) => {
            console.error('DB count error:', evt);
            callback(null, evt);
        });
        countQ.execute();
    }

    private loadSongs() {
        this.getCount((count, error) => {
            if (error) {
                console.error('DB song count error:', error);
                return;
            }

            console.log('[SONGS] DB song count:', count);
        });
        this.search([], (records, error) => {
            if (error) {
                console.error('DB song load error:', error);
                return;
            }

            this._records.length = 0;
            this._records.push(...records);
            this._ready = true;

            songCategories.set(this.getAllCategories());
            songTags.set(this.getAllTags());

            this.onUpdate(records);
        });
    }

    public getAllCategories() {
        const categories = [];

        for (const record of this._records) {
            if (categories.indexOf(record.category) === -1) {
                categories.push(record.category);
            }
        }

        return categories;
    }

    public getAllTags() {
        const tags = [];

        for (const record of this._records) {
            for (const tag of record.tags) {
                if (tags.indexOf(tag) === -1) {
                    tags.push(tag);
                }
            }
        }

        return tags;
    }

    public getAllFonts() {
        const fonts = [];

        for (const record of this._records) {
            for (const lyric of record.lyrics) {
                if (fonts.indexOf(lyric.font) === -1) {
                    fonts.push(lyric.font);
                }
            }
        }

        return fonts;
    }

    public importFromXML() {
        // TODO: impl
    }

    public importFromJSON() {
        // TODO: impl
    }

    public exportAsXML(categories: string[] = null, callback: ResultCallback<SongItem[]>): void {
        // TODO: impl
    }

    public exportAllAsXMLToFile(): void {
        // TODO: impl
    }

    public exportAllAsDBToFile(): void {
        // TODO: impl
    }

    public importDBFromFile(): void {
        // TODO: impl
    }

    public importXMLFromFile(): void {
        // TODO: impl
    }

    public exportSelectedCategoriesAsXMLToFile(): void {
        // TODO: impl
    }

    public exportAsJSON(categories: string[] = null, callback: ResultCallback<SongItem[]>): void {
        // TODO: impl
    }

    public add(song: Omit<SongItem, 'id'>, callback: ResultCallback<SongItem>) {
        const createRecordQ = new air.SQLStatement();
        createRecordQ.sqlConnection = this._dbConnection;

        // Create Query
        createRecordQ.text = `
            INSERT INTO songs (
                name,
                title,
                serial,
                category,
                tags,
                lyrics,
                youtube,
                author,
                notes,
                copyright,
                sequence,
                chords,
                key,
                bpm,
                timestamp
            ) VALUES (
                :name,
                :title,
                :serial,
                :category,
                :tags,
                :lyrics,
                :youtube,
                :author,
                :notes,
                :copyright,
                :sequence,
                :chords,
                :key,
                :bpm,
                :timestamp       
            )
        `;

        createRecordQ.parameters[":name"] = song.name;
        createRecordQ.parameters[":title"] = song.title;
        createRecordQ.parameters[":serial"] = song.serial;
        createRecordQ.parameters[":category"] = song.category;
        createRecordQ.parameters[":tags"] = JSON.stringify(song.tags);
        createRecordQ.parameters[":lyrics"] = JSON.stringify(song.lyrics);
        createRecordQ.parameters[":youtube"] = song.youtube;
        createRecordQ.parameters[":author"] = song.author;
        createRecordQ.parameters[":notes"] = song.notes;
        createRecordQ.parameters[":copyright"] = song.copyright;
        createRecordQ.parameters[":sequence"] = song.sequence;
        createRecordQ.parameters[":chords"] = song.chords;
        createRecordQ.parameters[":key"] = song.key;
        createRecordQ.parameters[":bpm"] = song.bpm;
        createRecordQ.parameters[":timestamp"] = song.timestamp.getTime();

        createRecordQ.addEventListener(air.SQLEvent.RESULT, (evt: air.SQLEvent) => {
            const { lastInsertRowID } = addRecordQ.getResult();

            this.search([], (records, error) => {
                if (error) {
                    callback(null, error);
                    return;
                }

                this._records.length = 0;
                this._records.push(...records);

                songCategories.set(this.getAllCategories());
                songTags.set(this.getAllTags());

                {
                    const record = this.getRecordByIdCached(lastInsertRowID);

                    if (!record) {
                        throw new Error('Record not found in the cache');
                    }

                    callback(record, null);
                }

                this.onUpdate(records);
            });
        });
        createRecordQ.addEventListener(air.SQLErrorEvent.ERROR, (evt: air.SQLErrorEvent) => {
            console.error('DB add record error:', evt);
            callback(null, evt);
        });
        createRecordQ.execute();
    }

    public update(song: SongItem, callback: ResultCallback<SongItem>) {
        const { id } = song;

        const updateRecordQ = new air.SQLStatement();
        updateRecordQ.sqlConnection = this._dbConnection;

        // Update Query
        updateRecordQ.text = `
            UPDATE songs
            SET
                name = :name,
                title = :title,
                serial = :serial,
                category = :category,
                tags = :tags,
                lyrics = :lyrics,
                youtube = :youtube,
                author = :author,
                notes = :notes,
                copyright = :copyright,
                sequence = :sequence,
                chords = :chords,
                key = :key,
                bpm = :bpm,
                timestamp = :timestamp
            WHERE id = :id
        `;
        updateRecordQ.parameters[":id"] = id;

        updateRecordQ.parameters[":name"] = song.name;
        updateRecordQ.parameters[":title"] = song.title;
        updateRecordQ.parameters[":serial"] = song.serial;
        updateRecordQ.parameters[":category"] = song.category;
        updateRecordQ.parameters[":tags"] = JSON.stringify(song.tags);
        updateRecordQ.parameters[":lyrics"] = JSON.stringify(song.lyrics);
        updateRecordQ.parameters[":youtube"] = song.youtube;
        updateRecordQ.parameters[":author"] = song.author;
        updateRecordQ.parameters[":notes"] = song.notes;
        updateRecordQ.parameters[":copyright"] = song.copyright;
        updateRecordQ.parameters[":sequence"] = song.sequence;
        updateRecordQ.parameters[":chords"] = song.chords;
        updateRecordQ.parameters[":key"] = song.key;
        updateRecordQ.parameters[":bpm"] = song.bpm;
        updateRecordQ.parameters[":timestamp"] = song.timestamp.getTime();

        updateRecordQ.addEventListener(air.SQLEvent.RESULT, (evt: air.SQLEvent) => {
            this.search([], (records, error) => {
                if (error) {
                    callback(null, error);
                    return;
                }

                this._records.length = 0;
                this._records.push(...records);

                songCategories.set(this.getAllCategories());
                songTags.set(this.getAllTags());

                {
                    const record = this.getRecordByIdCached(id);

                    if (!record) {
                        throw new Error('Record not found in the cache');
                    }

                    callback(record, null);
                }

                this.onUpdate(records);
            });
        });
        updateRecordQ.addEventListener(air.SQLErrorEvent.ERROR, (evt: air.SQLErrorEvent) => {
            console.error('DB update record error:', evt);
            callback(null, evt);
        });
        updateRecordQ.execute();
    }

    public delete(song: SongItem, callback: ResultCallback<number>) {
        const { id } = song;

        const deleteRecordQ = new air.SQLStatement();
        deleteRecordQ.sqlConnection = this._dbConnection;

        // Delete Query
        deleteRecordQ.text = `
            DELETE FROM songs
            WHERE id = :id
        `;
        deleteRecordQ.parameters[":id"] = id;

        deleteRecordQ.addEventListener(air.SQLEvent.RESULT, (evt: air.SQLEvent) => {
            this._dbConnection.compact();

            const { rowsAffected } = deleteRecordQ.getResult();

            // cost-effective way to remove the record cache
            {
                const itemIndex = this.getRecordIndexByIdCached(id);

                if (itemIndex === -1) {
                    throw new Error('Record not found in the list');
                }

                this._records.splice(itemIndex, 1);

                this.onUpdate(this._records);
            }

            callback(rowsAffected, null);
        });
        deleteRecordQ.addEventListener(air.SQLErrorEvent.ERROR, (evt: air.SQLErrorEvent) => {
            console.error('DB delete record error:', evt);
            callback(null, evt);
        });
        deleteRecordQ.execute();
    }

    public deleteAll(callback: ResultCallback<number>): void;
    public deleteAll(categories: string[] = null, callback: ResultCallback<number>): void {
        if (typeof categories === 'function') {
            callback = categories;
            categories = null;
        }

        const deleteRecordsQ = new air.SQLStatement();
        deleteRecordsQ.sqlConnection = this._dbConnection;

        const qs = [
            'DELETE FROM songs',
        ]
        const params = deleteRecordsQ.parameters;

        if (categories && Array.isArray(categories) && categories.length > 0) {
            qs.push('WHERE');
            qs.push(categories.map((cat, i) => {
                params[`:param_${i}`] = cat;
                return `category = :param_${i}`;
            }).join(' OR '));
        }

        // DeleteMultiple Query
        deleteRecordsQ.text = qs.join(' ');

        deleteRecordsQ.addEventListener(air.SQLEvent.RESULT, (evt: air.SQLEvent) => {
            this._dbConnection.compact();

            const { rowsAffected } = deleteRecordsQ.getResult();

            this._records.length = 0;

            this.onUpdate(this._records);

            callback(rowsAffected, null);
        });
        deleteRecordsQ.addEventListener(air.SQLErrorEvent.ERROR, (evt: air.SQLErrorEvent) => {
            console.error('DB delete records error:', evt);
            callback(null, evt);
        });
        deleteRecordsQ.execute();
    }
}

export class _SongNavigator_ {
    private _activeItem: Optional<SongItem> = undefined;

    private readonly _records: SongItem[];

    private readonly _pagination: PaginationState = {
        page: 1,
        limit: 10,
    }

    constructor(
        private readonly manager: _SongManager_,
    ) {
        this._records = [];
    }

    onChange(activeItem: SongItem) {
        console.log('Song changed:', activeItem);
    }

    public applyFilters(filters: SearchFilter[], callback: ResultCallback<SongItem[]>) {
        // TODO: impl
    }

    public clearFilters() {
        // TODO: impl
    }

    public showSongCreateDialog() {
        // TODO: impl
    }

    public showSongEditDialog() {
        // TODO: impl
    }

    public select(item: SongItem) {
        this._activeItem = item;

        // TODO: impl
    }

    public delete(item: SongItem) {
        // TODO: impl
    }

    public deleteByCategory(category: string) {
        // TODO: impl
    }

    public getRecordsPerPage() {
        return this._pagination.limit;
    }

    public setRecordsPerPage(limit: number) {
        this._pagination.limit = limit;

        // TODO: update records
    }

    public nextPage() {
        this._pagination.page++;

        // TODO: update records
    }

    public prevPage() {
        this._pagination.page--;

        // TODO: update records
    }

    public gotoPage(page: number) {
        this._pagination.page = page;
    }

    public entries(copy: boolean = false) {
        return copy ? [...this._records] : this._records;
    }

    public present(item: SongItem, slideIndex: number = 0) {
        // TODO: impl
    }

    public addToSchedule(item: SongItem) {
        // TODO: impl
    }
}

// index based
interface BibleVerses {
    [book: number]: {
        [chapter: number]: {
            [verse: number]: string,
        }
    }
}

interface BibleVersion {
    id: number,
    name: string,
    lang: string,
    file: string,
    font: string,
    bookNames: string[],
    verses: BibleVerses,
    copyright: string,
}

export class _BibleManager_ {
    private readonly _versions: BibleVersion[];

    constructor() {
        this._versions = [];
    }

    public getVersions() {
        return this._versions;
    }

    public getVersionById(versionId: number) {
        for (const version of this._versions) {
            if (version.id === versionId) {
                return version;
            }
        }

        return null;
    }

    public getBookName(book: number, versionId: number) {
        const version = this.getVersionById(versionId);

        if (version) {
            return version.bookNames[book];
        }

        return null;
    }

    public addVersion(version: BibleVersion) {
        this._versions.push(version);
    }

    public clearVersions() {
        this._versions.length = 0;
    }
}

export class _BibleNavigator_ {
    private readonly _activeVersions: BibleVersion[];
    private readonly _activeVerse: [number, number, number] = [0, 0, 0];

    constructor(
        private readonly manager: _BibleManager_
    ) {
    }

    public getSelectedRefName(versionId: number): string {
        const [book, chapter, verse] = this._activeVerse;

        const bookName = this.manager.getBookName(book, versionId);

        if (bookName) {
            return `${bookName} ${chapter + 1}:${verse + 1}`;
        }

        return null;
    }

    onChange(ref: [number, number, number]) {
        console.log('Verse changed:', ref);
    }

    public activateVersion(versionId: number) {
        const version = this.manager.getVersionById(versionId);

        if (version) {
            this._activeVersions.push(version);
        } else {
            throw new Error(`Version with ID ${versionId} not found`);
        }
    }

    public deactivateVersion(versionId: number) {
        const version = this.manager.getVersionById(versionId);

        if (version) {
            const index = this._activeVersions.indexOf(version);

            if (index !== -1) {
                this._activeVersions.splice(index, 1);
            }
        } else {
            throw new Error(`Version with ID ${versionId} not found`);
        }
    }

    public deactivateAllVersions() {
        this._activeVersions.length = 0;
    }

    public search(query: string, callback: ResultCallback<any[]>) {
        // TODO: impl
    }

    public select(book: number): void;
    public select(book: number, chapter: number): void;
    public select(book: number, chapter: number, verse: number): void {
        book ||= 0;
        chapter ||= 0;
        verse ||= 0;

        this._activeVerse[0] = book;
        this._activeVerse[1] = chapter;
        this._activeVerse[2] = verse;

        this.onChange(this._activeVerse);

        // TODO: impl
    }
}

export class _Presenter_ {
    constructor(
        private readonly song: _SongManager_,
        private readonly bible: _BibleManager_,
    ) {
    }

    public presentSong(item: SongItem, slideIndex: number = 0) {
        // TODO: impl
    }

    public presentVerse(book: number, chapter: number, verse: number) {
        // TODO: impl
    }

    public nextSlide() {
        // TODO: impl
    }

    public prevSlide() {
        // TODO: impl
    }

    public nextVerse() {
        // TODO: impl
    }

    public prevVerse() {
        // TODO: impl
    }

    public blank() {
        // TODO: impl
    }

    public close() {
        // TODO: impl
    }
}

function processImportSongDB() {
    const IS_DEBUG = false;

    let dbFile = null;
    let sqlConn = null;

    let startDir = air.File.desktopDirectory;
    const fileFilters = [
        new air.FileFilter("VerseVIEW Song DB", "*.db"),
    ];
    startDir.browseForOpen("Select Song DB", fileFilters);
    startDir.addEventListener(air.Event.SELECT, function(e) {
        dbFile = e.target;
        __debug(dbFile.nativePath);
        openDB();
    });

    function __debug(t) {
        if (IS_DEBUG) {
            console.trace("[SongImportManager]...." + t);
        }
    }

    function openDB() {
        sqlConn = new air.SQLConnection();
        sqlConn.addEventListener(air.SQLEvent.OPEN, function(_) {
            __debug("DB was created successfully");
            dbInit();
        });
        sqlConn.addEventListener(air.SQLErrorEvent.ERROR, function(e) {
            __debug("Error message:" + e.error.message);
            __debug("Details (create DB):" + e.error.details);
        });
        sqlConn.openAsync(dbFile);
    }

    function dbInit() {
        __debug(" Creating song import Manager table...");

        const sqlStmt = new air.SQLStatement();
        sqlStmt.sqlConnection = sqlConn;
        sqlStmt.text = `CREATE TABLE IF NOT EXISTS sm (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, cat TEXT, font TEXT, bkgndfname TEXT, key TEXT, copy TEXT, notes TEXT, lyrics TEXT)`;
        sqlStmt.addEventListener(air.SQLEvent.RESULT, onResult);
        sqlStmt.addEventListener(air.SQLErrorEvent.ERROR, onError);
        sqlStmt.execute();

        function onResult() {
            sqlStmt.removeEventListener(air.SQLEvent.RESULT, onResult);
            sqlStmt.removeEventListener(air.SQLErrorEvent.ERROR, onError);
            __debug("Song Import Table created.....");
            getAllSongs();
        }

        function onError(e) {
            sqlStmt.removeEventListener(air.SQLEvent.RESULT, onResult);
            sqlStmt.removeEventListener(air.SQLErrorEvent.ERROR, onError);
            __debug("Error message:" + e.error.message);
            __debug("Details in creating table :" + e.error.details);
        }
    }

    function getAllSongs() {
        __debug("Getting ALL Data from Song Import DB");

        const sqlStmt = new air.SQLStatement();
        sqlStmt.sqlConnection = sqlConn;
        sqlStmt.text = "SELECT * FROM sm ORDER BY name ASC";
        sqlStmt.addEventListener(air.SQLEvent.RESULT, onResult);
        sqlStmt.addEventListener(air.SQLErrorEvent.ERROR, onError);
        sqlStmt.execute();

        function onResult(_) {
            __debug("Successfully got all data from Song Import DB");
            const g = sqlStmt.getResult();
            $RvW.songManagerObj.addImportSongs(g);
        }

        function onError(_) {
            __debug("Song Import Manager data error...");
        }
    }
}

function splitIN2(slides: string[]): string[] {
    const result: string[] = [];

    for (const slide of slides) {
        const blank = isBlank(slide);
        const lines = slide.split("<BR>");

        let ln = "";
        let i = 1;

        if (!blank) {
            for (const line of lines) {
                if (i === 2) {
                    ln = ln + line;
                    result.push(ln);
                    ln = "";
                    i = 1;
                } else {
                    ln = `${ln + line}<BR>`;
                    i++;
                }
            }
            if (i === 2) {
                result.push(ln);
            }
        } else {
            result.push(ln);
        }
    }

    return result;
}

export class SongManager {
    constructor() {
        this.addSong = addSong;
        this.updateSong = updateSong;
        this.deleteSong = deleteSong;
        this.deleteSongByCat = deleteSongByCat;
        this.delCatManagedUpdate = delCatManagedUpdate;
        this.getSongObj = getSongObj;
        this.getSongsFromCat = getSongsFromCat;
        this.get_sm_cat_records = get_sm_cat_records;
        this.getFontList = getFontList;
        this.searchRecords = searchRecords;
        this.processImportSongDB = processImportSongDB;
        this.processExportSongXML = processExportSongXML;
        this.processExportCatXML = processExportCatXML;
        this.processImportSongXML = processImportSongXML;
        this.addImportSongs = addImportSongs;
        this.getSongObjWithID = getSongObjWithID;
        this.getSongObjWithName = getSongObjWithName;
        this.getSongID = getSongID;
        this.checkSongExists = checkSongExists;
        this.checkSongExistsInCat = checkSongExistsInCat;
        this.getAllTitlesForWeb = getAllTitlesForWeb;
        this.test2_updateRecords = test2_updateRecords;
        this.test2_getOrgsonglist = test2_getOrgsonglist;

        const IS_DEBUG = true;

        var ax = false;
        var ad = "./song/default.db";
        var m_sqlConnection = null;
        var aA = null;
        var ab = "ALL";
        var av = new Song();
        var az = [];
        var ae = [];
        var ap = [];
        var m;
        var K;
        var x;
        var v;
        var L;
        var k;
        var am;
        var P;
        var J;
        var W;
        var au;
        var b;
        var an;
        var u;
        var R;
        var ac;
        var aM;
        var af;
        var ao;
        var songz = [];
        var songx = [];
        var songy = [];
        var aq = null;
        var aj = null;
        var _importProgressPanel = null;
        var T = 0;

        setupImpProgPanel();
        setupDB();

        function setupImpProgPanel() {
            __debug("Generating ProgressPanel");
            _importProgressPanel = new YAHOO.widget.Panel("panelObj2xx", {
                width: "400px",
                fixedcenter: true,
                modal: true,
                visible: false,
                constraintoviewport: true,
            });
            _importProgressPanel.render(document.body);
            _importProgressPanel.setHeader("Song Import Progress");
            _importProgressPanel.setBody('<span id="total"></span> songs remaining');
            _importProgressPanel.hide();
        }

        function ay(aQ) {
            var aN = "";
            var aP = aQ.length;
            for (var aO = 0; aO < aP; aO++) {
                aN = aN + aQ[aO] + "<slide>";
            }
            return aN;
        }

        function D(aR) {
            var aQ = aR.split("<slide>");
            aQ.splice(aQ.length - 1, 1);
            if ($RvW.vvConfigObj.get_hideStanzaNumber()) {
                for (var aP = 0; aP < aQ.length; aP++) {
                    aQ[aP] = aQ[aP].replace(/^-?[0-9]*\.?[0-9]+/, "");
                }
            }
            if ($RvW.vvConfigObj.get_show2lines()) {
                aQ = splitIN2(aQ);
            }
            return aQ;
        }

        function j(aQ, aP) {
            var aN = aQ.length;
            var aO = [];
            for (var aR = 0; aR < aN; aR++) {
                if (aP[aR] == null) {
                    aO.push("");
                } else {
                    aO.push(aP[aR]);
                }
            }
            return aO;
        }

        function n() {
            var aO = songz.length;
            for (var aN = 0; aN < aO; aN++) {
                az[aN] = songz[aN].name;
                ae[aN] = songz[aN].id;
            }
        }

        function addSong(Obj, aP, isImporting) {
            m = Obj.name;
            K = Obj.catIndex;
            x = Obj.font;
            v = Obj.font2;
            L = Obj.timestamp;
            k = Obj.yvideo;
            am = Obj.bkgnd_fname;
            P = Obj.key;
            J = Obj.copyright;
            W = Obj.notes;
            if (isImporting) {
                au = Obj.slides;
                b = Obj.slides2;
            } else {
                au = ay(Obj.slides);
                b = ay(Obj.slides2);
            }
            an = Obj.name2;
            u = Obj.tags;
            R = Obj.slideseq;
            ac = Obj.rating;
            aM = Obj.chordsavailable;
            af = Obj.usagecount;
            ao = Obj.subcat;
            s(aP, isImporting);
        }

        function updateSong(aN, aO, aR, aS) {
            var aP = null;
            var aQ;
            if (aS == null) {
                aQ = false;
            } else {
                aQ = aS;
            }
            if (aR == null) {
                if (aQ) {
                    aP = songx[aO].id;
                } else {
                    aP = songz[aO].id;
                }
            } else {
                aP = aR;
            }
            __debug("Primary key of the song that is being saved after edit... " + aP);
            m = aN.name;
            K = aN.catIndex;
            x = aN.font;
            v = aN.font2;
            L = aN.timestamp;
            k = aN.yvideo;
            am = aN.bkgnd_fname;
            P = aN.key;
            J = aN.copyright;
            W = aN.notes;
            au = ay(aN.slides);
            b = ay(aN.slides2);
            an = aN.name2;
            u = aN.tags;
            R = aN.slideseq;
            ac = aN.rating;
            aM = aN.chordsavailable;
            af = aN.usagecount;
            ao = aN.subcat;
            Q(aP);
        }

        function deleteSong(aN, aO) {
            let aP;
            if (aO) {
                aP = songx[aN].id;
            } else {
                aP = songz[aN].id;
            }
            X(aP);
        }

        function deleteSongByCat(aN) {
            y(aN);
        }

        /**
         * @param {number} songId
         */
        function getSongObjWithID(songId) {
            for (const item of songz) {
                if (item.id === parseInt(songId)) {
                    const so = new Song();

                    so.id = item.id;
                    so.name = item.name;
                    so.catIndex = item.cat;
                    so.font = item.font;
                    so.font2 = item.font2;
                    so.timestamp = item.timestamp;
                    so.yvideo = item.yvideo;
                    so.bkgnd_fname = item.bkgndfname;
                    so.key = item.key;
                    so.copyright = item.copy;
                    so.notes = item.notes;
                    so.slides = D(item.lyrics);
                    const aO = item.lyrics2;
                    so.slides2 = aO != null ? D(aO) : [];
                    so.slides2 = j(so.slides, so.slides2);
                    so.name2 = item.title2;
                    so.tags = item.tags;
                    so.slideseq = item.slideseq;
                    so.rating = item.rating;
                    so.chordsavailable = item.chordsavailable;
                    so.usagecount = item.usagecount;
                    so.subcat = item.subcat;

                    return so;
                }
            }

            __debug("Song not found with ID: " + songId);

            return null;
        }

        function getSongObjWithName(aQ) {
            var aP = false;
            var aS = new Song();
            aS.slides = [];
            var aN = songz.length;
            for (var aR = 0; aR < aN; aR++) {
                if (songz[aR].name == aQ) {
                    aS.id = songz[aR].id;
                    aS.name = songz[aR].name;
                    aS.catIndex = songz[aR].cat;
                    aS.font = songz[aR].font;
                    aS.font2 = songz[aR].font2;
                    aS.timestamp = songz[aR].timestamp;
                    aS.yvideo = songz[aR].yvideo;
                    aS.bkgnd_fname = songz[aR].bkgndfname;
                    aS.key = songz[aR].key;
                    aS.copyright = songz[aR].copy;
                    aS.notes = songz[aR].notes;
                    aS.slides = D(songz[aR].lyrics);
                    var aO = songz[aR].lyrics2;
                    aS.slides2 = aO != null ? D(aO) : [];
                    aS.slides2 = j(aS.slides, aS.slides2);
                    aS.name2 = songz[aR].title2;
                    aS.tags = songz[aR].tags;
                    aS.slideseq = songz[aR].slideseq;
                    aS.rating = songz[aR].rating;
                    aS.chordsavailable = songz[aR].chordsavailable;
                    aS.usagecount = songz[aR].usagecount;
                    aS.subcat = songz[aR].subcat;
                    aP = true;
                    break;
                }
            }
            if (aP) {
                return aS;
            } else {
                return null;
            }
        }

        function getSongID(aO, aP) {
            var aN = 0;
            if (!aP) {
                aN = songz[aO].id;
            } else {
                aN = songx[aO].id;
            }
            return aN;
        }

        function getSongObj(aO, aQ) {
            var aP = new Song();
            aP.slides = [];
            if (!aQ) {
                aP.id = songz[aO].id;
                aP.name = songz[aO].name;
                aP.catIndex = songz[aO].cat;
                aP.font = songz[aO].font;
                aP.font2 = songz[aO].font2;
                aP.timestamp = songz[aO].timestamp;
                aP.yvideo = songz[aO].yvideo;
                aP.bkgnd_fname = songz[aO].bkgndfname;
                aP.key = songz[aO].key;
                aP.copyright = songz[aO].copy;
                aP.notes = songz[aO].notes;
                aP.slides = D(songz[aO].lyrics);
                var aN = songz[aO].lyrics2;
                aP.slides2 = aN != null ? D(aN) : [];
                aP.slides2 = j(aP.slides, aP.slides2);
                aP.name2 = songz[aO].title2;
                aP.tags = songz[aO].tags;
                aP.slideseq = songz[aO].slideseq;
                aP.rating = songz[aO].rating;
                aP.chordsavailable = songz[aO].chordsavailable;
                aP.usagecount = songz[aO].usagecount;
                aP.subcat = songz[aO].subcat;
            } else {
                aP.name = songx[aO].name;
                aP.catIndex = songx[aO].cat;
                aP.font = songx[aO].font;
                aP.font2 = songx[aO].font2;
                aP.timestamp = songx[aO].timestamp;
                aP.yvideo = songx[aO].yvideo;
                aP.bkgnd_fname = songx[aO].bkgndfname;
                aP.key = songx[aO].key;
                aP.copyright = songx[aO].copy;
                aP.notes = songx[aO].notes;
                aP.slides = D(songx[aO].lyrics);
                var aN = songx[aO].lyrics2;
                aP.slides2 = aN != null ? D(aN) : [];
                aP.slides2 = j(aP.slides, aP.slides2);
                aP.name2 = songx[aO].title2;
                aP.tags = songx[aO].tags;
                aP.slideseq = songx[aO].slideseq;
                aP.rating = songx[aO].rating;
                aP.chordsavailable = songx[aO].chordsavailable;
                aP.usagecount = songx[aO].usagecount;
                aP.subcat = songx[aO].subcat;
            }
            return aP;
        }

        function getSongsFromCat(aN) {
            ab = aN;
            __debug("In getSongsFromCat function " + aN);
            $RvW.songNavObj.update_songList({ data: songz }, aN);
        }

        function aK() {
            var aN = songz.length;
            var aO = "";
            for (var aP = 0; aP < aN; aP++) {
                aO += songz[aP].name + "|" + songz[aP].cat + "\n";
            }
            var aQ = "./song/songlist.txt";
            saveFileInAppStorage(aO, aQ);
        }

        function get_sm_cat_records() {
            return aq;
        }

        function d() {
            for (let i = 0; i < songy.length; i++) {
                ap[i] = songy[i].font;
            }
        }

        function getFontList() {
            return ap;
        }

        function processImportSongXML() {
            const spx = new SongExporter(songz, null, null, 1);
            spx.importXML();
        }

        function processExportSongXML() {
            const spx = new SongExporter(songz, null, null, 1);
            spx.exportAll();
        }

        function processExportCatXML() {
            const spx = new SongExporter(songz, ab, null, 2);
            spx.exportByCat();
        }

        function addImportSongs(aN) {
            var aO = aN.data.length;
            for (var aP = 0; aP < aO; aP++) {
                var aQ = checkSongExists(aN.data[aP].name);
                if (!aQ) {
                    m = aN.data[aP].name;
                    au = aN.data[aP].lyrics;
                    b = aN.data[aP].lyrics2;
                    J = aN.data[aP].copy;
                    K = aN.data[aP].cat;
                    x = aN.data[aP].font;
                    v = aN.data[aP].font2;
                    L = aN.data[aP].timestamp;
                    k = aN.data[aP].yvideo;
                    P = aN.data[aP].key;
                    W = aN.data[aP].notes;
                    am = "";
                    if (aP != aO - 1) {
                        s(false, true);
                    } else {
                        s(true, true);
                    }
                }
            }
        }

        function checkSongExists(aO) {
            var aN = songz.length;
            for (var aP = 0; aP < aN; aP++) {
                if (songz[aP].name == aO) {
                    return true;
                }
            }
            return false;
        }

        function checkSongExistsInCat(aP, aN) {
            var aO = songz.length;
            for (var aQ = 0; aQ < aO; aQ++) {
                var aS = songz[aQ].name;
                var aR = songz[aQ].cat;
                if (aS == aP && aR == aN) {
                    return true;
                }
            }
            return false;
        }

        function __debug(...aN) {
            if (IS_DEBUG) {
                console.trace("[SongManager]....", ...aN);
            }
        }

        function setupDB() {
            m_sqlConnection = new air.SQLConnection();
            m_sqlConnection.addEventListener(air.SQLEvent.OPEN, onDbConnect);
            m_sqlConnection.addEventListener(air.SQLErrorEvent.ERROR, onDbConnectError);
            var aN = air.File.applicationStorageDirectory.resolvePath(ad);
            m_sqlConnection.openAsync(aN);
        }

        function onDbConnect(aN) {
            __debug("DB was created successfully");
            ax = true;
            ensureSchema();
        }

        function onDbConnectError(aN) {
            __debug("Error message:" + aN.error.message);
            __debug("Details (create DB):" + aN.error.details);
            ax = false;
            Toast.error(
                "Song Database",
                "Error opening Song Database : " + aN.error.message
            );
        }

        function alterSongTable(aO, aQ) {
            __debug("Updating the Song database TABLE: " + aO + " " + aQ);
            const aS = new air.SQLStatement();
            aS.sqlConnection = m_sqlConnection;
            aS.text = `ALTER TABLE sm ADD COLUMN ${aO} ${aQ}`;
            aS.addEventListener(air.SQLEvent.RESULT, aP);
            aS.addEventListener(air.SQLErrorEvent.ERROR, aN);
            aS.execute();
            function aP() {
                __debug("Updating table worked !!!...");
            }
            function aN() {
                __debug("Failed updating table...");
                __debug("Error message:" + event.error.message);
                __debug("Details in creating table :" + event.error.details);
            }
        }

        function ensureSchema() {
            __debug("Creating song table...");
            aA = new air.SQLStatement();
            aA.sqlConnection = m_sqlConnection;
            aA.text = "CREATE TABLE IF NOT EXISTS sm (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, cat TEXT, font TEXT, font2 TEXT, timestamp TEXT, yvideo TEXT, bkgndfname TEXT, key TEXT, copy TEXT, notes TEXT, lyrics TEXT lyrics2 TEXT title2 TEXT tags TEXT slideseq TEXT rating INTEGER chordsavailable Boolean usagecount INTEGER subcat TEXT )";
            aA.addEventListener(air.SQLEvent.RESULT, onEnsureSchemaResult);
            aA.addEventListener(air.SQLErrorEvent.ERROR, onEnsureSchemaError);
            aA.execute();
        }

        function onEnsureSchemaResult() {
            aA.removeEventListener(air.SQLEvent.RESULT, onEnsureSchemaResult);
            aA.removeEventListener(air.SQLErrorEvent.ERROR, onEnsureSchemaError);
            __debug("Notes Table created.....");
            let songDBVersion = $RvW.vvConfigObj.get_songDBVersion();
            __debug("Song DB version " + songDBVersion);
            if (songDBVersion < 2) {
                alterSongTable("title2", "TEXT");
                alterSongTable("tags", "TEXT");
                alterSongTable("slideseq", "TEXT");
                alterSongTable("rating", "INTEGER");
                alterSongTable("chordsavailable", "Boolean");
                alterSongTable("usagecount", "INTEGER");
                alterSongTable("subcat", "TEXT");
                $RvW.vvConfigObj.set_songDBVersion(2);
                $RvW.vvConfigObj.save();
            }
            if (!isUpToDate() && task1Status() === false) {
                delCatManagedUpdate();
            } else {
                C();
                F();
                _loadSongsFromDB();
            }
        }

        function onEnsureSchemaError(aN) {
            aA.removeEventListener(air.SQLEvent.RESULT, onEnsureSchemaResult);
            aA.removeEventListener(air.SQLErrorEvent.ERROR, onEnsureSchemaError);
            __debug("Error message:" + aN.error.message);
            __debug("Details in creating table :" + aN.error.details);
        }

        function aD() {
            ax = false;
        }

        function s(aN, isImporting) {
            if (T === 0) {
                _importProgressPanel.show();
            }
            const aP = new air.SQLStatement();
            aP.sqlConnection = m_sqlConnection;
            let aS = `
INSERT INTO sm (
        name, cat, font, font2, timestamp, yvideo, bkgndfname, key, copy,
        notes, lyrics, lyrics2, title2, tags, slideseq, rating, chordsavailable, usagecount, subcat
)  SELECT
       :n, :cat, :fon, :fon2, :ts, :yv, :bkg, :key, :cop, :not, :lyr, :lyr2, :n2, :tag, :seq,
       :rate, :chords, :count, :subcat
`;
            if (!aN) {
                aS += " WHERE NOT EXISTS (SELECT 1 FROM sm WHERE name = :n AND cat = :cat)";
            }
            aP.text = aS;
            aP.parameters[":n"] = m;
            aP.parameters[":cat"] = K;
            aP.parameters[":fon"] = x;
            aP.parameters[":fon2"] = v;
            aP.parameters[":ts"] = L;
            aP.parameters[":yv"] = k;
            aP.parameters[":bkg"] = am;
            aP.parameters[":key"] = P;
            aP.parameters[":cop"] = J;
            aP.parameters[":not"] = W;
            aP.parameters[":lyr"] = au;
            aP.parameters[":lyr2"] = b;
            aP.parameters[":n2"] = an;
            aP.parameters[":tag"] = u;
            aP.parameters[":seq"] = R;
            aP.parameters[":rate"] = ac;
            aP.parameters[":chords"] = aM;
            aP.parameters[":count"] = af;
            aP.parameters[":subcat"] = ao;
            aP.addEventListener(air.SQLEvent.RESULT, aO);
            aP.addEventListener(air.SQLErrorEvent.ERROR, aQ);
            T++;
            aP.execute();

            function aO() {
                T--;
                if (T % 10 === 0) {
                    document.getElementById("total").innerHTML = T;
                }
                aP.removeEventListener(air.SQLEvent.RESULT, aO);
                aP.removeEventListener(air.SQLErrorEvent.ERROR, aQ);
                if (isImporting) {
                    if (T === 0) {
                        _importProgressPanel.hide();
                        Toast.success(
                            "Song Database",
                            "Song Lyrics imported to the Song Database complete."
                        );
                        if (!isUpToDate()) {
                            Toast.info("Songs", "Imported song database");
                            task1Complete();
                            checkVerUpdateFlags();
                        }
                        C();
                        F();
                        _loadSongsFromDB();
                    }
                }
                if (aN) {
                    __debug("UPDATE UI Flag....");
                    const aU = aP.getResult();
                    const aT = aU.lastInsertRowID;
                    C();
                    F();
                    _loadSongsFromDB();
                    if (isImporting) {
                        Toast.success(
                            "Song Database",
                            "Song Lyrics imported to the Song Database"
                        );
                    } else {
                        Toast.success(
                            "Song Database",
                            'Song "' + m + '" added to the Song Database.'
                        );
                    }
                }
                if (T === 0) {
                    __debug("Record count done.. ");
                    _importProgressPanel.hide();
                }
            }

            function aQ(aU) {
                T--;
                aP.removeEventListener(air.SQLEvent.RESULT, aO);
                aP.removeEventListener(air.SQLErrorEvent.ERROR, aQ);
                Toast.error(
                    "ADD EDIT Song",
                    "Failed to update song database.  Error message:" + aU.error.message
                );
                if (!isUpToDate() && T === 0) {
                    const aT = $RvW.vvConfigObj.get_songDBVersion();
                    if (aT === 2) {
                        $RvW.vvConfigObj.set_songDBVersion(1);
                        $RvW.vvConfigObj.save();
                        Toast.error(
                            "ADD EDIT Song",
                            "Failed to update song database. Please restart VerseVIEW Error message:" +
                            aU.error.message
                        );
                    }
                }
            }
        }

        function Q(aN) {
            const aO = new air.SQLStatement();
            aO.sqlConnection = m_sqlConnection;
            aO.text = `
UPDATE sm 
SET name=:n,cat=:cat,font=:fon,font2=:fon2,timestamp=:ts,yvideo=:yv,bkgndfname=:bkg,key=:key,
    copy=:cop,notes=:not,lyrics=:lyr,lyrics2=:lyr2, title2=:n2, tags=:tag, slideseq=:seq,
    rating=:rate, chordsavailable=:chords, usagecount=:count,subcat=:subcat 
WHERE id=:id;
`;
            aO.parameters[":id"] = aN;
            aO.parameters[":n"] = m;
            aO.parameters[":cat"] = K;
            aO.parameters[":fon"] = x;
            aO.parameters[":fon2"] = v;
            aO.parameters[":ts"] = L;
            aO.parameters[":yv"] = k;
            aO.parameters[":bkg"] = am;
            aO.parameters[":key"] = P;
            aO.parameters[":cop"] = J;
            aO.parameters[":not"] = W;
            aO.parameters[":lyr"] = au;
            aO.parameters[":lyr2"] = b;
            aO.parameters[":n2"] = an;
            aO.parameters[":tag"] = u;
            aO.parameters[":seq"] = R;
            aO.parameters[":rate"] = ac;
            aO.parameters[":chords"] = aM;
            aO.parameters[":count"] = af;
            aO.parameters[":subcat"] = ao;
            aO.addEventListener(air.SQLEvent.RESULT, function(aS) {
                $RvW.songNavObj.sn_backupGlobalID();
                C();
                F();
                _loadSongsFromDB();
                Toast.info("Song Database", 'Song "' + m + '" updated.');
            });
            aO.addEventListener(air.SQLErrorEvent.ERROR, function aQ(e) {
                __debug("UPDATE error:" + e.error);
                __debug("event.error.code:" + e.error.code);
                __debug("event.error.message:" + e.error.message);
            });
            aO.execute();
        }

        function _loadSongsFromDB() {
            __debug("Getting ALL Data from Song DB");

            const sqlStatement = new air.SQLStatement();
            sqlStatement.sqlConnection = m_sqlConnection;

            sqlStatement.text = "SELECT * FROM sm ORDER BY name ASC";

            sqlStatement.addEventListener(air.SQLEvent.RESULT, onResult);
            sqlStatement.addEventListener(air.SQLErrorEvent.ERROR, onError);
            sqlStatement.execute();

            function onResult(_) {
                const { data } = sqlStatement.getResult();
                songz = data ?? [];
                __debug("Successfully got all data from Song DB");
                a();
                $RvW.songNavObj.update_songList({ data: songz }, "ALL");
            }
            function onError(e) {
                __debug("Song Manager data error...");
                __debug("Error message:" + e.error.message);
                __debug("Error details :" + e.error.details);
            }
        }

        function getAllTitlesForWeb(query, callback) {
            __debug("Getting ALL Titles from Song DB");

            const sqlStatement = new air.SQLStatement();
            sqlStatement.sqlConnection = m_sqlConnection;
            sqlStatement.text = "SELECT * FROM sm ORDER BY name ASC";
            sqlStatement.addEventListener(air.SQLEvent.RESULT, function onResult() {
                __debug("Succesfuly got all data from Song DB");
                callback(null, $RvW.songNavObj.get_songList(sqlStatement.getResult(), "ALL", query));
            });
            sqlStatement.addEventListener(air.SQLErrorEvent.ERROR, function onError(aS) {
                __debug("Song Manager data error...");
                callback(aS);
            });
            sqlStatement.execute();
        }

        function C() {
            __debug("Getting ALL Categories from Song DB");
            const aP = new air.SQLStatement();
            aP.sqlConnection = m_sqlConnection;
            aP.text = "SELECT DISTINCT cat FROM sm ORDER BY cat ASC";
            aP.addEventListener(air.SQLEvent.RESULT, aO);
            aP.addEventListener(air.SQLErrorEvent.ERROR, aN);
            aP.execute();

            function aO(aR) {
                __debug("Successfully got all categories from Song DB");
                aq = aP.getResult();
                $RvW.songNavObj.update_CategoryList(aq.data);
            }

            function aN(aR) {
                __debug("Song Manager data error while trying to get category...");
            }
        }

        function F() {
            __debug("Getting ALL Unique Fonts from Song DB");
            const aP = new air.SQLStatement();
            aP.sqlConnection = m_sqlConnection;
            aP.text = "SELECT DISTINCT font FROM sm ORDER BY font ASC";
            aP.addEventListener(air.SQLEvent.RESULT, aO);
            aP.addEventListener(air.SQLErrorEvent.ERROR, aN);
            aP.execute();

            function aO(aR) {
                __debug("Successfully got all fonts from Song DB");
                const { data } = aP.getResult();
                songy = data ?? [];
                d();
            }

            function aN(aR) {
                __debug("Song Manager data error while trying to get fonts...");
            }
        }

        function searchRecords(aP, type, cb = null) {
            __debug("Searching Song DB | type: " + type);

            const sqlQuery = new air.SQLStatement();
            sqlQuery.sqlConnection = m_sqlConnection;
            sqlQuery.addEventListener(air.SQLEvent.RESULT, _onSqlResult);
            sqlQuery.addEventListener(air.SQLErrorEvent.ERROR, _onSqlError);

            let qqq = "";
            switch (type) {
                case SongSearchType.TITLE: {
                    qqq = "SELECT * FROM sm WHERE name LIKE :param1 OR title2 LIKE :param1";
                    sqlQuery.parameters[":param1"] = aP;
                    break;
                }
                case SongSearchType.LYRICS: {
                    qqq = "SELECT * FROM sm WHERE lyrics LIKE :param1 OR lyrics2 LIKE :param1 OR name LIKE :param1 OR subcat == :param2";
                    sqlQuery.parameters[":param1"] = aP;
                    sqlQuery.parameters[":param2"] = aP.replace(/%/gi, "");
                    break;
                }
                case SongSearchType.TAGS: {
                    qqq = "SELECT * FROM sm WHERE tags LIKE :param1";
                    sqlQuery.parameters[":param1"] = aP;
                    break;
                }
                case SongSearchType.CATEGORY: {
                    qqq = "SELECT * FROM sm WHERE cat LIKE :param1";
                    sqlQuery.parameters[":param1"] = aP;
                    break;
                }
                case SongSearchType.AUTHOR: {
                    qqq = "SELECT * FROM sm WHERE copy LIKE :param1";
                    sqlQuery.parameters[":param1"] = aP;
                    break;
                }
                case SongSearchType.NUMBER: {
                    qqq = "SELECT * FROM sm WHERE subcat LIKE :param1";
                    sqlQuery.parameters[":param1"] = aP;
                    break;
                }
                case SongSearchType.KEY: {
                    qqq = "SELECT * FROM sm WHERE key = :param1";
                    sqlQuery.parameters[":param1"] = aP;
                    break;
                }
                default: {
                    throw new Error("Invalid search type...");
                }
            }
            sqlQuery.text = qqq;
            sqlQuery.execute();
            function _onSqlResult(aU) {
                sqlQuery.removeEventListener(air.SQLEvent.RESULT, _onSqlResult);
                sqlQuery.removeEventListener(air.SQLErrorEvent.ERROR, _onSqlError);

                const { data } = sqlQuery.getResult();
                songx = data ?? [];
                if (type === SongSearchType.TAGS && data == null) {
                    removeTag(aP.split("%")[1]);
                    Toast.error("Song Tag Search", "No matching tag");
                } else {
                    if (aP.length > 2) {
                        $RvW.wordbrain.findRecordBy_wordin(aP);
                    }
                    $RvW.songNavObj.searchComplete({data}, type);
                }
            }
            function _onSqlError(aU) {
                sqlQuery.removeEventListener(air.SQLEvent.RESULT, _onSqlResult);
                sqlQuery.removeEventListener(air.SQLErrorEvent.ERROR, _onSqlError);
                __debug("Song Manager search data error...");
                alert("Search function failed.");
            }
        }

        function X(id) {
            __debug("Deleting record with keyValue as primary key from Song Database...");

            const aP = new air.SQLStatement();
            aP.sqlConnection = m_sqlConnection;
            aP.text = "DELETE FROM sm WHERE id = :id;";
            aP.addEventListener(air.SQLEvent.RESULT, onResult);
            aP.addEventListener(air.SQLErrorEvent.ERROR, onError);
            aP.parameters[":id"] = id;
            aP.execute();

            function onResult(aS) {
                aP.removeEventListener(air.SQLEvent.RESULT, insertResult);
                aP.removeEventListener(air.SQLErrorEvent.ERROR, insertError);
                C();
                F();
                _loadSongsFromDB();
            }
            function onError(aS) {
                aP.removeEventListener(air.SQLEvent.RESULT, insertResult);
                aP.removeEventListener(air.SQLErrorEvent.ERROR, insertError);
                __debug("Error deleting song DB");
                __debug("event.error.code:" + aS.error.code);
                __debug("event.error.message:" + aS.error.message);
            }
        }

        function y(cat) {
            __debug("Deleting records based on category from Song Database...");
            const aQ = new air.SQLStatement();
            aQ.sqlConnection = m_sqlConnection;
            aQ.text = "DELETE FROM sm WHERE cat = :cat;";
            aQ.addEventListener(air.SQLEvent.RESULT, onResult);
            aQ.addEventListener(air.SQLErrorEvent.ERROR, onError);
            aQ.parameters[":cat"] = cat;
            aQ.execute();
            function onResult(aS) {
                aQ.removeEventListener(air.SQLEvent.RESULT, onResult);
                aQ.removeEventListener(air.SQLErrorEvent.ERROR, onError);
                m_sqlConnection.compact();
                C();
                F();
                _loadSongsFromDB();
            }
            function onError(aS) {
                aQ.removeEventListener(air.SQLEvent.RESULT, onResult);
                aQ.removeEventListener(air.SQLErrorEvent.ERROR, onError);
                __debug("Error deleting song DB");
                __debug("event.error.code:" + aS.error.code);
                __debug("event.error.message:" + aS.error.message);
            }
        }

        function delCatManagedUpdate() {
            __debug("Deleting Category for managed update from Song Database...");
            var aP = new air.SQLStatement();
            aP.sqlConnection = m_sqlConnection;
            aP.text = "DELETE FROM sm WHERE cat = :cat1 OR cat = :cat2 OR cat = :cat3;";
            aP.addEventListener(air.SQLEvent.RESULT, aN);
            aP.addEventListener(air.SQLErrorEvent.ERROR, aO);
            aP.parameters[":cat1"] = "VV Malayalam 2021";
            aP.parameters[":cat2"] = "VV Hindi 2021";
            aP.parameters[":cat3"] = "VV Tamil 2021";
            aP.execute();
            function aN(aR) {
                aP.removeEventListener(air.SQLEvent.RESULT, aN);
                aP.removeEventListener(air.SQLErrorEvent.ERROR, aO);
                setTimeout(function () {
                    g();
                    m_sqlConnection.compact();
                }, 3000);
            }
            function aO(aR) {
                aP.removeEventListener(air.SQLEvent.RESULT, aN);
                aP.removeEventListener(air.SQLErrorEvent.ERROR, aO);
                __debug("Error deleting song DB category");
                __debug("event.error.code:" + aR.error.code);
                __debug("event.error.message:" + aR.error.message);
            }
        }

        function g() {
            __debug("about to copy new records...");
            const aP = air.File.applicationDirectory.resolvePath("./song/default.db");
            m_sqlConnection.addEventListener(air.SQLEvent.ATTACH, aQ);
            m_sqlConnection.addEventListener(air.SQLErrorEvent.ERROR, aO);
            m_sqlConnection.attach("newstuff", aP);
            function aQ(aR) {
                __debug("****** DB attach worked");
                aF();
            }
            function aO(aR) {
                __debug("Error message:" + aR.error.message);
                __debug("Details (Update Failed):" + aR.error.details);
            }
        }

        function aF() {
            __debug("Getting ALL Data from Original Song DB");
            const aP = new air.SQLStatement();
            aP.sqlConnection = m_sqlConnection;
            aP.text = "INSERT INTO sm SELECT NULL,name,cat,font,font2,timestamp,yvideo,bkgndfname,key,copy,notes,lyrics,lyrics2,title2,tags,slideseq,rating,chordsavailable,usagecount,subcat FROM newstuff.sm WHERE cat = :cat1 OR cat = :cat2 OR cat = :cat3";
            aP.addEventListener(air.SQLEvent.RESULT, aO);
            aP.addEventListener(air.SQLErrorEvent.ERROR, aN);
            aP.parameters[":cat1"] = "VV Malayalam 2021";
            aP.parameters[":cat2"] = "VV Hindi 2021";
            aP.parameters[":cat3"] = "VV Tamil 2021";
            aP.execute();
            function aO(aR) {
                __debug("Successfully got all data from Original Song DB and inserted");
                if (!isUpToDate()) {
                    Toast.info("Songs", "Updated song database");
                    task1Complete();
                    checkVerUpdateFlags();
                }
                C();
                F();
                _loadSongsFromDB();
            }
            function aN(aR) {
                __debug("Song DB updater data error...");
                __debug("UPDATE error:" + aR.error);
                __debug("event.error.code:" + aR.error.code);
                __debug("event.error.message:" + aR.error.message);
                Toast.error("Song Manager", "Song DB updater data error...");
            }
        }

        function ag() {
            var aO = songz.length;
            var aP = [0, 0];
            aP[0] = 0;
            aP[1] = 0;
            for (let iii = 0; iii < aO; iii++) {
                var aR = songz[iii].subcat;
                var aN = songz[iii].cat;
                if (aN == "VV Malayalam 2021") {
                    if (aR != null && aR != "") {
                        if (parseInt(aR) > aP[0]) {
                            aP[0] = aR;
                        }
                    }
                }
                if (aN == "VV Hindi 2021") {
                    if (aR != null && aR != "") {
                        if (parseInt(aR) > aP[1]) {
                            aP[1] = aR;
                        }
                    }
                }
            }
            aP[1] = aP[1] - 5000;
            return aP;
        }

        function a() {
            const aN = ag();
            $RvW.songNumberObj.setMaxMalayalam(aN[0]);
            $RvW.songNumberObj.setMaxHindi(aN[1]);
        }

        function aB() {
            const aO = songz.length;
            alert("Number of records..." + aO);
            let aQ = 0;
            const aP = songz[aQ].id;
            const aN = songz[aQ].cat;
            aR(aP, aN);
            function aR(aT, aS) {
                var aW = new air.SQLStatement();
                aW.sqlConnection = m_sqlConnection;
                var aY = "";
                aY += "UPDATE sm SET subcat=:songnumber WHERE id=:id;";
                aW.text = aY;
                aW.addEventListener(air.SQLEvent.RESULT, aZ);
                aW.addEventListener(air.SQLErrorEvent.ERROR, aU);
                aW.parameters[":id"] = aT;
                var aV = $RvW.songNumberObj.assignSongNumber(aS);
                aW.parameters[":songnumber"] = aV;
                console.trace(aQ + " ID: " + aT + " Song Number: " + aV);
                aW.execute();
                function aZ(a0) {
                    aW.removeEventListener(air.SQLEvent.RESULT, aZ);
                    aW.removeEventListener(air.SQLErrorEvent.ERROR, aU);
                    aX();
                }
                function aU(a0) {
                    aW.removeEventListener(air.SQLEvent.RESULT, aZ);
                    aW.removeEventListener(air.SQLErrorEvent.ERROR, aU);
                    __debug("UPDATE error:" + a0.error);
                    __debug("event.error.code:" + a0.error.code);
                    __debug("event.error.message:" + a0.error.message);
                    aX();
                }
                function aX() {
                    aQ++;
                    if (aQ < aO) {
                        var a1 = songz[aQ].id;
                        var a0 = songz[aQ].cat;
                        aR(a1, a0);
                    } else {
                        alert("Song number update complete");
                    }
                }
            }
        }

        function S() {
            var aO = songz.length;
            var aQ = 0;
            var aP = songz[aQ].id;
            var aN = songz[aQ].cat;
            var aR = songz[aQ].name.toLowerCase();
            aS(aP, aN, aR);
            function aS(aZ, aW, aV) {
                var aU = new air.SQLStatement();
                aU.sqlConnection = m_sqlConnection;
                aU.text = "UPDATE sm SET subcat=:songnumber WHERE id=:id;";
                aU.addEventListener(air.SQLEvent.RESULT, aT);
                aU.addEventListener(air.SQLErrorEvent.ERROR, aY);
                aU.parameters[":id"] = aZ;
                aU.parameters[":songnumber"] = $RvW.songNumberObj.assignSongNumber(aW, aV);
                aU.execute();
                function aT(a2) {
                    aU.removeEventListener(air.SQLEvent.RESULT, aT);
                    aU.removeEventListener(air.SQLErrorEvent.ERROR, aY);
                    aX();
                }
                function aY(a2) {
                    aU.removeEventListener(air.SQLEvent.RESULT, aT);
                    aU.removeEventListener(air.SQLErrorEvent.ERROR, aY);
                    __debug("UPDATE error:" + a2.error);
                    __debug("event.error.code:" + a2.error.code);
                    __debug("event.error.message:" + a2.error.message);
                    aX();
                }
                function aX() {
                    aQ++;
                    if (aQ < aO) {
                        var a3 = songz[aQ].id;
                        var a2 = songz[aQ].cat;
                        var a4 = songz[aQ].name.toLowerCase();
                        aS(a3, a2, a4);
                    } else {
                        alert("Song number update complete");
                    }
                }
            }
        }

        function test2_updateRecords() {
            var aS = testName.length;
            var aT = songz.length;
            for (var aQ = 0; aQ < aS; aQ++) {
                var aO = testName[aQ].toLowerCase();
                aO = test2_updatedname(aO);
                var aR = false;
                for (var aN = 0; aN < aT; aN++) {
                    var aP = songz[aN].name;
                    aP = aP.toLowerCase();
                    if (aO === aP) {
                        aR = true;
                        break;
                    }
                }
                if (!aR) {
                    console.trace("Song not found :" + aO);
                }
            }
        }

        function test2_getOrgsonglist() {
            var aS = [];
            var aR = "";
            var aO = songz.length;
            for (var aQ = 0; aQ < aO; aQ++) {
                var aN = songz[aQ].cat;
                var aP = songz[aQ].name;
                var aT = songz[aQ].subcat;
                if (aN == "Malayalam 2020" || aN == "Hindi 2020") {
                    aR = aN + "|" + aP + "|" + aT;
                    aS.push(aR);
                }
            }
            return aS;
        }

        function w(aS) {
            var aO = songz.length;
            __debug("record length " + aO);
            for (var aQ = 0; aQ < aO; aQ++) {
                var aN = songz[aQ].cat;
                var aR = new Song();
                if (aN == "Malayalam 2019") {
                    aR = getSongObj(aQ, false);
                    var aP = findIndexFromTestTitle1(aR.name);
                    if (aP != -1) {
                        aR.name2 = testTitle2[aP];
                        aR.tags = "";
                        if (testTag1[aP] != "") {
                            aR.tags = aR.tags + testTag1[aP] + ",";
                        }
                        if (testTag2[aP] != "") {
                            aR.tags = aR.tags + testTag2[aP] + ",";
                        }
                        if (testTag3[aP] != "") {
                            aR.tags = aR.tags + testTag3[aP] + ",";
                        }
                        aR.tags = aR.tags.slice(0, -1);
                        updateSong(aR, aQ, songz[aQ].id, false);
                    } else {
                        __debug("**** No Match **** : " + aR.name);
                    }
                }
            }
        }
    }
}
