declare global {
    namespace runtime {
        type int = number;
        type uint = number;

        class Object {
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
            }

            namespace crypto {
                function generateRandomBytes(numberRandomBytes: uint): utils.ByteArray;
            }

            namespace filesystem {
                class File {
                    constructor(path?: string);

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
