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
    import { CircleArrowRightIcon, ListMusicIcon, BookmarkXIcon, BookTextIcon } from "lucide-svelte";
    import { flyAndScale } from "$lib/utils";
    import { fade, fly, scale, slide } from "svelte/transition";
    import { flip } from 'svelte/animate'

    import {
        SearchIcon,
        MonitorUpIcon,
    } from 'lucide-svelte';
    import { toast } from "svelte-sonner";

    type ScheduleType = 'songs' | 'bible';

    const _schedule = Array.from({ length: 50 }).map(
        (_, i, a) => ({
            title: `Sing song song ${a.length - i}`,
            description: `Sing song song ${a.length - i}`,
            kind: Math.random() > 0.5 ? 'song' : 'bible',
        })
    );

    let numSkeletons = Math.round(window.innerHeight * 0.52 / 42);

    let scheduleList: PromiseLike<any[]> = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(_schedule);
        }, 10000);
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
            <div class="relative flex h-full max-h-full m-0 p-0 rounded-md border">
                <ScrollArea class="absolute flex flex-col h-full w-full">
                    {#await scheduleList}
                        <div class="p-4">
                            {#each { length: numSkeletons } as _, i}
                                {#if i > 0}
                                    <Separator class="my-2" />
                                {/if}
                                <div class="flex items-center justify-between gap-8">
                                    <div class="flex items-center w-full gap-2">
                                        <div>
                                            <Skeleton class="size-8 rounded-full" />
                                        </div>
                                        <div class="space-y-2 w-full">
                                            <Skeleton class="h-3 w-full" />
                                            <Skeleton class="h-3 w-3/4" />
                                        </div>
                                    </div>

                                    <div class="flex gap-2">
                                        <Skeleton class="size-8 rounded-xl" />
                                        <Skeleton class="size-8 rounded-xl" />
                                        <Skeleton class="size-8 rounded-xl" />
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {:then schedule}
                        <div class="p-4" transition:fade={{ delay: 0, duration: 250 }}>
                            {#each schedule as item, i (item)}
                                {#if i > 0}
                                    <Separator class="my-2" />
                                {/if}
                                <div
                                    class="cursor-pointer bg-opacity-50 flex flex-row justify-between items-center gap-2"
                                >
                                    <div class="flex items-center gap-4">
                                        <div class="p-0 text-muted-foreground">
                                            {#if item.kind === 'song'}
                                                <ListMusicIcon size="24" />
                                            {:else}
                                                <BookTextIcon size="24" />
                                            {/if}
                                        </div>

                                        <div class="">
                                            <h4 class="text-sm font-medium leading-none">{item.title}</h4>
                                            <p class="text-muted-foreground text-sm">{item.description}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            on:click={() => {
                                                toast.success('Item removed from schedule');
                                            }}
                                        >
                                            <BookmarkXIcon size="16" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            on:click={() => {
                                                toast.loading('Opening item...');
                                            }}
                                        >
                                            <CircleArrowRightIcon size="16" />
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