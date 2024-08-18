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

<div class="" role="group" aria-label="Control">
    <Button.Root on:click={blankPresentWindow}>
        <TvMinimalIcon />
    </Button.Root>

    <Button.Root on:click={logoPresentWindow}>
        <WallpaperIcon />
    </Button.Root>

    <Button.Root on:click={closePresentWindow}>
        <CircleXIcon />
    </Button.Root>

    <Button.Root on:click={goPrevious}>
        <ArrowBigLeftIcon />
    </Button.Root>

    <Button.Root on:click={goNext}>
        <ArrowBigRightIcon />
    </Button.Root>
</div>