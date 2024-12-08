<script lang="ts">
    import { onMount } from 'svelte';
    import { fade, slide, blur, fly } from 'svelte/transition';
    import { quadInOut } from 'svelte/easing';
    import Crypto from 'crypto-js';
    import { textfit } from 'svelte-textfit';
    import FontFaceObserver from 'fontfaceobserver';

    interface SlideContent {
        html: string;
        fontFamily?: string;
        ref?: HTMLElement;
    }

    enum SlideKind {
        Verse = 'verse',
        Lyric = 'lyric',
    }

    interface SlideState {
        kind: SlideKind;
        title: string;
        contents: SlideContent[];
        __hash__: string;
    }

    const POLL_INTERVAL = 100;

    let p_slide = $state<SlideState | undefined>();
    let p_hash = $state<string | undefined>();

    const isOBS = typeof window.obsstudio !== "undefined";

    // TODO: use BroadcastChannel

    function hashOf(d: any) {
        return Crypto.SHA1(JSON.stringify(d)).toString(Crypto.enc.Hex);
    }

    /* SETUP THE AJAX PARAMETERS */
    function getStageViewContent() {
        return new Promise<void>((resolve, reject) => {
            // Command to get the content of the presentation
            apiCall({ cmd: 9 }, async ({ ok, error, data }: any) => {
                if (!ok) {
                    // when no data, it will just blank
                    p_slide = p_hash = undefined;

                    return;
                }

                const hash = hashOf(data);
                if (p_hash !== hash) {
                    p_hash = hash;
                    await parseLower3rdResponse(data, hash);
                }

                resolve();
            });
        });
    }

    /* PROCESS THE RESPONSE AND ASSIGN THE RIGHT STRINGS */
    async function parseLower3rdResponse(t: any, hash: string) {
        const title: string = t.title;
        const contents: SlideContent[] = [];

        if (t.content1) {
            contents.push({
                html: t.content1,
                fontFamily: t.font1 || undefined,
            });
        }

        if (t.content2) {
            contents.push({
                html: t.content2,
                fontFamily: t.font2 || undefined,
            });
        }

        if (!title && contents.length === 0) {
            // when no data, it will just blank
            p_slide = undefined;

            return;
        }

        // fetch the font if not available
        const fonts = new Set(contents.map((c) => c.fontFamily).filter((f) => f) as string[]);

        // console.log(fonts);
        // for (const font of fonts) {
        //     try {
        //         const observer = new FontFaceObserver(font);
        //         await observer.load(null, 100);
        //     } catch (e) {
        //         console.error(`Font ${font} not available`, e);
        //     }
        // }

        // activate the slide
        p_slide = {
            kind: !title ? SlideKind.Lyric : SlideKind.Verse,
            title,
            contents,
            __hash__: hash,
        };
    }

    function apiCall(params: any, callback: any = null) {
        const url = [`/api/action`, new URLSearchParams({
            data: btoa(JSON.stringify(params)),
        }).toString()].join("?");

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                if (typeof callback === "function") {
                    callback(data);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    $effect(() => {
    });

    onMount(() => {
        let interval: ReturnType<typeof setInterval>;

        (function polling() {
            getStageViewContent().then(() => {
                interval = setTimeout(polling, POLL_INTERVAL);
            });
        }())

        return () => clearInterval(interval);
    });
</script>

<main class="box">
    {#if p_slide}
        <div class="slide"
            style:border-color={isOBS ? 'black' : 'red'}
            in:fade={{ duration: 300, easing: quadInOut }}
            out:fade={{ duration: 300, easing: quadInOut }}
        >
            {#if p_slide.title}
                <div class="title">
                    <h1>{@html p_slide.title}</h1>
                </div>
            {/if}

            <div class="contents">
                {#each p_slide.contents as content, i (i)}
                    <div class="content">
                        <div bind:this={content.ref} style="font-family: {content.fontFamily || ''}">
                            {#key content}
                            <p
                                use:textfit={{
                                    parent: content.ref,
                                    mode:"multi",
                                    autoResize: true,
                                    forceSingleModeWidth: true,
                                }}
                                transition:slide={{ duration: 300, easing: quadInOut }}
                            >{@html content.html}</p>
                            {/key}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</main>

<style lang="scss">
    .box {
        @apply w-screen h-screen;
        @apply bg-transparent p-10 overflow-hidden;
        //@apply bg-black;

        .slide {
            @apply w-full h-full;
            @apply flex flex-col justify-center items-center gap-y-4;
            @apply border border-red-500;

            .title {
                @apply p-2 bg-white rounded-sm font-bold;
            }

            .contents {
                @apply w-full h-full;
                @apply flex flex-row justify-center items-center gap-x-8;

                .content {
                  //@apply bg-white;
                  @apply flex justify-center items-center text-center;
                  @apply w-full h-full overflow-hidden;
                  @apply border border-red-500;
                }
            }
        }
    }
</style>