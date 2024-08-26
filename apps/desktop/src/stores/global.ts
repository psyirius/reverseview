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

export const colorTheme: Writable<ColorTheme> = writable(ColorTheme.DARK);

export const showRemotePanel: Writable<boolean> = writable(false);

export const localIpList: Writable<string[]> = writable([]);