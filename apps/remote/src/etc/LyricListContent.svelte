<script lang="ts">
    import type { Writable } from "svelte/store";
    import {
        getColor,
        presentSongSlide
    } from "./control";

    export let content: Writable<PromiseLike<any>>
</script>

<div class="">
    {#if $content}
        {#await $content}
            <p>Loading</p>
        {:then lyricsContent}
            {@const { id, name, font, slides, font2, slides2 } = lyricsContent}

            <h2>{name}</h2>

            {#each slides as slide, i (i)}
                {@const cb = () => presentSongSlide(id, i)}

                <div class="flex flex-row gap-4">
                    <!-- Slide 1 -->
                    <div
                        class=""
                        style:color={getColor(i)}
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
                        style:color={getColor(i)}
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