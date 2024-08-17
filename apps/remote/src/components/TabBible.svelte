<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import { Separator} from "$lib/components/ui/separator";
    import { ScrollArea } from "$lib/components/ui/scroll-area";
    import * as Form from "$lib/components/ui/form";
    import {
        Rows4Icon,
        LayoutGridIcon,
    } from "lucide-svelte";

    import {
        SearchIcon,
        MonitorUpIcon,
    } from 'lucide-svelte';
    import BibleRefGrid from "./BibleRefGrid.svelte";

    const verses = Array.from({ length: 50 }).map(
        (_, i, a) => `${i + 1}. In the beginning...`
    );

    let title = "Genesis";
    let description = "1:1-50";

    let gridMode = true;
</script>

<div class="container">
    <Card.Root class="h-full flex flex-col justify-between">
        <Card.Header class="py-6">
<!--            <Card.Title>-->
<!--                <Label for="bible-ref-query">Reference</Label>-->
<!--            </Card.Title>-->

            <Card.Description class="flex flex-row gap-2">
                <Input id="bible-ref-query" type="text" placeholder="Ps 1 1" class="max-w-full" />

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

                <Separator orientation="vertical" />

                <Tooltip.Root>
                    <Tooltip.Trigger asChild let:builder>
                        <Button
                            builders={[builder]}
                            variant="default"
                            size="sm"
                            class="aspect-square p-1 h-full"
                            on:click={() => gridMode = !gridMode}
                        >
                            {#if gridMode}
                                <Rows4Icon />
                            {:else}
                                <LayoutGridIcon />
                            {/if}
                        </Button>
                    </Tooltip.Trigger>

                    <Tooltip.Content>
                        {#if gridMode}
                            <p>List Mode</p>
                        {:else}
                            <p>Grid Mode</p>
                        {/if}
                    </Tooltip.Content>
                </Tooltip.Root>
            </Card.Description>
        </Card.Header>

        <Separator class="" />

        <Card.Content class="flex flex-col gap-2 h-full">
            {#if gridMode}
                <div class="pt-3 flex flex-row gap-2 w-full">
                    <div class="">
                        <h4 class="text-sm font-medium leading-none">{title}</h4>
                        <p class="text-muted-foreground text-sm">{description}</p>
                    </div>

                    <Separator orientation="vertical" />

                    <div class="">
                        <h4 class="text-sm font-medium leading-none">{title}</h4>
                        <p class="text-muted-foreground text-sm">{description}</p>
                    </div>
                </div>

                <div class="flex h-full max-h-full m-0 p-0">
                    <BibleRefGrid />
                </div>

<!--                <div class="relative flex h-full max-h-full m-0 p-0">-->
<!--                    <ScrollArea class="absolute flex flex-col h-full w-full rounded-md border">-->
                        <!-- ... -->
<!--                    </ScrollArea>-->
<!--                </div>-->
            {:else}
                <div class="pt-3">
                    <h4 class="text-sm font-medium leading-none">{title}</h4>
                    <p class="text-muted-foreground text-sm">{description}</p>
                </div>

                <div class="relative flex h-full max-h-full m-0 p-0">
                    <ScrollArea class="absolute flex flex-col h-full w-full rounded-md border">
                        <div class="py-2 px-4">
                            {#each verses as verse, i (verse)}
                                {#if i > 0}
                                    <Separator class="my-2" />
                                {/if}
                                <div class="text-sm bg-opacity-50 {(i % 2 === 0 ? '' : '')}">
                                    {verse}
                                </div>
                            {/each}
                        </div>
                    </ScrollArea>
                </div>
            {/if}
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