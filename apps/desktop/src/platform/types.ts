export enum Namespace {
    FS = 'FS',
    Clipboard = 'Clipboard',
}

export enum Platform {
    AIR = 'AIR',
    Electron = 'Electron',
    Tauri = 'Tauri',
}

/** @internal */
export type NamespaceExport = {
    [Namespace.FS]: () => FsImpl;
    [Namespace.Clipboard]: () => ClipboardImpl;
}

/** @internal */
export type FsImpl = {
    // createFile: (path: string) => void;
    // createDirectory: (path: string) => void;
}

/** @internal */
export type ClipboardImpl = {
    // copy: (text: string) => void;
    // paste: () => string;
}