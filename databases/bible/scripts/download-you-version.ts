import * as fs from 'node:fs'
// import * as path from 'node:path'
// import * as qs from 'node:querystring'

import * as cheerio from 'cheerio';

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

// GET https://www.bible.com/api/bible/version/339
// GET https://www.bible.com/api/bible/versions?language_tag=tam&type=all
// GET https://www.bible.com/_next/data/zuE4uZFUBpNQPgiA3wtoO/en/bible/339/JHN.1.TAOVBSI.json?versionId=339&usfm=JHN.1.TAOVBSI

//  <script id="__NEXT_DATA__" type="application/json">

const client = axios.create({
    baseURL: 'https://www.bible.com/',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    }
});

function unwrapYvResponse(res: any) {
    const { response } = res.data;
    const { code, data } = response;
    
    return data
}

async function main() {
    const RESULT = {} as any;

    // metaData fetch
    const res = await client.get('/');

    const $ = cheerio.load(res.data);
    const nextData = JSON.parse(
        $('script#__NEXT_DATA__[type="application/json"]').text()
    );
    const { buildId } = nextData;

    RESULT['buildId'] = buildId;
    RESULT['__NEXT_DATA__'] = nextData;

    let bva; // bible version abbreviation
    {
        const res = await client.get('/api/bible/versions?language_tag=tam&type=all');
        const {versions, total} = unwrapYvResponse(res);

        const version = versions.find((v: any) => v.id === 339);

        RESULT['__version__'] = version;

        // scrap version
        {
            const res = await client.get(`/api/bible/version/${version.id}`);
            const bvo = res.data;

            bva = bvo.abbreviation;

            console.log(bvo);

            RESULT['version'] = bvo;

            const $verses$ = (RESULT['$verses$'] = [] as any[]);

            const _books_ = [] as any[];

            for (const book of bvo.books) {
                const {usfm} = book;
                
                const _book_ = {
                    usfm,
                    chapters: [] as any[],
                };
                
                const _chapters_ = _book_.chapters;
                
                for (const chapter of book.chapters) {
                    const {usfm} = chapter;

                    const _chapter_ = {
                        usfm,
                        verses: [] as any[],
                    };

                    {
                        const res = await client.get(`https://www.bible.com/_next/data/${buildId}/en/bible/${version.id}/${usfm}.json`);
                        const {pageProps: props} = res.data;
                        const {chapterInfo} = props;
                        const {previous, content, next} = chapterInfo;

                        $verses$.push(props);

                        const $ = cheerio.load(content);

                        // verse with a child as label
                        const verses = $('.verse:has(.label)');
                        
                        const _verses_ = _chapter_.verses;

                        for (const v of verses) {
                            const verse = $(v);
                            const usfm = verse.attr('data-usfm');

                            if (!usfm) {
                                throw new Error('usfm not found');
                            }

                            const label = verse.find('.label');
                            const content = verse.find('.content');

                            const _verse_ = {
                                usfm: usfm.trim(),
                                label: label.text().trim(),
                                content: content.text().trim(),
                            }

                            _verses_.push(_verse_);

                            // console.log(usfm);
                        }

                        // console.log(previous, content, next);
                    }

                    _chapters_.push(_chapter_);

                    console.log(usfm);
                }

                _books_.push(_book_);

                console.log(usfm);
            }

            RESULT['$version.data$'] = {
                id: version.id,
                books: _books_,
            }
        }
    }

    fs.writeFileSync(`./you-version-dumps/${buildId}.${bva}.bible.json`, JSON.stringify(RESULT, null, 2));
}

main()
    .then(() => console.log('Done'))
    .catch(e => console.error(e));

// const _nextDistIndex = 'zuE4uZFUBpNQPgiA3wtoO';
// const BASE_URL = `https://www.bible.com/_next/data/${_nextDistIndex}/en/bible`;
//
// const BIBLE_VERSION_ID = 339;
// const USFM = 'GEN.1.TAOVBSI';
//
// const url = [
//     [BASE_URL, BIBLE_VERSION_ID, USFM + '.json'].join('/'),
//     qs.stringify({ versionId: BIBLE_VERSION_ID, usfm: USFM })
// ].join('?');
//
// const parser = unified()
//     .use(RehypeParse, { fragment: true })
//     .use(RehypeStringify)
// ;
//
// client.get(url)
//     .then(async ({ data }) => {
//         const { pageProps } = data;
//         const { chapterInfo: { content } } = pageProps;
//
//         // console.log(data);
//
//         // console.log(content);
//
//         const root = parser.parse(content)
//
//         removePosition(root, {});
//
//         console.log(inspect(root, {color: true}));
//
//         // console.log(inspect(select('root', root), {color: true}));
//     })
//     .catch(console.error);

