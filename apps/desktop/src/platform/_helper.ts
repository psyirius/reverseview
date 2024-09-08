import { Platform } from "./types";

export function determinePlatform(): Platform {
    // @ts-ignore
    if (typeof runtime !== 'undefined') {
        return Platform.AIR;
    }

    // @ts-ignore
    if (typeof tauri !== 'undefined') {
        return Platform.Tauri;
    }

    // @ts-ignore
    if (typeof require !== 'undefined') {
        return Platform.Electron;
    }

    throw new Error('Platform not supported');
}