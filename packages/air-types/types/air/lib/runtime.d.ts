declare global {
    namespace runtime {
        type uint = number;

        namespace flash {
            namespace media {
                class StageWebView {}
            }

            namespace html {
                class HTMLLoader {}
            }

            namespace utils {
                class ByteArray {}
            }

            namespace net {
                class URLRequest {}
            }

            namespace crypto {
                function generateRandomBytes(numberRandomBytes: uint): utils.ByteArray;
            }

            namespace filesystem {
                declare class File {
                    constructor(path?: string);

                    static readonly userDirectory: File;
                    static readonly desktopDirectory: File;
                    static readonly documentsDirectory: File;
                    static readonly applicationDirectory: File;
                    static readonly applicationStorageDirectory: File;

                    get parent(): File;

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
