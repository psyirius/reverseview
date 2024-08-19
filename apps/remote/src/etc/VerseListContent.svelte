<script lang="ts">
    import type {Writable} from "svelte/store";
    import {
        getColorVerse,
        loadBibleRef
    } from "./control";

    export let content: Writable<PromiseLike<any>>
</script>

<div class="">
    {#if $content}
        {#await $content}
            <p>Loading</p>
        {:then content}
            {@const { verses, font, book, chapter } = content}

            <h2>{book}:{chapter}</h2>

            {#each verses as verse, i (i)}
                {@const cb = () => loadBibleRef(parseInt(book), parseInt(chapter), i + 1)}

                <div
                    style:color={getColorVerse(i)}
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
                        {@html verse}
                    </div>
                </div>
            {/each}
        {:catch err}
            <p>{err}</p>
        {/await}
    {/if}
</div>