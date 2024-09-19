declare global {
    namespace runtime {
        type int = number;
        type uint = number;

        class Object {
            constructor();
            // ...

            // toString(): string;
        }

        class Date extends Object {
            constructor();
            // ...
        }

        class Array extends Object {
            constructor();

            // ...
        }

        // TODO: Implement this
        class Class extends Object {
        }

        class Vector<T> extends Object {
            fixed: boolean;
            length: uint;

            constructor(length?: uint, fixed?: boolean);

            concat(...args: T[]): Vector<T>;

            every(callback: Function, thisObject?: Object): boolean;

            filter(callback: Function, thisObject?: Object): Vector<T>;

            forEach(callback: Function, thisObject?: Object): void;

            indexOf(searchElement: T, fromIndex?: int): int;

            join(sep?: String): String;

            lastIndexOf(searchElement: T, fromIndex?: int): int;

            map(callback: Function, thisObject?: Object): Vector<T>;

            pop(): T;

            push(...args: T[]): uint;

            reverse(): Vector<T>;

            shift(): T;

            slice(startIndex?: int, endIndex?: int): Vector<T>;

            some(callback: Function, thisObject?: Object): boolean;

            sort(compareFunction: Function): Vector<T>;

            splice(startIndex: int, deleteCount?: uint, ...items: T[]): Vector<T>;

            toLocaleString(): String;

            toString(): String;

            unshift(...args: T[]): uint;
        }

        namespace flash {
            namespace errors {
                class Error extends Object {
                }

                class SQLError extends Error {
                    // ...
                }
            }

            namespace events {
                const enum EventType {
                    ACTIVATE = 'activate',
                    ADDED = 'added',
                    // ...
                }

                class Event<T = EventType> extends Object {
                    constructor(type: string, bubbles?: boolean, cancelable?: boolean);

                    // Properties
                    readonly bubbles: boolean;
                    readonly cancelable: boolean;
                    readonly currentTarget: Object;
                    readonly eventPhase: uint;
                    readonly target: Object;
                    readonly type: T;

                    // Methods
                    clone(): Event<T>;
                    formatToString(className: string, ...args: string[]): string;
                    isDefaultPrevented(): boolean;
                    preventDefault(): void;
                    stopImmediatePropagation(): void;
                    stopPropagation(): void;

                    toString(): string;

                    // Constants
                    static readonly ACTIVATE: string;
                    static readonly ADDED: string;
                    static readonly ADDED_TO_STAGE: string;
                    static readonly CANCEL: string;
                    static readonly CHANGE: string;
                    static readonly CLEAR: string;
                    static readonly CLOSE: string;
                    static readonly CLOSING: string;
                    static readonly COMPLETE: string;
                    static readonly CONNECT: string;
                    static readonly COPY: string;
                    // ...
                }

                const enum TextEventType {
                    ACTIVATE = 'activate',
                    ADDED = 'added',
                }

                class TextEvent<T = TextEventType> extends Event<T> {}
                class ErrorEvent<T> extends TextEvent<T> {}

                const enum SQLErrorEventType {
                    ERROR = 'error',
                }

                class SQLErrorEvent<T = SQLErrorEventType> extends ErrorEvent<T> {
                    constructor(type: T, bubbles?: boolean, cancelable?: boolean, error?: errors.SQLError);

                    // Properties
                    readonly error: errors.SQLError;

                    // Constants
                    static readonly ERROR = SQLErrorEventType.ERROR;
                }

                const enum SQLEventType {
                    ANALYZE = 'analyze',
                    ATTACH = 'attach',
                    BEGIN = 'begin',
                    CANCEL = 'cancel',
                    CLOSE = 'close',
                    COMMIT = 'commit',
                    COMPACT = 'compact',
                    DEANALYZE = 'deanalyze',
                    DETACH = 'detach',
                    OPEN = 'open',
                    REENCRYPT = 'reencrypt',
                    RELEASE_SAVEPOINT = 'releaseSavepoint',
                    RESULT = 'result',
                    ROLLBACK = 'rollback',
                    ROLLBACK_TO_SAVEPOINT = 'rollbackToSavepoint',
                    SCHEMA = 'schema',
                    SET_SAVEPOINT = 'setSavepoint',
                }

                class SQLEvent<T = SQLEventType> extends Event<T> {
                    // constructor();

                    // Constants
                    static readonly ANALYZE = SQLEventType.ANALYZE;
                    static readonly ATTACH = SQLEventType.ATTACH;
                    static readonly BEGIN = SQLEventType.BEGIN;
                    static readonly CANCEL = SQLEventType.CANCEL;
                    static readonly CLOSE = SQLEventType.CLOSE;
                    static readonly COMMIT = SQLEventType.COMMIT;
                    static readonly COMPACT = SQLEventType.COMPACT;
                    static readonly DEANALYZE = SQLEventType.DEANALYZE;
                    static readonly DETACH = SQLEventType.DETACH;
                    static readonly OPEN = SQLEventType.OPEN;
                    static readonly REENCRYPT = SQLEventType.REENCRYPT;
                    static readonly RELEASE_SAVEPOINT = SQLEventType.RELEASE_SAVEPOINT;
                    static readonly RESULT = SQLEventType.RESULT;
                    static readonly ROLLBACK = SQLEventType.ROLLBACK;
                    static readonly ROLLBACK_TO_SAVEPOINT = SQLEventType.ROLLBACK_TO_SAVEPOINT;
                    static readonly SCHEMA = SQLEventType.SCHEMA;
                    static readonly SET_SAVEPOINT = SQLEventType.SET_SAVEPOINT;
                }

                interface IEventDispatcher {
                    addEventListener(
                        type: string,
                        listener: Function,
                        useCapture?: boolean,
                        priority?: int,
                        useWeakReference?: boolean
                    ): void;

                    dispatchEvent(event: Event): boolean;

                    hasEventListener(type: string): boolean;

                    removeEventListener(
                        type: string,
                        listener: Function,
                        useCapture?: boolean
                    ): void;

                    willTrigger(type: string): boolean;
                }

                class EventDispatcher extends Object implements IEventDispatcher {
                    // IEventDispatcher
                    addEventListener(type: string, listener: Function, useCapture?: boolean, priority?: int, useWeakReference?: boolean): void;
                    dispatchEvent(event: Event): boolean;
                    hasEventListener(type: string): boolean;
                    removeEventListener(type: string, listener: Function, useCapture?: boolean): void;
                    willTrigger(type: string): boolean;

                    // ...
                }
            }

            namespace media {
                class StageWebView {}
            }

            namespace html {
                class HTMLLoader {}
            }

            namespace utils {
                class ByteArray {}
            }

            namespace data {
                enum SQLMode {
                    CREATE  = 'create',
                    READ    = 'read',
                    UPDATE  = 'update',
                }

                class SQLConnection extends events.EventDispatcher {
                    constructor();

                    static readonly isSupported: boolean;

                    readonly connected: boolean;
                    readonly autoCompact: boolean;
                    readonly inTransaction: boolean;

                    open(
                        reference?: object,
                        openMode?: SQLMode,
                        autoCompact?: boolean,
                        pageSize?: int,
                        encryptionKey?: utils.ByteArray
                    ): void;

                    openAsync(
                        reference?: object,
                        openMode?: SQLMode,
                        responder?: net.Responder,
                        autoCompact?: boolean,
                        pageSize?: int,
                        encryptionKey?: utils.ByteArray
                    ): void;
                }

                interface SQLStatementEventMap {
                    'error': events.SQLErrorEvent<'error'>;
                    'result': events.SQLEvent<'result'>;
                }

                class SQLStatement extends events.EventDispatcher {
                    constructor();

                    readonly executing: boolean;
                    readonly parameters: object;

                    itemClass: Class;
                    sqlConnection: SQLConnection;
                    text: string;

                    addEventListener<K extends keyof SQLStatementEventMap>(type: K, listener: (this: SQLStatement, evt: SQLStatementEventMap[K]) => any, useCapture?: boolean, priority?: int, useWeakReference?: boolean): void;
                    addEventListener(type: string, listener: (this: SQLStatement, evt: events.Event) => any, useCapture?: boolean, priority?: int, useWeakReference?: boolean): void;

                    removeEventListener<K extends keyof SQLStatementEventMap>(type: K, listener: (this: SQLStatement, evt: SQLStatementEventMap[K]) => any, useCapture?: boolean): void;
                    removeEventListener(type: string, listener: (this: SQLStatement, evt: events.Event) => any, useCapture?: boolean): void;
                }
            }

            namespace net {
                class URLRequest {}

                class Responder {
                    constructor(result: Function, status?: Function);
                }

                class FileReference extends events.EventDispatcher {
                    constructor();

                    public static readonly permissionStatus: string;

                    public readonly creationDate: Date;
                    public readonly creator: string;
                    public readonly data: utils.ByteArray;
                    public readonly extension: string;
                    public readonly modificationDate: Date;
                    public readonly name: string;
                    public readonly size: number;
                    public readonly type: string;

                    public browse(typeFilter?: Array): boolean;
                    public cancel(): void;
                    public download(request: URLRequest, defaultFileName?: string): void;
                    public load(): void;
                    public requestPermission(): void;
                    public save(data: any, defaultFileName?: string): void;
                    public upload(request: URLRequest, uploadDataFieldName?: string, testUpload?: boolean): void;
                    public uploadUnencoded(request: URLRequest): void;
                }
            }

            namespace crypto {
                function generateRandomBytes(numberRandomBytes: uint): utils.ByteArray;
            }

            namespace filesystem {
                class File extends net.FileReference {
                    static readonly userDirectory: File;
                    static readonly desktopDirectory: File;
                    static readonly documentsDirectory: File;
                    static readonly applicationDirectory: File;
                    static readonly applicationStorageDirectory: File;

                    static readonly permissionStatus: string;
                    static readonly systemCharset: string;
                    static readonly separator: string;

                    get parent(): File;
                    get exists(): boolean;
                    get isHidden(): boolean;
                    get isPackage(): boolean;
                    get isSymbolicLink(): boolean;

                    url: string;
                    nativePath: string;
                    downloaded: boolean;

                    // ...

                    constructor(path?: string);

                    public static createTempDirectory(): File;
                    public static createTempFile(): File;
                    public static getRootDirectories(): Array;

                    public override cancel(): void;
                    public override requestPermission(): void;

                    public browseForDirectory(title: string): void;
                    public browseForOpen(title: string, typeFilter?: Array): void;
                    public browseForOpenMultiple(title: string, typeFilter?: Array): void;
                    public browseForSave(title: string): void;
                    public canonicalize(): void;
                    public clone(): File;
                    public copyTo(newLocation: net.FileReference, overwrite?: boolean): void;
                    public copyToAsync(newLocation: net.FileReference, overwrite?: boolean): void;
                    public createDirectory(): void;
                    public deleteDirectory(deleteDirectoryContents?: boolean): void;
                    public deleteDirectoryAsync(deleteDirectoryContents?: boolean): void;
                    public deleteFile(): void;
                    public deleteFileAsync(): void;
                    public getDirectoryListing(): Array;
                    public getDirectoryListingAsync(): void;
                    public getRelativePath(ref: net.FileReference, useDotDot?: boolean): string;
                    public moveTo(newLocation: net.FileReference, overwrite?: boolean): void;
                    public moveToAsync(newLocation: net.FileReference, overwrite?: boolean): void;
                    public moveToTrash(): void;
                    public moveToTrashAsync(): void;
                    public openWithDefaultApplication(): void;
                    public resolvePath(path: string): File;
                }

                enum FileMode {
                    APPEND = 'append',
                    READ = 'read',
                    UPDATE = 'update',
                    WRITE = 'write',
                }

                class FileStream {}
            }

            namespace geom {
                class Rectangle extends Object {
                    bottom: number;
                    left: number;
                    right: number;
                    top: number;

                    height: number;
                    width: number;

                    x: number;
                    y: number;

                    bottomRight: Point;

                    constructor(x?: number, y?: number, width?: number, height?: number);

                    clone(): Rectangle;

                    contains(x: number, y: number): boolean;

                    // ...
                }

                class Point extends Object {
                    constructor(x?: number, y?: number);

                    add(v: Point): Point;

                    clone(): Point;

                    // ...
                }

                class Matrix extends Object {
                    constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);

                    // ...
                }
            }

            namespace filters {
                abstract class BitmapFilter extends Object {
                    constructor();

                    clone(): BitmapFilter;
                }

                class GradientGlowFilter extends BitmapFilter {}
                class GradientBevelFilter extends BitmapFilter {}
                class BevelFilter extends BitmapFilter {}
                class ShaderFilter extends BitmapFilter {}
                class DisplacementMapFilter extends BitmapFilter {}
                class BlurFilter extends BitmapFilter {}
                class GlowFilter extends BitmapFilter {}
                class DropShadowFilter extends BitmapFilter {}
                class ColorMatrixFilter extends BitmapFilter {}
                class ConvolutionFilter extends BitmapFilter {}

                enum BitmapFilterQuality {
                    LOW = 1,
                    MEDIUM = 2,
                    HIGH = 3,
                }

                enum BitmapFilterType {
                    INNER = 'inner',
                    OUTER = 'outer',
                    FULL = 'full',
                }
            }

            namespace display {
                class BitmapData extends Object {
                    readonly height: int;
                    readonly width: int;
                    readonly rect: geom.Rectangle;
                    readonly transparent: boolean;

                    constructor(width: int, height: int, transparent?: boolean, fillColor?: uint);

                    applyFilter(sourceBitmapData: BitmapData, sourceRect: geom.Rectangle, destPoint: geom.Point, filter: filters.BitmapFilter): void;

                    dispose(): void;
                    lock(): void;
                    unlock(changeRect?: geom.Rectangle): void;
                    scroll(x: int, y: int): void;
                    histogram(hRect?: geom.Rectangle): Vector<Vector<number>>;
                }

                class Screen extends events.EventDispatcher {
                    static getScreensForRectangle(rect: geom.Rectangle): Array;

                    readonly bounds: geom.Rectangle;
                    readonly colorDepth: int;
                    static readonly mainScreen: Screen;
                    static readonly screens: Array;
                    readonly visibleBounds: geom.Rectangle;
                }

                class NativeWindowInitOptions extends Object {
                    constructor();

                    maximizable: boolean;
                    minimizable: boolean;
                    owner: NativeWindow;
                    renderMode: NativeWindowRenderMode;
                    resizable: boolean;
                    systemChrome: NativeWindowSystemChrome;
                    transparent: boolean;
                    type: NativeWindowType;
                }

                class NativeWindow extends events.EventDispatcher {
                    readonly active: boolean;
                    alwaysInFront: boolean;
                    bounds: geom.Rectangle;
                    readonly closed: boolean;
                    readonly displayState: NativeWindowDisplayState;
                    height: number;
                    static readonly isSupported: boolean;
                    readonly maximizable: boolean;
                    maxSize: geom.Point;
                    menu: NativeMenu;
                    readonly minimizable: boolean;
                    minSize: geom.Point;
                    readonly owner: NativeWindow;
                    readonly renderMode: NativeWindowRenderMode;
                    readonly resizable: boolean;
                    readonly stage: Stage;
                    static readonly supportsMenu: boolean;
                    static readonly supportsNotification: boolean;
                    static readonly supportsTransparency: boolean;
                    readonly systemChrome: NativeWindowSystemChrome;
                    static readonly systemMaxSize: geom.Point;
                    static readonly systemMinSize: geom.Point;
                    title: string;
                    readonly transparent: boolean;
                    readonly type: NativeWindowType;
                    visible: boolean;
                    width: number;
                    x: number;
                    y: number;

                    constructor(initOptions: NativeWindowInitOptions);
                    activate(): void;
                    close(): void;
                    globalToScreen(globalPoint: geom.Point): geom.Point;
                    listOwnedWindows(): Vector<NativeWindow>;
                    maximize(): void;
                    minimize(): void;
                    notifyUser(type: string): void;
                    orderInBackOf(window: NativeWindow): boolean;
                    orderInFrontOf(window: NativeWindow): boolean;
                    orderToBack(): boolean;
                    orderToFront(): boolean;
                    restore(): void;
                    startMove(): boolean;
                    startResize(edgeOrCorner?: string): boolean;
                }

                enum NativeWindowType {
                    LIGHTWEIGHT = "lightweight",
                    NORMAL = "normal",
                    UTILITY = "utility",
                }

                enum NativeWindowDisplayState {
                    MAXIMIZED = "maximized",
                    MINIMIZED = "minimized",
                    NORMAL = "normal",
                }

                enum NativeWindowRenderMode {
                    AUTO = "auto",
                    CPU = "cpu",
                    DIRECT = "direct",
                }

                enum NativeWindowSystemChrome {
                    ALTERNATE = "alternate",
                    NONE = "none",
                    STANDARD = "standard",
                }

                class NativeMenu extends events.EventDispatcher {
                    constructor();
                }

                enum StageDisplayState {
                    FULL_SCREEN = "fullScreen",
                    FULL_SCREEN_INTERACTIVE = "fullScreenInteractive",
                    NORMAL = "normal",
                }

                enum StageQuality {
                    BEST = "best",
                    HIGH = "high",
                    LOW = "low",
                    MEDIUM = "medium",
                }

                class Stage {
                    // ...
                }
            }
        }
    }
}

export = runtime;
