import * as fs from 'node:fs'
import * as path from 'node:path'

/** @type {Record<string, string>} */
const pathMap = {
    'static'          : '.air',
}

for (const [from, to] of Object.entries(pathMap)) {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.cpSync(from, to, { recursive: true, force: true });
}