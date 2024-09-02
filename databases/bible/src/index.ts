import { PrismaClient, Version, Book, Chapter, Verse } from '@prisma/client'
import sqlite3 from 'sqlite3'
import * as process from "process";
import { promisify } from "node:util";

// get more vv bible dbs from http://verseview.info/vv/bible-database/
// https://www.wordproject.org/download/bibles/

const prisma = new PrismaClient()

const BOOK_TAG_MAP = [
    "Genesis",
    "Exodus",
    "Leviticus",
    "Numbers",
    "Deuteronomy",
    "Joshua",
    "Judges",
    "Ruth",
    "1 Samuel",
    "2 Samuel",
    "1 Kings",
    "2 Kings",
    "1 Chronicles",
    "2 Chronicles",
    "Ezra",
    "Nehemiah",
    "Esther",
    "Job",
    "Psalm",
    "Proverbs",
    "Ecclesiastes",
    "Song of Solomon",
    "Isaiah",
    "Jeremiah",
    "Lamentations",
    "Ezekiel",
    "Daniel",
    "Hosea",
    "Joel",
    "Amos",
    "Obadiah",
    "Jonah",
    "Micah",
    "Nahum",
    "Habakkuk",
    "Zephaniah",
    "Haggai",
    "Zechariah",
    "Malachi",
    "Matthew",
    "Mark",
    "Luke",
    "John",
    "Acts",
    "Romans",
    "1 Corinthians",
    "2 Corinthians",
    "Galatians",
    "Ephesians",
    "Philippians",
    "Colossians",
    "1 Thessalonians",
    "2 Thessalonians",
    "1 Timothy",
    "2 Timothy",
    "Titus",
    "Philemon",
    "Hebrews",
    "James",
    "1 Peter",
    "2 Peter",
    "1 John",
    "2 John",
    "3 John",
    "Jude",
    "Revelation",
].map(v => v.replace(' ', '_').toUpperCase());

function trimChar(string: string, charToRemove: string) {
    while(string.charAt(0) === charToRemove) {
        string = string.substring(1);
    }

    while(string.charAt(string.length - 1) === charToRemove) {
        string = string.substring(0, string.length - 1);
    }

    return string;
}

const sourceDbName = 'lbla.db';

async function magic(db: sqlite3.Database): Promise<void> {
    // Version
    const bibleVersion: Version = await prisma.version.create({
        data: {
            name: 'Spanish (LBLA)',
            tag: 'ES_LBLA',
            description: 'La Biblia de las Américas',
            locale: 'es-ES',
            direction: 'ltr',
            author: 'The Lockman Foundation',
            copyright: 'The Lockman Foundation',
            revision: 1,
        },
    });

    const allAsync = promisify<string, any[]>(db.all.bind(db));

    const d_ = await allAsync('SELECT DISTINCT bookNum FROM words;');
    const bookNums = d_.map(v => v.bookNum);

    const f_ = await allAsync('SELECT booknames FROM configuration;');
    const [x_] = f_.map(v => v.booknames);
    // const bookNames = x_.split(',').map((v: string) => trimChar(v.trim(), '\"').trim());
    const bookNames = JSON.parse('[' + x_ + ']');
    // const bookNames = ["Génesis" , "Exodo" , "Levitivo" , "Números" , "Deuterenomio" , "Josúe" , "Jueces" , "Rut" , "1 Samuel" , "2 Samuel" , "1 Reyes" , "2 Reyes" , "1 Crónicas" , "2 Crónicas" , "Esdras" , "Nehemías" , "Ester" , "Job" , "Salmos" , "Proverbios" , "Eclesiastés" , "Cantares" , "Isaías" , "Jeremías" , "Lamentaciones" , "Ezequiel" , "Daniel" , "Oseas" , "Joel" , "Amós" , "Abdias" , "Jonás" , "Miqueas" , "Nahum" , "Habacuc" , "Sofonías" , "Hageo" , "Zacarías" , "Malaquías" , "Mateo" , "Marcos" , "Lucas" , "Juan" , "Hechos" , "Romanos" , "1 Corintios" , "2 Corintios" , "Gálatas" , "Efesios" , "Filipenses" , "Colosenses" , "I Tesalonicenses" , "II Tesalonicenses" , "I Timoteo" , "II Timoteo" , "Tito" , "Filemón" , "Hebreos" , "Santiago" , "1 Pedro" , "2 Pedro" , "1 Juan" , "2 Juan" , "3 Juan" , "Judas" , "Apocalipsis"];
    console.assert(bookNums.length === bookNames.length);

    for (const bookNum of bookNums) {
        const bookName = bookNames[bookNum - 1];
        const bookTag = BOOK_TAG_MAP[bookNum - 1];

        const book: Book = await prisma.book.create({
            data: {
                name: bookName,
                tag: bookTag,
                version: {
                    connect: {
                        id: bibleVersion.id
                    }
                }
            },
        });

        const allAsync = promisify<string, number, any[]>(db.all.bind(db));

        const d_ = await allAsync('SELECT DISTINCT chNum FROM words WHERE bookNum = ?;', bookNum);
        const chNums = d_.map(v => v.chNum);

        for (const chNum of chNums) {
            const chapter: Chapter = await prisma.chapter.create({
                data: {
                    serial: chNum,
                    book: {
                        connect: {
                            id: book.id
                        }
                    }
                },
            });

            const allAsync = promisify<string, number, number, any[]>(db.all.bind(db));
            const d_ = await allAsync(
                'SELECT verseNum, word FROM words WHERE bookNum = ? AND chNum = ? ORDER BY verseNum;',
                bookNum, chNum
            );
            const verses = d_.map(v => [v.verseNum, v.word]);

            for (const [verseNum, content] of verses) {
                const verse: Verse = await prisma.verse.create({
                    data: {
                        serial: verseNum,
                        content: content,
                        chapter: {
                            connect: {
                                id: chapter.id,
                            }
                        },
                        book: {
                            connect: {
                                id: book.id,
                            }
                        },
                    },
                });

                console.log(verse);
            }
        }
    }
}

async function main(): Promise<void> {
    const db = new sqlite3.Database(
        __dirname + '/../data/' + sourceDbName,
        sqlite3.OPEN_READONLY,
        (err) => {
            if (err) {
                console.error(err.message);
                process.exit(1);
            }
            console.log('Connected to the my database.');
            magic(db);
        },
    );
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch((e) => {
        throw e
    })
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    .finally(async () => {
        await prisma.$disconnect()
    })
