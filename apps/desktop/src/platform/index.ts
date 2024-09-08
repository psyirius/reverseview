import AirImpl from './air';
import {Namespace, Platform} from './types';
import { determinePlatform } from "./_helper";
import {createDirectoryApi, createFileApi} from "./fs";

const _implCache = {};

export function getImplementation(namespace: Namespace, platform?: Platform): any {
    platform ??= determinePlatform();

    const cacheKey = `${platform}.${namespace}`;

    switch (platform) {
        case Platform.AIR: {
            return _implCache[cacheKey] || (_implCache[cacheKey] = AirImpl[namespace]());
        }

        default: {
            throw new Error('Platform not supported');
        }
    }
}

export const fs = (function () {
    const impl = getImplementation(Namespace.FS);

    return {
        File: createFileApi(impl),
        Directory: createDirectoryApi(impl),
    }
}());