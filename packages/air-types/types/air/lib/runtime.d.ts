declare global {
    namespace runtime {
        type int = number;
        type uint = number;

        class Object {
            constructor();
        }

        class Date extends Object {
            constructor();
        }

        class Array extends Object {
            constructor();
        }

        namespace flash {
            namespace events {
                class Event extends Object {

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
        }
    }
}

export = runtime;
