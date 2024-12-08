import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'url'

const SWF_LIB_ROOT = '.air/swf/lib';
const DEP_PACKAGE = '@rvw/flash-support';

const flashSupportPkgPath = fileURLToPath(import.meta.resolve(DEP_PACKAGE + '/package.json'));

const flashSupportPkgRoot = path.dirname(flashSupportPkgPath);
const flashSupportPkg = JSON.parse(fs.readFileSync(flashSupportPkgPath, { encoding: 'utf8' }));

/** @type {Record<string, string>} */
const pathMap = {};

if (Array.isArray(flashSupportPkg.files)) {
    for (const file of flashSupportPkg.files) {
        const src = path.join(flashSupportPkgRoot, file);

        pathMap[src] = path.join(SWF_LIB_ROOT, 'support');
    }
}

for (const [from, to] of Object.entries(pathMap)) {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.cpSync(from, to, { recursive: true, force: true });
}