import fs from "node:fs";
import path from "node:path";
import ignore from "ignore";
import { globSync } from "glob";
import MapGroupBy from 'map.groupby';
import { spawn } from "node:child_process";

// TODO: make it a cli and a library

// shims
MapGroupBy.shim();

const PROJECT_ROOT = path.resolve(import.meta.dirname, "..", '..');

const DIST_ROOT = path.resolve(PROJECT_ROOT, "dist");
const SOURCE_ROOT = path.resolve(PROJECT_ROOT, ".air");
const RUNTIMES_ROOT = path.resolve(PROJECT_ROOT, "runtimes");
const KEYSTORES_ROOT = path.resolve(PROJECT_ROOT, "keystores");

const BUILD_DIR = path.resolve(PROJECT_ROOT, ".build");
const IGNORE_FILEPATH = path.resolve(SOURCE_ROOT, ".airignore");
const APP_DESC_PATH = path.resolve(PROJECT_ROOT, "application.xml");
const KEYSTORE_FILEPATH = path.resolve(KEYSTORES_ROOT, "signing-release.p12");
const OUTPUT_FILEPATH = 'ReVerseVIEW.air';

function cacheAndCollectAppFiles() {
    const ig = ignore();

    if (fs.existsSync(IGNORE_FILEPATH)) {
        ig.add(fs.readFileSync(IGNORE_FILEPATH, "utf-8"));
    }

    const entries = globSync("**/*", {
        // Adds a / character to directory matches.
        mark: true, // for ignore to match it
        absolute: false,
        cwd: SOURCE_ROOT,
        dot: false,
    });

    // filters
    const isDirectory = (p) => fs.lstatSync(path.resolve(SOURCE_ROOT, p)).isDirectory();
    const isNotDirectory = (p) => !isDirectory(p);

    // mappings
    const toPosixPath = (p) => p.split(path.sep).join(path.posix.sep);

    // utils
    const arrayEqual = (a, b) => a.every((e, i) => b[i] === e);

    function flattenIncludes(dirMap, directory) {
        const flat = [];

        const items = dirMap.get(directory);

        for (const item of ig.filter(items)) {
            if (isDirectory(item)) {
                flat.push(...flattenIncludes(dirMap, item))
            } else {
                flat.push(item);
            }
        }

        if (arrayEqual(flat, items)) {
            return [directory];
        }

        return flat;
    }

    const fullDirMap = Map.groupBy(entries, (filepath) => path.dirname(filepath) + path.sep);

    return flattenIncludes(fullDirMap, '.' + path.sep).map(toPosixPath);
}

function makeRelease() {
    const appFiles = cacheAndCollectAppFiles();

    console.log('App Files:', appFiles);

    fs.rmSync(BUILD_DIR, { recursive: true, force: true });

    const APP_FILES_CACHE_DIR = path.resolve(BUILD_DIR, 'cache');

    fs.mkdirSync(APP_FILES_CACHE_DIR, { recursive: true });
    fs.mkdirSync(DIST_ROOT, { recursive: true });

    appFiles.forEach(p => fs.cpSync(
        path.resolve(SOURCE_ROOT, p),
        path.resolve(APP_FILES_CACHE_DIR, p),
        { recursive: true },
    ));

    const appDescPath = APP_DESC_PATH;
    const outputPath = path.resolve(DIST_ROOT, OUTPUT_FILEPATH);

    const keystorePath = KEYSTORE_FILEPATH;
    const keystorePassword = "v[euHZbwbsTnU1~#-5[X";

    const args = [
        "-package",

        "-storetype",
        "PKCS12",

        "-keystore",
        keystorePath,

        "-storepass",
        keystorePassword,

        "-target",
        "air",

        outputPath,

        appDescPath,

        APP_FILES_CACHE_DIR,
    ];

    const sp = spawn("adt", args, {
        cwd: APP_FILES_CACHE_DIR,
        shell: true,
    });

    sp.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });

    sp.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });

    sp.on("close", (code) => {
        if (code === 0) {
            console.log('Build complete!')
        } else {
            console.log(`Build failed with code: ${code}`);
        }
    });
}

// entry
makeRelease();
