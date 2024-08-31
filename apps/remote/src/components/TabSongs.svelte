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
    import { XIcon, BookmarkPlusIcon, BookmarkCheckIcon, BookmarkMinusIcon } from "lucide-svelte";
    import { flyAndScale } from "$lib/utils";
    import { fade, fly, scale, slide } from "svelte/transition";
    import { flip } from 'svelte/animate'

    import {
        SearchIcon,
        MonitorUpIcon,
    } from 'lucide-svelte';
    import {toast} from "svelte-sonner";

    function openSlidePanel(e: any) {
        slidesList = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(_slides);
            }, 1000);
        });
        songMeta = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    title: e.target.innerText,
                    description: e.target.innerText,
                });
            }, 1000);
        });
        slidesPaneCollapsed = false;
    }

    const _songs = Array.from({ length: 50 }).map(
        (_, i, a) => ({
            title: `Sing song song ${a.length - i}`,
            description: `Sing song song ${a.length - i}`,
            bookmarked: Math.random() > 0.5,
        })
    );

    const _slides = Array.from({ length: 50 }).map(
        (_, i, a) => [1,2,3,4].map(() => `${a.length - i} Hhsiofho cvebv eoe oe`).join('<br>')
    );

    let title = "Reference";
    let description = "An open-source UI component library.";

    let songListPane: PaneAPI;
    let slideListPane: PaneAPI;

    let slidesPaneCollapsed = false;
    let numSongSkeletons = Math.round(window.innerHeight * 0.52 / 48);

    let songList: PromiseLike<any[]> = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(_songs);
        }, 3000);
    });
    let slidesList: PromiseLike<any[]> = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(_slides);
        }, 3000);
    });
    let songMeta: PromiseLike<any> = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ title, description });
        }, 3000);
    });
</script>

<div class="container">
    <Card.Root class="h-full flex flex-col justify-between">
        <Card.Header class="py-6">
<!--            <Card.Title>-->
<!--                <Label for="song-query">Songs</Label>-->
<!--            </Card.Title>-->

            <Card.Description class="flex flex-row gap-2">
                <Input id="song-query" type="text" placeholder="Song name..." class="max-w-full" />

                <Tooltip.Root>
                    <Tooltip.Trigger asChild let:builder>
                        <Button builders={[builder]} variant="default" >
                            <SearchIcon />
                        </Button>
                    </Tooltip.Trigger>

                    <Tooltip.Content>
                        <p>Search Reference</p>
                    </Tooltip.Content>
                </Tooltip.Root>
            </Card.Description>
        </Card.Header>

        <Separator class="" />

        <Card.Content class="flex flex-col gap-2 h-full py-6">
            <Resizable.PaneGroup
                direction="horizontal"
                autoSaveId="songsPaneGroup"
                class="rounded-md border"
            >
                <Resizable.Pane
                    defaultSize={35}
                    collapsible={true}
                    collapsedSize={0}
                    minSize={25}
                    bind:pane={songListPane}
                >
                    <div class="relative flex h-full max-h-full m-0 p-0">
                        <ScrollArea class="absolute flex flex-col h-full w-full">
                            {#await songList}
                                <div class="p-4">
                                    {#each { length: numSongSkeletons } as _, i}
                                        <div class="items-center space-y-2">
                                            {#if i > 0}
                                                <Separator class="my-3" />
                                            {/if}
                                            <Skeleton class="h-4 w-full" />
                                            <Skeleton class="h-3 w-3/4" />
                                        </div>
                                    {/each}
                                </div>
                            {:then songs}
                                <div class="p-4" transition:fade={{ delay: 0, duration: 250 }}>
                                    {#each songs as song, i (song)}
                                        {#if i > 0}
                                            <Separator class="my-2" />
                                        {/if}
                                        <div
                                            class="bg-opacity-50 flex flex-row justify-between items-center gap-2"
                                        >
                                            <div
                                                class="cursor-pointer"
                                                on:click={openSlidePanel}
                                                on:keyup={openSlidePanel}
                                                role="button"
                                                tabindex="0"
                                            >
                                                <h4 class="text-sm font-medium leading-none truncate">{song.title}</h4>
                                                <p class="text-muted-foreground text-sm truncate">{song.description}</p>
                                            </div>

                                            <div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    on:click={() => {
                                                        if (song.bookmarked) {
                                                            toast.success('Song removed from bookmarks');
                                                        } else {
                                                            toast.success('Song added to bookmarks');
                                                        }
                                                    }}
                                                >
                                                    {#if !song.bookmarked}
                                                        <BookmarkPlusIcon size="16" />
                                                    {:else}
                                                        <BookmarkMinusIcon size="16" />
                                                    {/if}
                                                </Button>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            {:catch someError}
                                <div class="py-2 px-4">
                                    System error: {someError.message}.
                                </div>
                            {/await}
                        </ScrollArea>
                    </div>
                </Resizable.Pane>

                {#if !slidesPaneCollapsed}
                    <Resizable.Handle withHandle />
                    <Resizable.Pane
                        defaultSize={65}
                        minSize={40}
                        bind:pane={slideListPane}
                    >
                        <div class="flex flex-col gap-0 h-full">
                            <div class="flex flex-row space-y-2 justify-between py-2 px-4 bg-gray-50 bg-opacity-50">
                                <div class="w-full h-full">
                                    <div class="space-y-1 w-full" transition:fade={{ delay: 0, duration: 250 }}>
                                        {#await songMeta}
                                            <Skeleton class="h-4 w-2/4" />
                                            <Skeleton class="h-4 w-10/12" />
                                        {:then meta}
                                            <h4 class="text-sm font-medium leading-none truncate">{meta.title}</h4>
                                            <p class="text-muted-foreground text-sm truncate">{meta.description}</p>
                                        {:catch err}
                                            <h4 class="text-sm font-medium leading-none text-red-600 truncate">
                                                {'!!! Failed to Load Song Lyrics !!!'}
                                            </h4>
                                            <p class="text-muted-foreground text-sm truncate">{err.message}</p>
                                        {/await}
                                    </div>
                                </div>

                                <div class="relative text-muted-foreground flex">
                                    <div class="absolute top-0 right-0">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            class="size-6"
                                            on:click={() => {
                                            slidesPaneCollapsed = !slidesPaneCollapsed;
                                        }}
                                        >
                                            <XIcon size="16" />
                                        </Button>
                                    </div>
                                </div>

                                <!-- absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full text-vermilion-800 hover:bg-vermilion-100 focus:shadow-vermilion-400 focus:outline-none focus:ring-2 focus:ring-black -->
<!--                                <div class="relative p-0 m-0 flex">-->
<!--                                    <button class="absolute right-0 text-muted-foreground">-->
<!--                                        <XIcon size="16" />-->
<!--                                    </button>-->

<!--                                </div>-->
                            </div>

                            <Separator class="" />

                            <!-- Use Sheet in or BottomPane in Mobile -->
                            <div class="relative flex h-full max-h-full m-0 p-0">
                                <ScrollArea class="absolute flex flex-col h-full w-full">
                                    {#await slidesList}
                                        <div class="p-4">
                                            {#each { length: numSongSkeletons } as _, i}
                                                <div class="items-center space-y-2">
                                                    {#if i > 0}
                                                        <Separator class="my-3" />
                                                    {/if}
                                                    <Skeleton class="h-4 w-full" />
                                                    <Skeleton class="h-3 w-3/4" />
                                                </div>
                                            {/each}
                                        </div>
                                    {:then slides}
                                        <div class="p-4">
                                            {#each slides as slide, i (slide)}
                                                {#if i > 0}
                                                    <Separator class="my-2" />
                                                {/if}
                                                <div
                                                    class="text-sm bg-opacity-50 cursor-pointer overflow-ellipsis"
                                                    tabindex="0"
                                                    role="button"
                                                    on:click={() => {
                                                        toast.success('Clicked on slide');
                                                    }}
                                                    on:keyup={() => {
                                                        toast.success('Clicked on slide');
                                                    }}
                                                >
                                                    <!-- FIXME: DANGER -->
                                                    {@html slide}
                                                </div>
                                            {/each}
                                        </div>
                                    {:catch someError}
                                        <div class="py-2 px-4">
                                            System error: {someError.message}.
                                        </div>
                                    {/await}
                                </ScrollArea>
                            </div>
                        </div>
                    </Resizable.Pane>
                {/if}
            </Resizable.PaneGroup>
        </Card.Content>

        <!--        <Card.Footer class="bg-black text-red-50">-->
        <!--            >>>>>-->
        <!--        </Card.Footer>-->
    </Card.Root>
</div>

<style lang="scss">
    .container {
        @apply flex flex-col;
        @apply p-0 m-0;
        @apply w-full;
        @apply h-full;
    }
</style>