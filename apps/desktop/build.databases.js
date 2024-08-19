import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from 'url'

/** @type {Record<string, string>} */
const pathMap = {
    '@rvw/bible-db'     : '.air/bible',
    '@rvw/songs-db'     : '.air/song',
}

for (const [pkg, dest] of Object.entries(pathMap)) {
    const remotePkgPath = fileURLToPath(import.meta.resolve(pkg + '/package.json'));

    const remotePkgRoot = path.dirname(remotePkgPath);
    const remotePkg = JSON.parse(fs.readFileSync(remotePkgPath, 'utf8'));

    /** @type {Record<string, string>} */
    const copyMap = {};

    if (Array.isArray(remotePkg.files)) {
        for (const file of remotePkg.files) {
            const src = path.join(remotePkgRoot, file);

            copyMap[src] = dest;
        }
    }

    for (const [from, to] of Object.entries(copyMap)) {
        fs.mkdirSync(path.dirname(to), { recursive: true });
        fs.cpSync(from, to, { recursive: true, force: true });
    }
}
