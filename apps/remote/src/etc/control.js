import { toast } from "svelte-sonner";
import { writable} from "svelte/store";
import * as store from "svelte/store";

/** @type {import("svelte/store").Writable<HTMLSelectElement>} */
export const songsSelect = writable();

/** @type {import("svelte/store").Writable<HTMLSelectElement>} */
export const scheduleSelect = writable();

/** @type {import("svelte/store").Writable<HTMLOptionElement[]>} */
export const songsSelectOptions = writable([]);

/** @type {import("svelte/store").Writable<HTMLOptionElement[]>} */
export const scheduleSelectOptions = writable([]);

/** @type {import("svelte/store").Writable<boolean>} */
export const songsFirstLine = writable(false);

/** @type {import("svelte/store").Writable<boolean>} */
export const songsTwoLinePresent = writable(false);

/** @type {import("svelte/store").Writable<boolean>} */
export const scheduleFirstLine = writable(false);

/** @type {import("svelte/store").Writable<boolean>} */
export const scheduleTwoLinePresent = writable(false);

/** @type {import("svelte/store").Writable<string>} */
export const bibleSearchQuery = writable('');

/** @type {import("svelte/store").Writable<string>} */
export const songsSearchQuery = writable('');

/** @type {import("svelte/store").Writable<PromiseLike<any>>} */
export const versesResult = writable();

/** @type {import("svelte/store").Writable<PromiseLike<any>>} */
export const songsLyricsContent = writable();

/** @type {import("svelte/store").Writable<PromiseLike<any[]>>} */
export const scheduleLyricsContent = writable(Promise.resolve([]));

// TODO: remove and rely on the backend
const BibleReference = (function () {
    const numberOfChapters = [
        [0],
        [
            50, 31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27, 33, 38, 18, 34, 24, 20, 67, 34, 35, 46,
            22, 35, 43, 55, 32, 20, 31, 29, 43, 36, 30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26,
        ],
        [
            40, 22, 25, 22, 31, 23, 30, 25, 32, 35, 29, 10, 51, 22, 31, 27, 36, 16, 27, 25, 26, 36, 31, 33, 18, 40, 37, 21,
            43, 46, 38, 18, 35, 23, 35, 35, 38, 29, 31, 43, 38,
        ],
        [27, 17, 16, 17, 35, 19, 30, 38, 36, 24, 20, 47, 8, 59, 57, 33, 34, 16, 30, 37, 27, 24, 33, 44, 23, 55, 46, 34],
        [
            36, 54, 34, 51, 49, 31, 27, 89, 26, 23, 36, 35, 16, 33, 45, 41, 50, 13, 32, 22, 29, 35, 41, 30, 25, 18, 65, 23,
            31, 40, 16, 54, 42, 56, 29, 34, 13,
        ],
        [
            34, 46, 37, 29, 49, 33, 25, 26, 20, 29, 22, 32, 32, 18, 29, 23, 22, 20, 22, 21, 20, 23, 30, 25, 22, 19, 19, 26,
            68, 29, 20, 30, 52, 29, 12,
        ],
        [24, 18, 24, 17, 24, 15, 27, 26, 35, 27, 43, 23, 24, 33, 15, 63, 10, 18, 28, 51, 9, 45, 34, 16, 33],
        [21, 36, 23, 31, 24, 31, 40, 25, 35, 57, 18, 40, 15, 25, 20, 20, 31, 13, 31, 30, 48, 25],
        [4, 22, 23, 18, 22],
        [
            31, 28, 36, 21, 22, 12, 21, 17, 22, 27, 27, 15, 25, 23, 52, 35, 23, 58, 30, 24, 42, 15, 23, 29, 22, 44, 25, 12,
            25, 11, 31, 13,
        ],
        [24, 27, 32, 39, 12, 25, 23, 29, 18, 13, 19, 27, 31, 39, 33, 37, 23, 29, 33, 43, 26, 22, 51, 39, 25],
        [22, 53, 46, 28, 34, 18, 38, 51, 66, 28, 29, 43, 33, 34, 31, 34, 34, 24, 46, 21, 43, 29, 53],
        [25, 18, 25, 27, 44, 27, 33, 20, 29, 37, 36, 21, 21, 25, 29, 38, 20, 41, 37, 37, 21, 26, 20, 37, 20, 30],
        [
            29, 54, 55, 24, 43, 26, 81, 40, 40, 44, 14, 47, 40, 14, 17, 29, 43, 27, 17, 19, 8, 30, 19, 32, 31, 31, 32, 34,
            21, 30,
        ],
        [
            36, 17, 18, 17, 22, 14, 42, 22, 18, 31, 19, 23, 16, 22, 15, 19, 14, 19, 34, 11, 37, 20, 12, 21, 27, 28, 23, 9,
            27, 36, 27, 21, 33, 25, 33, 27, 23,
        ],
        [10, 11, 70, 13, 24, 17, 22, 28, 36, 15, 44],
        [13, 11, 20, 32, 23, 19, 19, 73, 18, 38, 39, 36, 47, 31],
        [10, 22, 23, 15, 17, 14, 14, 10, 17, 32, 3],
        [
            42, 22, 13, 26, 21, 27, 30, 21, 22, 35, 22, 20, 25, 28, 22, 35, 22, 16, 21, 29, 29, 34, 30, 17, 25, 6, 14, 23,
            28, 25, 31, 40, 22, 33, 37, 16, 33, 24, 41, 30, 24, 34, 17,
        ],
        [
            150, 6, 12, 8, 8, 12, 10, 17, 9, 20, 18, 7, 8, 6, 7, 5, 11, 15, 50, 14, 9, 13, 31, 6, 10, 22, 12, 14, 9, 11, 12,
            24, 11, 22, 22, 28, 12, 40, 22, 13, 17, 13, 11, 5, 26, 17, 11, 9, 14, 20, 23, 19, 9, 6, 7, 23, 13, 11, 11, 17,
            12, 8, 12, 11, 10, 13, 20, 7, 35, 36, 5, 24, 20, 28, 23, 10, 12, 20, 72, 13, 19, 16, 8, 18, 12, 13, 17, 7, 18,
            52, 17, 16, 15, 5, 23, 11, 13, 12, 9, 9, 5, 8, 28, 22, 35, 45, 48, 43, 13, 31, 7, 10, 10, 9, 8, 18, 19, 2, 29,
            176, 7, 8, 9, 4, 8, 5, 6, 5, 6, 8, 8, 3, 18, 3, 3, 21, 26, 9, 8, 24, 13, 10, 7, 12, 15, 21, 10, 20, 14, 9, 6,
        ],
        [
            31, 33, 22, 35, 27, 23, 35, 27, 36, 18, 32, 31, 28, 25, 35, 33, 33, 28, 24, 29, 30, 31, 29, 35, 34, 28, 28, 27,
            28, 27, 33, 31,
        ],
        [12, 18, 26, 22, 16, 20, 12, 29, 17, 18, 20, 10, 14],
        [8, 17, 17, 11, 16, 16, 13, 13, 14],
        [
            66, 31, 22, 26, 6, 30, 13, 25, 22, 21, 34, 16, 6, 22, 32, 9, 14, 14, 7, 25, 6, 17, 25, 18, 23, 12, 21, 13, 29,
            24, 33, 9, 20, 24, 17, 10, 22, 38, 22, 8, 31, 29, 25, 28, 28, 25, 13, 15, 22, 26, 11, 23, 15, 12, 17, 13, 12,
            21, 14, 21, 22, 11, 12, 19, 12, 25, 24,
        ],
        [
            52, 19, 37, 25, 31, 31, 30, 34, 22, 26, 25, 23, 17, 27, 22, 21, 21, 27, 23, 15, 18, 14, 30, 40, 10, 38, 24, 22,
            17, 32, 24, 40, 44, 26, 22, 19, 32, 21, 28, 18, 16, 18, 22, 13, 30, 5, 28, 7, 47, 39, 46, 64, 34,
        ],
        [5, 22, 22, 66, 22, 22],
        [
            48, 28, 10, 27, 17, 17, 14, 27, 18, 11, 22, 25, 28, 23, 23, 8, 63, 24, 32, 14, 49, 32, 31, 49, 27, 17, 21, 36,
            26, 21, 26, 18, 32, 33, 31, 15, 38, 28, 23, 29, 49, 26, 20, 27, 31, 25, 24, 23, 35,
        ],
        [12, 21, 49, 30, 37, 31, 28, 28, 27, 27, 21, 45, 13],
        [14, 11, 23, 5, 19, 15, 11, 16, 14, 17, 15, 12, 14, 16, 9],
        [3, 20, 32, 21],
        [9, 15, 16, 15, 13, 27, 14, 17, 14, 15],
        [1, 21],
        [4, 17, 10, 10, 11],
        [7, 16, 13, 12, 13, 15, 16, 20],
        [3, 15, 13, 19],
        [3, 17, 20, 19],
        [3, 18, 15, 20],
        [2, 15, 23],
        [14, 21, 13, 10, 14, 11, 15, 14, 23, 17, 12, 17, 14, 9, 21],
        [4, 14, 17, 18, 6],
        [
            28, 25, 23, 17, 25, 48, 34, 29, 34, 38, 42, 30, 50, 58, 36, 39, 28, 27, 35, 30, 34, 46, 46, 39, 51, 46, 75, 66,
            20,
        ],
        [16, 45, 28, 35, 41, 43, 56, 37, 38, 50, 52, 33, 44, 37, 72, 47, 20],
        [24, 80, 52, 38, 44, 39, 49, 50, 56, 62, 42, 54, 59, 35, 35, 32, 31, 37, 43, 48, 47, 38, 71, 56, 53],
        [21, 51, 25, 36, 54, 47, 71, 53, 59, 41, 42, 57, 50, 38, 31, 27, 33, 26, 40, 42, 31, 25],
        [
            28, 26, 47, 26, 37, 42, 15, 60, 40, 43, 48, 30, 25, 52, 28, 41, 40, 34, 28, 41, 38, 40, 30, 35, 27, 27, 32, 44,
            31,
        ],
        [16, 32, 29, 31, 25, 21, 23, 25, 39, 33, 21, 36, 21, 14, 23, 33, 27],
        [16, 31, 16, 23, 21, 13, 20, 40, 13, 27, 33, 34, 31, 13, 40, 58, 24],
        [13, 24, 17, 18, 18, 21, 18, 16, 24, 15, 18, 33, 21, 14],
        [6, 24, 21, 29, 31, 26, 18],
        [6, 23, 22, 21, 32, 33, 24],
        [4, 30, 30, 21, 23],
        [4, 29, 23, 25, 18],
        [5, 10, 20, 13, 18, 28],
        [3, 12, 17, 18],
        [6, 20, 15, 16, 16, 25, 21],
        [4, 18, 26, 17, 22],
        [3, 16, 15, 15],
        [1, 25],
        [13, 14, 18, 19, 16, 14, 20, 28, 13, 28, 39, 40, 29, 25],
        [5, 27, 26, 18, 17, 20],
        [5, 25, 25, 22, 19, 14],
        [3, 21, 22, 18],
        [5, 10, 29, 24, 21, 21],
        [1, 13],
        [1, 14],
        [1, 25],
        [22, 20, 29, 22, 11, 14, 17, 17, 13, 21, 11, 19, 17, 18, 20, 8, 21, 18, 24, 21, 15, 27, 21],
    ];
    const bookNameEnglish = [
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
    ];
    const defaultBookNames = [
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
    ];

    class BibleReference {
        constructor() {
            this.init = init;

            this.getBook = getBook;
            this.getChapter = getChapter;
            this.getVerse = getVerse;

            this.getErrorMessage = getErrorMessage;

            /** @type {any} */
            let _0x460ff1;
            /** @type {any} */
            let _0x198a7a;
            /** @type {any} */
            let _book;
            /** @type {any} */
            let _chapter;
            /** @type {any} */
            let _verse;
            /** @type {string} */
            let _errMessage = "";

            /**
             * @param {string} q
             */
            function init(q) {
                _errMessage = "";
                return _parseQuery(q);
            }

            /**
             * @param {string} q
             *
             * @return boolean
             */
            function _parseQuery(q) {
                let _0x21d96a = true;
                let _0x349e3c = q;
                _chapter = 0x1;
                _verse = 0x1;
                _0x349e3c = _0x349e3c.replace(/^\s+|\s+$/g, "");
                _0x349e3c = _0x349e3c.replace(/\s\s+/g, " ");
                let _0x14f59c = _0x349e3c.split(" ");
                const _0x513c14 = Number.isInteger(parseInt(_0x14f59c[0x0]));
                if (_0x513c14 && _0x14f59c[0x1] != null) {
                    _0x460ff1 = _0x14f59c[0x0] + " " + _0x14f59c[0x1].toLowerCase();
                    if (_0x14f59c[0x2] != null) {
                        let _0x236cd0 = _0x14f59c[0x2].indexOf(":");
                        if (_0x236cd0 !== -0x1) {
                            _0x14f59c = _0x14f59c[0x2].split(":");
                            _chapter = _0x14f59c[0x0];
                            _verse = _0x14f59c[0x1];
                        } else {
                            _chapter = _0x14f59c[0x2];
                            if (_0x14f59c[0x3] != null) {
                                _verse = _0x14f59c[0x3];
                            }
                        }
                    }
                } else {
                    _0x460ff1 = _0x14f59c[0x0].toLowerCase();
                    if (_0x14f59c[0x1] != null) {
                        let _0x236cd0 = _0x14f59c[0x1].indexOf(":");
                        if (_0x236cd0 !== -0x1) {
                            _0x14f59c = _0x14f59c[0x1].split(":");
                            _chapter = _0x14f59c[0x0];
                            _verse = _0x14f59c[0x1];
                        } else {
                            _chapter = _0x14f59c[0x1];
                            if (_0x14f59c[0x2] != null) {
                                _verse = _0x14f59c[0x2];
                            }
                        }
                    }
                }
                const _0x465510 = bookNameEnglish.length;
                _book = -0x1;
                for (let ii = 0x0; ii < _0x465510; ii++) {
                    let _0x57b6e3 = bookNameEnglish[ii].toLowerCase();
                    let _0x34665b = new RegExp("^ " + _0x460ff1);
                    let _0x30b523 = _0x34665b.test(_0x57b6e3);
                    if (_0x30b523) {
                        _0x198a7a = bookNameEnglish[ii];
                        _book = ii + 0x1;
                        break;
                    }
                }
                if (_book === -0x1) {
                    for (let jj = 0x0; jj < _0x465510; jj++) {
                        let _0x57b6e3 = defaultBookNames[jj].toLowerCase();
                        let _0x34665b = new RegExp("^" + _0x460ff1);
                        let _0x30b523 = _0x34665b.test(_0x57b6e3);
                        if (_0x30b523) {
                            _0x198a7a = bookNameEnglish[jj];
                            _book = jj + 0x1;
                            break;
                        }
                    }
                }
                if (!Number.isInteger(parseInt(_chapter))) {
                    _errMessage = "Invalid chapter number.";
                    _0x21d96a = false;
                } else {
                    if (!Number.isInteger(parseInt(_verse))) {
                        _errMessage = "Invalid verse number.";
                        _0x21d96a = false;
                    } else {
                        if (_book === -0x1) {
                            _errMessage = "Did not find matching book name to " + _0x460ff1;
                            _0x21d96a = false;
                        } else {
                            const _0x3f1ba9 = numberOfChapters[_book][0x0];
                            if (_chapter < 0x1 || _chapter > _0x3f1ba9) {
                                _errMessage = "Invalid chapter number for the book " + _0x198a7a;
                                _0x21d96a = false;
                            } else {
                                const _0x898e84 = numberOfChapters[_book][_chapter];
                                if (_verse < 0x1 || _verse > _0x898e84) {
                                    _errMessage = "Invalid verse number for " + _0x198a7a + " " + _chapter;
                                    _0x21d96a = false;
                                }
                            }
                        }
                    }
                }
                return _0x21d96a;
            }

            function getErrorMessage() {
                return _errMessage;
            }

            function getBook() {
                return _book;
            }

            function getChapter() {
                return _chapter;
            }

            function getVerse() {
                return _verse;
            }
        }
    }

    return BibleReference;
}());

const colorList = ["red", "black", "green", "blue", "magenta"];
const numColor = colorList.length;

const b_colorList = ["black", "#0000FF"];
const b_numColor = b_colorList.length;

// OK
export function getSch() {
    const t = toast.loading('Fetching Schedule...');

    apiCall({ cmd: 30 }, ({ok, data, error}) => {
        toast.dismiss(t);

        if (!ok) {
            toast.error('Failed to fetch Schedule!');
        } else {
            fillSch(data);
        }
    });
}

// OK
export function getSchContent() {
    const selectedScheduleValue = store.get(scheduleSelect).value;

    const [schIndex, songId] = selectedScheduleValue.split(':').map(x => parseInt(x));

    const t = toast.loading('Fetching Schedule Content...');

    // if anything is selected
    if (selectedScheduleValue) {
        apiCall({
            cmd: 31,
            index: schIndex,
        }, ({ok, data, error}) => {
            toast.dismiss(t);

            if (!ok) {
                toast.error('Failed to fetch Schedule Content');
            } else {
                processSongResponse(songId, data, true);
            }
        });
    } else {
        toast.warning('Select a schedule to view content.');
    }
}

/**
 * @param {string[]} s
 * */
function splitIN2(s) {
    //Split s in 2 lines SEARCH

    //console.log("Slide: " + s);

    const len = s.length;
    const newSlides = [];
    //console.log("Slide length " + len);

    for (let i = 0; i < len; i++) {
        //console.log("Slide: |" + s[i] + "|");

        const slideIsBlank = isBlank(s[i]); //Function in common.js

        const lines = s[i].split("<BR>");

        //if (lines == null) {
        //	lines = "";
        //}

        let newLine = "";
        const lineLen = lines.length;
        //debug("Line Length: " + lineLen);

        let count = 1;

        if (!slideIsBlank) {
            for (let x = 0; x < lineLen; x++) {
                //This is the code to break into two lines
                //	debug("Line " + (x+1) + "...." + lines[x]);
                if (count === 2) {
                    newLine = newLine + lines[x];
                    newSlides.push(newLine);
                    newLine = "";
                    count = 1;
                } else {
                    newLine = newLine + lines[x] + "<BR>";
                    count++;
                }
            }

            if (count === 2) {
                newSlides.push(newLine); // For odd number of lines
            }
        } else {
            newSlides.push(newLine); //The original is blank. So Push in a blank slide   June 28, 2020
        }
    }

    return newSlides;
}

/**
 * @param {string} str
 * */
function isBlank(str) {
    //print("slideText length" + str.length);
    let slideTxtWithoutSpace = str.replace(/\s/g, ""); // Remove all spaces
    slideTxtWithoutSpace = slideTxtWithoutSpace.replace(/<BR>/g, ""); //Already the \n has been replaced by <BR> so remove that too
    //print("slideText length without space" + slideTxtWithoutSpace.length);

    return slideTxtWithoutSpace.length <= 0;
}

/**
 * @param {any[]} schList
 * */
function fillSch(schList) {
    const options = [];

    for (let i = 0; i < schList.length; i++) {
        if (schList[i].type === 0) { // songs only
            options.push(
                new Option(`${schList[i].name}`, `${schList[i].index}:${schList[i].id}`)
            );
        }
    }

    scheduleSelectOptions.set(options);

    toast.success('Schedule list updated!', {
        description: `${options.length} item${options.length > 1 ? 's' : ''} found.`
    });
}

// OK
export function getBibleRef() {
    getVerses();

    const ref = store.get(bibleSearchQuery);

    const bibleRefObj = new BibleReference();

    if (!bibleRefObj.init(ref)) {
        toast.error('Invalid Bible Reference!', {
            description: bibleRefObj.getErrorMessage()
        });
    } else {
        const t = toast.loading('Loading Bible Reference...');

        apiCall({
            cmd: 8,
            ref: [bibleRefObj.getBook(), bibleRefObj.getChapter(), bibleRefObj.getVerse()],
        }, ({ok, data, error}) => {
            toast.dismiss(t);

            if (!ok) {
                toast.error('Failed to load Bible Reference!');
            } else {
                console.log("Bible", data);
            }
        });
    }
}

// OK
export function goNext() {
    apiCall({ cmd: 2 });
}

// OK
export function goPrevious() {
    apiCall({ cmd: 3 });
}

// OK
export function blankPresentWindow() {
    apiCall({ cmd: 15 });
}

// OK
export function logoPresentWindow() {
    apiCall({ cmd: 14 });
}

// OK
export function closePresentWindow() {
    apiCall({ cmd: 4 });
}

// OK
export function getSongList() {
    const query = store.get(songsSearchQuery);

    const t = toast.loading('Searching Songs...');

    apiCall({
        cmd: 20,
        query,
    }, ({ok, data, error}) => {
        toast.dismiss(t);

        if (!ok) {
            toast.error('Failed to search songs!');
        } else {
            fillSongs(data);
        }
    });
}

// OK
export function setSongBookmark() {
    const selectedScheduleValue = store.get(songsSelect).value;

    if (!selectedScheduleValue) {
        toast.warning('Select a song to bookmark.');
        return;
    }

    const songId = parseInt(selectedScheduleValue);

    apiCall({
        cmd: 22,
        id: songId,
    }, ({ok, error}) => {
        if (!ok) {
            toast.error('Failed to bookmark song!');
        } else {
            toast.success('Song bookmarked!');
        }
    });
}

// OK
export function getVerses() {
    const query = store.get(bibleSearchQuery);

    const bibleRefObj = new BibleReference();

    if (!bibleRefObj.init(query)) { // local check
        toast.error('Invalid Bible Reference!', {
            description: bibleRefObj.getErrorMessage(),
        });
    } else {
        const t = toast.loading('Loading Verses...');

        apiCall({
            cmd: 7,
            ref: query,
        }, ({ok, data, error}) => {
            toast.dismiss(t);

            if (!ok) {
                toast.error('Failed to load verses!');
            } else {
                processVerseResponse(data);
            }
        });
    }
}

/**
 * @param {number} book (non-index)
 * @param {number} chapter (non-index)
 * @param {number} verse (non-index)
 * */
export function loadBibleRef(book, chapter, verse) {
    apiCall({
        cmd: 8,
        ref: [book, chapter, verse],
    }, ({ok, data, error}) => {
        if (!ok) {
            toast.error('Failed to load Bible Reference!');
        } else {
            console.log("Bible", data);
        }
    });
}

/**
 * @param {number} index
 * */
export function getColor(index) {
    return b_colorList[index % b_numColor];
}

/**
 * @param {Record<string, any>} data
 * */
function processVerseResponse(data) {
    versesResult.set(
        Promise.resolve(data)
    );
}

/**
 * @param {Record<string, any>} songs
 * */
function fillSongs(songs) {

    const options = [];

    for (let i = 0; i < songs.length; i++) {
        options.push(
            new Option(songs[i].name, String(songs[i].id))
        );
    }

    songsSelectOptions.set(options);
}

// OK
export function getSongContent() {
    const selectedSchIndex = store.get(songsSelect).value;

    if (!selectedSchIndex) {
        toast.warning('Select a song to fetch.');
        return;
    }

    const songId = parseInt(selectedSchIndex);

    const t = toast.loading('Loading Song Lyrics...');

    apiCall({
        cmd: 21,
        id: songId,
    }, ({ok, data, error}) => {
        toast.dismiss(t);

        if (!ok) {
            toast.error('Failed to load song lyrics!');
        } else {
            processSongResponse(songId, data, false);
        }
    });
}

/**
 * @param {number} songId
 * @param {number} slideIdx
 */
export function presentSongSlide(songId, slideIdx) {
    apiCall({
        cmd: 17,
        id: songId,
        index: slideIdx,
    });
}

/**
 * @param {number} songId
 * @param {any} songObj
 * @param {boolean} isSchedule
 */
function processSongResponse(songId, songObj, isSchedule = false) {
    const obj = {
        ...songObj,
        id: songId,
    }

    const content = Promise.resolve(obj);

    if (isSchedule) {
        scheduleLyricsContent.set(content);
    } else {
        songsLyricsContent.set(content);
    }
}

/**
 * @param {string} x
 * */
function getFirstLine(x) {
    if (store.get(scheduleFirstLine)) {
        const t = x.split("<BR>");
        return t[0];
    }

    return x;
}

/**
 * @param {string} x
 * */
function getFirstLine2(x) {
    if (store.get(songsFirstLine)) {
        const t = x.split("<BR>");
        return t[0];
    }

    return x;
}

/**
 * @callback ApiCallCallback
 * @param {{ok: boolean, data?: any, error?: string}} response
 * */

/**
 * @param {any} params
 * @param {ApiCallCallback?} callback
 */
function apiCall(params, callback = null) {
    const baseUrl = '';
    // const baseUrl = '//localhost:50000';
    const url = [`${baseUrl}/action`, new URLSearchParams({
        data: btoa(JSON.stringify(params)),
    }).toString()].join("?");

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (typeof callback === "function") {
                callback(data);
            }
        })
        .catch(error => {
            toast.error('API Error!', {
                description: error.toString()
            });
        });
}