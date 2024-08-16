<script lang="ts">
    import Content from "./components/Content.svelte";
    import { Toaster } from "$lib/components/ui/sonner";
</script>

<main>
    <Content />
    <Toaster />
</main>

<style lang="scss">
    main {
        @apply w-screen h-screen;
        @apply p-4;
        @apply bg-accent-foreground;
        @apply border-red-200;
        @apply border-2;

        //@apply w-full h-full flex items-center justify-center;
    }
</style>
