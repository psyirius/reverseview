import { polyfillLog } from './console';

const { runtime } = window;

if (!runtime) {
    throw new Error('Air runtime api is not available!')
}

const {
    File,
    // @ts-ignore
    FileMode,
    // @ts-ignore
    FileStream,
    // @ts-ignore
    FileFilter,
    trace,
    // @ts-ignore
    Event,
    // @ts-ignore
    ByteArray,
} = air;

export const fs = {
    resolveUrlInDesktopDir(path: string, nativePath = false): string {
        const file = File.desktopDirectory;
        file.resolvePath(path);
        return nativePath ? file.nativePath : file.url;
    },
    resolveUrlInAppStorageDir(path: string, nativePath = false): string {
        const file = File.applicationStorageDirectory;
        file.resolvePath(path);
        return nativePath ? file.nativePath : file.url;
    },
    copyFileSyncAppToStorageDir(src: string, dest: string): boolean {
        const file = File.applicationDirectory.resolvePath(src);
        const dst = File.applicationStorageDirectory.resolvePath(dest);
        file.copyTo(dst, true);
        return dst.exists;
    },
    writeFileSync(filename: string, content: string, charset = 'utf-8') {
        const f = new File(filename);
        const s = new FileStream();
        s.open(f, FileMode.WRITE);
        s.writeMultiByte(content, charset);
        s.close();
    },
    writeFileBytesSync(filename: string, content: any) {
        const f = new File(filename);
        const s = new FileStream();
        s.open(f, FileMode.WRITE);
        s.writeBytes(content);
        s.close();
    },
    readFileSync(filename: string, charset = 'utf-8') {
        const f = new File(filename);
        const s = new FileStream();
        s.open(f, FileMode.READ);
        const content = s.readMultiByte(s.length, charset);
        s.close();
        return content;
    },
    readFileBytesSync(filename: string) {
        const f = new File(filename);
        const s = new FileStream();
        s.open(f, FileMode.READ);
        const content = new ByteArray();
        s.readBytes(content);
        s.close();
        return content;
    }
}

export const dialogs = {
    browseFileForOpen(
        title: string,
        startUrl: string,
        onSelect: (url: string) => void,
        typeFilter: { [key: string]: string } = {}, /* '*.txt;*.csv': 'Text Files' */
    ): void {
        const f = new File(startUrl);

        const filter = new runtime.Array();
        for (const k of Object.keys(typeFilter)) {
            // @ts-ignore
            filter.push(new FileFilter(filters[k], k));
        }

        // @ts-ignore
        f.addEventListener(Event.SELECT, (e: any) => {
            const selectedFile = e.target as File;
            // @ts-ignore
            onSelect(selectedFile.nativePath);
        });

        f.browseForOpen(title, filter);
    }
}

export const db = {
    lyric: {
        // TODO: impl
    },
    bible: {
        // TODO: impl
    },
}

export const net = {
    http: {
        // TODO: impl
    },
    ws: {
        // TODO: impl
    },
}

const polyfills = {
    console: {
        log(...args: any[]): void {
            polyfillLog(trace, ...args);
        },
    }
};

export const console = {
    log: (...args: any[]) => polyfills.console.log.apply(null, args),
    warn: (...args: any[]) => polyfills.console.log.apply(null, args),
    info: (...args: any[]) => polyfills.console.log.apply(null, args),
    debug: (...args: any[]) => polyfills.console.log.apply(null, args),
    error: (...args: any[]) => polyfills.console.log.apply(null, args),
    trace: (...args: any[]) => polyfills.console.log.apply(null, args),
}

export const createLogger = (context: string) => {
    const log = (...args: any[]) => polyfills.console.log(`[${context}]`, ...args);

    return {
        log: log,
        warn: log,
        info: log,
        debug: log,
        error: log,
        trace: log,
    }
}

export default {
    fs,
    console,
    createLogger,
}