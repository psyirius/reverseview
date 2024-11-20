<script lang="ts" context="module">
    export const BookInfoMap = [                                                /* [bg, fg] */
        { id: 1,    sym: 'Gn',  name: 'Genesis',            color: ['#7D4E24'] },
        { id: 2,    sym: 'Ex',  name: 'Exodus',             color: ['#7D4E24'] },
        { id: 3,    sym: 'Lv',  name: 'Leviticus',          color: ['#7D4E24'] },
        { id: 4,    sym: 'Nm',  name: 'Numbers',            color: ['#7D4E24'] },
        { id: 5,    sym: 'Dt',  name: 'Deuteronomy',        color: ['#7D4E24'] },
        { id: 6,    sym: 'Jos', name: 'Joshua',             color: ['#D88117'] },
        { id: 7,    sym: 'Jdg', name: 'Judges',             color: ['#D88117'] },
        { id: 8,    sym: 'Ru',  name: 'Ruth',               color: ['#D88117'] },
        { id: 9,    sym: '1Sa', name: '1 Samuel',           color: ['#D88117'] },
        { id: 10,   sym: '2Sa', name: '2 Samuel',           color: ['#D88117'] },
        { id: 11,   sym: '1Ki', name: '1 Kings',            color: ['#D88117'] },
        { id: 12,   sym: '2Ki', name: '2 Kings',            color: ['#D88117'] },
        { id: 13,   sym: '1Ch', name: '1 Chronicles',       color: ['#D88117'] },
        { id: 14,   sym: '2Ch', name: '2 Chronicles',       color: ['#D88117'] },
        { id: 15,   sym: 'Ezr', name: 'Ezra',               color: ['#D88117'] },
        { id: 16,   sym: 'Ne',  name: 'Nehemiah',           color: ['#D88117'] },
        { id: 17,   sym: 'Est', name: 'Esther',             color: ['#D88117'] },
        { id: 18,   sym: 'Job', name: 'Job',                color: ['#CA211A'] },
        { id: 19,   sym: 'Ps',  name: 'Psalms',             color: ['#CA211A'] },
        { id: 20,   sym: 'Pr',  name: 'Proverbs',           color: ['#CA211A'] },
        { id: 21,   sym: 'Ec',  name: 'Ecclesiastes',       color: ['#CA211A'] },
        { id: 22,   sym: 'So',  name: 'Song of Solomon',    color: ['#CA211A'] },
        { id: 23,   sym: 'Is',  name: 'Isaiah',             color: ['#8C347E'] },
        { id: 24,   sym: 'Je',  name: 'Jeremiah',           color: ['#8C347E'] },
        { id: 25,   sym: 'La',  name: 'Lamentations',       color: ['#8C347E'] },
        { id: 26,   sym: 'Ez',  name: 'Ezekiel',            color: ['#8C347E'] },
        { id: 27,   sym: 'Da',  name: 'Daniel',             color: ['#8C347E'] },
        { id: 28,   sym: 'Ho',  name: 'Hosea',              color: ['#8C347E'] },
        { id: 29,   sym: 'Jo',  name: 'Joel',               color: ['#8C347E'] },
        { id: 30,   sym: 'Am',  name: 'Amos',               color: ['#8C347E'] },
        { id: 31,   sym: 'Ob',  name: 'Obadiah',            color: ['#8C347E'] },
        { id: 32,   sym: 'Jn',  name: 'Jonah',              color: ['#8C347E'] },
        { id: 33,   sym: 'Mi',  name: 'Micah',              color: ['#8C347E'] },
        { id: 34,   sym: 'Na',  name: 'Nahum',              color: ['#8C347E'] },
        { id: 35,   sym: 'Ha',  name: 'Habakkuk',           color: ['#8C347E'] },
        { id: 36,   sym: 'Zp',  name: 'Zephaniah',          color: ['#8C347E'] },
        { id: 37,   sym: 'Hg',  name: 'Haggai',             color: ['#8C347E'] },
        { id: 38,   sym: 'Zc',  name: 'Zechariah',          color: ['#8C347E'] },
        { id: 39,   sym: 'Ma',  name: 'Malachi',            color: ['#8C347E'] },
        { id: 40,   sym: 'Mt',  name: 'Matthew',            color: ['#3C468D'] },
        { id: 41,   sym: 'Mk',  name: 'Mark',               color: ['#3C468D'] },
        { id: 42,   sym: 'Lk',  name: 'Luke',               color: ['#3C468D'] },
        { id: 43,   sym: 'Jn',  name: 'John',               color: ['#3C468D'] },
        { id: 44,   sym: 'Ac',  name: 'Acts',               color: ['#008CA7'] },
        { id: 45,   sym: 'Ro',  name: 'Romans',             color: ['#0F8150'] },
        { id: 46,   sym: '1Co', name: '1 Corinthians',      color: ['#0F8150'] },
        { id: 47,   sym: '2Co', name: '2 Corinthians',      color: ['#0F8150'] },
        { id: 48,   sym: 'Ga',  name: 'Galatians',          color: ['#0F8150'] },
        { id: 49,   sym: 'Eph', name: 'Ephesians',          color: ['#0F8150'] },
        { id: 50,   sym: 'Php', name: 'Philippians',        color: ['#0F8150'] },
        { id: 51,   sym: 'Col', name: 'Colossians',         color: ['#0F8150'] },
        { id: 52,   sym: '1Th', name: '1 Thessalonians',    color: ['#0F8150'] },
        { id: 53,   sym: '2Th', name: '2 Thessalonians',    color: ['#0F8150'] },
        { id: 54,   sym: '1Ti', name: '1 Timothy',          color: ['#0F8150'] },
        { id: 55,   sym: '2Ti', name: '2 Timothy',          color: ['#0F8150'] },
        { id: 56,   sym: 'Tit', name: 'Titus',              color: ['#0F8150'] },
        { id: 57,   sym: 'Phm', name: 'Philemon',           color: ['#0F8150'] },
        { id: 58,   sym: 'Heb', name: 'Hebrews',            color: ['#0F8150'] },
        { id: 59,   sym: 'Jm',  name: 'James',              color: ['#0F8150'] },
        { id: 60,   sym: '1Pe', name: '1 Peter',            color: ['#0F8150'] },
        { id: 61,   sym: '2Pe', name: '2 Peter',            color: ['#0F8150'] },
        { id: 62,   sym: '1Jo', name: '1 John',             color: ['#0F8150'] },
        { id: 63,   sym: '2Jo', name: '2 John',             color: ['#0F8150'] },
        { id: 64,   sym: '3Jo', name: '3 John',             color: ['#0F8150'] },
        { id: 65,   sym: 'Jud', name: 'Jude',               color: ['#0F8150'] },
        { id: 66,   sym: 'Rev', name: 'Revelation',         color: ['#7DA91E'] },
    ];

    export const BookCountInfoMap: number[][] = [
        // [ nChapters, ...nVerses ]
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
</script>

<script lang="ts">
    import { ScrollArea } from "$lib/components/ui/scroll-area";

    import type { PaneAPI } from "paneforge";

    import { toast } from "svelte-sonner";
    import {writable} from "svelte/store";
    import {onMount} from "svelte";

    export let current = [0, 0, 0];

    $: {
        toast.message(`Current: ${current}`);
    }

    function getBooks() {
        return BookInfoMap;
    }

    function getChapters(selectedBook: number) {
        const BookInfo = BookInfoMap[selectedBook - 1];
        const [ numChapters ] = BookCountInfoMap[selectedBook - 1];

        return Array.from({ length: numChapters }).map((_, i) => ({
            id: i + 1,
            title: `${i + 1}`,
            book: selectedBook,
            kind: 'chapter',
            color: BookInfo.color,
        }));
    }

    function getVerses(selectedBook: number, selectedChapter: number) {
        const BookInfo = BookInfoMap[selectedBook - 1];
        const [ numChapters, ...numVersesMap ] = BookCountInfoMap[selectedBook - 1];
        const numVerses = numVersesMap[selectedChapter - 1];

        return Array.from({ length: numVerses }).map((_, i) => ({
            id: i + 1,
            title: `${i + 1}`,
            book: selectedBook,
            chapter: selectedChapter,
            kind: 'verse',
            color: BookInfo.color,
        }));
    }

    function setBook(bookId: number) {
        openChapterPane = openVersePane = false;

        $selectedBook = bookId;
        $selectedChapter = 0;

        openChapterPane = true;
    }

    function setChapter(chapterId: number) {
        openVersePane = false;

        $selectedChapter = chapterId;
        $selectedVerse = 0;

        openVersePane = true;
    }

    function setVerse(verseId: number) {
        $selectedVerse = verseId;

        if (![$selectedBook, $selectedChapter, $selectedVerse].every((v, i) => v === current[i])) {
            current = [$selectedBook, $selectedChapter, $selectedVerse];
        }
    }

    let selectedBookDescription: string | undefined;

    $: {
        if (selectedBook && selectedChapter && selectedVerse) {
            selectedBookDescription = getBooks().find(b => b.id === $selectedBook)?.name;
            selectedBookDescription += ` ${selectedChapter}`;
            selectedBookDescription += `:${selectedVerse}`;
        }
    }

    function getAlphaColor(hexColor: string, alpha: number) {
        return hexColor + Math.round(alpha * 255).toString(16).padStart(2, '0');
    }

    let booksPane: PaneAPI;
    let chaptersPane: PaneAPI;
    let versesPane: PaneAPI;

    let selectedBook = writable(0);
    let selectedChapter = writable(0);
    let selectedVerse = writable(0);

    function isBookSelected(book: number) {
        return $selectedBook === book;
    }

    function isChapterSelected(book: number, chapter: number) {
        return $selectedBook === book && $selectedChapter === chapter;
    }

    function isVerseSelected(book: number, chapter: number, verse: number) {
        return $selectedBook === book && $selectedChapter === chapter && $selectedVerse === verse;
    }

    let openChapterPane = false;
    let openVersePane = false;

    let xGridTpl = 'repeat(auto-fill, minmax(3.5rem, 1fr))';

    let booksContainer: HTMLDivElement;

    function calculateCellSize(w: number, h: number, x: number) {
        // // Calculate the approximate number of rows and columns
        // let c = Math.ceil(Math.sqrt(x * w / h)); // Number of columns
        // let r = Math.ceil(x / c); // Number of rows
        //
        // // Adjust columns if necessary
        // if (r * c < x) {
        //     c += 1;
        // }
        //
        // // Calculate the width and height of each cell
        // const cellWidth = w / c;
        // const cellHeight = h / r;
        //
        // return { cellWidth, cellHeight };

        return Math.sqrt((w * h) / x);
    }

    let xCellWidth = 10;
    let xCellHeight = 10;

    onMount(() => {
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { height, width } = entry.contentRect;

                const x = getBooks().length;

                // calculate the size of each cell (square) to contain all cells
                // const cellSize = Math.floor(Math.sqrt((width * height) / x));

                // let { cellWidth, cellHeight } = calculateCellSize(width, height, x);
                let cellSize = calculateCellSize(width, height, x);

                xGridTpl = `repeat(auto-fill, minmax(${Math.max(cellSize, 50)}px, .25fr))`;

                // (entry.target as HTMLDivElement).style.fontSize = `${cellSize / 5}px`;

                // xCellWidth = cellWidth;
                // xCellHeight = cellHeight;

                // toast.message(`Resized: ${height}x${width} => `);
            }
        });

        observer.observe(booksContainer);
    })
</script>

<div class="h-full flex flex-col w-full rounded-md border p-0.5 select-none">
    <Resizable.PaneGroup direction="vertical" class="border rounded-[0.2rem]" autoSaveId="bibleGridPaneGroup">
        <Resizable.Pane defaultSize={50} bind:pane={booksPane}>
            <div class="relative flex h-full max-h-full m-0 p-0" bind:this={booksContainer}>
                <ScrollArea class="absolute flex flex-col h-full w-full">
                    <div class="x-grid books transition" style:grid-template-columns={xGridTpl}>
                        {#each getBooks() as book (book.id)}
                            <div
                                class="x-box bg-opacity-50 cursor-pointer hover:bg-gray-600 transition aspect-square justify-center"
                                class:border-2={$selectedBook === book.id}
                                class:border-black={$selectedBook === book.id}
                                style:background-color={book.color[0]}
                                style:color={book.color[1] || 'white'}
                                onclick={() => setBook(book.id)}
                                onkeyup={(e) => (e.key === 'Enter') && setBook(book.id)}
                                tabindex="0"
                                role="button"
                            >
<!--                                <div class="flex flex-col h-full w-full justify-center items-center">-->
<!--                                </div>-->
                                <p class="font-semibold text-md">{book.sym}</p>
                                <span class="font-light text-xs truncate">{book.name}</span>
                            </div>
                        {/each}
                    </div>
                </ScrollArea>
            </div>
        </Resizable.Pane>

        {#if openChapterPane}
            <Resizable.Handle class="p-0.5" />

            <Resizable.Pane defaultSize={50}>
                <Resizable.PaneGroup direction="horizontal">
                    <Resizable.Pane defaultSize={50} bind:pane={chaptersPane}>
                        <div class="relative flex h-full max-h-full m-0 p-0">
                            <ScrollArea class="absolute flex flex-col h-full w-full">
                                <div class="x-grid chapters">
                                    {#each getChapters($selectedBook) as chapter (chapter.id)}
                                        <div
                                            class="x-box cursor-pointer hover:bg-gray-600 transition aspect-square text-white"
                                            class:border-2={$selectedBook === chapter.book && $selectedChapter === chapter.id}
                                            class:border-black={$selectedBook === chapter.book && $selectedChapter === chapter.id}
                                            style:background-color={getAlphaColor(chapter.color[0], 1)}
                                            style:color={chapter.color[1] || 'white'}
                                            onclick={() => setChapter(chapter.id)}
                                            onkeyup={(e) => (e.key === 'Enter') && setChapter(chapter.id)}
                                            tabindex="0"
                                            role="button"
                                        >
                                            <span>{chapter.title}</span>
                                        </div>
                                    {/each}
                                </div>
                            </ScrollArea>
                        </div>
                    </Resizable.Pane>

                    {#if openVersePane}
                        <Resizable.Handle class="p-0.5" />

                        <Resizable.Pane defaultSize={50} bind:pane={versesPane}>
                            <div class="relative flex h-full max-h-full m-0 p-0">
                                <ScrollArea class="absolute flex flex-col h-full w-full">
                                    <div class="x-grid verses">
                                        {#each getVerses($selectedBook, $selectedChapter) as verse (verse.id)}
                                            <div
                                                class="x-box bg-opacity-80 cursor-pointer hover:bg-gray-600 transition aspect-square"
                                                class:border-2={$selectedBook === verse.book && $selectedChapter === verse.chapter && $selectedVerse === verse.id}
                                                class:border-black={$selectedBook === verse.book && $selectedChapter === verse.chapter && $selectedVerse === verse.id}
                                                style:background-color={getAlphaColor(verse.color[0], 0.80)}
                                                style:color={verse.color[1] || 'white'}
                                                onclick={() => setVerse(verse.id)}
                                                onkeyup={(e) => (e.key === 'Enter') && setVerse(verse.id)}
                                                tabindex="0"
                                                role="button"
                                            >
                                                <span>{verse.title}</span>
                                            </div>
                                        {/each}
                                    </div>
                                </ScrollArea>
                            </div>
                        </Resizable.Pane>
                    {/if}
                </Resizable.PaneGroup>
            </Resizable.Pane>
        {/if}
    </Resizable.PaneGroup>
</div>

<style lang="scss">
    .x-grid {
        @apply grid;
        @apply grid-cols-10;
        @apply transition;
        //grid-template-columns: repeat(auto-fit, minmax(2.5rem, 1fr));
        gap: 0.1rem;

        & > .x-box {
            display: grid;
            place-content: center;
            //@apply flex flex-col justify-center items-center text-ellipsis;
        }
    }
</style>