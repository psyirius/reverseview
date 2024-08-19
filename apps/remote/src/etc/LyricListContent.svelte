<script lang="ts">
    import type { Writable } from "svelte/store";
    import {
        getColorLyrics,
        presentSongSlide
    } from "./control";
    import Label from "../lib/components/ui/label/label.svelte";

    export let content: Writable<PromiseLike<any>>
</script>

<div class="">
    {#if $content}
        {#await $content}
            <p>Loading</p>
        {:then content}
            {@const { id, name, font, slides, font2, slides2 } = content}

            <Label>{name}</Label>

            {#each slides as slide, i (i)}
                {@const cb = () => presentSongSlide(id, i)}

                <div class="flex flex-row gap-4">
                    <!-- Slide 1 -->
                    <div
                        class=""
                        style:color={getColorLyrics(i)}
                        style:font-family={font}
                    >
                        <div
                            on:click={cb}
                            on:keyup={cb}
                            role="button"
                            tabindex="0"
                            class=""
                        >
                            <!-- FIXME: DANGER -->
                            {@html slide}
                        </div>
                    </div>

                    <!-- Slide 2 -->
                    <div
                        class=""
                        style:color={getColorLyrics(i)}
                        style:font-family={font2}
                    >
                        <div
                            on:click={cb}
                            on:keyup={cb}
                            role="button"
                            tabindex="0"
                            class=""
                        >
                            <!-- FIXME: DANGER -->
                            {@html slides2[i]}
                        </div>
                    </div>
                </div>
            {/each}
        {:catch err}
            <p>{err}</p>
        {/await}
    {/if}
</div>