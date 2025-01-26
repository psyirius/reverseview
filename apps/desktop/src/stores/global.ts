import {
    type Readable,
    type Writable,
    get,
    derived,
    readable,
    writable,
} from '@/utils/_store'
import type {BibleVersion} from "@/bible/version";

export enum ColorTheme {
    LIGHT = 0,
    DARK = 1,
}

export interface NetworkInterfaceInfo {
    name: string;
    addr: string;
    mac?: string;
}

export enum ScheduleItemType {
    LYRIC = 0,
    VERSE = 1,
}

export type ScheduleItem = {
    id: string, // schId
    index: number, // sch_order
    type: ScheduleItemType, // isSong === 1
    title: string,
    description: string,
    meta: Record<string, any>,
}

export type BibleVerseRef = {
    label: string,
    book: number,
    chapter: number,
    verse: number,
}

export type BibleVerse = {
    ref: [number, number, number], /* [book, chapter, verse] */
    font: string,
    text: string,
}

// Right Tab
export const selectedTab: Writable<number> = writable(0);
export const selectedBible: Writable<[number, number, number]> = writable([0, 0, 0]);
export const presentingBible: Writable<[number, number, number]> = writable([-1, -1, -1]);
export const presentingLyric: Writable<any | null> = writable(null);
export const bookList: Writable<(string | string[])[]> = writable([]);
export const chapterList: Writable<string[]> = writable([]);
export const verseList: Writable<string[]> = writable([]);
export const selectedVerseList: Writable<BibleVerse[][]> = writable([]);
export const bibleFont1: Writable<string> = writable('');
export const bibleFont2: Writable<string> = writable('');
export const selectedBookRef: Writable<string> = writable('');
export const bibleNavSearch: Writable<string> = writable('');
export const recentBibleRefs: Writable<BibleVerseRef[]> = writable([]);

export const songCategories: Writable<string[]> = writable([]);
export const songTags: Writable<string[]> = writable([]);
export const selectedSongCategory: Writable<number | null> = writable(null);
export const selectedSongTag: Writable<number | null> = writable(null);
export const selectedSong: Writable<any | null> = writable(undefined);
export const selectedSong2Edit: Writable<any | null> = writable(null);

export const selectedBibleVersionForVerseEdit: Writable<number> = writable(0);
export const selectedSongForEdit: Writable<any | null> = writable(null);

export const bgStillImageList: Writable<any[]> = writable([]);

export const showRemotePanel: Writable<boolean> = writable(false);
export const showSongEditPanel: Writable<boolean> = writable(false);
export const showLyricEditPanel: Writable<boolean> = writable(false);
export const showBibleNotesEditPanel: Writable<boolean> = writable(false);
export const showColorPickerPanel: Writable<boolean> = writable(false);
export const showBibleManagePanel: Writable<boolean> = writable(false);
export const showBibleSelectPanel: Writable<boolean> = writable(false);
export const showVerseEditPanel: Writable<boolean> = writable(false);
export const songSearchError: Writable<string | undefined> = writable(undefined);
export const remoteEnabled: Writable<boolean> = writable(false);
export const presentationMainEnabled: Writable<boolean> = writable(false);
export const presentationStageEnabled: Writable<boolean> = writable(false);
export const presentationPrimaryFontOverride: Writable<string | null> = writable(null);
export const presentationSecondaryFontOverride: Writable<string | null> = writable(null);
export const availableScreens: Writable<any[]> = writable([]);
export const availableFonts: Writable<any[]> = writable([]);
export const presentationMainScreen: Writable<number> = writable(-1);
export const presentationStageScreen: Writable<number> = writable(-1);
export const localIpList: Writable<NetworkInterfaceInfo[]> = writable([]);
export const scheduleList: Writable<ScheduleItem[]> = writable([]);
export const navFontSize: Writable<number> = writable(0);
export const remoteCustomHostname: Writable<string> = writable('');
export const remoteListenPort: Writable<number> = writable(50000);

export const currentBibleVersions: Writable<BibleVersion[]> = writable([]);
export const selectedBibleVersion1: Writable<number> = writable(0);
export const selectedBibleVersion2: Writable<number> = writable(0);
export const twoVersesPerSlide: Writable<boolean> = writable(false);

export const colorTheme: Writable<ColorTheme> = writable(ColorTheme.DARK);