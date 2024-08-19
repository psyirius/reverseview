<script>
    import {
        blankPresentWindow,
        closePresentWindow,
        goNext,
        goPrevious,
        logoPresentWindow,
    } from "./control";

    import {
        TvMinimalIcon,
        WallpaperIcon,
        CircleXIcon,
        ArrowBigLeftIcon,
        ArrowBigRightIcon,
    } from 'lucide-svelte';

    import * as Button from "$lib/components/ui/button";
</script>

<div class="flex flex-row justify-center">
    <div class="flex flex-row justify-center gap-2 border rounded-xl p-2 shadow" role="group" aria-label="Control">
        <Button.Root on:click={blankPresentWindow} variant="secondary" >
            <TvMinimalIcon />
        </Button.Root>

        <Button.Root on:click={logoPresentWindow} variant="secondary" >
            <WallpaperIcon />
        </Button.Root>

        <Button.Root on:click={closePresentWindow} variant="destructive" >
            <CircleXIcon />
        </Button.Root>

        <Button.Root on:click={goPrevious} variant="secondary" >
            <ArrowBigLeftIcon />
        </Button.Root>

        <Button.Root on:click={goNext} variant="secondary" >
            <ArrowBigRightIcon />
        </Button.Root>
    </div>
</div>