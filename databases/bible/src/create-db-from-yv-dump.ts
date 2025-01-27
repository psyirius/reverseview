import {
    PrismaClient,
    Publisher,
    Language,
    Version,
    Book,
    Chapter,
    Verse,
} from '@prisma/client';
import * as fs from "node:fs";

const prisma = new PrismaClient();

const {version: _ver, ['$version.data$']: vdx, ...rest} = JSON.parse(
    fs.readFileSync('you-version-dumps/zuE4uZFUBpNQPgiA3wtoO.TAOVBSI.bible.json', 'utf8')
);

async function main() {
    // language
    const language = await prisma.language.create({
        data: {
            name: _ver.language.name,
            local_name: _ver.language.local_name,
            description: _ver.language.description,
            locale: _ver.language.iso_639_1 + '-IN',
            iso_639_1: _ver.language.iso_639_1,
            iso_639_3: _ver.language.iso_639_3,
            direction: _ver.language.text_direction,
        },
    });

    console.log(language);

    // publisher
    const publisher = await prisma.publisher.create({
        data: {
            id: _ver.publisher.id,
            name: _ver.publisher.name,
            local_name: _ver.publisher.local_name,
            description: _ver.publisher.description,
            website: _ver.publisher.url,
        },
    });

    console.log(publisher);

    // version
    const version = await prisma.version.create({
        data: {
            id: _ver.id,
            title: _ver.title,
            local_title: _ver.local_title,
            abbr: _ver.abbreviation,
            local_abbr: _ver.local_abbreviation,
            description: undefined,
            copyright: _ver.copyright_short.text,
            copyright_long: _ver.copyright_long.text,
            edition: undefined,
            revision: 0,
            languageId: language.id,
            publisherId: publisher.id,
        }
    });

    console.log(version);

    // books
    const books = await prisma.book.createManyAndReturn({
        data: _ver.books.map((v: any, i: number) => ({
            name: v.human,
            usfm: v.usfm,
            subtitle: null,
            description: null,
            canon: v.canon,
            versionId: version.id,
        })),
    });
    
    console.log(books);

    // chapters & verses
    
    const chapters = [];
    const verses = [];
    
    for (let i = 0; i < books.length; i++) {
        const book = books[i];
        const _chapters = vdx.books[i].chapters;

        for (let j = 0; j < _chapters.length; j++) {
            const _chapter = _chapters[j];

            const chapter = await prisma.chapter.create({
                data: {
                    ordinal: j + 1,
                    usfm: _chapter.usfm,
                    description: undefined,
                    bookId: book.id,
                }
            });

            chapters.push(chapter);
            console.log(chapter);

            const _verses = _chapters[j].verses;

            for (let k = 0; k < _verses.length; k++) {
                const _verse = _verses[k];

                const verse = await prisma.verse.create({
                    data: {
                        ordinal: k + 1,
                        usfm: _verse.usfm,
                        content: _verse.content,
                        note: undefined,
                        chapterId: chapter.id,
                        bookId: book.id,
                    }
                });
                
                verses.push(verse);
                console.log(verse);
            }
        }
    }
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

