import * as fs from 'node:fs'
import * as path from 'node:path'

import axios from 'axios'
import { fileURLToPath } from "node:url";
import {createWriteStream} from "node:fs";

const BASE_URL = 'http://www.verseview.info/download/bible'

const client = axios.create({
    baseURL: BASE_URL,
})

;(async () => {
    const { data: bibleVersions } = await client.get('/version_server.txt')

    const bva = bibleVersions
        .split('|')
        .map(e => e.trim()
            .split(',')
            .map(e => e.trim())
        )
        .map(([name, desc, filename, revision, k]) => ({
            name,
            desc,
            filename,
            revision: Number(revision),
            k: Number(k),
        }))

    for (const obj of bva) {
        const { name, filename } = obj;

        const bibleDest = path.join(
            import.meta.dirname,
            '..',
            '.downloads',
            'bibles',
            name,
        )

        fs.mkdirSync(bibleDest, { recursive: true })

        const bibleZipPath = path.join(
            bibleDest,
            filename,
        )

        const bibleMetaPath = path.join(
            bibleDest,
            'metadata.json',
        )

        if (fs.existsSync(bibleMetaPath) && fs.existsSync(bibleZipPath)) {
            continue
        }

        console.log(obj);

        const response = await client.get(`/${filename}`, {
            responseType: 'stream'
        })

        fs.writeFileSync(
            bibleMetaPath,
            JSON.stringify({
                ...obj,
                url: response.config.url,
            })
        )

        const writer = createWriteStream(bibleZipPath)
        response.data.pipe(writer)
    }
})()