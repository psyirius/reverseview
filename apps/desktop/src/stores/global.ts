import {
    type Readable,
    type Writable,
    get,
    derived,
    readable,
    writable,
} from '@/utils/_store'

export enum ColorTheme {
    LIGHT = 0,
    DARK = 1,
}

export const selectedTab: Writable<number> = writable(0);
export const selectedBookRef: Writable<string> = writable('');
export const menuYtLink: Writable<string | null> = writable(null);
export const navNotifyMessage: Writable<string | null> = writable(null);
export const showRemotePanel: Writable<boolean> = writable(false);
export const remoteEnabled: Writable<boolean> = writable(false);
export const localIpList: Writable<string[]> = writable([]);

export const colorTheme: Writable<ColorTheme> = writable(ColorTheme.DARK);