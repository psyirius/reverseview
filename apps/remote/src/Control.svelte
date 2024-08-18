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
        scheduleTwoLinePresent,
        songsSelect,
        songsSelectOptions,
        songsFirstLine,
        scheduleFirstLine,
        songsTwoLinePresent,
        bibleSearchQuery,
        songsSearchQuery,
        versesResult,
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

    let selectedTab = 'schedule';

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
        class=""
    >
        <Tabs.List class="">
            {#each tabs as tab}
                <Tabs.Trigger
                    value={tab.id}
                    class=""
                >
                    {tab.title}
                </Tabs.Trigger>
            {/each}
        </Tabs.List>

        <!-- Tab: Bible -->
        <Tabs.Content value="bible" class="">
            <div class="" >
                <Label>Reference</Label>

                <div class="">
                    <div class="">
                        <!-- #remote_bibleRefID -->
                        <input
                            type="text"
                            class=""
                            bind:value={$bibleSearchQuery}
                            on:keyup={onBibleSearchKeyUp}
                            placeholder=""
                        />
                    </div>

                    <div class="">
                        <Button.Root on:click={getVerses}>
                            <SearchIcon />
                        </Button.Root>

                        <Button.Root on:click={getBibleRef}>
                            <MonitorUpIcon />
                        </Button.Root>
                    </div>
                </div>

                <ControlMenu />

                <VerseListContent content={versesResult} />
            </div>
        </Tabs.Content>

        <!-- Tab: Schedule -->
        <Tabs.Content value="schedule" class="">
            <div class="">
                <div class="">
                    <div class="">
                        <select class="" bind:this={$scheduleSelect}>
                            {#each $scheduleSelectOptions as option (option.value)}
                                <option value={option.value}>{option.text}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="">
                        <Button.Root on:click={getSch}>
                            <RefreshCcwIcon />
                        </Button.Root>

                        <Button.Root on:click={getSchContent}>
                            <ArrowDownToLineIcon />
                        </Button.Root>
                    </div>

                    <div class="">
                        <!-- #singleLine -->
                        <div class="">
                            <input type="checkbox" bind:checked={$scheduleFirstLine} />
                            <Label
                                for=""
                                class=""
                            >
                                First Line
                            </Label>
                        </div>

                        <!-- #twoLinePresent -->
                        <div class="">
                            <input type="checkbox" bind:checked={$scheduleTwoLinePresent} />
                            <Label
                                for=""
                                class=""
                            >
                                Present Two Lines
                            </Label>
                        </div>
                    </div>
                </div>

                <ControlMenu />

                <LyricListContent content={scheduleLyricsContent} />
            </div>
        </Tabs.Content>

        <!-- Tab: Songs -->
        <Tabs.Content value="songs" class="">
            <div class="" >
                <Label>Search Song</Label>

                <div class="">
                    <div class="">
                        <!-- #remote_songSearchID -->
                        <input
                            type="text"
                            class=""
                            bind:value={$songsSearchQuery}
                            on:keyup={onSongSearchKeyUp}
                            placeholder=""
                        />
                    </div>

                    <div class="">
                        <Button.Root on:click={getSongList} >
                            <SearchIcon />
                        </Button.Root>

                        <Button.Root on:click={getSongContent}>
                            <ArrowDownToLineIcon />
                        </Button.Root>

                        <Button.Root on:click={setSongBookmark}>
                            <BookmarkPlusIcon />
                        </Button.Root>
                    </div>
                </div>

                <div class="">
                    <div class="">
                        <select class="" id="songID" bind:this={$songsSelect}>
                            {#each $songsSelectOptions as option (option.value)}
                                <option value={option.value}>{option.label}</option>
                            {/each}
                        </select>
                    </div>
                </div>

                <div class="">
                    <!-- #singleLine2 -->
                    <div class="">
                        <input type="checkbox" bind:checked={$songsFirstLine} />
                        <Label
                            for=""
                            class=""
                        >
                            First Line
                        </Label>
                    </div>

                    <!-- #twoLinePresent2 -->
                    <div class="">
                        <input type="checkbox" bind:checked={$songsTwoLinePresent} />
                        <Label
                            for=""
                            class=""
                        >
                            Present Two Lines
                        </Label>
                    </div>
                </div>

                <ControlMenu />

                <LyricListContent content={songsLyricsContent} />
            </div>
        </Tabs.Content>
    </Tabs.Root>

    <Toaster position="bottom-center" richColors />
</main>