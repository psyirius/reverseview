import * as _sqlite3 from "sqlite3";
import * as fs from "node:fs";

const sqlite3 = _sqlite3.verbose();

// const db = new sqlite3.Database("data/vv10/songs.db");
const db = new sqlite3.Database("C:\\Users\\Psyrizz\\AppData\\Roaming\\VerseVIEW10\\vvdata\\songs\\songs.db");
const db2 = new sqlite3.Database("data/out.db");

const records = [];

const CATEGORY_MAP = {
    'VV Bengali Songs': 'Bengali',
    'VV Hindi 2021': 'Hindi',
    'VV Nyishi Songs': 'Nyishi',
    'VV Tamil 2021': 'Tamil',
    'VV Malayalam 2021': 'Malayalam',
    'English1': 'English',
}

db.serialize(() => {
    let slideMisMatches = 0;
    let font1Misses = 0;
    let font2Misses = 0;

    db.each("SELECT * FROM sm", (err, row) => {
        if (err) {
            console.error(err);
            return;
        }

        let {
            id,
            name,
            title2: title,
            cat: category,
            tags,
            font: font1,
            font2,
            // timestamp,
            yvideo: youtube,
            key,
            copy: copyright,
            subcat: serial,
            lyrics: lyrics1,
            lyrics2,
            notes,
            slideseq: sequence,
        } = row as any;

        if (category in CATEGORY_MAP) {
            category = CATEGORY_MAP[category];
        }

        font1 = (font1 === "null" || !font1) ? null : font1;
        font2 = (font2 === "null" || !font2) ? null : font2;

        const lyrics = [];

        if (lyrics1) {
            if (!font1) {
                console.error("Font1 missing:", {
                    id, name, title, category,
                });
                font1Misses++;
            }

            lyrics.push(
                {
                    font: font1,
                    slides: lyrics1
                        .replace(/<br>/gi, '<br>')
                        .split('<slide>')
                        .filter((slide: string) => slide.trim().length > 0)
                        .map((slide: string) => slide.split('<br>').map(l => l.trim()).join('\n')),
                }
            );
        }

        if (lyrics2) {
            const slides = lyrics2
                .replace(/<br>/gi, '<br>')
                .split('<slide>')
                .filter((slide: string) => slide.trim().length > 0)
                .map((slide: string) => slide.split('<br>').map(l => l.trim()).join('\n'));

            if (slides.length) {
                const l1c = lyrics.at(0).slides;

                if (slides.length !== l1c.length) {
                    console.error("Content length mismatch:", {
                        id, name, title, category,
                        lengths: [slides.length, l1c.length],
                    });
                    slideMisMatches++;
                    return;
                }

                if (!font2) {
                    console.error("Font2 missing:", {
                        id, name, title, category,
                    });
                    font2Misses++;
                }

                lyrics.push(
                    {
                        font: font2,
                        slides: slides,
                    }
                );
            }
        }

        title = (title === "null" || !title) ? null : title;
        tags = tags ? tags.split(',').map((tag: string) => tag.trim()) : [];
        sequence = (sequence === "null" || !sequence) ? null : sequence;

        const timestamp = new Date();

        records.push({
            id,
            name,
            title,
            serial: Number.parseInt(serial) || null,
            category,
            tags,
            lyrics,
            copyright: copyright || null,
            author: copyright || null,
            youtube: youtube || null,
            key: key || null,
            chords: null,
            bpm: null,
            notes: notes || null,
            sequence: sequence || null,
            timestamp,
        });
    }, () => {
        fs.writeFileSync("data/songs.out.json", JSON.stringify(records, null, 2));

        console.log("Done:", records.length);
        console.log("Slide mismatches:", slideMisMatches);
        console.log("Font1 misses:", font1Misses);
        console.log("Font2 misses:", font2Misses);

        db2.serialize(() => {
            db2.run("DROP TABLE IF EXISTS songs");
            db2.run(`
                CREATE TABLE IF NOT EXISTS songs (
                    id              INTEGER PRIMARY KEY AUTOINCREMENT,
                    name            TEXT NOT NULL,
                    title           TEXT,
                    serial          INTEGER,
                    category        TEXT,
                    tags            TEXT,
                    lyrics          TEXT,
                    youtube         TEXT,
                    author          TEXT,
                    sequence        TEXT,
                    copyright       TEXT,
                    notes           TEXT,
                    chords          TEXT,
                    key             TEXT,
                    bpm             INTEGER,
                    timestamp       INTEGER
                )
            `, () => {
                for (const record of records) {
                    db2.run(`
                        INSERT INTO songs (
                            id,
                            name,
                            title,
                            serial,
                            category,
                            tags,
                            lyrics,
                            youtube,
                            author,
                            sequence,
                            copyright,
                            notes,
                            chords,
                            key,
                            bpm,
                            timestamp
                        ) VALUES (
                            $id,
                            $name,
                            $title,
                            $serial,
                            $category,
                            $tags,
                            $lyrics,
                            $youtube,
                            $author,
                            $sequence,
                            $copyright,
                            $notes,
                            $chords,
                            $key,
                            $bpm,
                            $timestamp
                        )
                    `, {
                        $id: record.id,
                        $name: record.name,
                        $title: record.title,
                        $serial: record.serial,
                        $category: record.category,
                        $tags: JSON.stringify(record.tags),
                        $lyrics: JSON.stringify(record.lyrics),
                        $youtube: record.youtube,
                        $author: record.author,
                        $sequence: record.sequence,
                        $copyright: record.copyright,
                        $notes: record.notes,
                        $chords: record.chords,
                        $key: record.key,
                        $bpm: record.bpm,
                        $timestamp: record.timestamp.getTime(),
                    });
                }
            });
        });
    });
});

// setTimeout(() => {
//     console.log("Closing databases");
//     db.close();
//     db2.close();
// }, 10000);