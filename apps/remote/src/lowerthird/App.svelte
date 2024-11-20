<script lang="ts">
    import { onMount } from 'svelte';
    import {parent_style, fit} from "./text-fit.svelte";

    const POLL_INTERVAL = 200;

    let p_title = $state();
    let p_font1 = $state();
    let p_font2 = $state();
    let p_text1 = $state();
    let p_text2 = $state();

    /* SETUP THE AJAX PARAMETERS */
    function getStageViewContent() {
        // Command to get the content of the presentation
        apiCall({ cmd: 9 }, ({ ok, error, data }: any) => {
            if (!ok) {
                // when no data, it will just blank

                // $("#mainContainer").hide();

                return;
            }

            parseLower3rdResponse(data);
        });
    }

    /* PROCESS THE RESPONSE AND ASSIGN THE RIGHT STRINGS */
    function parseLower3rdResponse(t: any) {
        p_title = t.title;
        p_font1 = t.font1;
        p_font2 = t.font2;
        p_text1 = t.content1;
        p_text2 = t.content2;
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

    onMount(() => {
        const interval = setInterval(() => {
            getStageViewContent();
        }, POLL_INTERVAL);

        return () => clearInterval(interval);
    });
</script>

<main>
    <!-- Must be in a container -->
    <div class="container just-for-demo">
        <!-- Parent Wrapping Div -->
        <div style={parent_style}>
            <h2 use:fit>{@html p_title}</h2>
        </div>
    </div>

    <!-- Must be in a container -->
    <div class="container just-for-demo">
        <!-- Parent Wrapping Div -->
        <div style={parent_style}>
            <h1 use:fit style="font-family: {p_font1}">{@html p_text1}</h1>
        </div>
    </div>

    <div class="container just-for-demo">
        <!-- Parent Wrapping Div -->
        <div style={parent_style}>
            <h1 use:fit={{min_size: 3, max_size: 200}} style="font-family: {p_font2}">{@html p_text2}</h1>
        </div>
    </div>
</main>

<style>
    .container {
        background: lightblue;
        padding: 20px;
        height: 300px;
        width: 300px;
    }

    .just-for-demo {
        resize: both;
        overflow: hidden;
        margin-bottom: 1rem;
    }
</style>