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
        return Array.from({ length: 66 }).map((_, i, a) => ({
            id: i + 1,
            title: `Book ${i + 1}`,
            description: `Book ${i + 1}`,
            kind: 'book',
        }));
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
                                class="bg-opacity-80 cursor-pointer hover:bg-gray-600 transition aspect-square"
                                class:bg-black={selectedBook === book.id}
                                on:click={() => setBook(book.id)}
                                on:keyup={(e) => e.key === 'Enter' && setBook(book.id)}
                                tabindex="0"
                                role="button"
                            >
                                <span>{book.title}</span>
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
                                            class="bg-opacity-80 cursor-pointer hover:bg-gray-600 transition aspect-square"
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
                                                class="bg-opacity-80 cursor-pointer hover:bg-gray-600 transition aspect-square"
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

        & > * {
            display: grid;
            place-content: center;
        }
    }
</style>