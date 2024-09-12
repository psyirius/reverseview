import * as fs from 'node:fs'
import * as path from 'node:path'
import * as qs from 'node:querystring'

import axios from 'axios'
import { fileURLToPath } from 'node:url'

import RehypeParse from 'rehype-parse'
import RehypeStringify from 'rehype-stringify'
import {unified} from 'unified'
import {inspect} from 'unist-util-inspect'
import {removePosition} from 'unist-util-remove-position'
import {select, selectAll, matches} from 'unist-util-select'
import {visit} from 'unist-util-visit'
import {filter} from 'unist-util-filter'
import {map} from 'unist-util-map'

// const x = 'https://www.bible.com/api/bible/version/339';
// const u = 'https://www.bible.com/_next/data/k60w2ZjWUDCzoGVpzW7wl/en/bible/339/GEN.2.TAOVBSI.json?versionId=339&usfm=GEN.2.TAOVBSI';
// const x = 'https://www.bible.com/api/bible/versions?language_tag=tam&type=all';
// const x = 'https://www.bible.com/api/bible/configuration';

const _nextDistIndex = 'k60w2ZjWUDCzoGVpzW7wl';
const BASE_URL = `https://www.bible.com/_next/data/${_nextDistIndex}/en/bible`;

const BIBLE_VERSION_ID = 339;
const BIBLE_VERSION_USFM = 'GEN.1.TAOVBSI';

const url = [
    [BASE_URL, BIBLE_VERSION_ID, BIBLE_VERSION_USFM + '.json'].join('/'),
    qs.stringify({ versionId: BIBLE_VERSION_ID, usfm: BIBLE_VERSION_USFM })
].join('?');

const parser = unified()
    .use(RehypeParse, { fragment: true })
    .use(RehypeStringify)
;

axios.get(url)
    .then(async ({ data }) => {
        const { pageProps } = data;
        const { chapterInfo: { content } } = pageProps;

        // console.log(data);

        // console.log(content);

        const root = parser.parse(content)

        removePosition(root, {});

        console.log(inspect(root, {color: true}));

        // console.log(inspect(select('root', root), {color: true}));
    })
    .catch(console.error);

