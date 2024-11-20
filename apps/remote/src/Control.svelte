<script lang="ts">
    import { Toaster } from "svelte-sonner";
    import { } from "bits-ui";

    import * as Tabs from "$lib/components/ui/tabs";
    import * as Button from "$lib/components/ui/button";

    import Label from "$lib/components/ui/label/label.svelte";

    import {
        getSch,
        getVerses,
        getBibleRef,
        getSongList,
        getSchContent,
        getSongContent,
        setSongBookmark,

        // stores
        scheduleSelect,
        scheduleSelectOptions,
        songsSelect,
        songsSelectOptions,
        bibleSearchQuery,
        songsSearchQuery,
        versesContent,
        scheduleLyricsContent,
        songsLyricsContent,
    } from "./etc/control";

    import ControlMenu from "./etc/ControlMenu.svelte";

    import {
        SearchIcon,
        MonitorUpIcon,
        BookmarkPlusIcon,
        ArrowDownToLineIcon,
        RefreshCcwIcon,
    } from 'lucide-svelte';
    import VerseListContent from "./etc/VerseListContent.svelte";
    import LyricListContent from "./etc/LyricListContent.svelte";

    const tabs = [
        { id: 'bible', title: 'Bible' },
        { id: 'schedule', title: 'Schedule' },
        { id: 'songs', title: 'Songs' },
    ];

    let selectedTab = 'bible';

    function onBibleSearchKeyUp(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            getVerses();
        }
    }

    function onSongSearchKeyUp(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            getSongList();
        }
    }
</script>

<main>
    <Tabs.Root
        bind:value={selectedTab}
        class="h-full w-full flex flex-col gap-2"
    >
        <Tabs.List class="grid grid-cols-3 w-full">
            {#each tabs as tab}
                <Tabs.Trigger value={tab.id}>{tab.title}</Tabs.Trigger>
            {/each}
        </Tabs.List>

        <!-- Tab: Bible -->
        <Tabs.Content value="bible" class="m-0 h-full">
            <div class="tab-content">
                <Label>Reference</Label>

                <div class="flex flex-row justify-between gap-2">
                    <div class="flex w-full">
                        <input
                            type="text"
                            class="w-full border rounded-md"
                            bind:value={$bibleSearchQuery}
                            onkeyup={onBibleSearchKeyUp}
                            placeholder=""
                        />
                    </div>

                    <div class="flex flex-row gap-2">
                        <Button.Root onclick={getVerses}>
                            <SearchIcon />
                        </Button.Root>

                        <Button.Root onclick={getBibleRef}>
                            <MonitorUpIcon />
                        </Button.Root>
                    </div>
                </div>

                <ControlMenu />

                <VerseListContent content={versesContent} />
            </div>
        </Tabs.Content>

        <!-- Tab: Schedule -->
        <Tabs.Content value="schedule" class="m-0 h-full">
            <div class="tab-content">
                <Label>Scheduled Songs</Label>

                <div class="flex flex-row justify-between gap-2">
                    <div class="flex w-full">
                        <select class="w-full border rounded-md" bind:this={$scheduleSelect}>
                            {#each $scheduleSelectOptions as option (option.value)}
                                <option value={option.value}>{option.text}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="flex flex-row gap-2">
                        <Button.Root onclick={getSch}>
                            <RefreshCcwIcon />
                        </Button.Root>

                        <Button.Root onclick={getSchContent}>
                            <ArrowDownToLineIcon />
                        </Button.Root>
                    </div>
                </div>

                <ControlMenu />

                <LyricListContent content={scheduleLyricsContent} />
            </div>
        </Tabs.Content>

        <!-- Tab: Songs -->
        <Tabs.Content value="songs" class="m-0 h-full">
            <div class="tab-content" >
                <Label>Search Song</Label>

                <div class="flex flex-row justify-between gap-2">
                    <div class="flex w-full flex-row gap-2">
                        <input
                            type="text"
                            class="w-full border rounded-md"
                            bind:value={$songsSearchQuery}
                            onkeyup={onSongSearchKeyUp}
                            placeholder=""
                        />

                        <div class="flex w-full">
                            <select class="w-full border rounded-md" bind:this={$songsSelect}>
                                {#each $songsSelectOptions as option (option.value)}
                                    <option value={option.value}>{option.label}</option>
                                {/each}
                            </select>
                        </div>
                    </div>

                    <div class="flex flex-row gap-2">
                        <Button.Root onclick={getSongList} >
                            <SearchIcon />
                        </Button.Root>

                        <Button.Root onclick={getSongContent}>
                            <ArrowDownToLineIcon />
                        </Button.Root>

                        <Button.Root onclick={setSongBookmark}>
                            <BookmarkPlusIcon />
                        </Button.Root>
                    </div>
                </div>

                <ControlMenu />

                <LyricListContent content={songsLyricsContent} />
            </div>
        </Tabs.Content>
    </Tabs.Root>

    <Toaster position="bottom-center" richColors />
</main>

<style lang="scss">
    main {
        @apply flex;
        @apply flex-col;
        @apply gap-4;
        @apply p-2;
        //@apply border-2 border-red-200;
        @apply h-full w-full;
        @apply justify-between;
    }

    .tab-content {
        @apply flex flex-col;
        @apply gap-2;
        @apply p-0 m-0;
        @apply w-full;
        @apply h-full;
    }
</style>