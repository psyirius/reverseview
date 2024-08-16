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
        SearchIcon,
        MonitorUpIcon,
    } from 'lucide-svelte';

    const _songs = Array.from({ length: 50 }).map(
        (_, i, a) => `v1.2.0-beta.${a.length - i}`
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

                <Tooltip.Root>
                    <Tooltip.Trigger asChild let:builder>
                        <Button builders={[builder]} variant="default">
                            <MonitorUpIcon />
                        </Button>
                    </Tooltip.Trigger>

                    <Tooltip.Content>
                        <p>Present Verse</p>
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
                    defaultSize={40}
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
                                <div class="p-4">
                                    {#each songs as song, i (song)}
                                        {#if i > 0}
                                            <Separator class="my-2" />
                                        {/if}
                                        <div class="text-sm bg-opacity-50 cursor-pointer overflow-ellipsis">
                                            {song}
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
                        defaultSize={60}
                        minSize={40}
                        bind:pane={slideListPane}
                    >
                        <div class="pt-3">
                            <h4 class="text-sm font-medium leading-none">{title}</h4>
                            <p class="text-muted-foreground text-sm">{description}</p>
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