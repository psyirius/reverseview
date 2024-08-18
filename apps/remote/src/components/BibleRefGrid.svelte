<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import * as Resizable from "$lib/components/ui/resizable";
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import { Separator } from "$lib/components/ui/separator";
    import { ScrollArea } from "$lib/components/ui/scroll-area";
    import { Checkbox } from "$lib/components/ui/checkbox";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import type { PaneAPI } from "paneforge";
    import {
    } from 'lucide-svelte';

    import { flyAndScale } from "$lib/utils";
    import { flip } from 'svelte/animate'
    import { fade, fly, scale, slide } from "svelte/transition";

    import { toast } from "svelte-sonner";

    function getBooks() {
        return [                                                /* [bg, fg] */
            { id: 1,    sym: 'Gn',  name: 'Genesis',        color: ['#7D4E24'] },
            { id: 2,    sym: 'Ex',  name: 'Exodus',         color: ['#7D4E24'] },
            { id: 3,    sym: 'Lv',  name: 'Leviticus',      color: ['#7D4E24'] },
            { id: 4,    sym: 'Nm',  name: 'Numbers',        color: ['#7D4E24'] },
            { id: 5,    sym: 'Dt',  name: 'Deuteronomy',    color: ['#7D4E24'] },
            { id: 6,    sym: 'Jos', name: 'Joshua',         color: ['#D88117'] },
            { id: 7,    sym: 'Jdg', name: 'Judges',         color: ['#D88117'] },
            { id: 8,    sym: 'Ru',  name: 'Ruth',           color: ['#D88117'] },
            { id: 9,    sym: '1Sa', name: '1 Samuel',       color: ['#D88117'] },
            { id: 10,   sym: '2Sa', name: '2 Samuel',       color: ['#D88117'] },
            { id: 11,   sym: '1Ki', name: '1 Kings',        color: ['#D88117'] },
            { id: 12,   sym: '2Ki', name: '2 Kings',        color: ['#D88117'] },
            { id: 13,   sym: '1Ch', name: '1 Chronicles',   color: ['#D88117'] },
            { id: 14,   sym: '2Ch', name: '2 Chronicles',   color: ['#D88117'] },
            { id: 15,   sym: 'Ezr', name: 'Ezra',           color: ['#D88117'] },
            { id: 16,   sym: 'Ne',  name: 'Nehemiah',       color: ['#D88117'] },
            { id: 17,   sym: 'Est', name: 'Esther',         color: ['#D88117'] },
            { id: 18,   sym: 'Job', name: 'Job',            color: ['#CA211A'] },
            { id: 19,   sym: 'Ps',  name: 'Psalms',         color: ['#CA211A'] },
            { id: 20,   sym: 'Pr',  name: 'Proverbs',       color: ['#CA211A'] },
            { id: 21,   sym: 'Ec',  name: 'Ecclesiastes',   color: ['#CA211A'] },
            { id: 22,   sym: 'So',  name: 'Song of Solomon',color: ['#CA211A'] },
            { id: 23,   sym: 'Is',  name: 'Isaiah',         color: ['#8C347E'] },
            { id: 24,   sym: 'Je',  name: 'Jeremiah',       color: ['#8C347E'] },
            { id: 25,   sym: 'La',  name: 'Lamentations',   color: ['#8C347E'] },
            { id: 26,   sym: 'Ez',  name: 'Ezekiel',        color: ['#8C347E'] },
            { id: 27,   sym: 'Da',  name: 'Daniel',         color: ['#8C347E'] },
            { id: 28,   sym: 'Ho',  name: 'Hosea',          color: ['#8C347E'] },
            { id: 29,   sym: 'Jo',  name: 'Joel',           color: ['#8C347E'] },
            { id: 30,   sym: 'Am',  name: 'Amos',           color: ['#8C347E'] },
            { id: 31,   sym: 'Ob',  name: 'Obadiah',        color: ['#8C347E'] },
            { id: 32,   sym: 'Jn',  name: 'Jonah',          color: ['#8C347E'] },
            { id: 33,   sym: 'Mi',  name: 'Micah',          color: ['#8C347E'] },
            { id: 34,   sym: 'Na',  name: 'Nahum',          color: ['#8C347E'] },
            { id: 35,   sym: 'Ha',  name: 'Habakkuk',       color: ['#8C347E'] },
            { id: 36,   sym: 'Zp',  name: 'Zephaniah',      color: ['#8C347E'] },
            { id: 37,   sym: 'Hg',  name: 'Haggai',         color: ['#8C347E'] },
            { id: 38,   sym: 'Zc',  name: 'Zechariah',      color: ['#8C347E'] },
            { id: 39,   sym: 'Ma',  name: 'Malachi',        color: ['#8C347E'] },
            { id: 40,   sym: 'Mt',  name: 'Matthew',        color: ['#3C468D'] },
            { id: 41,   sym: 'Mk',  name: 'Mark',           color: ['#3C468D'] },
            { id: 42,   sym: 'Lk',  name: 'Luke',           color: ['#3C468D'] },
            { id: 43,   sym: 'Jn',  name: 'John',           color: ['#3C468D'] },
            { id: 44,   sym: 'Ac',  name: 'Acts',           color: ['#008CA7'] },
            { id: 45,   sym: 'Ro',  name: 'Romans',         color: ['#0F8150'] },
            { id: 46,   sym: '1Co', name: '1 Corinthians',  color: ['#0F8150'] },
            { id: 47,   sym: '2Co', name: '2 Corinthians',  color: ['#0F8150'] },
            { id: 48,   sym: 'Ga',  name: 'Galatians',      color: ['#0F8150'] },
            { id: 49,   sym: 'Eph', name: 'Ephesians',      color: ['#0F8150'] },
            { id: 50,   sym: 'Php', name: 'Philippians',    color: ['#0F8150'] },
            { id: 51,   sym: 'Col', name: 'Colossians',     color: ['#0F8150'] },
            { id: 52,   sym: '1Th', name: '1 Thessalonians',color: ['#0F8150'] },
            { id: 53,   sym: '2Th', name: '2 Thessalonians',color: ['#0F8150'] },
            { id: 54,   sym: '1Ti', name: '1 Timothy',      color: ['#0F8150'] },
            { id: 55,   sym: '2Ti', name: '2 Timothy',      color: ['#0F8150'] },
            { id: 56,   sym: 'Tit', name: 'Titus',          color: ['#0F8150'] },
        ];
    }

    function getChapters(selectedBook: number) {
        return Array.from({ length: 50 }).map((_, i, a) => ({
            id: i + 1,
            title: `Chapter ${i + 1}`,
            description: `Chapter ${i + 1}`,
            kind: 'chapter',
        }));
    }

    function getVerses(selectedBook: number, selectedChapter: number) {
        return Array.from({ length: 50 }).map((_, i, a) => ({
            id: i + 1,
            title: `Verse ${i + 1}`,
            description: `Verse ${i + 1}`,
            kind: 'verse',
        }));
    }

    function setBook(bookId: number) {
        selectedBook = bookId;
    }

    function setChapter(chapterId: number) {
        selectedChapter = chapterId;
    }

    function setVerse(verseId: number) {
        selectedVerse = verseId;
    }

    let selectedBookDescription: string | undefined;

    $: {
        if (selectedBook && selectedChapter && selectedVerse) {
            selectedBookDescription = getBooks().find(b => b.id === selectedBook)?.name;
            selectedBookDescription += ` ${selectedChapter}`;
            selectedBookDescription += `:${selectedVerse}`;
        }
    }

    let booksPane: PaneAPI;
    let chaptersPane: PaneAPI;
    let versesPane: PaneAPI;

    let selectedBook = 0;
    let selectedChapter = 0;
    let selectedVerse = 0;
</script>

<div class="h-full flex flex-col w-full rounded-md border p-0.5 select-none">
    <Resizable.PaneGroup direction="vertical" class="border rounded-[0.2rem]" autoSaveId="bibleGridPaneGroup">
        <Resizable.Pane defaultSize={50} bind:pane={booksPane}>
            <div class="relative flex h-full max-h-full m-0 p-0">
                <ScrollArea class="absolute flex flex-col h-full w-full">
                    <div class="x-grid books">
                        {#each getBooks() as book (book.id)}
                            <div
                                class="x-box bg-opacity-80 cursor-pointer hover:bg-gray-600 transition aspect-square"
                                class:bg-black={selectedBook === book.id}
                                style:background={book.color[0]}
                                on:click={() => setBook(book.id)}
                                on:keyup={(e) => e.key === 'Enter' && setBook(book.id)}
                                tabindex="0"
                                role="button"
                            >
                                <h4>{book.sym}</h4>
                                <span>{book.name}</span>
                            </div>
                        {/each}
                    </div>
                </ScrollArea>
            </div>
        </Resizable.Pane>

        {#if !!selectedBook}
            <Resizable.Handle class="p-0.5" />

            <Resizable.Pane defaultSize={50}>
                <Resizable.PaneGroup direction="horizontal">
                    <Resizable.Pane defaultSize={50} bind:pane={chaptersPane}>
                        <div class="relative flex h-full max-h-full m-0 p-0">
                            <ScrollArea class="absolute flex flex-col h-full w-full">
                                <div class="x-grid chapters">
                                    {#each getChapters(selectedBook) as chapter (chapter.id)}
                                        <div
                                            class="x-box bg-opacity-80 cursor-pointer hover:bg-gray-600 transition aspect-square"
                                            class:bg-black={selectedChapter === chapter.id}
                                            on:click={() => setChapter(chapter.id)}
                                            on:keyup={(e) => e.key === 'Enter' && setChapter(chapter.id)}
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

                    {#if !!selectedChapter}
                        <Resizable.Handle class="p-0.5" />

                        <Resizable.Pane defaultSize={50} bind:pane={versesPane}>
                            <div class="relative flex h-full max-h-full m-0 p-0">
                                <ScrollArea class="absolute flex flex-col h-full w-full">
                                    <div class="x-grid verses">
                                        {#each getVerses(selectedBook, selectedChapter) as verse (verse.id)}
                                            <div
                                                class="x-box bg-opacity-80 cursor-pointer hover:bg-gray-600 transition aspect-square"
                                                class:bg-black={selectedVerse === verse.id}
                                                on:click={() => setVerse(verse.id)}
                                                on:keyup={(e) => e.key === 'Enter' && setVerse(verse.id)}
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
        //@apply grid-cols-10;
        grid-template-columns: repeat(auto-fill, minmax(3.5rem, 1fr));
        gap: 0.1rem;

        & > .x-box {
            display: grid;
            place-content: center;
            @apply bg-gray-600;
        }
    }
</style>