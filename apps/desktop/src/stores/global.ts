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

export interface NetworkInterfaceInfo {
    name: string;
    addr: string;
    mac?: string;
}

// Right Tab
export const selectedTab: Writable<number> = writable(0);
export const selectedBookRef: Writable<string> = writable('');
export const menuYtLink: Writable<string | null> = writable(null);
export const navNotifyMessage: Writable<string | null> = writable(null);
export const showRemotePanel: Writable<boolean> = writable(false);
export const remoteEnabled: Writable<boolean> = writable(false);
export const localIpList: Writable<NetworkInterfaceInfo[]> = writable([]);
export const remoteCustomHostname: Writable<string> = writable('');
export const remoteListenPort: Writable<number> = writable(50000);

export const colorTheme: Writable<ColorTheme> = writable(ColorTheme.DARK);