import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'url'

const WEB_ROOT = '.air/webroot';
const DEP_PACKAGE = '@rvw/remote';

const remotePkgPath = fileURLToPath(import.meta.resolve(DEP_PACKAGE + '/package.json'));

const remotePkgRoot = path.dirname(remotePkgPath);
const remotePkg = JSON.parse(fs.readFileSync(remotePkgPath, { encoding: 'utf8' }));

/** @type {Record<string, string>} */
const pathMap = {};

if (Array.isArray(remotePkg.files)) {
    for (const file of remotePkg.files) {
        const src = path.join(remotePkgRoot, file);

        pathMap[src] = WEB_ROOT;
    }
}

for (const [from, to] of Object.entries(pathMap)) {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.cpSync(from, to, { recursive: true, force: true });
}