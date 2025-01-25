// @ts-nocheck

import {Toast} from "@app/toast";
import {$RvW} from "@/rvw";
import {console} from "@/platform/adapters/air";
import {
    selectedBible,
    selectedSong,
    selectedSong2Edit,
    showSongEditPanel,
    songCategories,
    songTags
} from "@stores/global";
import * as XmlUtils from "@/utils/xml";
import {presentationCtx} from "@app/presentation";
import {presentation} from "@/p_window";
import {scheduler} from "@app/glc";

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

// TODO: improve query performance
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

        this._dbConnection.openAsync(
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

    private getCachedRecordById(id: string): Nullable<SongItem> {
        for (const record of this._records) {
            if (record.id === id) {
                return record;
            }
        }

        return null;
    }

    private getCachedRecordIndexById(id: string): number {
        for (let i = 0; i < this._records.length; i++) {
            if (this._records[i].id === id) {
                return i;
            }
        }

        return -1;
    }

    public getSong(id: number) {
        return this.getCachedRecordById(id);
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

    private getCount(callback: ResultCallback<number>): void {
        const countQ = new air.SQLStatement();
        countQ.sqlConnection = this._dbConnection;

        // Count Query
        countQ.text = `
            SELECT COUNT(*) as count FROM songs;
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
        const self = this;

        // TODO: save last open dir

        const file = air.File.desktopDirectory;
        const fileFilters = [
            new air.FileFilter("VerseVIEW Song DB", "*.xml"),
        ];
        file.browseForOpen("Select Song DB in XML format.", fileFilters);
        file.addEventListener(air.Event.SELECT, onSelectFile);

        function onSelectFile(e: air.Event) {
            const { FileStream, FileMode } = air;

            const selectedFile = e.target;

            const fileStream = new FileStream();
            fileStream.open(selectedFile, FileMode.READ);
            const fileContents = fileStream.readMultiByte(fileStream.bytesAvailable, 'utf-8');
            fileStream.close();

            const songsDoc = XmlUtils.parse(fileContents);

            console.trace('Song DB File:', fileContents.length, songsDoc);

            parseSongDB(songsDoc);
        }

        function parseSongDB(root: XMLDocument) {
            if (root != null) {
                if (root.getElementsByTagName("type")[0] != null) {
                    const rootTagName = root.getElementsByTagName("type")[0].textContent;

                    if (rootTagName.toLowerCase() === 'xmlsong') {
                        const added = importSongsFromDoc(root);

                        Toast.success(
                            "Song Database",
                            `Imported ${added} songs.`
                        );
                    } else {
                        Toast.error(
                            "Song Database",
                            "Invalid database for VerseVIEW Songs in XML format. (Wrong type field)"
                        );
                    }
                } else {
                    Toast.error(
                        "Song Database",
                        "Invalid database for VerseVIEW Songs in XML format. (Type field not present)"
                    );
                }
            } else {
                Toast.error(
                    "Song Database",
                    "Invalid database for VerseVIEW Songs in XML format. (Invalid XML format)"
                );
            }
        }

        function getTagValue(doc: Element, tagName: string, fallback: any = undefined) {
            const el = doc.getElementsByTagName(tagName)[0];

            if (el) {
                return el.textContent;
            } else {
                if (fallback === undefined) {
                    throw new Error(`Tag not found: ${tagName}`);
                }
                return fallback;
            }
        }

        function importSongsFromDoc(doc: XMLDocument) {
            const songItems = doc.getElementsByTagName("song");

            console.trace('Total Songs:', songItems.length);

            const songs = [];

            const existingCategories = self.getAllCategories();

            for (let i = 0; i < songItems.length; ++i) {
                const item = songItems[i];

                const name = getTagValue(item, "name");
                const title = getTagValue(item, "name2", null);
                const category = getTagValue(item, "category", null);
                const font1 = getTagValue(item, "font", null);
                const font2 = getTagValue(item, "font2", null);
                const serial = parseInt(getTagValue(item, "subcat", 0));
                const tags = getTagValue(item, "tags", '');
                const copyright = getTagValue(item, "copyright", null);
                const youtube = getTagValue(item, "yvideo", null);
                const notes = getTagValue(item, "notes", null);
                const key = getTagValue(item, "key", null);
                const sequence = getTagValue(item, "slideseq", null);
                const _slides1 = getTagValue(item, "slide", '');
                const _slides2 = getTagValue(item, "slide2", '');
                const timestamp = getTagValue(item, "timestamp", null);

                // TODO: impl a proper merging strategy with overwrite prompts

                // skip if the category already exists
                if (existingCategories.indexOf(category) !== -1) {
                    console.log('Skipping Import:', name);
                    continue;
                }

                const slides1 = _slides1.split('<slide>')
                    .map((s: string) => s.replace(/<br>/gi, '\n').trim())
                    .filter(Boolean);

                const slides2 = _slides2.split('<slide>')
                    .map((s: string) => s.replace(/<br>/gi, '\n').trim())
                    .filter(Boolean);

                const song: Omit<SongItem, 'id'> = {
                    name,
                    title,
                    serial: isNaN(serial) ? null : serial,
                    category,
                    tags: tags.split(',').map((t: string) => t.trim()),
                    youtube,
                    key,
                    chords: null,
                    bpm: 0,
                    notes,
                    sequence,
                    copyright,
                    author: null,
                    lyrics: [
                        {
                            font: font1,
                            slides: slides1,
                        },
                        {
                            font: font2,
                            slides: slides2,
                        },
                    ],
                    timestamp: new Date(),
                };

                self.add(song, (imported, error) => {
                    if (error) {
                        console.error('Song import error:', error);
                        return;
                    }

                    console.log('Song imported:', imported.name);
                }, false);

                // console.log('Importing Song:', song);

                songs.push(song);
            }

            self.loadSongs();

            console.log('Imported Songs:', songs.length);

            return songs.length;
        }
    }

    public importFromJSON() {
        // TODO: impl
    }

    public exportAsXML(categories: string[] = null, callback: ResultCallback<SongItem[]>): void {
        // TODO: impl
    }

    public exportSongXML(): void {
        // TODO: impl
    }

    public exportCatSongsXML(): void {
        // TODO: impl
    }

    public exportAsJSON(categories: string[] = null, callback: ResultCallback<SongItem[]>): void {
        // TODO: impl
    }

    public add(song: Omit<SongItem, 'id'>, callback: ResultCallback<SongItem>, reload = true) {
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
            );
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
            const { lastInsertRowID } = createRecordQ.getResult();

            console.log('DB add record result:', lastInsertRowID);

            if (!reload) {
                callback({
                    ...song,
                    id: lastInsertRowID,
                }, null);
                return;
            }

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
                    const record = this.getCachedRecordById(lastInsertRowID);

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
                    const record = this.getCachedRecordById(id);

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
                const itemIndex = this.getCachedRecordIndexById(id);

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
        console.log('ApplyFilters:', filters);
    }

    public clearFilters() {
        // TODO: impl
        console.log('ClearFilters');
    }

    public showSongCreateDialog() {
        selectedSong2Edit.set(null);
        showSongEditPanel.set(true);
    }

    public showSongEditDialog(item?: SongItem = null) {
        selectedSong2Edit.set(item ?? this._activeItem);
        showSongEditPanel.set(true);
    }

    public select(item: SongItem) {
        this._activeItem = item;

        // TODO: impl
        console.log('SelectItem:', item);

        selectedSong.set(item);
    }

    public delete(item: SongItem) {
        this.manager.delete(item, (result, error) => {
            if (error) {
                console.error('DeleteItemError:', error);
                return;
            }

            console.log('Deleted:', result)
        })
    }

    public deleteByCategory(category: string) {
        // @ts-ignore
        this.manager.deleteAll([category], (result, error) => {
            if (error) {
                console.error('DeleteCategoryError:', error);
                return;
            }

            console.log('Deleted:', result)
        });
    }

    public getRecordsPerPage() {
        return this._pagination.limit;
    }

    public setRecordsPerPage(limit: number) {
        this._pagination.limit = limit;

        // TODO: update records
        console.log('SetRecordsPerPage:', limit);
    }

    public nextPage() {
        this._pagination.page++;

        // TODO: update records
        console.log('NextPage');
    }

    public prevPage() {
        this._pagination.page--;

        // TODO: update records
        console.log('PrevPage');
    }

    public gotoPage(page: number) {
        this._pagination.page = page;
    }

    public entries(copy: boolean = false) {
        return copy ? [...this._records] : this._records;
    }

    public present(item: SongItem, slideIndex: number = 0) {
        // TODO: impl
        console.log('PresentItem:', item);
    }

    public addToSchedule(item: SongItem, callback: ResultCallback<SongItem>) {
        // TODO: impl
        console.log('AddToSchedule:', item);

        scheduler.addSong(item.id);
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
        $RvW.webServerObj.broadcastWS({event: 'cc:present', type: 'lyric'});

        presentationCtx.p_text1_arr = (item.lyrics[0]?.slides || []).map(s => s.trim().replace(/\n/g, '<br>'));

        const secSlides = item.lyrics[1]?.slides || [];
        while (secSlides.length < presentationCtx.p_text1_arr.length) {
            secSlides.push('');
        }

        presentationCtx.p_text2_arr = secSlides.map(s => s.trim().replace(/\n/g, '<br>'));

        presentationCtx.p_text1_font = item.lyrics[0]?.font;
        presentationCtx.p_text2_font = item.lyrics[1]?.font;

        if ($RvW.vvConfigObj.get_p_showTitle()) {
            presentationCtx.p_title = item.name;
        } else {
            presentationCtx.p_title = '';
        }

        presentationCtx.p_footer = item.copyright;
        presentationCtx.p_current_index = slideIndex;
        presentationCtx.p_last_index = presentationCtx.p_text1_arr.length - 1;
        presentationCtx.p_bkgnd_filename = $RvW.graphicsObj.getBkgndFilename();
        presentationCtx.p_logo_mode = false;
        presentationCtx.p_bkgnd_motion = $RvW.graphicsObj.getMotionFlag();
        presentationCtx.p_bkgnd_color = "blue";
        presentationCtx.p_font_color = $RvW.rvwPreferences.get('app.settings.text.color1');
        presentationCtx.p_font_color2 = $RvW.rvwPreferences.get('app.settings.text.color2')
        presentationCtx.p_ver1ScaleFactor = 2;
        presentationCtx.p_ver2ScaleFactor = 2;

        const noSecondarySlide = !presentationCtx.p_text2_arr[0];
        const primaryOnly = $RvW.vvConfigObj.get_song_primaryOnly();

        if (primaryOnly == "true" || noSecondarySlide) {
            presentationCtx.p_text_orientation = "2";
        } else {
            if ($RvW.vvConfigObj.get_song_text_orientation() == "0") {
                presentationCtx.p_text_orientation = "0";
            } else {
                presentationCtx.p_text_orientation = "1";
            }
        }

        // Start presenting
        presentation();
    }

    public presentVerse(book: number, chapter: number, verse: number) {
        console.log('PresentVerse:', book, chapter, verse);

        selectedBible.set([book, chapter, verse]);

        $RvW.present();
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
