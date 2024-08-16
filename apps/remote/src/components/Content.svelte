<script lang="ts">
    import * as Tabs from "$lib/components/ui/tabs";
    // import { Tabs } from "bits-ui";

    import BibleTab from "./TabBible.svelte";
    import SongsTab from "./TabSongs.svelte";
    import ScheduleTab from "./TabSchedule.svelte";
    import Toolbar from "./Toolbar.svelte";
    import { cubicInOut } from 'svelte/easing';
    import { crossfade } from 'svelte/transition';

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
    <Tabs.Root value="{tabs.schedule.id}" class="h-full w-full flex flex-col gap-2">
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
