import {
    type Readable,
    type Writable,
    get,
    derived,
    readable,
    writable,
} from '@/utils/_store'
import {SongSearchType} from "@/const";
import {Song} from "@/song/obj";

export enum ColorTheme {
    LIGHT = 0,
    DARK = 1,
}

export interface NetworkInterfaceInfo {
    name: string;
    addr: string;
    mac?: string;
}

export type BibleVersion = [
    string, // Name
    string, // File
    string, // Font
    string, // Copyright
    string, // FontSize
    string, // SearchFile
    string, // SelectedFont
    string, // BookNames
];

export type SongSearchQuery = {
    type: SongSearchType,
    value: string,
}

// Right Tab
export const selectedTab: Writable<number> = writable(0);
export const selectedBookRef: Writable<string> = writable('');
export const menuYtLink: Writable<string | null> = writable(null);
export const navNotifyMessage: Writable<string | null> = writable(null);
export const songSearchQuery: Writable<SongSearchQuery | null> = writable(null);
export const songCategories: Writable<string[]> = writable([]);
export const songTags: Writable<string[]> = writable([]);
export const selectedSongCategory: Writable<number | null> = writable(null);
export const selectedSongTag: Writable<number | null> = writable(null);
export const selectedSong: Writable<Song | null> = writable(undefined);
export const showRemotePanel: Writable<boolean> = writable(false);
export const showSongEditPanel: Writable<boolean> = writable(false);
export const showLyricEditPanel: Writable<boolean> = writable(false);
export const showBibleNotesEditPanel: Writable<boolean> = writable(false);
export const showColorPickerPanel: Writable<boolean> = writable(false);
export const showBibleManagePanel: Writable<boolean> = writable(false);
export const showBibleSelectPanel: Writable<boolean> = writable(false);
export const showVerseEditPanel: Writable<boolean> = writable(false);
export const remoteEnabled: Writable<boolean> = writable(false);
export const localIpList: Writable<NetworkInterfaceInfo[]> = writable([]);
export const remoteCustomHostname: Writable<string> = writable('');
export const remoteListenPort: Writable<number> = writable(50000);

export const currentBibleVersions: Writable<BibleVersion[]> = writable([]);
export const selectedBibleVersion1: Writable<number> = writable(0);
export const selectedBibleVersion2: Writable<number> = writable(0);

export const colorTheme: Writable<ColorTheme> = writable(ColorTheme.DARK);