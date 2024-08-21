<script lang="ts">
    import * as Tabs from "$lib/components/ui/tabs";
    // import { Tabs } from "bits-ui";

    import BibleTab from "./TabBible.svelte";
    import SongsTab from "./TabSongs.svelte";
    import ScheduleTab from "./TabSchedule.svelte";
    import Toolbar from "./Toolbar.svelte";
    import { cubicInOut } from 'svelte/easing';
    import { crossfade } from 'svelte/transition'
    import Sun from "svelte-radix/Sun.svelte";
    import Moon from "svelte-radix/Moon.svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Button } from "$lib/components/ui/button";

    import { resetMode, setMode } from "mode-watcher";

    const [send, receive] = crossfade({
        duration: 250,
        easing: cubicInOut,
    });

    const tabs = {
        bible: {
            id: "bible",
            title: "Bible",
            component: BibleTab,
        },
        schedule: {
            id: "schedule",
            title: "Schedule",
            component: ScheduleTab,
        },
        songs: {
            id: "songs",
            title: "Songs",
            component: SongsTab,
        },
    };
</script>

<div class="container">
    <Tabs.Root value="{tabs.bible.id}" class="h-full w-full flex flex-col gap-2">
        <Tabs.List class="grid grid-cols-3 w-full">
            {#each Object.values(tabs) as { id, title }}
                <Tabs.Trigger value="{id}" >{title}</Tabs.Trigger>
            {/each}
        </Tabs.List>

        {#each Object.values(tabs) as { id, component }}
            <Tabs.Content value="{id}" class="m-0 h-full">
                <svelte:component this="{component}" />
            </Tabs.Content>
        {/each}
    </Tabs.Root>

<!--    <DropdownMenu.Root>-->
<!--        <DropdownMenu.Trigger asChild let:builder>-->
<!--            <Button builders={[builder]} variant="outline" size="icon">-->
<!--                <Sun-->
<!--                    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"-->
<!--                />-->
<!--                <Moon-->
<!--                    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"-->
<!--                />-->
<!--                <span class="sr-only">Toggle theme</span>-->
<!--            </Button>-->
<!--        </DropdownMenu.Trigger>-->
<!--        <DropdownMenu.Content align="end">-->
<!--            <DropdownMenu.Item on:click={() => setMode("light")}-->
<!--            >Light</DropdownMenu.Item-->
<!--            >-->
<!--            <DropdownMenu.Item on:click={() => setMode("dark")}>Dark</DropdownMenu.Item>-->
<!--            <DropdownMenu.Item on:click={() => resetMode()}>System</DropdownMenu.Item>-->
<!--        </DropdownMenu.Content>-->
<!--    </DropdownMenu.Root>-->

    <Toolbar />
</div>

<style lang="scss">
    .container {
        @apply flex;
        @apply flex-col;
        @apply gap-4;
        @apply p-0;
        //@apply border-2 border-red-200;
        @apply h-full w-full;
        @apply justify-between;
    }
</style>
