<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import { toast } from "svelte-sonner";

    import {
        TvMinimal,
        Wallpaper,
        CircleX,
        ArrowBigLeft,
        ArrowBigRight,
    } from 'lucide-svelte';

    function onClick(evt: any) {
        toast.success("Button Clicked", {
            position: "top-right",
            description: "Sunday, December 03, 2023 at 9:00 AM",
            dismissable: true,
            action: {
                label: "OK",
                onClick: () => console.info("Ok")
            }
        })
    }

    const buttons = [
        { label: 'Blank', icon: TvMinimal, variant: 'outline', tooltip: 'Preset Blank', onClick },
        { label: 'Logo', icon: Wallpaper, variant: 'outline', tooltip: 'Present Logo', onClick },
        { label: 'Close', icon: CircleX, variant: 'destructive', tooltip: 'Close Presentation', onClick },
        { label: 'Prev', icon: ArrowBigLeft, variant: 'outline', tooltip: 'Previous Verse/Slide', onClick },
        { label: 'Next', icon: ArrowBigRight, variant: 'outline', tooltip: 'Next Verse/Slide', onClick },
    ];
</script>

<div class="flex flex-row justify-center">
    <div class="flex flex-row justify-center gap-2 border rounded-xl p-2 shadow" role="group" aria-label="Control">
        {#each buttons as { icon, tooltip, onClick, variant }}
            <Tooltip.Root>
                <Tooltip.Trigger asChild let:builder>
                    <Button
                        builders={[builder]}
                        variant={variant}
                        class="px-4"
                        onclick={onClick}
                    >
                        <svelte:component this={icon} />
                    </Button>
                </Tooltip.Trigger>

                <Tooltip.Content>
                    <p>{tooltip}</p>
                </Tooltip.Content>
            </Tooltip.Root>
        {/each}
    </div>
</div>