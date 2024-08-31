export enum OpenMode {
    CREATE  = 'create',
    READ    = 'read',
    UPDATE  = 'update',
}

export class Connection {
    private _conn: air.SQLConnection;

    constructor(public database: air.File) {
        this._conn = new air.SQLConnection();
    }

    public open(mode: OpenMode = OpenMode.CREATE) {
        const _mode = air.SQLMode[mode];
        this._conn.openAsync(this.database, _mode);
    }

    public openSync(mode: OpenMode = OpenMode.CREATE) {
        const _mode = air.SQLMode[mode];
        this._conn.open(this.database, _mode);
    }
}